def write_file(state, name, content):
    state["files"][name] = content

def read_file(state, name):
    return state["files"].get(name, "")

def list_files(state):
    return list(state["files"].keys())