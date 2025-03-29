import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from google.oauth2 import service_account
from langchain_google_vertexai import VertexAI

# Load environment variables
load_dotenv()

class InfluencerService:
    def __init__(self):
        # Load API keys from environment variables
        pinecone_api_key = os.getenv("PINECONE_API_KEY")
        openai_api_key = os.getenv("OPENAI_API_KEY")
        index_name = os.getenv("PINECONE_INDEX_NAME", "dreamwell-hackathon")
        
        # Initialize Pinecone
        pc = Pinecone(api_key=pinecone_api_key)
        index = pc.Index(index_name)
        
        # Initialize embeddings
        embeddings = OpenAIEmbeddings(
            model="text-embedding-3-large", 
            api_key=openai_api_key
        )
        
        # Create vector store
        vector_store = PineconeVectorStore(index=index, embedding=embeddings)
        
        # Initialize retriever
        self.retriever = vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": 1, "score_threshold": 0.5},
        )
        
        # Load credentials from JSON file
        with open('dreamwell-hackathon-cc484b903fe7.json', 'r') as f:
            credentials_json = json.load(f)

        credentials = service_account.Credentials.from_service_account_info(credentials_json)

        # Initialize VertexAI model
        self.model = VertexAI(
            model_name="gemini-pro",
            credentials=credentials
        )
    
    def query(self, question):
        """
        Query the system for influencer recommendations based on a question.
        
        Args:
            question (str): The query or product description
            
        Returns:
            tuple: (response, retrieved_docs)
        """
        # Retrieve relevant documents
        retrieved_docs = self.retriever.invoke(question)

        # Combine retrieved content into a single prompt
        combined_prompt = "Based on the following documents: "
        for doc in retrieved_docs:
            combined_prompt += f"\n{doc.page_content}"
        combined_prompt += "\nWhat recommendations do you have for marketing the product?"

        # Invoke the VertexAI model with the combined prompt
        response = self.model.invoke(combined_prompt)

        # Return the response and retrieved documents
        return response, retrieved_docs
