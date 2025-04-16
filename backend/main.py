from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from img_upload_utils import upload_image_to_azure
from tasks import get_negative, get_rgb_channels

app = FastAPI()


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
        negative = get_negative(contents)
        return StreamingResponse(negative, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    

@app.post("/api/task/rgb-channels")
async def rgb_channels(file: UploadFile = File(...)):
    """
    Accepts an image, separates RGB channels, and returns 3 color-isolated images in a ZIP file.
    """
    image_bytes = await file.read()
    result_zip = get_rgb_channels(image_bytes)
    return StreamingResponse(result_zip, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=rgb_channels.zip"
    })