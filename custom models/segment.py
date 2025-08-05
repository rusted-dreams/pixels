import torch
from torchvision import transforms
from torchvision.models.segmentation import deeplabv3_resnet101
from PIL import Image
import io
import numpy as np
import cv2

# Load the model
model = deeplabv3_resnet101(pretrained=True).eval()

# Preprocessing
preprocess = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def segment_image(image_bytes: bytes):
    # Decode image
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    input_tensor = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)['out'][0]
    output_predictions = output.argmax(0).byte().cpu().numpy()

    # Create colored segmentation map
    label_colors = np.array([
        (0, 0, 0),        # 0=background
        (128, 0, 0),      # 1=aeroplane
        (0, 128, 0),      # 2=bicycle
        (128, 128, 0),    # ...
        (0, 0, 128),
        (128, 0, 128),
        (0, 128, 128),
        (128, 128, 128),
        (64, 0, 0),
        (192, 0, 0),
        (64, 128, 0),
        (192, 128, 0),
        (64, 0, 128),
        (192, 0, 128),
        (64, 128, 128),
        (192, 128, 128),
        (0, 64, 0),
        (128, 64, 0),
        (0, 192, 0),
        (128, 192, 0),
        (0, 64, 128)
    ])
    r = np.zeros_like(output_predictions).astype(np.uint8)
    g = np.zeros_like(output_predictions).astype(np.uint8)
    b = np.zeros_like(output_predictions).astype(np.uint8)

    for l in range(0, len(label_colors)):
        mask = output_predictions == l
        r[mask] = label_colors[l, 0]
        g[mask] = label_colors[l, 1]
        b[mask] = label_colors[l, 2]

    segmented_img = np.stack([r, g, b], axis=2)
    _, buffer = cv2.imencode('.png', segmented_img)
    return io.BytesIO(buffer.tobytes())
