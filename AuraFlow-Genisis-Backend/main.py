from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import Dict
class QuestionRequest(BaseModel):
    question: str
class APIEndpoints:
    """Class to organize API endpoints using OOP approach"""
    
    def __init__(self):
        self.router = APIRouter()
        self.setup_routes()
    
    def setup_routes(self):
        """Configure all routes for this endpoint group"""
        self.router.add_api_route("/hello", self.hello, methods=["GET"])
        self.router.add_api_route("/ask-deepseek", self.ask_deepseek, methods=["POST"])
    async def hello(self) -> Dict[str, str]:
        """Simple hello endpoint"""
        return {"message": "Hello from Dreamwell API!"}


    async def ask_deepseek(self, request: QuestionRequest) -> Dict[str, str]:
        """Ask the deepseek model a question"""
        from agent.ollama_agent import OllamaDeepSeekAgent
        meta3_hackathon = OllamaDeepSeekAgent(pinecone_db_name='meta3-hackathon', k=10)
        return {"response": meta3_hackathon.ask_model(request.question)}


# Initialize the FastAPI app
app = FastAPI(
    title="Dreamwell API",
    description="API for Dreamwell influencer-brand matching platform",
    version="0.1.0"
)

# Initialize endpoints and include router
api_endpoints = APIEndpoints()
app.include_router(api_endpoints.router)

# Add startup event for any initialization
# @app.on_event("startup")
# async def startup_event():
#     print("API is starting up...")

# For running directly 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)