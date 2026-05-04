from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import get_chat_response

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    lead_score: str
    intent: str
    next_action: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response_data = await get_chat_response(request.user_id, request.message)
        # Ensure that the dictionary from get_chat_response maps nicely to ChatResponse
        return ChatResponse(
            reply=response_data.get("reply", "Sorry, I missed that."),
            lead_score=response_data.get("lead_score", "COLD"),
            intent=response_data.get("intent", "query"),
            next_action=response_data.get("next_action", "continue_call")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
