from typing import List, Dict, Any, Optional
import os
import time
import uuid
from pinecone import Pinecone, ServerlessSpec  # type: ignore
from langchain_core.documents import Document

class PineconeClient:
    """
    Client for interacting with Pinecone vector database.
    """
    
    def __init__(self, index_name: str = "langchain-test-index", dimension: int = 3072):
        """
        Initialize the Pinecone client.
        
        Args:
            api_key: Pinecone API key
            index_name: Name of the Pinecone index to use
            dimension: Dimension of the vectors to store
        """
        self.api_key = os.getenv("PINECONE_API_KEY")
        if not self.api_key:
            raise ValueError("Pinecone API key is required")
        
        self.index_name = index_name
        self.dimension = dimension
        
        # Initialize Pinecone client
        self.pc = Pinecone(api_key=self.api_key)
        
        # Create index if it doesn't exist
        existing_indexes = [index_info["name"] for index_info in self.pc.list_indexes()]
        
        if self.index_name not in existing_indexes:
            self.pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
            # Wait for index to be ready
            while not self.pc.describe_index(self.index_name).status["ready"]:
                time.sleep(1)
        
        # Connect to the index
        self.index = self.pc.Index(self.index_name)
    
    def upsert(self, vectors: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Insert or update vectors in the Pinecone index.
        
        Args:
            vectors: List of vectors to upsert
            
        Returns:
            Response from Pinecone
        """
        return self.index.upsert(vectors=vectors)
    
    def add_documents(self, documents: List[Document], embedding_model, ids: Optional[List[str]] = None) -> List[str]:
        """
        Add documents to the Pinecone index.
        
        Args:
            documents: List of documents to add
            embedding_model: Model to use for generating embeddings
            ids: Optional list of IDs for the documents
            
        Returns:
            List of document IDs
        """
        if ids is None:
            ids = [str(uuid.uuid4()) for _ in range(len(documents))]
        
        # Generate embeddings for documents
        texts = [doc.page_content for doc in documents]
        embeddings = embedding_model.embed_documents(texts)
        
        # Prepare vectors for upsert
        vectors = []
        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            vectors.append({
                "id": ids[i],
                "values": embedding,
                "metadata": {
                    "text": doc.page_content,
                    **doc.metadata
                }
            })
        
        # Upsert vectors to Pinecone
        self.upsert(vectors=vectors)
        
        return ids
    
    def search(self, query_vector: List[float], top_k: int = 5, filter: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Search for similar vectors in the Pinecone index.
        
        Args:
            query_vector: The query vector
            top_k: Number of results to return
            filter: Optional filter to apply to the search
            
        Returns:
            List of matching documents
        """
        results = self.index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True,
            filter=filter
        )
        
        # Format results
        matches = []
        for match in results.get("matches", []):
            matches.append({
                "id": match.get("id"),
                "score": match.get("score"),
                "text": match.get("metadata", {}).get("text", ""),
                "metadata": match.get("metadata", {})
            })
        
        return matches
    
    def similarity_search(self, query: str, embedding_model, k: int = 5, filter: Optional[Dict[str, Any]] = None) -> List[Document]:
        """
        Search for similar documents using a text query.
        
        Args:
            query: The text query
            embedding_model: Model to use for generating embeddings
            k: Number of results to return
            filter: Optional filter to apply to the search
            
        Returns:
            List of matching documents
        """
        # Generate embedding for query
        query_embedding = embedding_model.embed_query(query)
        
        # Search for similar vectors
        results = self.search(query_vector=query_embedding, top_k=k, filter=filter)
        
        # Convert results to Documents
        documents = []
        for result in results:
            documents.append(
                Document(
                    page_content=result["text"],
                    metadata={k: v for k, v in result["metadata"].items() if k != "text"}
                )
            )
        
        return documents
    
    def delete(self, ids: List[str]) -> Dict[str, Any]:
        """
        Delete vectors from the Pinecone index.
        
        Args:
            ids: List of vector IDs to delete
            
        Returns:
            Response from Pinecone
        """
        return self.index.delete(ids=ids)
    
    def as_retriever(self, search_type: str = "similarity", search_kwargs: Optional[Dict[str, Any]] = None):
        """
        Create a retriever from the Pinecone index.
        
        Args:
            search_type: Type of search to perform
            search_kwargs: Additional search parameters
            
        Returns:
            A retriever object
        """
        # This is a simplified version - in a real implementation, 
        # you would return a proper LangChain retriever
        return PineconeRetriever(
            client=self,
            embedding_model=None,  # This would need to be passed in
            search_type=search_type,
            search_kwargs=search_kwargs or {}
        )

class PineconeRetriever:
    """
    A simple retriever for Pinecone.
    """
    
    def __init__(self, client, embedding_model, search_type: str, search_kwargs: Dict[str, Any]):
        self.client = client
        self.embedding_model = embedding_model
        self.search_type = search_type
        self.search_kwargs = search_kwargs
    
    def invoke(self, query: str, filter: Optional[Dict[str, Any]] = None) -> List[Document]:
        """
        Retrieve documents based on the query.
        
        Args:
            query: The query string
            filter: Optional filter to apply
            
        Returns:
            List of retrieved documents
        """
        if self.embedding_model is None:
            raise ValueError("Embedding model must be set to use the retriever")
            
        k = self.search_kwargs.get("k", 5)
        
        if self.search_type == "similarity_score_threshold":
            score_threshold = self.search_kwargs.get("score_threshold", 0.0)
            # Implementation would filter results by score
            
        return self.client.similarity_search(
            query=query,
            embedding_model=self.embedding_model,
            k=k,
            filter=filter
        )
