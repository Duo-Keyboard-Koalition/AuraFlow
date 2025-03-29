import os
import getpass
from branding_db import BrandingDatabase

# Get Pinecone API key
if not os.getenv("PINECONE_API_KEY"):
    os.environ["PINECONE_API_KEY"] = getpass.getpass("Enter your Pinecone API key: ")

pinecone_api_key = os.environ.get("PINECONE_API_KEY")

# Initialize the branding database
branding_db = BrandingDatabase(api_key=pinecone_api_key, index_name="branding-database")

# Example branding content
branding_content = [
    "Our brand voice is friendly, professional, and approachable. We use simple language and avoid jargon.",
    "The company colors are deep blue (#0047AB) and silver (#C0C0C0), representing trust and innovation.",
    "Our target audience is tech-savvy professionals aged 25-45 who value efficiency and quality.",
    "The brand mission is to simplify complex technologies for everyday users.",
    "Our logo should always appear with at least 20px padding and never be displayed smaller than 100x100px.",
    "The company tagline is 'Technology Simplified' and should appear on all marketing materials.",
    "Brand photography should feature diverse people using our products in real-world settings.",
    "Social media posts should maintain a 70/30 ratio of informative to promotional content.",
    "Customer testimonials should be prominently featured on the website and in marketing materials.",
    "All product names should be capitalized and include the company name as a prefix."
]

# Add content to the database
metadata_list = [
    {"category": "voice", "importance": "high"},
    {"category": "visual", "importance": "high"},
    {"category": "audience", "importance": "medium"},
    {"category": "mission", "importance": "high"},
    {"category": "visual", "importance": "medium"},
    {"category": "messaging", "importance": "high"},
    {"category": "visual", "importance": "medium"},
    {"category": "social", "importance": "low"},
    {"category": "marketing", "importance": "medium"},
    {"category": "naming", "importance": "medium"}
]

# Add the branding content to the database
doc_ids = branding_db.add_branding_content(branding_content, metadata_list)
print(f"Added {len(doc_ids)} branding guidelines to the database")

# Example queries
print("\nSearching for visual branding guidelines:")
results = branding_db.search_branding("visual identity and logo usage", k=2, filter={"category": "visual"})
for doc in results:
    print(f"- {doc.page_content}")

print("\nSearching for high importance guidelines:")
results = branding_db.search_branding("important brand elements", k=3, filter={"importance": "high"})
for doc in results:
    print(f"- {doc.page_content}")

print("\nGeneral query about brand voice:")
results = branding_db.query("How should our brand communicate with customers?")
for doc in results:
    print(f"- {doc.page_content}")
