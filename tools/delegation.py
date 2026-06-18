from agents.researcher import researcher
from agents.summarizer import summarizer
from tools.datetime_tool import get_current_datetime

def delegate(task):

    task_lower = task.lower()

    if (
        "date" in task_lower
        or "time" in task_lower
        or "day" in task_lower
        or "morning" in task_lower
        or "night" in task_lower
    ):
        return get_current_datetime()

    if "research" in task_lower:
        return researcher(task)

    return summarizer(task)