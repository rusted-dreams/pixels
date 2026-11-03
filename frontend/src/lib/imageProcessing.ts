import type * as OpenCV from "@techstark/opencv-js";
import type { Mat } from "@techstark/opencv-js";
import type { WorkerRequest } from "./processingTypes";

/** All matrices belong to one operation and are released, including on errors. */
export function processPixels(cv: typeof OpenCV, { endpoint, images, params }: WorkerRequest) {
  const allocated: Array<{ delete(): void }> = [];
  const own = <T extends { delete(): void }>(value: T): T => { allocated.push(value); return value; };
  const mat = () => own(new cv.Mat());
  const number = (key: string, fallback: number, min = -Infinity, max = Infinity, integer = false) => {
    const value = params[key] === undefined ? fallback : Number(params[key]);
    if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
      throw new Error(`Invalid ${key}: expected ${integer ? "an integer" : "a number"} between ${min} and ${max}`);
    }
    return value;
  };
  const kernelSize = (fallback = 3) => {
    const size = number(params.kernel_size !== undefined ? "kernel_size" : "ksize", fallback, 1, 31, true);
    if (size % 2 === 0) throw new Error("Kernel size must be odd");
    return size;
  };
  const dimensions = (width: number, height: number) => {
    if (width < 1 || height < 1 || width > 32767 || height > 32767 || width * height > 32_000_000) {
      throw new Error("The resulting image is too large or too small. Use a smaller image or scale factor.");
    }
    return new cv.Size(width, height);
  };
  const rgb = (image: ImageData) => {
    dimensions(image.width, image.height);
    const rgba = own(cv.matFromImageData(image));
    const result = mat();
    // Python's IMREAD_COLOR discards alpha; use RGB throughout the browser pipeline.
    cv.cvtColor(rgba, result, cv.COLOR_RGBA2RGB);
    return result;
  };
  const output = (source: Mat, name = "processed-result.png") => {
    const rgba = mat();
    cv.cvtColor(source, rgba, source.channels() === 1 ? cv.COLOR_GRAY2RGBA : cv.COLOR_RGB2RGBA);
    return { name, image: new ImageData(new Uint8ClampedArray(rgba.data), rgba.cols, rgba.rows) };
  };
  try {
    if (!images.length) throw new Error("Please select an image");
    const src = rgb(images[0]);
    const dst = mat();
    let grayImage: Mat | undefined;
    const gray = () => {
      if (!grayImage) {
        grayImage = mat();
        cv.cvtColor(src, grayImage, cv.COLOR_RGB2GRAY);
      }
      return grayImage;
    };
    const task = endpoint.replace(/^\/api\/task\//, "");
    const size = () => new cv.Size(src.cols, src.rows);
    const kernel = (fallback = 3) => {
      const k = kernelSize(fallback);
      return own(cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(k, k)));
    };
    const blur = (target: Mat, sigma = 0, fallback = 5) => {
      const k = kernelSize(fallback);
      cv.GaussianBlur(src, target, new cv.Size(k, k), sigma);
    };
    const affine = (values: number[], width = src.cols, height = src.rows) => {
      const matrix = own(cv.matFromArray(2, 3, cv.CV_32F, values));
      cv.warpAffine(src, dst, matrix, dimensions(width, height));
    };
    switch (task) {
      case "negative": cv.bitwise_not(src, dst); break;
      case "grayscale": gray().copyTo(dst); break;
      case "binary": cv.threshold(gray(), dst, 127, 255, cv.THRESH_BINARY); break;
      case "resize": cv.resize(src, dst, new cv.Size(256, 256)); break;
      case "scale": {
        const fx = number("fx", 1, Number.EPSILON, 10);
        const fy = number("fy", 1, Number.EPSILON, 10);
        dimensions(Math.round(src.cols * fx), Math.round(src.rows * fy));
        cv.resize(src, dst, new cv.Size(0, 0), fx, fy, cv.INTER_LINEAR);
        break;
      }
      case "rotate": {
        const matrix = own(cv.getRotationMatrix2D(new cv.Point(Math.floor(src.cols / 2), Math.floor(src.rows / 2)), number("angle", 0), 1));
        cv.warpAffine(src, dst, matrix, size());
        break;
      }
      case "translate": affine([1, 0, number("tx", 0), 0, 1, number("ty", 0)]); break;
      // Retain the original backend's shear orientation and canvas expansion.
      case "shear-image-horizontal": {
        const shear = number("shear_x", 1);
        affine([1, 0, 0, shear, 1, 0], src.cols, Math.floor(src.rows + Math.abs(shear) * src.cols));
        break;
      }
      case "shear-image-vertical": {
        const shear = number("shear_y", 1);
        affine([1, shear, 0, 0, 1, 0], Math.floor(src.cols + Math.abs(shear) * src.rows), src.rows);
        break;
      }
      case "bitwise-and":
      case "bitwise-or":
      case "bitwise-xor": {
        if (images.length !== 2) throw new Error("This task requires exactly 2 images");
        const second = rgb(images[1]);
        const common = new cv.Size(Math.min(src.cols, second.cols), Math.min(src.rows, second.rows));
        const firstResized = mat(), secondResized = mat();
        cv.resize(src, firstResized, common);
        cv.resize(second, secondResized, common);
        if (task === "bitwise-and") cv.bitwise_and(firstResized, secondResized, dst);
        if (task === "bitwise-or") cv.bitwise_or(firstResized, secondResized, dst);
        if (task === "bitwise-xor") cv.bitwise_xor(firstResized, secondResized, dst);
        break;
      }
      case "rgb-channels": {
        const results = ["red.png", "green.png", "blue.png"].map((name, channel) => {
          const values = [0, 0, 0, 0];
          values[channel] = 255;
          const mask = own(new cv.Mat(src.rows, src.cols, cv.CV_8UC3, new cv.Scalar(...values)));
          const isolated = mat();
          cv.bitwise_and(src, mask, isolated);
          return output(isolated, name);
        });
        return { images: results, zip: true };
      }
      case "log-transformation":
      case "inverse-log-transformation":
      case "power-law-transformation":
      case "power-law": {
        const gamma = number("gamma", task === "power-law" ? 1 : 0.5, 0, 50);
        const lut = own(new cv.Mat(1, 256, cv.CV_8UC1));
        for (let i = 0; i < 256; i++) {
          const value = task === "log-transformation" ? 255 * Math.log1p(i) / Math.log(256)
            : task === "inverse-log-transformation" ? 255 * Math.expm1(i / 255) / Math.expm1(1)
            : 255 * Math.pow(i / 255, gamma);
          lut.data[i] = Math.floor(value);
        }
        cv.LUT(gray(), lut, dst);
        break;
      }
      case "gaussian": blur(dst, number("sigmaX", 0, 0)); break;
      case "lowpass": blur(dst); break;
      case "highpass":
      case "highboost": {
        const blurred = mat();
        blur(blurred);
        cv.subtract(src, blurred, dst);
        if (task === "highboost") {
          const boost = number("boost_factor", 2, 0);
          // Preserve the backend's weighting and saturated high-pass component.
          cv.addWeighted(src, 1 + boost, dst, -boost, 0, dst);
        }
        break;
      }
      case "sobel": {
        const dx = number("dx", 1, 0, 2, true), dy = number("dy", 0, 0, 2, true);
        const k = kernelSize();
        if (dx + dy === 0) throw new Error("At least one Sobel derivative must be greater than zero");
        const gradient = mat();
        cv.Sobel(gray(), gradient, cv.CV_64F, dx, dy, k);
        cv.convertScaleAbs(gradient, dst);
        break;
      }
      case "prewitt": {
        const axis = params.axis ?? "x";
        if (!["x", "y", "both"].includes(String(axis))) throw new Error("Invalid Prewitt direction");
        const kx = own(cv.matFromArray(3, 3, cv.CV_32F, [1, 0, -1, 1, 0, -1, 1, 0, -1]));
        const ky = own(cv.matFromArray(3, 3, cv.CV_32F, [1, 1, 1, 0, 0, 0, -1, -1, -1]));
        if (axis === "both") {
          const gx = mat(), gy = mat(), magnitude = mat();
          cv.filter2D(gray(), gx, cv.CV_32F, kx);
          cv.filter2D(gray(), gy, cv.CV_32F, ky);
          cv.magnitude(gx, gy, magnitude);
          gray().copyTo(dst);
          for (let i = 0; i < dst.data.length; i++) dst.data[i] = Math.min(255, Math.floor(magnitude.data32F[i]));
        } else cv.filter2D(gray(), dst, -1, axis === "x" ? kx : ky);
        break;
      }
      case "laplacian-filter":
      case "log": {
        const source = task === "log" ? mat() : gray();
        if (task === "log") blur(source, number("sigma", 1, 0));
        const laplacian = mat();
        cv.Laplacian(source, laplacian, cv.CV_64F, task === "log" ? 1 : kernelSize(1), task === "log" ? 1 : number("scale", 1));
        cv.convertScaleAbs(laplacian, dst);
        break;
      }
      case "max-filter": cv.dilate(gray(), dst, kernel()); break;
      case "min-filter": cv.erode(gray(), dst, kernel()); break;
      case "midpoint-filter": {
        const maxed = mat(), mined = mat(), element = kernel();
        cv.dilate(gray(), maxed, element);
        cv.erode(gray(), mined, element);
        gray().copyTo(dst);
        for (let i = 0; i < dst.data.length; i++) dst.data[i] = Math.floor((maxed.data[i] + mined.data[i]) / 2);
        break;
      }
      case "median-filter": cv.medianBlur(gray(), dst, kernelSize()); break;
      case "noise/gaussian":
      case "noise/rayleigh": {
        const noise = own(new cv.Mat(src.rows, src.cols, cv.CV_8UC3));
        const mean = number("mean", 0), std = number("std", 1, 0), scale = number("scale", 1, 0);
        for (let i = 0; i < noise.data.length; i++) {
          const radius = Math.sqrt(-2 * Math.log(1 - Math.random()));
          const sample = task === "noise/rayleigh" ? scale * radius : mean + std * radius * Math.cos(2 * Math.PI * Math.random());
          // Match the backend's NumPy uint8 conversion before saturated cv.add.
          noise.data[i] = Math.trunc(sample);
        }
        cv.add(src, noise, dst);
        break;
      }
      case "canny": cv.Canny(gray(), dst, number("threshold1", 100, 0), number("threshold2", 200, 0)); break;
      case "harris": {
        const corners = mat(), expanded = mat();
        const block = number(params.block_size !== undefined ? "block_size" : "block size", 2, 2, 255, true);
        cv.cornerHarris(gray(), corners, block, kernelSize(), number("k", 0.04, 0, 1));
        cv.dilate(corners, expanded, own(new cv.Mat()));
        const threshold = cv.minMaxLoc(expanded, own(new cv.Mat())).maxVal * number("threshold", 0.01, 0, 1);
        src.copyTo(dst);
        for (let i = 0; i < expanded.data32F.length; i++) {
          if (expanded.data32F[i] > threshold) dst.data.set([255, 0, 0], i * 3);
        }
        break;
      }
      case "hough-circles": {
        const blurred = mat(), circles = mat();
        cv.medianBlur(gray(), blurred, 5);
        const minRadius = number("min_radius", 0, 0, 1000, true);
        const maxRadius = number("max_radius", 0, 0, 1000, true);
        if (maxRadius !== 0 && maxRadius < minRadius) throw new Error("Maximum radius must be at least the minimum radius");
        cv.HoughCircles(blurred, circles, cv.HOUGH_GRADIENT, number("dp", 1.2, 1), number("min_dist", 100, Number.EPSILON), number("param1", 100, Number.EPSILON), number("param2", 30, Number.EPSILON), minRadius, maxRadius);
        src.copyTo(dst);
        for (let i = 0; i < circles.data32F.length; i += 3) {
          const center = new cv.Point(Math.round(circles.data32F[i]), Math.round(circles.data32F[i + 1]));
          cv.circle(dst, center, Math.round(circles.data32F[i + 2]), new cv.Scalar(0, 255, 0), 2);
          cv.circle(dst, center, 2, new cv.Scalar(255, 0, 0), 3);
        }
        break;
      }
      case "hough-lines": {
        const edges = mat(), lines = mat();
        cv.Canny(gray(), edges, 50, 150);
        // The existing slider is explicitly in degrees; OpenCV expects radians.
        cv.HoughLines(edges, lines, number("rho", 1, Number.EPSILON), number("theta", 1, Number.EPSILON, 180) * Math.PI / 180, number("threshold", 100, 1, 500, true));
        src.copyTo(dst);
        for (let i = 0; i < lines.data32F.length; i += 2) {
          const rho = lines.data32F[i], theta = lines.data32F[i + 1];
          const a = Math.cos(theta), b = Math.sin(theta), x = a * rho, y = b * rho;
          cv.line(dst, new cv.Point(Math.trunc(x - 1000 * b), Math.trunc(y + 1000 * a)), new cv.Point(Math.trunc(x + 1000 * b), Math.trunc(y - 1000 * a)), new cv.Scalar(255, 0, 0), 2);
        }
        break;
      }
      case "dilation": cv.dilate(gray(), dst, kernel(5), new cv.Point(-1, -1), number("iterations", 1, 1, 10, true)); break;
      case "erosion": cv.erode(gray(), dst, kernel(5), new cv.Point(-1, -1), number("iterations", 1, 1, 10, true)); break;
      case "opening": cv.morphologyEx(gray(), dst, cv.MORPH_OPEN, kernel(5)); break;
      case "closing": cv.morphologyEx(gray(), dst, cv.MORPH_CLOSE, kernel(5)); break;
      case "hitmiss": {
        const binary = mat();
        cv.threshold(gray(), binary, 127, 255, cv.THRESH_BINARY);
        const element = own(cv.matFromArray(3, 3, cv.CV_8SC1, [0, 1, 0, 1, -1, 1, 0, 1, 0]));
        cv.morphologyEx(binary, dst, cv.MORPH_HITMISS, element);
        break;
      }
      case "segment": {
        // OpenCV color segmentation replaces the unconnected PyTorch model.
        if (src.rows * src.cols === 1) {
          src.copyTo(dst);
          break;
        }
        const samples = own(new cv.Mat(src.rows * src.cols, 3, cv.CV_32F));
        samples.data32F.set(src.data);
        const labels = mat(), centers = mat();
        cv.kmeans(samples, Math.min(8, samples.rows), labels,
          new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 20, 1),
          3, (cv as typeof OpenCV & { KMEANS_PP_CENTERS: number }).KMEANS_PP_CENTERS, centers);
        src.copyTo(dst);
        for (let i = 0; i < labels.data32S.length; i++) {
          const offset = labels.data32S[i] * 3;
          for (let channel = 0; channel < 3; channel++) dst.data[i * 3 + channel] = Math.round(centers.data32F[offset + channel]);
        }
        break;
      }
      default: throw new Error(`Unsupported processing task: ${task}`);
    }
    return { images: [output(dst)], zip: false };
  } finally {
    for (let i = allocated.length - 1; i >= 0; i--) allocated[i].delete();
  }
}
