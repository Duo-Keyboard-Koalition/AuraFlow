import os
import requests
from pinecone import Pinecone
import time
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import OllamaEmbeddings
from langchain_ollama import OllamaLLM

# API Keys
TAVILY_API_KEY = "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"
PINECONE_API_KEY = "pcsk_613Fp6_N6csf5obvPwnbzaPcUUw6WtnEkAgeqaVCvCFcQ8LAKFf6gKnr2ruYTVn5ZdAe8"
index_name = "dreamwell-hackathon"  # change if desired

class getInfluencers:
    def __init__(self, api_key, index_name):
        pc = Pinecone(api_key=api_key)
        index = pc.Index(index_name)
        embeddings = OllamaEmbeddings(model="llama3:latest")
        vector_store = PineconeVectorStore(index=index, embedding=embeddings)
        self.retriever = vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": 1, "score_threshold": 0.5},
        )
        # Initialize Ollama model with the latest Llama model
        self.model = OllamaLLM(model="llama3:latest")
    def querry(self, question):
        # Retrieve relevant documents
        retrieved_docs = self.retriever.invoke(
            question
        )

        # Combine retrieved content into a single prompt
        combined_prompt = "Based on the following documents: "
        for doc in retrieved_docs:
            combined_prompt += f"\n{doc.page_content}"
        combined_prompt += "\nWhat recommendations do you have for marketing the product?"

        # Invoke the Ollama model with the combined prompt
        response = self.model.invoke(combined_prompt)

        # Output the response
        return response, retrieved_docs
