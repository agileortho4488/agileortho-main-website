from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

from db import leads_col
from helpers import admin_required

router = APIRouter()

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465"))
SMTP_EMAIL = os.environ.get("SMTP_EMAIL")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_FROM_NAME = os.environ.get("SMTP_FROM_NAME", "Agile Healthcare")


def send_email(to_email: str, subject: str, html_body: str):
    """Send email via Zoho SMTP."""
    msg = MIMEMultipart("alternative")
    msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_EMAIL}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)


BROCHURE_EMAIL_TEMPLATE = """
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #ffffff;">
  <div style="padding: 32px; border-bottom: 1px solid rgba(255,255,255,0.06);">
    <h1 style="color: #D4AF37; font-size: 22px; margin: 0 0 4px;">Agile Healthcare</h1>
    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">Meril Life Sciences — Authorized Master Franchise, Telangana</p>
  </div>
  <div style="padding: 32px;">
    <p style="color: #fff; font-size: 15px; line-height: 1.6;">Dear {name},</p>
    <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7;">
      Thank you for your interest in <strong style="color: #2DD4BF;">{product_interest}</strong>.
      We're pleased to share our product catalog with you.
    </p>
    <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7;">
      Our team will reach out to you shortly with detailed specifications and pricing tailored for <strong>{hospital}</strong>.
    </p>
    <div style="margin: 24px 0; padding: 20px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); border-radius: 4px;">
      <p style="color: #D4AF37; font-size: 13px; font-weight: 600; margin: 0 0 8px;">Your Enquiry Summary</p>
      <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 4px 0;">Department: {department}</p>
      <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 4px 0;">Product Interest: {product_interest}</p>
      <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 4px 0;">District: {district}</p>
    </div>
    <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7;">
      For immediate assistance, connect with us on WhatsApp: <a href="https://wa.me/917416521222" style="color: #25D366; text-decoration: none;">+91 74165 21222</a>
    </p>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);">
      <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
        Agile Healthcare | Telangana's Meril Master Franchise<br>
        Serving 1,891+ healthcare facilities across 33 districts
      </p>
    </div>
  </div>
</div>
"""


@router.post("/api/admin/email/send-brochure")
async def send_brochure_email(request: Request, _=Depends(admin_required)):
    """Send a brochure/catalog email to a lead."""
    body = await request.json()
    lead_id = body.get("lead_id")
    custom_email = body.get("email")

    if lead_id:
        lead = await leads_col.find_one({"id": lead_id}, {"_id": 0})
        if not lead:
            raise HTTPException(404, "Lead not found")
    else:
        lead = body

    to_email = custom_email or lead.get("email")
    if not to_email:
        raise HTTPException(400, "No email address available for this lead")

    html = BROCHURE_EMAIL_TEMPLATE.format(
        name=lead.get("name", "Doctor"),
        product_interest=lead.get("product_interest", "Meril medical devices"),
        hospital=lead.get("hospital_clinic", "your facility"),
        department=lead.get("department", "General"),
        district=lead.get("district", "Telangana"),
    )

    try:
        send_email(to_email, "Agile Healthcare — Product Catalog & Enquiry Confirmation", html)
    except Exception as e:
        raise HTTPException(500, f"Email delivery failed: {str(e)}")

    if lead_id:
        await leads_col.update_one(
            {"id": lead_id},
            {"$set": {"brochure_sent": True, "brochure_sent_at": datetime.now(timezone.utc).isoformat()}}
        )

    return {"success": True, "message": f"Brochure email sent to {to_email}"}


@router.post("/api/email/lead-confirmation")
async def send_lead_confirmation(request: Request):
    """Auto-send confirmation email when a lead is captured (public endpoint)."""
    body = await request.json()
    email = body.get("email")
    if not email:
        return {"skipped": True, "reason": "No email provided"}

    html = BROCHURE_EMAIL_TEMPLATE.format(
        name=body.get("name", "Doctor"),
        product_interest=body.get("product_interest", "Meril medical devices"),
        hospital=body.get("hospital_clinic", "your facility"),
        department=body.get("department", "General"),
        district=body.get("district", "Telangana"),
    )

    try:
        send_email(email, "Thank you for your enquiry — Agile Healthcare", html)
        return {"success": True}
    except Exception:
        return {"success": False, "reason": "Email delivery failed"}
