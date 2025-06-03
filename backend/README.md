# EduRAG Backend

This is the backend API for the EduRAG webapp, built with FastAPI.

## Setup

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Download the embedding model (all-MiniLM-L6-v2):

   - Download using the HuggingFace CLI:
     ```bash
     pip install huggingface_hub
     huggingface-cli download sentence-transformers/all-MiniLM-L6-v2 --local-dir all-MiniLM-L6-v2
     ```
   - Alternatively, download from the [HuggingFace model page](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) and place the files in an `all-MiniLM-L6-v2/` directory.

3. Set up your OpenAI API key:

   - Create a `.env` file in the `backend/` directory:
     ```
     OPENAI_API_KEY=sk-...your-key-here...
     ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://127.0.0.1:8000`.

## Endpoints

- `POST /upload`: Upload a lecture note file (PDF or TXT).
- `POST /query`: Query your notes (RAG pipeline).
