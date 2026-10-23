import uvicorn
import os
from google.adk.sessions import InMemorySessionService
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from accountant.agent import app as adk_app


session_service = InMemorySessionService()

runner = Runner(app=adk_app,  session_service= session_service)
app = FastAPI(title="live-accountant")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
async def health() -> dict[str, str]:

    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ["PORT"]))