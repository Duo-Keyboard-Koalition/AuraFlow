from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
import os
import requests
import json
from typing import Dict, List, Any, Optional
from langchain_core.documents import Document

class OllamaDeepSeekAgent:
    """
    Agent that uses Ollama for generating responses and accessing information.
    """
    
    def __init__(self, pinecone_db_name = "meta3-hackathon", k = 10):
        """
        Initialize the Ollama agent.
        
        Args:
            model_name: The name of the Ollama model to use
            pinecone_client: The Pinecone client for vector storage
            embedding_model: The embedding model to use
            host: The Ollama API host URL
        """
        from model import pineconeVectorModelLLAMA3Embed
        self.vdb = pineconeVectorModelLLAMA3Embed(pinecone_db_name, k = k)
    def ask_model(self, question):
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_ollama.llms import OllamaLLM
        
        from langchain.schema.runnable import RunnablePassthrough
        from langchain_core.output_parsers import StrOutputParser

        # Get the retriever from your model
        retrieve_db = self.vdb.get_retriever()

        # Create Ollama model
        model = OllamaLLM(model="deepseek-r1")

        # Update template to include context from retriever
        template = """Answer the question based on the following context:

        Context:
        {context}
        I am an AI model that are going to help you get the best influenver for your brand. I can help you with the following:
        - Find the best influencer for your brand
        - Help you with the best influencer marketing strategy
        - Help you with the best influencer marketing campaign
        - find the influencer that would BUY your product genuinely
        Question: {question}
        Within the database there is a list of influencers that are categorized based on their niche. You are also in need to justify why did you pick specific influencers
        Answer: Let's think step by step."""

        prompt = ChatPromptTemplate.from_template(template)

        # Function to format retrieved documents into a string
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        # Create the complete RAG chain
        rag_chain = (
            {
                "context": lambda query: format_docs(retrieve_db.invoke(query)),
                "question": RunnablePassthrough()
            }
            | prompt 
            | model 
            | StrOutputParser()
        )

        # Example usage
        response = rag_chain.invoke(question)
        return(response)