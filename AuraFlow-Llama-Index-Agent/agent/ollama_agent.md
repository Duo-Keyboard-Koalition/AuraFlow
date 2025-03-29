from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
import os
import requests
import json
from typing import Dict, List, Any, Optional
from langchain_core.documents import Document
import os
import cohere
from typing import Dict, List


# Define the API schema as a class
class InfluencerMatch:
    def __init__(self, name: str, platform: str, followers: str, engagement: str,
                 niche: str, details: str, values: List[str], vibeScore: float,
                 audienceAlignment: float, contentStyle: str):
        self.name = name
        self.platform = platform
        self.followers = followers
        self.engagement = engagement
        self.niche = niche
        self.details = details
        self.values = values
        self.vibeScore = vibeScore
        self.audienceAlignment = audienceAlignment
        self.contentStyle = contentStyle

    def to_dict(self) -> Dict[str, str]:
        return {
            "name": self.name,
            "platform": self.platform,
            "followers": self.followers,
            "engagement": self.engagement,
            "niche": self.niche,
            "details": self.details,
            "values": self.values,
            "vibeScore": self.vibeScore,
            "audienceAlignment": self.audienceAlignment,
            "contentStyle": self.contentStyle
        }


def get_influencer_match(influencer_description) -> InfluencerMatch:
    dict = {
        "model": "command-r-plus",
        "title": "Command R+",
        "apiKey": "R7p7xFH94Vbu7d7rcQcntLjWoYoPTG8sFJ9Y4bl3",
        "provider": "cohere"
    }
    # Initialize Cohere client
    COHERE_API_KEY = dict['apiKey']
    co = cohere.ClientV2(COHERE_API_KEY)

    # Global variable to store influencer match
    influencer_match_global = None

    # System message for context and style guide with API Schema
    SYSTEM_MESSAGE = f"""
    ## Task & Context
    You are tasked with matching influencer data to the following schema:

    {InfluencerMatch.__doc__}

    # Parsing response to fill the InfluencerMatch class (assuming response format allows it)
    # This is a placeholder example assuming a correctly formatted response
    example_response_data = 
        "name": "Jane Doe",
        "platform": "Instagram",
        "followers": "150k",
        "engagement": "High",
        "niche": "Fashion",
        "details": "Fashion influencer known for her chic styles.",
        "values": ["Sustainability", "Creativity"],
        "vibeScore": 8.5,
        "audienceAlignment": 7.0,
        "contentStyle": "Minimalist"




    Your output should fill in this schema with the relevant details provided by your input.
    ## Style Guide
    Answer in full sentences, using proper grammar and spelling.
    please output in JSON format ONLY THE JSON FORMAT

    """

    # Messages for the chat
    messages = [
        {"role": "system", "content": SYSTEM_MESSAGE},
        {"role": "user", "content": f"Provide a detailed influencer description for: \n{influencer_description}"},
    ]

    # Chat response from Cohere
    response = co.chat(
        model="command-a-03-2025",
        messages=messages
    )

    # Assuming we get similar data from the API (for demonstration purposes)
    #
    #
    #
    # print(response.message.content[0].text)
    # the text is returned in the format of a string, so we need to parse it into a dictionary
    # ```json
    # {}
    # ```
    # clean the string
    response_text = response.message.content[0].text
    response_text = response_text.replace("\n", "")
    # please use regex to clean the string
    import re
    # get the first occurance of {
    start_index = response_text.find("{")
    # get the last occurance of }
    end_index = response_text.rfind("}")
    # get the substring that contains the dictionary
    response_text = response_text[start_index:end_index + 1]
    return response_text


influencer_description = '''
    Got it! If you're looking for a textual description of a fake influencer, here's an example. This description will incorporate various attributes that one might use to describe an influencer, focusing on their persona and content style:

    ---

    Meet **Alex Star**, a charismatic and dynamic fashion influencer dominating the Instagram scene. With over **150k dedicated followers**, Alex has carved out a niche in the **fashion world**, known for a **minimalist aesthetic** that sets trends among young adults and industry insiders alike.

    Alex's content is celebrated for its **high engagement rates**, thanks to a unique blend of **sustainability and creativity** that resonates deeply with their environmentally conscious audience. Each post is a glimpse into Alex's world, filled with **chic outfit inspirations** and innovative styling tips that push the boundaries of contemporary fashion.

    The influencer's value-driven approach to content creation not only captivates viewers but also fosters a strong sense of community. Alex regularly collaborates with like-minded brands, ensuring each partnership aligns with their **authentic voice** and mission to promote **sustainable fashion**.

    With an impressive **vibe score of 8.9** and **audience alignment score of 8.5**, Alex's content seamlessly marries aesthetics and purpose, offering more than just visual appeal. It’s about making a statement—a win-win for both followers looking for stylish inspiration and brands seeking impactful collaborations.

    ---

    This description paints a vivid picture of the influencer's style, engagement, values, and appeal to an audience. Adjust the attributes such as name, niche, platform, and style to fit whatever specific profile you have in mind.

    '''


# Get the influencer match
# influencer_match = get_influencer_match(influencer_description)
# print(influencer_match.to_dict())
class OllamaDeepSeekAgent:
    """
    Agent that uses Ollama and Pinecone for retrieving influencer data
    and generating responses through the Cohere model.
    """

    def __init__(self, pinecone_db_name="meta3-hackathon", k=10):
        """
        Initialize the Ollama agent.

        Args:
            pinecone_db_name: Name of the Pinecone database to retrieve influencers.
            k: Number of top results to retrieve from Pinecone.
        """
        self.

    def process_influencers(self, query: str) -> Dict[str, List[Dict]]:
        """
        Process each influencer retrieved from Pinecone through the Cohere model.

        Args:
            query: The query/question to retrieve relevant influencer information.

        Returns:
            Dict[str, List[Dict]]: A list of referrals generated for each influencer.
        """
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_ollama.llms import OllamaLLM
        from langchain_core.output_parsers import StrOutputParser
        from langchain.schema.runnable import RunnablePassthrough
        import json
