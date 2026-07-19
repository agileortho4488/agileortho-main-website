import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getAllProducts } from '@/lib/data';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Load the catalog once per request context
  const products = await getAllProducts();

  // Dynamically select model based on available API Keys
  // Prioritize Claude for clinical reasoning, fallback to Gemini
  let activeModel = process.env.ANTHROPIC_API_KEY 
    ? anthropic('claude-3-haiku-20240307') 
    : google('models/gemini-2.5-flash');

  const systemPrompt = `You are the 'Agile Healthcare Clinical Lead Consultant', an elite AI assistant for a premier medical device distributor in Telangana, India.
    Your job is to assist surgeons and hospital procurement officers with technical specifications and product availability.
    - BE HIGHLY PROFESSIONAL, clinical, and concise. 
    - You represent Meril Life Sciences and Agile Healthcare.
    - If a user asks for pricing, quotes, or emergency dispatch, tell them: "I can arrange an immediate quote and dispatch. Please share your name, hospital, and WhatsApp number and our team will contact you instantly."
    - The MOMENT a user gives their name, hospital, OR phone/WhatsApp number, call the \`captureLead\` tool with whatever details you have (silently), then keep chatting. Never skip this — a captured lead is the whole point.
    - Use the \`searchCatalog\` tool to find technical specs and sizes before answering product questions.
    - NEVER guess product specs. ALWAYS use the tool.`;

  const toolsDef = {
    searchCatalog: tool({
      description: 'Search the Agile Healthcare product catalog to find medical devices, technical specifications, materials, and sizes.',
      parameters: z.object({
        query: z.string().describe('The name of the product, category, or division (e.g., "Destiknee", "Trauma plate", "Cardiovascular").'),
      }),
      // @ts-ignore - Vercel AI SDK type inference mismatch for execute return type
      execute: async ({ query }) => {
        const q = query.toLowerCase();
        // Extremely basic text search against the JSON array
        const matches = products.filter((p: any) => 
          (p.product_name_display && p.product_name_display.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.division_canonical && p.division_canonical.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
        ).slice(0, 5); // Return top 5 matches to save context window

        if (matches.length === 0) {
          return { results: [], message: "No products found matching that query in the catalog." };
        }

        return {
          results: matches.map((m: any) => ({
            name: m.product_name_display,
            division: m.division_canonical,
            category: m.category,
            material: m.materials_canonical || m.material_canonical,
            sku: m.sku_code,
            specs: m.technical_specifications || "No technical specs available.",
          }))
        };
      }
    }),
    captureLead: tool({
      description: 'Save a sales lead the moment the user shares their name, hospital, or phone/WhatsApp number. Call with whatever details are known — partial is fine.',
      parameters: z.object({
        name: z.string().optional().describe('Person name if given'),
        phone: z.string().optional().describe('Phone or WhatsApp number if given'),
        hospital: z.string().optional().describe('Hospital or organization if given'),
        interest: z.string().optional().describe('What products/help they asked about'),
      }),
      // @ts-ignore - AI SDK execute return type
      execute: async ({ name, phone, hospital, interest }: any) => {
        const BRAIN_URL = process.env.BRAIN_URL || 'http://151.185.47.113:8000';
        try {
          await fetch(`${BRAIN_URL}/api/leads/website`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name || '', phone: phone || '', hospital: hospital || '',
              enquiryType: 'Website Chatbot', interest: interest || '',
            }),
            signal: AbortSignal.timeout(4000),
          });
        } catch (e) {
          console.error('Chat lead capture failed (non-fatal):', (e as Error).message);
        }
        return { saved: true, message: 'Lead noted; team will follow up.' };
      },
    }),
  };

  let result;
  try {
    result = await streamText({
      model: activeModel,
      system: systemPrompt,
      messages,
      tools: toolsDef,
      maxSteps: 5,
    });
  } catch (error) {
    console.warn("Primary AI Model failed (likely out of credits). Falling back to Gemini...", error);
    result = await streamText({
      model: google('models/gemini-2.5-flash'),
      system: systemPrompt,
      messages,
      tools: toolsDef,
      maxSteps: 5,
    });
  }

  return result.toDataStreamResponse();
}
