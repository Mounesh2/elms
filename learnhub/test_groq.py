import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize the Groq client with the API key from environment
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    # Try .env.local if not in .env
    load_dotenv(".env.local")
    api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("Error: GROQ_API_KEY not found in .env or .env.local")
    exit(1)

client = Groq(api_key=api_key)
completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
      {
        "role": "user",
        "content": "hi\n"
      },
      {
        "role": "assistant",
        "content": "It's nice to meet you. Is there something I can help you with, or would you like to chat?"
      },
      {
        "role": "user",
        "content": "Explain what a Llama is in one sentence."
      }
    ],
    temperature=1,
    max_completion_tokens=1024,
    top_p=1,
    stream=True,
    stop=None
)

print("AI Output: ", end="", flush=True)
for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
print("\n")
