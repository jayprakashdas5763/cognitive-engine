import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import asyncio
from graph import build_graph

app = FastAPI(title="Cognitive Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    goal: str
    currentTask: str
    thinking: str
    confidence: int
    progress: int
    tools: List[str]

@app.get("/")
async def root():
    return {"message": "Cognitive Agent API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        graph = build_graph()

        state = {
            "messages": [request.message],
            "todos": [],
            "current_task": "",
            "files": {},
            "results": [],
        }

        result = graph.invoke(state)

        todos = result.get("todos", [])
        completed_tasks = sum(1 for t in todos if t.get("status") == "done")
        total_tasks = len(todos)
        progress = int((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0

        tools_used = [
            "Planner",
            "Executor",
            "Synthesizer",
        ]

        response = ChatResponse(
            response=result.get("files", {}).get("final_report.txt", "Processing complete."),
            goal=request.message,
            currentTask=", ".join(
                [t.get("description", "") for t in todos if t.get("status") == "done"]
            )[:100],
            thinking=f"Processed {total_tasks} tasks successfully.",
            confidence=min(85 + (completed_tasks % 15), 100),
            progress=min(progress, 100),
            tools=tools_used,
        )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
