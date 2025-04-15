import cv2
import numpy as np
import time
import sys
import os

def extract_and_stack_channels(img):
    """
    Extracts the B, G, R channels and stacks them side-by-side.
    Note: OpenCV loads images in BGR, so for an RGB view, we swap the order.
    """
    b, g, r = cv2.split(img)
    # For visualization, stack channels in R, G, B order
    stacked = np.hstack([r, g, b])
    return stacked

def geometric_transformations(img):
    """
    Applies several geometric transformations to the image:
        1. Scaling (by factor 0.5)
        2. Rotation (by 45 degrees)
        3. Translation (shift right and down by 50 pixels)
        4. Horizontal Shear (shear factor = 0.3)
        5. Vertical Shear (shear factor = 0.3)
    Returns a dictionary of transformed images.
    """
    rows, cols = img.shape[:2]
    
    # 1. Scaling
    scale_factor = 0.5
    scaled = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_LINEAR)
    
    # 2. Rotation
    angle = 45  # degrees
    center = (cols // 2, rows // 2)
    rot_mat = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img, rot_mat, (cols, rows))
    
    # 3. Translation
    tx, ty = 50, 50
    trans_mat = np.float32([[1, 0, tx], [0, 1, ty]])
    translated = cv2.warpAffine(img, trans_mat, (cols, rows))
    
    # 4. Horizontal Shear
    shear_factor = 0.3
    shear_h_mat = np.float32([[1, shear_factor, 0], [0, 1, 0]])
    shear_horizontal = cv2.warpAffine(img, shear_h_mat, (cols, rows))
    
    # 5. Vertical Shear
    shear_v_mat = np.float32([[1, 0, 0], [shear_factor, 1, 0]])
    shear_vertical = cv2.warpAffine(img, shear_v_mat, (cols, rows))
    
    return {
        "scaled": scaled,
        "rotated": rotated,
        "translated": translated,
        "shear_horizontal": shear_horizontal,
        "shear_vertical": shear_vertical
    }

def intensity_transformations(gray):
    """
    Applies a set of intensity transformations on a grayscale image.
    Returns a dictionary of transformed images.
    """
    # a. Negative Transformation
    negative = 255 - gray

    # b. Logarithmic Transformation
    c_log = 255 / np.log(1 + 255)
    log_transformed = np.uint8(c_log * np.log1p(gray))
    
    # c. Inverse Logarithmic (Exponential) Transformation
    gray_norm = gray / 255.0
    c_exp = 255 / (np.exp(1) - 1)
    exp_transformed = np.uint8(c_exp * np.expm1(gray_norm))
    
    # d. Power Law Transformation (Gamma Correction)
    gamma = 0.5  # adjust gamma as needed
    power_law = np.uint8(255 * np.power(gray / 255.0, gamma))
    
    # e. Contrast Stretching with three different threshold pairs
    def contrast_stretch(img, lower, upper):
        stretched = np.clip((img - lower) / (upper - lower) * 255, 0, 255)
        return np.uint8(stretched)
    
    cs1 = contrast_stretch(gray, 50, 200)
    cs2 = contrast_stretch(gray, 30, 220)
    cs3 = contrast_stretch(gray, 80, 180)
    
    return {
        "negative": negative,
        "log": log_transformed,
        "exp": exp_transformed,
        "power_law": power_law,
        "contrast_stretching_1": cs1,
        "contrast_stretching_2": cs2,
        "contrast_stretching_3": cs3
    }

# --------------------------------------------
# Main Processing Script
# --------------------------------------------
if len(sys.argv) < 2:
    print("Usage: python operations.py <path_to_image1> [<path_to_image2> ...]")
    sys.exit(1)

# Loop through all provided image paths
for image_path in sys.argv[1:]:
    print(f"\n=== Processing image: {image_path} ===")

    # Verify the file exists
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' does not exist.")
        continue

    # Read the image
    frame = cv2.imread(image_path)
    if frame is None:
        print(f"Error: Could not read the image '{image_path}'. Ensure it is a valid image file.")
        continue

    # Display the original uploaded image (for testing purposes)
    cv2.imshow(f'Uploaded Image: {os.path.basename(image_path)}', frame)
    cv2.waitKey(500)
    cv2.destroyAllWindows()

    # Start the timer for all operations
    start_time = time.time()

    # --- Basic Operations ---
    print(">> Basic Operations: Grayscale, Binary, Resize")
    # 1. Convert to Grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # 2. Convert Grayscale to Binary (Thresholding)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    # 3. Resize the Image to 256x256
    resized = cv2.resize(frame, (256, 256))
    # Display the basic operations results
    cv2.imshow(f'Grayscale Image: {os.path.basename(image_path)}', gray)
    cv2.imshow(f'Binary Image: {os.path.basename(image_path)}', binary)
    cv2.imshow(f'Resized Image: {os.path.basename(image_path)}', resized)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # --- Section 1: Channel Extraction and Stacking ---
    print(">> Section 1: Extract and Stack RGB Channels")
    stacked_channels = extract_and_stack_channels(frame)
    cv2.imshow('Stacked RGB Channels (R | G | B)', stacked_channels)
    cv2.waitKey(500)
    cv2.destroyAllWindows()

    # --- Section 2: Geometric Transformations ---
    print(">> Section 2: Geometric Transformations")
    geo_results = geometric_transformations(frame)
    cv2.imshow('Scaled Image', geo_results["scaled"])
    cv2.imshow('Rotated Image', geo_results["rotated"])
    cv2.imshow('Translated Image', geo_results["translated"])
    cv2.imshow('Horizontal Shear', geo_results["shear_horizontal"])
    cv2.imshow('Vertical Shear', geo_results["shear_vertical"])
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # --- Section 3: Intensity Transformations ---
    print(">> Section 3: Intensity Transformations on Grayscale Image")
    # Convert to grayscale (already computed above)
    intensity_results = intensity_transformations(gray)
    cv2.imshow('Negative Transformation', intensity_results["negative"])
    cv2.imshow('Logarithmic Transformation', intensity_results["log"])
    cv2.imshow('Inverse Log (Exponential) Transformation', intensity_results["exp"])
    cv2.imshow('Power Law Transformation (Gamma=0.5)', intensity_results["power_law"])
    cv2.imshow('Contrast Stretching 1 (50,200)', intensity_results["contrast_stretching_1"])
    cv2.imshow('Contrast Stretching 2 (30,220)', intensity_results["contrast_stretching_2"])
    cv2.imshow('Contrast Stretching 3 (80,180)', intensity_results["contrast_stretching_3"])
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # End timer and print overall analysis time
    analysis_time = time.time() - start_time
    print(f">> Time taken for all operations on {os.path.basename(image_path)}: {analysis_time:.4f} seconds\n")

print("=== All images processed. ===")
