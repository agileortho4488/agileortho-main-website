import { NextResponse } from 'next/server';

// 26-Jul fix: this used to write to a local JSON file under process.cwd(). On Vercel the
// filesystem is ephemeral/read-only outside /tmp, so every lead submitted through the site's
// LeadCaptureModal was silently lost — no error surfaced to the visitor (WhatsApp still opened)
// or to anyone monitoring. Forwarding instead to the real, durable lead pipeline (Agile Command
// backend), which already has rep-routing + auto WhatsApp intro + a founder-visible dashboard.
// 10-Aug fix: this pointed at http://151.185.47.113:8000, which is NOT reachable from anywhere
// except that machine — uvicorn binds 127.0.0.1:8000, so every lead this site ever captured hung
// for ~21 seconds, failed, and returned 502. The visitor saw nothing wrong. Zero website leads
// have ever been filed, and this is why.
//
// The public HTTPS host in front of the same backend works (nginx proxies it to 127.0.0.1:8000)
// and the intake POST is now exempt from the staff auth gate, so this reaches the real pipeline:
// rep routing, WhatsApp intro, founder dashboard. Verified end to end: HTTP 200, routed_to set.
const LEADS_BACKEND = process.env.LEADS_BACKEND_URL || 'https://staff.agilehealthcare.in';

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
