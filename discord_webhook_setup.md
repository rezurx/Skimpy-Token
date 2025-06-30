# Discord Webhook Setup for SKIMPY Token Project

This document explains how to integrate Discord notifications into your SKIMPY Token project using webhooks. Webhooks allow your project to send automated messages or alerts to a specific Discord channel.

## What is a Discord Webhook?

A webhook is a unique URL that acts as a bridge between an application (like your project's scripts) and a Discord channel. When your script sends a message (a "payload") to this URL, Discord receives it and posts it into the designated channel. It's a simple, one-way communication method for your project to "talk" to Discord.

## How to Create a Discord Webhook URL:

YouYou will need to perform these steps directly within your Discord application or browser:

1.  **Open Discord:** Go to your Discord server.
2.  **Select a Channel:** Choose the text channel where you want the notifications to appear (e.g., `#general`, `#dev-updates`, or create a new one like `#skimpy-alerts`).
3.  **Edit Channel:** Hover over the channel name and click the **cogwheel icon** (⚙️) to open "Edit Channel" settings.
4.  **Integrations:** In the channel settings, click on "Integrations" in the left sidebar.
5.  **Create Webhook:** Click the "Create Webhook" button.
6.  **Customize (Optional):**
    *   You can change the webhook's name (e.g., "SKIMPY Bot").
    *   You can upload an image for its avatar.
    *   Make sure the correct channel is selected.
7.  **Copy Webhook URL:** Click the "Copy Webhook URL" button. This is the unique URL your project will use.
8.  **Save URL:** **Keep this URL private!** Anyone with this URL can send messages to your Discord channel. It's recommended to store this URL securely, for example, in your project's `.env` file, and never commit it directly to version control.

## How to Use the Webhook in Your Project (Example - Python):

Once you have your Webhook URL, you can use it in your scripts to send messages. Here's a conceptual Python example using the `requests` library (you would need to install `requests` if you don't have it: `pip install requests`):

```python
import requests
import json
import os

# It's best practice to load your webhook URL from an environment variable
# For example, from a .env file using a library like python-dotenv
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

def send_discord_message(message_content: str):
    if not DISCORD_WEBHOOK_URL:
        print("Error: DISCORD_WEBHOOK_URL not set.")
        return

    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "content": message_content
    }

    try:
        response = requests.post(DISCORD_WEBHOOK_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
        print(f"Message sent to Discord: {message_content}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send message to Discord: {e}")

# Example usage:
# if __name__ == "__main__":
#     # Make sure to set DISCORD_WEBHOOK_URL in your environment or .env file
#     # For example: export DISCORD_WEBHOOK_URL="YOUR_WEBHOOK_URL_HERE"
#     send_discord_message("SKIMPY Token deployment successful!")
```

Remember to add `DISCORD_WEBHOOK_URL` to your `.env` file (and `.env.example`) and never commit your actual webhook URL to your Git repository.
