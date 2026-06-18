from typing import TypedDict, List, Dict

class AgentState(TypedDict):

    messages: List[str]

    todos: List[dict]

    current_task: str

    files: Dict[str, str]

    results: List[str]