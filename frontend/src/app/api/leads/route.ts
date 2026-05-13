import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'src/data/leads.json');

// Ensure the leads file exists
function ensureLeadsFile() {
  if (!fs.existsSync(LEADS_FILE)) {
    fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, hospital, interest, source, district } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    ensureLeadsFile();

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    const newLead = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      name,
      phone,
      hospital,
      interest,
      source,
      district,
      status: 'new'
    };

    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true, leadId: newLead.id });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    ensureLeadsFile();
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
