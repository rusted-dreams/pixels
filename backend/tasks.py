import cv2
import numpy as np
from io import BytesIO
import zipfile


def get_negative(image_bytes: bytes) -> BytesIO:
    # Convert bytes to NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Apply negative transformation
    negative = cv2.bitwise_not(img)

    # Encode image to PNG in memory
    success, encoded_image = cv2.imencode(".png", negative)
    if not success:
        raise Exception("Failed to encode image")

    # Wrap in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())

def get_resized(image_bytes: bytes) -> BytesIO:
    # Convert bytes to NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Resize the image to 256 x 256 pixels
    resized = cv2.resize(img, (256, 256))
    
    # Encode the resized image to PNG format in memory
    success, encoded_image = cv2.imencode(".png", resized)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())


def get_grayscale(image_bytes: bytes) -> BytesIO:
    # Convert bytes to a NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Encode the grayscale image to PNG format in memory
    success, encoded_image = cv2.imencode(".png", gray)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())


def get_binary(image_bytes: bytes) -> BytesIO:
    # Convert bytes to a NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Convert the grayscale image to a binary image using thresholding
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    
    # Encode the binary image to PNG format in memory
    success, encoded_image = cv2.imencode(".png", binary)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())


def get_bitwise_and(image_bytes1: bytes, image_bytes2: bytes) -> BytesIO:
    # Convert both image bytes to NumPy arrays
    nparr1 = np.frombuffer(image_bytes1, np.uint8)
    nparr2 = np.frombuffer(image_bytes2, np.uint8)
    
    # Decode the images into color format
    img1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)
    
    # Ensure both images have the same dimensions.
    # Resize both images to the dimensions of the smaller image.
    rows1, cols1, _ = img1.shape
    rows2, cols2, _ = img2.shape
    rows = min(rows1, rows2)
    cols = min(cols1, cols2)
    img1 = cv2.resize(img1, (cols, rows))
    img2 = cv2.resize(img2, (cols, rows))
    
    # Apply the bitwise AND operation
    result = cv2.bitwise_and(img1, img2)
    
    # Encode the result to PNG format in memory
    success, encoded_image = cv2.imencode(".png", result)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())

def get_bitwise_or(image_bytes1: bytes, image_bytes2: bytes) -> BytesIO:
    # Convert bytes to NumPy arrays
    nparr1 = np.frombuffer(image_bytes1, np.uint8)
    nparr2 = np.frombuffer(image_bytes2, np.uint8)
    img1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)

    # Resize images to common dimensions
    rows1, cols1, _ = img1.shape
    rows2, cols2, _ = img2.shape
    rows = min(rows1, rows2)
    cols = min(cols1, cols2)
    img1 = cv2.resize(img1, (cols, rows))
    img2 = cv2.resize(img2, (cols, rows))

    # Apply bitwise OR operation
    result = cv2.bitwise_or(img1, img2)

    # Encode result image to PNG in memory
    success, encoded_image = cv2.imencode(".png", result)
    if not success:
        raise Exception("Failed to encode image")
    
    return BytesIO(encoded_image.tobytes())


def get_bitwise_xor(image_bytes1: bytes, image_bytes2: bytes) -> BytesIO:
    # Convert bytes to NumPy arrays
    nparr1 = np.frombuffer(image_bytes1, np.uint8)
    nparr2 = np.frombuffer(image_bytes2, np.uint8)
    img1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)

    # Resize images to common dimensions
    rows1, cols1, _ = img1.shape
    rows2, cols2, _ = img2.shape
    rows = min(rows1, rows2)
    cols = min(cols1, cols2)
    img1 = cv2.resize(img1, (cols, rows))
    img2 = cv2.resize(img2, (cols, rows))

    # Apply bitwise XOR operation
    result = cv2.bitwise_xor(img1, img2)

    # Encode result image to PNG in memory
    success, encoded_image = cv2.imencode(".png", result)
    if not success:
        raise Exception("Failed to encode image")
    
    return BytesIO(encoded_image.tobytes())


def get_log_transformation(image_bytes: bytes) -> BytesIO:
    # Convert bytes to a NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # Decode the image as grayscale
    gray = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    # Compute the constant c based on the maximum intensity
    c = 255 / np.log(1 + 255)  # log(256)
    # Apply logarithmic transformation
    log_transformed = np.uint8(c * np.log1p(gray))
    
    # Encode the transformed image to PNG format in memory
    success, encoded_image = cv2.imencode(".png", log_transformed)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())


def get_inverse_log_transformation(image_bytes: bytes) -> BytesIO:
    # Convert bytes to a NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # Decode the image as grayscale
    gray = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    # Normalize the image to the range [0, 1]
    gray_norm = gray / 255.0
    # Compute the constant c
    c = 255 / (np.exp(1) - 1)
    # Apply the inverse log (exponential) transformation
    exp_transformed = np.uint8(c * np.expm1(gray_norm))
    
    # Encode the transformed image to PNG format in memory
    success, encoded_image = cv2.imencode(".png", exp_transformed)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())



def get_power_law_transformation(image_bytes: bytes, gamma: float = 0.5) -> BytesIO:
    # Convert bytes to a NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # Decode the image as grayscale
    gray = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    # Apply power law (gamma) transformation
    power_law = np.uint8(255 * np.power(gray / 255.0, gamma))
    
    # Encode the transformed image to PNG format in memory
    success, encoded_image = cv2.imencode(".png", power_law)
    if not success:
        raise Exception("Failed to encode image")
    
    # Wrap the encoded image in BytesIO to return as response
    return BytesIO(encoded_image.tobytes())


def rotate_image(image_bytes: bytes, angle: float = 0.0, scale: float = 1.0) -> BytesIO:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    (h, w) = img.shape[:2]
    center = (w / 2, h / 2)
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, scale)
    rotated_img = cv2.warpAffine(img, rotation_matrix, (w, h))
    success, encoded_image = cv2.imencode(".png", rotated_img)
    if not success:
        raise Exception("Failed to encode image")
    return BytesIO(encoded_image.tobytes())

def shear_image_horizontal(image_bytes: bytes, shear_factor: float = 0.5) -> BytesIO:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    (h, w) = img.shape[:2]
    shear_matrix = np.float32([[1, 0, 0], [shear_factor, 1, 0]])
    new_height = int(h + abs(shear_factor) * w)
    sheared_img = cv2.warpAffine(img, shear_matrix, (w, new_height))
    success, encoded_image = cv2.imencode(".png", sheared_img)
    if not success:
        raise Exception("Failed to encode image")
    return BytesIO(encoded_image.tobytes())

def shear_image_vertical(image_bytes: bytes, shear_factor: float = 0.5) -> BytesIO:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    (h, w) = img.shape[:2]
    shear_matrix = np.float32([[1, shear_factor, 0], [0, 1, 0]])
    new_width = int(w + abs(shear_factor) * h)
    sheared_img = cv2.warpAffine(img, shear_matrix, (new_width, h))
    success, encoded_image = cv2.imencode(".png", sheared_img)
    if not success:
        raise Exception("Failed to encode image")
    return BytesIO(encoded_image.tobytes())






def get_rgb_channels(image_bytes: bytes) -> BytesIO:
    # Decode the input image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Split channels (OpenCV uses BGR by default)
    b, g, r = cv2.split(img)

    # Create full 3-channel images from each
    r_img = cv2.merge([np.zeros_like(r), np.zeros_like(r), r])  # Red only
    g_img = cv2.merge([np.zeros_like(g), g, np.zeros_like(g)])  # Green only
    b_img = cv2.merge([b, np.zeros_like(b), np.zeros_like(b)])  # Blue only

    # Encode each image
    encoded_r = cv2.imencode(".png", r_img)[1].tobytes()
    encoded_g = cv2.imencode(".png", g_img)[1].tobytes()
    encoded_b = cv2.imencode(".png", b_img)[1].tobytes()

    # Create in-memory ZIP
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        zip_file.writestr("red.png", encoded_r)
        zip_file.writestr("green.png", encoded_g)
        zip_file.writestr("blue.png", encoded_b)

    zip_buffer.seek(0)
    return zip_buffer