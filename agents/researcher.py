from tools.search_tool import web_search

def researcher(task):
    result = web_search(task)
    return f"""

Research Result for:
{task}
{result}
"""
