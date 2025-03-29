# This is a sample Python script.

# Press ⌃F5 to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.


def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press F9 to toggle the breakpoint.


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print_hi('PyCharm')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from influencer_service import InfluencerService
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Influencer Recommendation API",
    description="API for getting influencer recommendations based on product descriptions",
    version="1.0.0"
)

# Initialize the influencer service
influencer_service = InfluencerService()

# Define request and response models
class QueryRequest(BaseModel):
    query: str
    
class Document(BaseModel):
    page_content: str
    metadata: Dict[str, Any] = {}
    
class QueryResponse(BaseModel):
    response: str
    documents: List[Document]

@app.get("/")
async def root():
    return {"message": "Welcome to the Influencer Recommendation API"}

@app.post("/query", response_model=QueryResponse)
async def get_recommendations(request: QueryRequest):
    try:
        # Get recommendations from the service
        response, retrieved_docs = influencer_service.query(request.query)
        
        # Convert retrieved documents to the expected format
        docs = [
            Document(
                page_content=doc.page_content,
                metadata=doc.metadata
            ) for doc in retrieved_docs
        ]
        
        # Return the response
        return QueryResponse(
            response=response,
            documents=docs
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
