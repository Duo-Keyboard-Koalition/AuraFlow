import requests

# Base URL of your API
API_URL = "http://localhost:8000/ask_deepseek_influencer"

# Sample data for the BrandForm
test_data = {
    "brand": "Dreamwell",
    "influencer": "Jane Doe",
    "brandValues": ["Innovation", "Sustainability", "Authenticity"],
    "missionStatement": "Connecting brands with the right influencers for meaningful engagement.",
    "targetEmotion": "Excitement"
}

# Make the POST request
response = requests.post(API_URL, json=test_data)

# Check and display the response
if response.status_code == 200:
    print("Test successful!")
    print("Response:", response.json())
else:
    print(f"Test failed with status code {response.status_code}")
    print("Response:", response.text)