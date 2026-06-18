from langgraph.graph import StateGraph, END
from state import AgentState
from nodes.planner import planner_node
from nodes.executor import executor_node
from nodes.synthesizer import synthesizer_node

def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("planner", planner_node)
    graph.add_node("executor", executor_node)
    graph.add_node("synthesizer", synthesizer_node)
    graph.set_entry_point("planner")
    graph.add_edge("planner", "executor")
    def check_done(state):

        return all(
            task["status"] == "done"
            for task in state["todos"]

        )

    graph.add_conditional_edges(
        "executor",
        check_done,

        {
            True: "synthesizer",
            False: "executor"

        }

    )

    graph.add_edge("synthesizer", END)

    return graph.compile()