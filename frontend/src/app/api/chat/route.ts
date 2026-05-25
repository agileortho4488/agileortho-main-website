import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getAllProducts } from '@/lib/data';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Load the catalog once per request context
  const products = await getAllProducts();

  const result = await streamText({
    model: google('models/gemini-1.5-pro-latest'),
    system: `You are the 'Agile Healthcare Clinical Lead Consultant', an elite AI assistant for a premier medical device distributor in Telangana, India.
    Your job is to assist surgeons and hospital procurement officers with technical specifications and product availability.
    - BE HIGHLY PROFESSIONAL, clinical, and concise. 
    - You represent Meril Life Sciences and Agile Healthcare.
    - If a user asks for pricing, quotes, or emergency dispatch, tell them: "I can arrange an immediate quote and dispatch. Please provide your WhatsApp number or Hospital name, and our logistics team will contact you instantly."
    - Use the \`searchCatalog\` tool to find technical specs and sizes before answering product questions.
    - NEVER guess product specs. ALWAYS use the tool.`,
    messages,
    tools: {
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
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
