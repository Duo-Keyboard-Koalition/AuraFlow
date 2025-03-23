import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")

try:
    llm = ChatOpenAI(api_key=api_key)
    response = llm.invoke("Hello, world!")
    print(response)
except Exception as e:
    print(f"Error occurred: {e}")