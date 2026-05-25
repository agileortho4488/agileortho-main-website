import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const CATALOG_PATH = path.join(__dirname, '../src/data/catalog_products.json');
const INSIGHTS_DIR = path.join(__dirname, '../src/data/insights');

if (!fs.existsSync(INSIGHTS_DIR)) {
  fs.mkdirSync(INSIGHTS_DIR, { recursive: true });
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));

const topics = [
  {
    slug: 'destiknee-vs-freedom-knee',
    title: 'Destiknee vs Freedom Knee: Clinical Outcomes & Patient Demographics',
    productQueries: ['Destiknee', 'Freedom'],
  },
  {
    slug: 'titanium-locking-plates-guide',
    title: 'The Surgeon’s Guide to Titanium Locking Plates: Strength & Biomechanics',
    productQueries: ['Locking Plate', 'Titanium'],
  },
  {
    slug: 'evermine50-vs-biomime',
    title: 'Evermine50 vs Biomime: Coronary Stent Specifications Compared',
    productQueries: ['Evermine50', 'Biomime'],
  },
];

async function generateInsight(topic) {
  console.log(`Generating insight for: ${topic.title}...`);

  const relevantProducts = catalog.filter(p => 
    topic.productQueries.some(q => 
      (p.product_name_display && p.product_name_display.toLowerCase().includes(q.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(q.toLowerCase()))
    )
  ).slice(0, 10);

  const prompt = `
  You are an expert Orthopedic and Cardiovascular Surgeon and a Medical SEO Writer.
  Write a highly technical, clinical comparison article titled: "${topic.title}".
  
  Use the following JSON product data from Agile Healthcare to ensure exact accuracy in materials, indications, and sizes:
  ${JSON.stringify(relevantProducts.map(p => ({
    name: p.product_name_display,
    specs: p.technical_specifications,
    material: p.materials_canonical || p.material_canonical,
    division: p.division_canonical,
  })))}

  REQUIREMENTS:
  1. Output PURE MARKDOWN. Do not include markdown code block backticks (\`\`\`) wrapping the output.
  2. Include a YAML frontmatter block at the very top exactly like this:
  ---
  title: "${topic.title}"
  date: "${new Date().toISOString().split('T')[0]}"
  category: "Clinical Comparison"
  ---
  3. Write 500-800 words.
  4. Use Headings (##, ###), bullet points, and clinical terminology.
  5. Conclude with a strong recommendation to contact Agile Healthcare for procurement in Telangana.
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
  });

  const content = result.response.text().replace(/^```markdown\\n|```$/g, '');
  
  const filePath = path.join(INSIGHTS_DIR, `${topic.slug}.md`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Saved ${filePath}`);
}

async function main() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is missing in .env.local");
    process.exit(1);
  }

  for (const topic of topics) {
    try {
      await generateInsight(topic);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (e) {
      console.error(`❌ Error generating ${topic.slug}:`, e.message);
    }
  }
}

main();
