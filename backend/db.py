import os
import motor.motor_asyncio

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

products_col = db["products"]
leads_col = db["leads"]
conversations_col = db["conversations"]
admins_col = db["admins"]
imports_col = db["pdf_imports"]
wa_conversations_col = db["wa_conversations"]
wa_message_status_col = db["wa_message_status"]
wa_webhook_logs_col = db["wa_webhook_logs"]
