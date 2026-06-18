from graph import build_graph

def main():
    graph = build_graph()
    user_goal = input("Enter your goal: ")
    state = {
        "messages": [user_goal],
        "todos": [],
        "current_task": "",
        "files": {},
        "results": []
    }

    result = graph.invoke(state)
    print("\n===== FINAL REPORT =====\n")
    print(result["files"]["final_report.txt"])

 

if __name__ == "__main__":

    main()
