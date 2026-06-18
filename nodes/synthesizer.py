
from tools.file_system import read_file

def synthesizer_node(state):
    final_output = []

    for file_name in state["files"]:
        content = read_file(state, file_name)
        final_output.append(content)

    state["files"]["final_report.txt"] = "\n\n".join(final_output)

    return state