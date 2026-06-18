# Autonomous Cognitive Engine

A multi-agent autonomous system powered by LangGraph that breaks down complex goals into manageable tasks and executes them using specialized AI agents.

## Features

- **Goal Planning**: Automatically breaks down user goals into structured TODO tasks
- **Multi-Agent System**: Uses specialized agents for research, summarization, and date/time handling
- **Web Search Integration**: Leverages Tavily API for real-time web search
- **LLM-Powered**: Uses Mistral AI models for planning, summarization, and task delegation
- **State Management**: Tracks all tasks and results through a state machine

## Architecture

The system uses a three-stage pipeline:

1. **Planner**: Breaks down the user goal into structured tasks
2. **Executor**: Processes tasks one by one, delegating to appropriate agents
3. **Synthesizer**: Combines all results into a final report

## Prerequisites

- Python 3.8+
- Mistral API key
- Tavily API key

## Setup

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your API keys:
   ```
   MISTRAL_API_KEY=your_mistral_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

## Usage

Run the engine with:

```bash
python main.py
```

Enter your goal when prompted:
```
Enter your goal: Research the latest advancements in AI and summarize them
```

The system will:
1. Break down your goal into tasks
2. Execute each task using appropriate agents
3. Generate a final report combining all results

## Project Structure

```
.
├── main.py                 # Entry point
├── graph.py               # LangGraph workflow definition
├── state.py               # State schema
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── agents/
│   ├── researcher.py     # Web search agent
│   └── summarizer.py     # LLM-based summarization agent
├── nodes/
│   ├── planner.py        # Goal planning node
│   ├── executor.py       # Task execution node
│   └── synthesizer.py    # Result synthesis node
└── tools/
    ├── search_tool.py    # Tavily web search wrapper
    ├── planning.py       # Task planning utilities
    ├── delegation.py     # Task delegation logic
    ├── file_system.py    # In-memory file management
    └── datetime_tool.py  # Date/time utilities
```

## API Keys

- **Mistral API**: Get from [Mistral AI Console](https://console.mistral.ai/)
- **Tavily API**: Get from [Tavily](https://tavily.com/)

## Notes

- API keys are stored in `.env` and should never be committed to version control
- The `.env` file is gitignored for security
- Results are stored in memory and output as a final report
