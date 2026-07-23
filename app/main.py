from fastapi import FastAPI

app = FastAPI(title="SelamForge API")

@app.get("/health")
def health():
    return {"status": "ok"}
