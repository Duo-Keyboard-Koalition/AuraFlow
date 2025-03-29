from camel.models import ModelFactory
from camel.types import ModelPlatformType, ModelType
from camel.configs import ChatGPTConfig
from camel.messages import BaseMessage
from camel.agents import ChatAgent
from litellm.llms.cohere.chat.transformation import CohereChatConfig
import os
# set COHERE_API_KEY to
os.environ["COHERE_API_KEY"] = "R7p7xFH94Vbu7d7rcQcntLjWoYoPTG8sFJ9Y4bl3"

# Define the model, here in this case we use gpt-4o-mini
model = ModelFactory.create(
    model_platform=ModelPlatformType.COHERE,
    model_type=ModelType.COHERE_COMMAND_R,
)
# Define an assitant message
system_msg = "You are a helpful assistant."

# Initialize the agent
# Create a chat agent with a system message
agent = ChatAgent(system_message="You are a helpful assistant.")

# Step through a conversation
response = agent.step("Hello, can you help me?")
print(response.text)