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