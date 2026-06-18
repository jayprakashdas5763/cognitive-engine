import json
from langchain_mistralai.chat_models import ChatMistralAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0
)

def write_todos(goal):
    prompt = f"""
    Break the following goal into structured TODO tasks.
    Return ONLY valid JSON list.
    Example:
    [
      {{
        "id": 1,
        "description": "Research topic",
        "status": "pending"
      }}
    ]
    Goal:
    {goal}
    """

    response = llm.invoke(prompt).content

    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return [
            {
                "id": 1,
                "description": goal,
                "status": "pending"
            }
        ]
