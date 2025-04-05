import os
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()

AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")

blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)

def upload_image_to_azure(file_data: bytes, filename: str) -> str:
    unique_filename = f"{uuid4().hex}_{filename}"
    blob_client = container_client.get_blob_client(unique_filename)

    blob_client.upload_blob(file_data, overwrite=True)

    blob_url = blob_client.url
    return blob_url
