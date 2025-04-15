import cv2
import numpy as np
from io import BytesIO


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

