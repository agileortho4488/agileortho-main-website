from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"

class IndexUrlRequest(BaseModel):
    url: str
