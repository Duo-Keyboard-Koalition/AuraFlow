from google import genai
from google.genai import types
import json


def load_credentials(file_path = "gcloud-creds.json"):
    """
    Load Google Cloud credentials from a JSON file.
    """
    import os
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=file_path

load_credentials()
def generate():
    # Initialize Vertex AI client
    client = genai.Client(
        vertexai=True,
        project="dreamwell-hackathon",
        location="us-central1",
    )

    video1 = types.Part.from_uri(
        file_uri="https://www.youtube.com/watch?v=TitZV6k8zfA",
        mime_type="video/*",
    )

    text1 = types.Part.from_text(text="""##Task description
You are an influencer auditor and You are given a video to analyse. 

Analyze the video to:
1. Identify all occurrences of the reference product in each frame
2. Analyze the influencer in the video by determining their:
   - Personality Traits
   - Values
   - Brand Identity
   - Socio-Cultural Background
   - Primary Audience Demographics
   - Platform Appeal & Reach

##Output specification
You should provide the output in a strictly valid JSON format:
{
  "semantic_summary": [
    {
      "timestamp": "mm:ss format",
      "content_description": "Describe the product the influencer is talking about. The summary of what the influencer is talking about. This should be a brief description of the content in the video frame."
    }
  ],
  "influencer_analysis": {
    "personality_traits": ["trait1", "trait2", ...],
    "values": ["value1", "value2", ...],
    "brand_identity": "Description of brand identity",
    "socio_cultural_background": "Description of background",
    "audience_demographics": "Description of primary audience",
    "platform_appeal": "Description of appeal and reach"
  }
}

Be aware that timestamps must be in strict mm:ss format. Do not output anything after the JSON content. If there are no matching products, provide an empty array for product_occurrences. Please do not hallucinate.
Your answer (as valid JSON):""")

    si_text1 = """You are a video data analyst with expertise in commercial products and influencer marketing. Please do not hallucinate. Focus on objective analysis of both the product appearances and the influencer characteristics. Provide comprehensive insights into the influencer's personality, values, and audience to help brands make informed decisions about potential partnerships."""

    model = "gemini-2.0-flash-001"
    contents = [
        types.Content(
            role="user",
            parts=[
                video1,
                text1
            ]
        )
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        response_modalities=["TEXT"],
        safety_settings=[
            types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF")
        ],
        system_instruction=[types.Part.from_text(text=si_text1)],
    )

    for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
    ):
        # please format this into a json
        # It starts like ```json
        # file content
        # ```
        dict_str = chunk.text
        # remove the first and last characters ``` json and ```
        dict_str = dict_str[6:-3]
        print(dict_str)
        # print the dictionary
        return json.loads(dict_str)


if __name__ == "__main__":
    print(generate())