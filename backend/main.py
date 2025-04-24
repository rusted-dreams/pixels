from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from img_upload_utils import upload_image_to_azure
import tasks
import numpy as np
from segment import segment_image

app = FastAPI()

origins = [
    "0.0.0.0"
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def root():
    return {"message": "Backend is up and running"}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        blob_url = upload_image_to_azure(contents, file.filename)
        return {"success": True, "url": blob_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/task/negative")
async def negative(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        negative = tasks.get_negative(contents)
        return StreamingResponse(negative, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    

@app.post("/api/task/rgb-channels")
async def rgb_channels(file: UploadFile = File(...)):
    """
    Accepts an image, separates RGB channels, and returns 3 color-isolated images in a ZIP file.
    """
    image_bytes = await file.read()
    result_zip = tasks.get_rgb_channels(image_bytes)
    return StreamingResponse(result_zip, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=rgb_channels.zip"
    })

@app.post("/api/task/resize")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_resized(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")


@app.post("/api/task/grayscale")
async def grayscale(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        grayscale = tasks.get_grayscale(contents)
        return StreamingResponse(grayscale, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")


@app.post("/api/task/binary")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_binary(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")

# fix this endpoint  
@app.post("/api/task/bitwise-and")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_bitwise_and(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")

# fix this endpoint
@app.post("/api/task/bitwise-or")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_bitwise_or(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")

#fix this endpoint 
@app.post("/api/task/bitwise-xor")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_bitwise_xor(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    

@app.post("/api/task/log-transformation")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_log_transformation(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    

@app.post("/api/task/inverse-log-transformation")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_inverse_log_transformation(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    

@app.post("/api/task/power-law-transformation")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_power_law_transformation(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    
@app.post("/api/task/shear-image-horizontal")
async def horizontal_shear(file: UploadFile = File(...), shear_x: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.get_horizontal_sheared_image(contents, shear_x)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Horizontal shearing failed: {str(e)}")

@app.post("/api/task/shear-image-vertical")
async def vertical_shear(file: UploadFile = File(...), shear_y: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.get_vertical_sheared_image(contents, shear_y)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vertical shearing failed: {str(e)}")

@app.post("/api/task/laplacian-filter")
async def laplacian_filter(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_laplacian(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    
@app.post("/api/task/gaussian")
async def gaussian_blur(file: UploadFile = File(...), ksize: int = Form(5), sigmaX: float = Form(0.0)):
    try:
        contents = await file.read()
        output = tasks.get_gaussian(contents, ksize, sigmaX)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gaussian blur failed: {str(e)}")

@app.post("/api/task/sobel")
async def sobel_filter(file: UploadFile = File(...), dx: int = Form(1), dy: int = Form(0), ksize: int = Form(3)):
    try:
        contents = await file.read()
        output = tasks.get_sobel(contents, dx, dy, ksize)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sobel filter failed: {str(e)}")

@app.post("/api/task/prewitt")
async def prewitt_filter(file: UploadFile = File(...), axis: str = Form("x")):
    try:
        contents = await file.read()
        output = tasks.get_prewitt(contents, axis)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prewitt filter failed: {str(e)}")
    

@app.post("/api/task/midpoint-filter")
async def midpoint_filter(file: UploadFile = File(...), ksize: int = Form(0)):
    try:
        contents = await file.read()
        output = tasks.get_midpoint_filter(contents, ksize)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sobel filter failed: {str(e)}")
    
@app.post("/api/task/max-filter")
async def max_filter(file: UploadFile = File(...), ksize: int = Form(0)):
    try:
        contents = await file.read()
        output = tasks.get_max_filter(contents, ksize)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sobel filter failed: {str(e)}")
    
@app.post("/api/task/min-filter")
async def min_filter(file: UploadFile = File(...), ksize: int = Form(0)):
    try:
        contents = await file.read()
        output = tasks.get_min_filter(contents, ksize)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sobel filter failed: {str(e)}")
    
@app.post("/api/task/median-filter")
async def median_filter(file: UploadFile = File(...), ksize: int = Form(0)):
    try:
        contents = await file.read()
        output = tasks.get_median_filter(contents, ksize)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sobel filter failed: {str(e)}")
    
@app.post("/api/task/power-law")
async def power_law_transform(file: UploadFile = File(...), gamma: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.get_power_law_transformation(contents, gamma)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Power law transformation failed: {str(e)}")

@app.post("/api/task/scale")
async def scale_image(file: UploadFile = File(...), fx: float = Form(1.0), fy: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.get_scaled_image(contents, fx, fy)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scaling failed: {str(e)}")
    
@app.post("/api/task/rotate")
async def rotate_image(file: UploadFile = File(...), angle: float = Form(0.0)):
    try:
        contents = await file.read()
        output = tasks.get_rotated_image(contents, angle)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rotation failed: {str(e)}")
    
@app.post("/api/task/translate")
async def translate_image(file: UploadFile = File(...), tx: int = Form(0), ty: int = Form(0)):
    try:
        contents = await file.read()
        output = tasks.get_translated_image(contents, tx, ty)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
    
@app.post("/api/task/noise/gaussian")
async def gaussian_noise(file: UploadFile = File(...), mean: float = Form(0.0), std: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.add_gaussian_noise(contents, mean, std)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gaussian noise addition failed: {str(e)}")


@app.post("/api/task/noise/rayleigh")
async def rayleigh_noise(file: UploadFile = File(...), scale: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.add_rayleigh_noise(contents, scale)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rayleigh noise addition failed: {str(e)}")
        
@app.post("/api/task/log")
async def laplacian_of_gaussian_filter(file: UploadFile = File(...), kernel_size: int = Form(5), sigma: float = Form(1.0)):
    try:
        contents = await file.read()
        output = tasks.laplacian_of_gaussian(contents, kernel_size, sigma)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Laplacian of Gaussian filter failed: {str(e)}")


@app.post("/api/task/highpass")
async def high_pass_filter(file: UploadFile = File(...), kernel_size: int = Form(5)):
    try:
        contents = await file.read()
        output = tasks.high_pass_filter(contents, kernel_size)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"High pass filter failed: {str(e)}")


@app.post("/api/task/lowpass")
async def low_pass_filter(file: UploadFile = File(...), kernel_size: int = Form(5)):
    try:
        contents = await file.read()
        output = tasks.low_pass_filter(contents, kernel_size)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Low pass filter failed: {str(e)}")

@app.post("/api/task/highboost")
async def high_boost_filter(file: UploadFile = File(...), boost_factor: float = Form(2.0), kernel_size: int = Form(5)):
    try:
        contents = await file.read()
        output = tasks.high_boost_filter(contents, boost_factor, kernel_size)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"High Boost filter failed: {str(e)}")

@app.post("/api/task/canny")
async def canny_edge(file: UploadFile = File(...), threshold1: int = Form(100), threshold2: int = Form(200)):
    try:
        contents = await file.read()
        output = tasks.canny_edge_detection(contents, threshold1, threshold2)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Canny edge detection failed: {str(e)}")

@app.post("/api/task/harris")
async def harris_corner(file: UploadFile = File(...), block_size: int = Form(2), ksize: int = Form(3), k: float = Form(0.04), threshold: float = Form(0.01)):
    try:
        contents = await file.read()
        output = tasks.harris_corner_detection(contents, block_size, ksize, k, threshold)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Harris corner detection failed: {str(e)}")

@app.post("/api/task/hough-circles")
async def hough_circles(
    file: UploadFile = File(...),
    dp: float = Form(1.2),
    min_dist: int = Form(100),
    param1: int = Form(100),
    param2: int = Form(30),
    min_radius: int = Form(0),
    max_radius: int = Form(0)
):
    try:
        contents = await file.read()
        output = tasks.hough_circle_transform(contents, dp, min_dist, param1, param2, min_radius, max_radius)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hough circle transform failed: {str(e)}")

@app.post("/api/task/hough-lines")
async def hough_lines(
    file: UploadFile = File(...),
    rho: float = Form(1),
    theta: float = Form(np.pi / 180),
    threshold: int = Form(100)
):
    try:
        contents = await file.read()
        output = tasks.hough_line_transform(contents, rho, theta, threshold)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hough line transform failed: {str(e)}")

@app.post("/api/task/dilation")
async def dilation(file: UploadFile = File(...), kernel_size: int = Form(5), iterations: int = Form(1)):
    try:
        contents = await file.read()
        output = tasks.dilation_operation(contents, kernel_size, iterations)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dilation failed: {str(e)}")


@app.post("/api/task/erosion")
async def erosion(file: UploadFile = File(...), kernel_size: int = Form(5), iterations: int = Form(1)):
    try:
        contents = await file.read()
        output = tasks.erosion_operation(contents, kernel_size, iterations)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erosion failed: {str(e)}")


@app.post("/api/task/opening")
async def opening(file: UploadFile = File(...), kernel_size: int = Form(5)):
    try:
        contents = await file.read()
        output = tasks.opening_operation(contents, kernel_size)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Opening failed: {str(e)}")


@app.post("/api/task/closing")
async def closing(file: UploadFile = File(...), kernel_size: int = Form(5)):
    try:
        contents = await file.read()
        output = tasks.closing_operation(contents, kernel_size)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Closing failed: {str(e)}")


@app.post("/api/task/hitmiss")
async def hitmiss(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        output = tasks.hit_miss_transform(contents)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hit-or-Miss failed: {str(e)}")

@app.post("/api/task/segment")
async def segment(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        output = segment_image(contents)
        return StreamingResponse(output, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Segmentation failed: {str(e)}")
