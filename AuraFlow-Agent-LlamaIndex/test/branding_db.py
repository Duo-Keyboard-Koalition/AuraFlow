import os
import time
from uuid import uuid4

import pinecone
from langchain_core.vectorstores import VectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

class PineconeStore(VectorStore):
    """Custom Pinecone vector store implementation compatible with older Pinecone client."""
    
    def __init__(self, index, embedding: Embeddings):
        """Initialize with Pinecone index and embedding function."""
        self.index = index
        self.embedding = embedding
        
    def add_documents(self, documents, ids=None):
        """Add documents to the vector store."""
        if ids is None:
            ids = [str(uuid4()) for _ in range(len(documents))]
            
        # Get embeddings for documents
        embeddings = self.embedding.embed_documents([doc.page_content for doc in documents])
        
        # Prepare vectors for upsert
        vectors = []
        for i, (doc, emb) in enumerate(zip(documents, embeddings)):
            metadata = doc.metadata.copy()
            metadata["text"] = doc.page_content
            vectors.append({
                "id": ids[i],
                "values": emb,
                "metadata": metadata
            })
        
        # Upsert in batches to avoid request size limits
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i+batch_size]
            self.index.upsert(vectors=batch)
            
        return ids
    
    def similarity_search(self, query, k=4, filter=None):
        """Search for similar documents."""
        # Get embedding for query
        query_embedding = self.embedding.embed_query(query)
        
        # Search in Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=k,
            include_metadata=True,
            filter=filter
        )
        
        # Convert to documents
        documents = []
        for match in results["matches"]:
            metadata = match["metadata"].copy()
            text = metadata.pop("text")
            documents.append(Document(page_content=text, metadata=metadata))
            
        return documents
    
    def similarity_search_with_score(self, query, k=4, filter=None):
        """Search for similar documents and return with scores."""
        # Get embedding for query
        query_embedding = self.embedding.embed_query(query)
        
        # Search in Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=k,
            include_metadata=True,
            filter=filter
        )
        
        # Convert to documents with scores
        documents_with_scores = []
        for match in results["matches"]:
            metadata = match["metadata"].copy()
            text = metadata.pop("text")
            doc = Document(page_content=text, metadata=metadata)
            documents_with_scores.append((doc, match["score"]))
            
        return documents_with_scores
    
    def delete(self, ids):
        """Delete vectors by ID."""
        self.index.delete(ids=ids)
        
    def as_retriever(self, search_type="similarity", search_kwargs=None):
        """Return as a retriever."""
        from langchain_core.retrievers import VectorStoreRetriever
        
        search_kwargs = search_kwargs or {}
        return VectorStoreRetriever(
            vectorstore=self,
            search_type=search_type,
            search_kwargs=search_kwargs
        )


class BrandingDatabase:
    """
    A class to manage a branding-focused vector database using Pinecone.
    This database can store and retrieve branding-related content.
    """
    
    def __init__(self, api_key, index_name="branding-database", use_ollama=True, dimension=1536):
        """
        Initialize the branding database.
        
        Args:
            api_key (str): Pinecone API key
            index_name (str): Name of the Pinecone index to use
            use_ollama (bool): Whether to use Ollama embeddings (True) or OpenAI (False)
            dimension (int): Dimension of the embedding vectors
        """
        # Initialize Pinecone
        pinecone.init(api_key=api_key)
        self.index_name = index_name
        
        # Check if index exists, create if it doesn't
        if index_name not in pinecone.list_indexes():
            pinecone.create_index(
                name=index_name,
                dimension=dimension,
                metric="cosine"
            )
            # Wait for index to be ready
            while not pinecone.describe_index(index_name)["status"]["ready"]:
                time.sleep(1)
        
        # Connect to the index
        self.index = pinecone.Index(index_name)
        
        # Set up embeddings model
        if use_ollama:
            self.embeddings = OllamaEmbeddings(model="llama3:latest")
            self.model = OllamaLLM(model="llama3:latest")
            # Ollama embeddings are typically 4096 dimensions for llama3
            # If using Ollama, we should have created the index with this dimension
        else:
            self.embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
            # OpenAI embeddings are 1536 dimensions for text-embedding-3-large
        
        # Initialize our custom vector store
        self.vector_store = PineconeStore(
            index=self.index,
            embedding=self.embeddings
        )
        
        # Initialize retriever
        self.retriever = self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
    
    def add_branding_content(self, contents, metadata_list=None, ids=None):
        """
        Add branding-related content to the database.
        
        Args:
            contents (list): List of text content strings
            metadata_list (list, optional): List of metadata dictionaries
            ids (list, optional): List of IDs for the documents
            
        Returns:
            list: List of document IDs
        """
        if metadata_list is None:
            metadata_list = [{"source": "branding"} for _ in range(len(contents))]
        
        if ids is None:
            ids = [str(uuid4()) for _ in range(len(contents))]
        
        documents = [
            Document(page_content=content, metadata=metadata)
            for content, metadata in zip(contents, metadata_list)
        ]
        
        return self.vector_store.add_documents(documents=documents, ids=ids)
    
    def search_branding(self, query, k=3, filter=None):
        """
        Search for branding content similar to the query.
        
        Args:
            query (str): The search query
            k (int): Number of results to return
            filter (dict, optional): Metadata filter
            
        Returns:
            list: List of Document objects
        """
        return self.vector_store.similarity_search(query, k=k, filter=filter)
    
    def search_with_scores(self, query, k=3, filter=None):
        """
        Search for branding content with similarity scores.
        
        Args:
            query (str): The search query
            k (int): Number of results to return
            filter (dict, optional): Metadata filter
            
        Returns:
            list: List of (Document, score) tuples
        """
        return self.vector_store.similarity_search_with_score(query, k=k, filter=filter)
    
    def delete_content(self, ids):
        """
        Delete content from the database.
        
        Args:
            ids (list): List of document IDs to delete
        """
        self.vector_store.delete(ids=ids)
    
    def query(self, question, filter=None):
        """
        Query the database using the retriever.
        
        Args:
            question (str): The question to ask
            filter (dict, optional): Metadata filter
            
        Returns:
            list: List of retrieved documents
        """
        return self.retriever.invoke(question, filter=filter)
