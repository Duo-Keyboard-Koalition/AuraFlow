import json
from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
from pinecone import Pinecone
# dotenv
from dotenv import load_dotenv
import os
load_dotenv()
# Constants for database names
INFLUENCER_DB = 'meta3-hackathon'
BRAND_DB = "dreamwell-hackathon"


# Define the BrandForm schema
class BrandForm(BaseModel):
    brand: str
    influencer: str
    brandValues: list[str]  # List of strings
    missionStatement: str
    targetEmotion: str


# Define the InfluencerForm schema
class InfluencerForm(BaseModel):
    brand: str
    influencer: str
    brandValues: list[str]  # List of strings
    missionStatement: str
    targetEmotion: str


# API Endpoints class
class APIEndpoints:
    """Class to organize API endpoints using OOP approach."""

    def __init__(self):
        self.router = APIRouter()
        self.setup_routes()

    def setup_routes(self):
        """Configure all routes for this endpoint group."""
        self.router.add_api_route("/health", self.health, methods=["GET"])
        self.router.add_api_route("/ask_deepseek_influencer", self.ask_deepseek_influencer, methods=["POST"])
        self.router.add_api_route("/ask_deepseek_brand", self.ask_deepseek_brand, methods=["POST"])

    async def health(self) -> Dict[str, str]:
        """Simple hello endpoint."""
        return {"message": "Hello from Dreamwell API!"}

    async def ask_deepseek_influencer(self, request: BrandForm) -> Dict[str, list]:
        """Ask the DeepSeek model for influencer insights."""
        import os
        from langchain_ollama import OllamaEmbeddings
        from langchain_pinecone import PineconeVectorStore
        from agent.get_influencer_match import get_influencer_match
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        embeddings = OllamaEmbeddings(
            model="llama3",
        )
        index = pc.Index(INFLUENCER_DB)
        vector_store = PineconeVectorStore(index=index, embedding=embeddings)
        # Get the retriever from Pinecone
        retriever = vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": 10, "score_threshold": 0.5},
        )
        # Retrieve relevant influencers from Pinecone
        # turn request into a query string
        query = f"brand: {request.brand}, influencer: {request.influencer}, brandValues: {request.brandValues}, missionStatement: {request.missionStatement}, targetEmotion: {request.targetEmotion}"
        pinecone_results = retriever.invoke(query)

        # Parse results to ensure proper JSON format
        results = []
        for result in pinecone_results:
            try:
                # Try to parse if string contains JSON
                match_result = get_influencer_match(result.page_content)
                if isinstance(match_result, str):
                    # If it's a string, try to parse it as JSON
                    try:
                        parsed_json = json.loads(match_result)
                        results.append(parsed_json)
                    except json.JSONDecodeError:
                        # If not valid JSON, include as raw text
                        results.append({"raw_text": match_result})
                else:
                    # If already a dict/object, add directly
                    results.append(match_result)
            except Exception as e:
                results.append({"error": str(e), "content": result.page_content[:100] + "..."})

        return {"response": results}
    async def ask_deepseek_brand(self, request: InfluencerForm) -> Dict[str, Dict]:
        """Ask the DeepSeek model for brand insights."""
        return {"response": {"hi":"hi"}}

    @staticmethod
    def _convert_brand_form_to_string(brandform: BrandForm) -> str:
        """Helper method to convert BrandForm to string."""
        return f"{brandform.brand} {brandform.influencer} {brandform.brandValues} {brandform.missionStatement} {brandform.targetEmotion}"


# Initialize the FastAPI app
app = FastAPI(
    title="Dreamwell API",
    description="API for the Dreamwell influencer-brand matching platform",
    version="0.1.0"
)

# Initialize endpoints and include the router
api_endpoints = APIEndpoints()
app.include_router(api_endpoints.router)

# For running directly
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)