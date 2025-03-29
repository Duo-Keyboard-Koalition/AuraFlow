import json
from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
from agent.ollama_agent import OllamaDeepSeekAgent
# Constants for database names
INFLUENCER_DB = 'meta3-hackathon'
BRAND_DB = "dreamwell-hackathon"


"""Ask the DeepSeek model for influencer insights.
    brand: str
    influencer: str
    brandValues: list[str]  # List of strings
    missionStatement: str
    targetEmotion: str

"""
deepseek_agent = OllamaDeepSeekAgent(pinecone_db_name=INFLUENCER_DB, k=5)
return_dictstr = deepseek_agent.process_influencers("brand: Dreamwell, influencer: Would want to vibe with the latest innovations and technology, brandValues: ['Innovation', 'Sustainability', 'Authenticity'], missionStatement: Connecting brands with the right influencers for meaningful engagement., targetEmotion: Excitement")
print(return_dictstr)

