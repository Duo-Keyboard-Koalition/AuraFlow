import os
import time
import sys
import subprocess
from dotenv import load_dotenv
from models import getInfluencers

# Load environment variables if you have a .env file
load_dotenv()

def check_dependencies():
    """
    Check if required dependencies are installed
    """
    try:
        import langchain_ollama
        print("langchain-ollama is installed")
    except ImportError:
        print("langchain-ollama is not installed. Installing now...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "langchain-ollama"])
        print("langchain-ollama installed successfully")
    
    try:
        import langchain_pinecone
        print("langchain-pinecone is installed")
    except ImportError:
        print("langchain-pinecone is not installed. Installing now...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "langchain-pinecone"])
        print("langchain-pinecone installed successfully")

def test_influencer_finder():
    """
    Test the getInfluencers class functionality
    """
    # Check dependencies first
    check_dependencies()
    
    # API Keys
    PINECONE_API_KEY = "pcsk_613Fp6_N6csf5obvPwnbzaPcUUw6WtnEkAgeqaVCvCFcQ8LAKFf6gKnr2ruYTVn5ZdAe8"
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "dreamwell-hackathon")
    
    print(f"Using Pinecone index: {PINECONE_INDEX_NAME}")
    
    # Initialize the getInfluencers class
    try:
        print("Initializing getInfluencers class...")
        influencer_finder = getInfluencers(PINECONE_API_KEY, PINECONE_INDEX_NAME)
        print("Successfully initialized getInfluencers class")
    except Exception as e:
        print(f"Error initializing getInfluencers class: {e}")
        return
    
    # Test cases
    test_questions = [
        "What influencers would be good for marketing a new fitness app?",
        "Who would be good influencers for marketing a luxury skincare product?",
        "What influencers would be good for marketing a new tech gadget?"
    ]
    
    # Run tests
    for i, question in enumerate(test_questions):
        print(f"\n--- Test {i+1}: {question} ---")
        try:
            start_time = time.time()
            response, retrieved_docs = influencer_finder.querry(question)
            end_time = time.time()
            
            print(f"Query execution time: {end_time - start_time:.2f} seconds")
            
            print("\nResponse:")
            print(response)
            
            print("\nRetrieved Documents:")
            for j, doc in enumerate(retrieved_docs):
                print(f"Document {j+1}:")
                print(doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content)
                print(f"Metadata: {doc.metadata}\n")
        except Exception as e:
            print(f"Error during query: {e}")
    
    # Test error handling
    print("\n--- Testing error handling with empty query ---")
    try:
        response, retrieved_docs = influencer_finder.querry("")
        print("Response for empty query:")
        print(response)
        print("\nNumber of documents retrieved:", len(retrieved_docs))
    except Exception as e:
        print(f"Error with empty query: {e}")

if __name__ == "__main__":
    test_influencer_finder()
