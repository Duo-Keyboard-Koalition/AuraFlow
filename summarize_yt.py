from google import genai
from google.genai import types
import base64

def generate():
  client = genai.Client(
      vertexai=True,
      project="dreamwell-hackathon",
      location="us-central1",
  )

  image1 = types.Part.from_uri(
      file_uri="gs://cloud-samples-data/generative-ai/image/product_detection.webp",
      mime_type="image/webp",
  )
  video1 = types.Part.from_uri(
      file_uri="https://youtu.be/aBx8-LvAxg4",
      mime_type="video/*",
  )
  text1 = types.Part.from_text(text="""##Task description
You are given a retail product's image and a video to label. Your task is to examine every video frame and find out all the occurences of this reference product in each frame. Explain your finding for each occurence.
##Output specification
You should provide the output in a strictly valid JSON format same as the following example. [
{timestamp\": \"Timestamp of the event in mm:ss format.\",
\"reason\": \"How does the product appear in the video frame.\"
},
{\"timestamp\": \"Timestamp of the event in mm:ss format.\",
\"reason\": \"How does the product appear in the video frame.\"
},
]
Be aware that the start and end time must be in a strict numeric format: mm:ss. Do not output anything after the JSON content. If there are no matching logos, you should not output anything. Please do not hallucinate.
Your answer (as a JSON LIST):""")
  video2 = types.Part.from_uri(
      file_uri="https://www.youtube.com/watch?v=9HyQXA1la04",
      mime_type="video/*",
  )
  si_text1 = """You are a video data analyst with expertise in commercial products. Please do not hallucinate. You can just output nothing if there are no positive findings. Do not output findings for products not matching the reference image."""

  model = "gemini-2.0-flash-001"
  contents = [
    types.Content(
      role="user",
      parts=[
        image1,
        video1,
        text1,
        video2
      ]
    )
  ]
  generate_content_config = types.GenerateContentConfig(
    temperature = 1,
    top_p = 0.95,
    max_output_tokens = 8192,
    response_modalities = ["TEXT"],
    safety_settings = [types.SafetySetting(
      category="HARM_CATEGORY_HATE_SPEECH",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_HARASSMENT",
      threshold="OFF"
    )],
    system_instruction=[types.Part.from_text(text=si_text1)],
  )

  for chunk in client.models.generate_content_stream(
    model = model,
    contents = contents,
    config = generate_content_config,
    ):
    print(chunk.text, end="")

generate()