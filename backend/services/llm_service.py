import os
import json
import logging
from typing import Dict, List
from groq import AsyncGroq
from utils.prompt import SYSTEM_PROMPT
from dotenv import load_dotenv

load_dotenv()

# Setup simple logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory store for conversation history
# Structure: { "user_id": [{"role": "user"|"assistant", "content": "..."}] }
user_memories: Dict[str, List[Dict[str, str]]] = {}
MAX_HISTORY = 10

# Initialize Groq Client
api_key = os.getenv("GROQ_API_KEY", "missing_key")
client = AsyncGroq(api_key=api_key)

async def get_chat_response(user_id: str, message: str) -> dict:
    try:
        # Initialize history for user if not exists
        if user_id not in user_memories:
            user_memories[user_id] = []
            
        history = user_memories[user_id]
        
        # Append new user message
        history.append({"role": "user", "content": message})
        
        # Keep only the last MAX_HISTORY messages to manage context window
        if len(history) > MAX_HISTORY:
            # We assign back to the dictionary to ensure reference is updated if needed
            user_memories[user_id] = history[-MAX_HISTORY:]
            history = user_memories[user_id]
            
        # Build messages for API
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history
        
        # Call OpenAI API
        logger.info(f"Calling LLM for user_id: {user_id}")
        response = await client.chat.completions.create(
            model="llama3-8b-8192", # Groq model that supports JSON output
            messages=messages,
            response_format={ "type": "json_object" },
            temperature=0.7,
            max_tokens=250,
            timeout=15.0 # 15 seconds timeout
        )
        
        response_text = response.choices[0].message.content
        logger.info(f"LLM Response: {response_text}")
        
        try:
            parsed_response = json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback if somehow not valid JSON despite response_format
            logger.error("LLM returned invalid JSON")
            parsed_response = {
                "reply": "I'm having a bit of trouble understanding right now. Can we try that again?",
                "lead_score": "COLD",
                "intent": "query",
                "next_action": "continue_call"
            }
            
        # Add assistant response text to history for better natural context
        history.append({"role": "assistant", "content": parsed_response.get("reply", "")})
        
        return parsed_response

    except Exception as e:
        logger.error(f"Error calling LLM API: {e}")
        # Fallback response in case of API failure or timeout
        return {
            "reply": "Sorry, I'm experiencing some network issues on my end. Could you repeat that?",
            "lead_score": "COLD",
            "intent": "query",
            "next_action": "continue_call"
        }
