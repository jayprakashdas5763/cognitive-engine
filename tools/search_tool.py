from tavily import TavilyClient
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("TAVILY_API_KEY")
if not api_key:
    raise ValueError("TAVILY_API_KEY not found in environment variables")

client = TavilyClient(api_key=api_key)

def web_search(query):
    """Search the web using Tavily API."""
    try:
        response = client.search(query=query, max_results=3)
        results = []

        for r in response["results"]:
            results.append(f"{r['title']}\n{r['content']}")

        return "\n\n".join(results)
    except Exception as e:
        return f"Error during web search: {str(e)}"
