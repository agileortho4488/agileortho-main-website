from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import ChatRequest, IndexUrlRequest
from app.services.rag_service import rag_service
import os

app = FastAPI(title="Agile Healthcare AI Agent API")

# Setup CORS to allow website widget to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Initialize the RAG service (Vector DB, LLM)
    rag_service.initialize()

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response = rag_service.chat(request.message, request.session_id)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/index/url")
async def index_url_endpoint(request: IndexUrlRequest, background_tasks: BackgroundTasks):
    # Process scraping in background to not block
    background_tasks.add_task(rag_service.index_url, request.url)
    return {"message": f"Started indexing {request.url} in the background."}

@app.post("/index/pdf")
async def index_pdf_endpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Save file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
        
    # Index in background
    background_tasks.add_task(rag_service.index_pdf, file_location)
    return {"message": f"Started indexing {file.filename} in the background."}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# --- WhatsApp Cloud API Webhook Integration ---
@app.get("/webhook/whatsapp")
async def verify_whatsapp_webhook(request: Request):
    """
    Required for Meta/WhatsApp Business API verification
    """
    verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "default_verify_token")
    
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode and token:
        if mode == "subscribe" and token == verify_token:
            print("WhatsApp Webhook Verified!")
            return int(challenge)
        else:
            raise HTTPException(status_code=403, detail="Verification failed")
    return {"message": "Hello from webhook"}

@app.post("/webhook/whatsapp")
async def receive_whatsapp_message(request: Request, background_tasks: BackgroundTasks):
    """
    Receives incoming messages from WhatsApp
    """
    try:
        data = await request.json()
        
        # Parse the Meta WhatsApp incoming message payload
        if "object" in data and data["object"] == "whatsapp_business_account":
            for entry in data.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    
                    if messages:
                        message = messages[0]
                        phone_number = message.get("from") # The user's phone number
                        text_body = message.get("text", {}).get("body")
                        
                        if text_body:
                            # Generate AI response based on the WhatsApp user's phone number as session_id
                            # Done in background to immediately return 200 OK to Meta
                            background_tasks.add_task(process_whatsapp_reply, text_body, phone_number)
                            
        return {"status": "ok"}
    except Exception as e:
        print(f"Error handling WhatsApp Webhook: {e}")
        return {"status": "error"}

async def process_whatsapp_reply(message_body: str, phone_number: str):
    # 1. Ask the AI for an answer using their phone number as session memory
    ai_response = rag_service.chat(message_body, session_id=phone_number)
    
    # 2. Send the message back via Meta Cloud API
    # Requires WHATSAPP_TOKEN and a setup phone_number_id from Meta Dashboard
    whatsapp_token = os.getenv("WHATSAPP_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "your_phone_number_id")
    
    if not whatsapp_token or whatsapp_token == "your_whatsapp_token":
        print(f"Skipping WA sending: WHATSAPP_TOKEN not set. AI said: {ai_response}")
        return

    import httpx
    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "text",
        "text": {"body": ai_response}
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers)
        if res.status_code != 200:
            print(f"Failed to send WA message: {res.text}")
        else:
            print(f"Sent WA reply to {phone_number}")
