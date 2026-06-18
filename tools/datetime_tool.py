from datetime import datetime

def get_current_datetime():
    """Get current date and time."""
    now = datetime.now()
    return f"Current date and time: {now.strftime('%Y-%m-%d %H:%M:%S')}"
