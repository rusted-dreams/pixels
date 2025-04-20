from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from img_upload_utils import upload_image_to_azure
import tasks

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
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.get_grayscale(contents)
        return StreamingResponse(resize, media_type="image/png")

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
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.shear_image_horizontal(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")

@app.post("/api/task/shear-image-vertical")
async def resize(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        resize = tasks.shear_image_vertical(contents)
        return StreamingResponse(resize, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"process failed: {str(e)}")
    