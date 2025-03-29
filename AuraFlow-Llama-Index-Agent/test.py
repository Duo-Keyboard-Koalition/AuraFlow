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


def get_influener_report(question):

    from langchain_core.prompts import ChatPromptTemplate
    from langchain_ollama.llms import OllamaLLM
    from langchain.schema.runnable import RunnablePassthrough
    from langchain_core.output_parsers import StrOutputParser

    # Get the retriever from your model
    influencer_db = pineconeVectorModelLLAMA3Embed("meta3-hackathon", k = 10).get_retriever()

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
            "context": lambda query: format_docs(influencer_db.invoke(query)),
            "question": RunnablePassthrough()
        }
        | prompt 
        | model 
        | StrOutputParser()
    )

    # Example usage
    response = rag_chain.invoke(question)
    return response
get_influener_report("My brand is Gaming Keyboards? looking for high tech high intensity gamer influencers")