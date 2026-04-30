import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, enquiryType, message } = body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, message' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const leadData = {
      id: `lead_${Date.now()}`,
      timestamp,
      name,
      email,
      phone,
      organization: organization || 'Not specified',
      enquiryType: enquiryType || 'General Enquiry',
      message,
      source: 'website_contact_form',
      status: 'new',
    };

    // Log to console (visible in Vercel logs)
    console.log('NEW LEAD CAPTURED:', JSON.stringify(leadData, null, 2));

    // Try sending email via Resend (if API key is set)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (RESEND_API_KEY) {
      const emailPayload = {
        from: 'Agile Healthcare Website <noreply@agilehealthcare.in>',
        to: ['info@agilehealthcare.in'],
        reply_to: email,
        subject: `[New Enquiry] ${enquiryType || 'General'} from ${name} — ${organization || phone}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
            <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #00b4d8;">
              <h1 style="color: #00b4d8; margin: 0 0 8px; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">New Website Enquiry</h1>
              <p style="color: #aaa; margin: 0; font-size: 12px;">${timestamp}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #222; color: #aaa; font-size: 13px; width: 35%;">Name</td>
                <td style="padding: 12px; border-bottom: 1px solid #222; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #222; color: #aaa; font-size: 13px;">Phone</td>
                <td style="padding: 12px; border-bottom: 1px solid #222;"><a href="tel:${phone}" style="color: #00b4d8;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #222; color: #aaa; font-size: 13px;">Email</td>
                <td style="padding: 12px; border-bottom: 1px solid #222;"><a href="mailto:${email}" style="color: #00b4d8;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #222; color: #aaa; font-size: 13px;">Organization</td>
                <td style="padding: 12px; border-bottom: 1px solid #222;">${organization || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #222; color: #aaa; font-size: 13px;">Enquiry Type</td>
                <td style="padding: 12px; border-bottom: 1px solid #222;">
                  <span style="background: #00b4d8; color: #000; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${enquiryType || 'General'}</span>
                </td>
              </tr>
            </table>
            
            <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 20px; margin-top: 20px;">
              <h3 style="color: #aaa; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Message</h3>
              <p style="margin: 0; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #222; text-align: center;">
              <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(name)}, thank you for enquiring at Agile Healthcare. How can we help you today?" 
                 style="background: #25D366; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Reply on WhatsApp
              </a>
            </div>
          </div>
        `,
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendResponse.ok) {
        const err = await resendResponse.text();
        console.error('Resend API error:', err);
        // Don't fail — lead is still captured in logs
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry received. Our team will contact you within 24 hours.',
      leadId: leadData.id,
    });

  } catch (error) {
    console.error('Enquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please call us directly: +91 74162 16262' },
      { status: 500 }
    );
  }
}
