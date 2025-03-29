from langchain_ollama import OllamaEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from uuid import uuid4
# import the import .env stuff
import os
from dotenv import load_dotenv
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")


class pineconeVectorModelLLAMA3Embed:
    def __init__(self, index_string, k = 1, score_threshold = 0.5):
        embeddings = OllamaEmbeddings(
            model="llama3",
        )
        pc = Pinecone(api_key=PINECONE_API_KEY)
        index = pc.Index(index_string)
        self.embeddings = embeddings
        vector_store = PineconeVectorStore(index=index, embedding=embeddings)
        self.vector_store = vector_store
        self.retriever = vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": k, "score_threshold": score_threshold},
        )
    def get_retriever(self):
        return self.retriever
    '''
    Takes in a list of documents
    [
    Document(
        page_content="Building an exciting new project with LangChain - come check it out!",
        metadata={"source": "tweet"},
    ),
    ....
    ]
    '''
    def add_documents(self, documents, ids = None):
        if ids is None:
            ids = [str(uuid4()) for _ in range(len(documents))]
        return self.vector_store.add_documents(documents=documents, ids=ids)

