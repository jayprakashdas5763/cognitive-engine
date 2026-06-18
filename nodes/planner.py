from tools.planning import write_todos

def planner_node(state):
    goal = state["messages"][-1]
    todos = write_todos(goal)
    state["todos"] = todos
    
    return state