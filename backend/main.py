from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import PyPDF2
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import openai
import os
import io
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

# Initialize ChromaDB client and collection
chroma_client = chromadb.Client(Settings(persist_directory=".chroma_db"))
collection = chroma_client.get_or_create_collection("notes")

# Initialize embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Set OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def chunk_text(text, chunk_size=500):
    # Simple chunking by character count
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type == "application/pdf":
        file_bytes = await file.read()
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    elif file.content_type == "text/plain":
        text = (await file.read()).decode("utf-8")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and TXT are supported.")
    chunks = chunk_text(text)
    # Embed and store in ChromaDB
    embeddings = embedder.encode(chunks).tolist()
    ids = [f"{file.filename}_{i}" for i in range(len(chunks))]
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=[{"filename": file.filename, "chunk": i} for i in range(len(chunks))]
    )
    return {"filename": file.filename, "num_chunks": len(chunks), "chunks": chunks}

@app.post("/query")
async def query_notes(question: str = Form(...)):
    # Embed the question
    question_embedding = embedder.encode([question]).tolist()[0]
    # Query ChromaDB for top 5 relevant chunks
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=5,
        include=["documents", "metadatas", "distances"]
    )
    # Format the results
    top_chunks = []
    context = ""
    for doc, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0]):
        top_chunks.append({
            "chunk": doc,
            "metadata": meta,
            "distance": dist
        })
        context += doc + "\n"
    # Call OpenAI LLM
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not set in environment variable OPENAI_API_KEY.")
    prompt = f"You are an assistant helping a student with their lecture notes. Use the following context to answer the question.\n\nContext:\n{context}\n\nQuestion: {question}\nAnswer:"
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for answering questions about lecture notes."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300
    )
    answer = response.choices[0].message.content.strip()
    return {"question": question, "answer": answer, "top_chunks": top_chunks} 