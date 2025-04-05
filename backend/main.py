from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from img_upload_utils import upload_image_to_azure

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Backend is up and running"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        blob_url = upload_image_to_azure(contents, file.filename)
        return {"success": True, "url": blob_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")