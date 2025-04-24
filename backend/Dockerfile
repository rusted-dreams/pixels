# Use an official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR ./

RUN apt-get update && apt-get install -y curl
RUN apt-get update && apt-get install -y libgl1

RUN pip install uv

RUN echo "source $HOME/.local/bin/env" >> ~/.bashrc
RUN echo "source $HOME/.local/bin/env.fish" >> ~/.bashrc

# Copy project files
COPY . .

# Sync dependencies using uv
RUN uv sync

# Expose container port
EXPOSE 8001

# Start the app using uvicorn
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
