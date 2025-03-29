This is the form Data for the influencers


interface FormData {
  brand: string;              // Brand identity description
  influencer: string;         // Influencer vibe criteria
  brandValues: string[];      // Selected brand values (up to 5)
  missionStatement: string;   // Brand's mission statement
  targetEmotion: string;      // Emotion the brand wants to evoke
}


```
from typing import Optional, Literal, Type
from pydantic import BaseModel
# LangChain-related imports
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
class GKSearchInput(BaseModel):
    operation: str


"""Example of Python client calling Knowledge Graph Search API."""
def googleKGraphSearch(query = 'Taylor Swift'):
  import json
  import urllib.parse
  import urllib.request

  api_key = 'AIzaSyDqndbVj-x6mGty5O26Azy6Hsavvr8a2zw'

  service_url = 'https://kgsearch.googleapis.com/v1/entities:search'
  params = {
      'query': query,
      'limit': 10,
      'indent': True,
      'key': api_key,
  }
  url = service_url + '?' + urllib.parse.urlencode(params)
  response = json.loads(urllib.request.urlopen(url).read())
  return response


class GKSearchTool(BaseTool):
    name: str = "Calculator"
    description: str = "Useful for performing basic google saerch operations: given a querry"
    args_schema: Type[BaseModel] = CalculatorInput
    return_direct: bool = True

    def _run(
        self, query: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Example of Python client calling Knowledge Graph Search API."""
        import json
        import urllib.parse
        import urllib.request

        api_key = 'AIzaSyDqndbVj-x6mGty5O26Azy6Hsavvr8a2zw'
        query = 'Taylor Swift'
        service_url = 'https://kgsearch.googleapis.com/v1/entities:search'
        params = {
            'query': query,
            'limit': 10,
            'indent': True,
            'key': api_key,
        }
        url = service_url + '?' + urllib.parse.urlencode(params)
        response = json.loads(urllib.request.urlopen(url).read())
        # respons is a dictionar
        return str(response)

    async def _arun(
        self, operation: str, a: int, b: int, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Perform the requested operation asynchronously."""
        raise NotImplementedError("CustomCalculatorTool does not support asynchronous operations.")


# Initialize tools
calculator = GKSearchTool()

```