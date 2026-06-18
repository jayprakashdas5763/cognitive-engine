from tools.delegation import delegate
from tools.file_system import write_file

def executor_node(state):
    for task in state["todos"]:
        if task["status"] == "pending":
            result = delegate(task["description"])
            state["results"].append(result)
            filename = f"task_{task['id']}.txt"
            write_file(state, filename, result)
            task["status"] = "done"
            break
        
    return state
