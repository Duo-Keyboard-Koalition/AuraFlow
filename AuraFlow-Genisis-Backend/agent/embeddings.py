import requests
import numpy as np
from typing import List, Union

class LlamaEmbeddings:
    """
    Class for generating embeddings using the Llama model via Ollama.
    """
    
    def __init__(self, host: str = "http://localhost:11434", model: str = "llama"):
        """
        Initialize the Llama embeddings model.
        
        Args:
            host: The Ollama API host URL
            model: The model name to use for embeddings
        """
        self.host = host
        self.model = model
    
    def embed_query(self, text: str) -> List[float]:
        """
        Generate embeddings for a single text query.
        
        Args:
            text: The text to embed
            
        Returns:
            The embedding vector
        """
        return self.embed_documents([text])[0]
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts.
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors
        """
        embeddings = []
        
        for text in texts:
            url = f"{self.host}/api/embeddings"
            
            payload = {
                "model": self.model,
                "prompt": text
            }
            
            try:
                response = requests.post(url, json=payload)
                response.raise_for_status()
                embedding = response.json().get("embedding", [])
                embeddings.append(embedding)
            except requests.exceptions.RequestException as e:
                print(f"Error generating embeddings: {e}")
                # Return a zero vector as fallback
                embeddings.append([0.0] * 4096)
        
        return embeddings
