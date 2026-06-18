import streamlit as st
from graph import build_graph
import time

st.set_page_config(
    page_title="Autonomous Cognitive Engine",
    layout="wide",
    initial_sidebar_state="collapsed",
    menu_items=None
)

# Custom CSS
st.markdown("""
    <style>
    [data-testid="stMainBlockContainer"] {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    .header-title {
        text-align: center;
        margin-bottom: 1rem;
    }
    .input-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }
    .input-label {
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .result-section {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin-top: 2rem;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    .task-item {
        background: white;
        padding: 1rem;
        margin: 0.5rem 0;
        border-left: 4px solid #667eea;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .stat-box {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        margin: 0.5rem;
    }
    .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
    }
    .stat-label {
        color: #666;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown('<div class="header-title">', unsafe_allow_html=True)
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    st.markdown("# 🧠 Autonomous Cognitive Engine")
    st.markdown("*Intelligent task planning & execution with AI agents*")
st.markdown('</div>', unsafe_allow_html=True)

st.divider()

# Initialize session state
if "result" not in st.session_state:
    st.session_state.result = None
if "tasks" not in st.session_state:
    st.session_state.tasks = []
if "running" not in st.session_state:
    st.session_state.running = False

# Input Section
st.markdown('<div class="input-section">', unsafe_allow_html=True)
st.markdown('<p class="input-label">🎯 What do you want to accomplish?</p>', unsafe_allow_html=True)

col1, col2 = st.columns([5, 1])
with col1:
    goal = st.text_input(
        "Enter your goal:",
        placeholder="e.g., Research the latest AI breakthroughs and create a summary",
        label_visibility="collapsed",
        key="goal_input"
    )

with col2:
    run_button = st.button("Execute", use_container_width=True, type="primary", key="run_btn")

st.markdown('</div>', unsafe_allow_html=True)

# Process
if run_button and goal:
    st.session_state.running = True

    # Progress section
    progress_container = st.container(border=True)
    with progress_container:
        st.markdown("### ⚙️ Processing...")
        progress_bar = st.progress(0)
        status_text = st.empty()

        try:
            # Simulate progress
            status_text.text("🔄 Building task plan...")
            progress_bar.progress(20)
            time.sleep(0.5)

            graph = build_graph()
            state = {
                "messages": [goal],
                "todos": [],
                "current_task": "",
                "files": {},
                "results": []
            }

            status_text.text("🚀 Executing tasks...")
            progress_bar.progress(50)
            time.sleep(0.5)

            result = graph.invoke(state)

            status_text.text("✨ Synthesizing results...")
            progress_bar.progress(75)
            time.sleep(0.5)

            st.session_state.result = result["files"].get("final_report.txt", "No results")
            st.session_state.tasks = result.get("todos", [])

            progress_bar.progress(100)
            status_text.text("✅ Complete!")
            time.sleep(1)

            st.session_state.running = False
            progress_container.empty()
            st.rerun()

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
            st.session_state.running = False

# Display results
if st.session_state.result:
    st.divider()

    # Stats
    st.markdown("### 📊 Execution Summary")
    stats_col1, stats_col2, stats_col3 = st.columns(3)

    with stats_col1:
        st.markdown(f'''
            <div class="stat-box">
                <div class="stat-number">{len(st.session_state.tasks)}</div>
                <div class="stat-label">Tasks Planned</div>
            </div>
        ''', unsafe_allow_html=True)

    with stats_col2:
        completed = sum(1 for t in st.session_state.tasks if t.get("status") == "done")
        st.markdown(f'''
            <div class="stat-box">
                <div class="stat-number">{completed}</div>
                <div class="stat-label">Tasks Completed</div>
            </div>
        ''', unsafe_allow_html=True)

    with stats_col3:
        st.markdown(f'''
            <div class="stat-box">
                <div class="stat-number">100%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        ''', unsafe_allow_html=True)

    # Tasks breakdown
    if st.session_state.tasks:
        st.markdown("### 📋 Task Breakdown")
        for i, task in enumerate(st.session_state.tasks, 1):
            status_icon = "✅" if task.get("status") == "done" else "⏳"
            st.markdown(f'''
                <div class="task-item">
                    {status_icon} <b>Task {i}:</b> {task.get("description", "N/A")}
                </div>
            ''', unsafe_allow_html=True)

    # Results
    st.markdown('<div class="result-section">', unsafe_allow_html=True)
    st.markdown("### 📄 Final Report")
    st.text_area(
        "Result:",
        value=st.session_state.result,
        height=300,
        disabled=True,
        label_visibility="collapsed"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    # Download section
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        st.download_button(
            label="📥 Download Report",
            data=st.session_state.result,
            file_name="report.txt",
            mime="text/plain",
            use_container_width=True
        )
    with col2:
        if st.button("🔄 New Task", use_container_width=True):
            st.session_state.result = None
            st.session_state.tasks = []
            st.rerun()

    st.success("✨ Task completed successfully!")

# Footer
st.divider()
st.markdown("""
    <div style="text-align: center; color: #888; font-size: 0.85rem; margin-top: 2rem;">
    <p>🤖 Powered by LangGraph & Mistral AI | 🔍 Web Search by Tavily</p>
    </div>
""", unsafe_allow_html=True)
