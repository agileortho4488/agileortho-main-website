import { NextResponse } from 'next/server';

// 26-Jul fix: this used to write to a local JSON file under process.cwd(). On Vercel the
// filesystem is ephemeral/read-only outside /tmp, so every lead submitted through the site's
// LeadCaptureModal was silently lost — no error surfaced to the visitor (WhatsApp still opened)
// or to anyone monitoring. Forwarding instead to the real, durable lead pipeline (Agile Command
// backend), which already has rep-routing + auto WhatsApp intro + a founder-visible dashboard.
const LEADS_BACKEND = process.env.LEADS_BACKEND_URL || 'http://151.185.47.113:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, hospital, interest, source, district } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const upstream = await fetch(`${LEADS_BACKEND}/api/leads/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, hospital: hospital || '', interest: interest || '',
        source: source || 'website', city: district || '',
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('Lead backend rejected submission:', upstream.status, detail);
      return NextResponse.json({ error: 'Lead backend unavailable' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
