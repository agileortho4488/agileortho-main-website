import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: `You are the Agile Healthcare Clinical Support AI. 
  Your goal is to assist surgeons, OT managers, and hospital procurement teams in Telangana.
  You represent Agile Healthcare, a Master Distributor for Meril Life Sciences.
  
  CORE KNOWLEDGE:
  - You have access to a catalog of 1,202 medical devices across Trauma, Joint Replacement, Cardiovascular, Endo-Surgery, and Diagnostics.
  - You provide technical specifications, sizing information, and clinical benefits.
  - If you don't know a specific detail, offer to connect them with a regional product specialist.
  - You are professional, expert, and precise.
  
  CONTEXTUAL TONE:
  - Gold-standard medical support.
  - Premium, reliable, and clinical.
  `
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lastMessage = body.messages ? body.messages[body.messages.length - 1].content : body.message;
    
    if (!lastMessage) return NextResponse.json({ error: 'No message provided' }, { status: 400 });

    // Load catalog for context (simple keyword-based context extraction)
    const catalogPath = path.join(process.cwd(), 'src/data/catalog_products.json');
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    // Find relevant products (simple search for demo/mvp)
    const keywords = lastMessage.toLowerCase().split(' ');
    const relevantProducts = catalogData
      .filter((p: any) => {
        const name = (p.product_name_display || p.product_name || '').toLowerCase();
        return keywords.some(k => k.length > 3 && name.includes(k));
      })
      .slice(0, 5); // Limit to top 5 relevant products

    const context = relevantProducts.length > 0 
      ? `RELEVANT PRODUCT DATA:\n${JSON.stringify(relevantProducts, null, 2)}`
      : "No specific product match found in immediate search. Answer based on general medical device knowledge or ask for clarification.";

    // Generate response
    const prompt = `User Query: ${lastMessage}\n\n${context}\n\nProvide a clinical, helpful response:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: 'assistant', content: text, response: text });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
