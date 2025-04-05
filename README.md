### setup backend:
- install uv using - `pip install uv` or follow the [docs](https://docs.astral.sh/uv/getting-started/installation/)
- make sure you are in the backend dir. then use the command `uv venv --python 3.12 .venv` to create the virtual env.
- `uv pip install -r requirements.txt` - install the required packages.
- start the server using - `uvicorn main:app --reload`