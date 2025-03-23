from fastapi import FastAPI
import os
from dotenv import load_dotenv
from models import getInfluencers
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Get API keys from environment variables

PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "dreamwell-hackathon")

app = FastAPI()

from pydantic import BaseModel

class InfluencerQuery(BaseModel):
    question: str

@app.post("/influencers")
async def influencers(query: InfluencerQuery):
    print(query.question)
    # return the question
    getinf = getInfluencers(PINECONE_API_KEY, PINECONE_INDEX_NAME)
    return {"response": getinf.querry(query.question)}
