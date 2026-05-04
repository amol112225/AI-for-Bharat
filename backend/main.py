from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import os
from routes.chat import router as chat_router

app = FastAPI(title="AP Hunter AI Backend")

# Allow Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)

# --- MODELS ---
class ChatRequest(BaseModel):
    user_text: str
    current_score: int

class ChatResponse(BaseModel):
    ai_text: str
    agent_type: str
    emotion: str
    interest: str
    new_score: int
    thinking_process: str

class TranscriptMessage(BaseModel):
    speaker: str
    text: str

class SummaryRequest(BaseModel):
    transcript: List[TranscriptMessage]
    final_score: int

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "AP Hunter Backend is running", "version": "1.0.0"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Simulates the Multi-Agent LLM Routing and Generation.
    In production, this routes to Claude/OpenAI with specific Agent prompts.
    """
    text = request.user_text.lower()
    score = request.current_score
    
    # Simulate LLM Network Latency to make the UI "Thinking" state visible
    time.sleep(1.5) 
    
    if any(word in text for word in ['broker', 'not interested', 'busy', 'no']):
        return ChatResponse(
            ai_text="I completely understand. Many of our top clients had brokers too. We offer exclusive off-market deals. Just giving it 2 mins could show you what they are missing.",
            agent_type="objection",
            emotion="Frustrated",
            interest="Low",
            new_score=max(20, score - 15),
            thinking_process="Analyzing intent... handling trust objection..."
        )
    elif any(word in text for word in ['what', 'deal', 'price', 'ok', 'tell me', 'how']):
        return ChatResponse(
            ai_text="Great! We have a premium 3BHK launch in Baner today, 15% below market rate. Should I send the brochure on your WhatsApp?",
            agent_type="sales",
            emotion="Curious",
            interest="Medium",
            new_score=min(100, score + 25),
            thinking_process="Detecting interest... switching to sales pitch..."
        )
    elif any(word in text for word in ['yes', 'sure', 'send', 'awesome']):
        return ChatResponse(
            ai_text="Perfect, sending it right now on WhatsApp. Our relationship manager will connect if you have questions. Have a great day!",
            agent_type="scoring",
            emotion="Happy",
            interest="High",
            new_score=min(100, score + 40),
            thinking_process="High intent detected... scoring and closing..."
        )
    else:
        return ChatResponse(
            ai_text="Got it. Let me just send you a quick text with details so you can review it at your convenience.",
            agent_type="sales",
            emotion="Neutral",
            interest="Medium",
            new_score=score,
            thinking_process="General query... maintaining engagement..."
        )

@app.post("/api/analyze")
async def analyze_call(request: SummaryRequest):
    """
    Takes the full transcript and uses LLM logic to generate the executive summary
    and the RM's suggested opener.
    """
    # Simulate deep LLM Analysis Time
    time.sleep(2.5) 
    
    score = request.final_score
    classification = "HOT" if score >= 70 else "WARM" if score >= 40 else "COLD"
    
    # Generate intelligent summary based on classification
    if classification == "HOT":
        summary = "The lead initially showed hesitation but was successfully converted by the Objection Agent offering off-market deals. Intent peaked at the end, requested brochure via WhatsApp. Highly qualified for immediate RM follow-up."
        opener = "Hi, I saw you requested the Baner off-market brochure from our AI earlier today. What did you think of the floor plan?"
    elif classification == "WARM":
        summary = "The lead engaged with the AI but remained somewhat neutral. Showed some interest in pricing but did not fully commit. Recommend WhatsApp drip campaign before direct RM call."
        opener = "Hi, our AI mentioned you were looking at Pune properties. Are you looking for investment or self-use?"
    else:
        summary = "The lead was unresponsive or highly frustrated. Existing broker objection was not fully overcome. Archived for future retargeting."
        opener = "N/A"
        
    return {
        "score": score,
        "classification": classification,
        "executive_summary": summary,
        "suggested_opener": opener,
        "objections_handled": ["Broker Objection - Resolved via Off-Market value prop"] if classification == "HOT" else []
    }
