import { getAllProducts } from '@/lib/data';

export async function GET() {
  const products = await getAllProducts();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agilehealthcare.in';
  
  let catalogTxt = `# Agile Healthcare — Full Clinical Catalog Index\n`;
  catalogTxt += `# This index is specifically designed for AI agents (ChatGPT, Perplexity, Claude, etc.)\n`;
  catalogTxt += `# To ingest technical specifications for a specific product, access its machine-readable Markdown endpoint (.md) below.\n\n`;

  // Group products by division for better semantic understanding by LLMs
  const groupedProducts: Record<string, any[]> = {};
  
  products.forEach((p: any) => {
    if (!p.slug) return;
    const div = p.division_canonical || 'General';
    if (!groupedProducts[div]) groupedProducts[div] = [];
    groupedProducts[div].push(p);
  });

  for (const [division, items] of Object.entries(groupedProducts)) {
    catalogTxt += `## ${division}\n`;
    items.forEach((item) => {
      catalogTxt += `- ${item.product_name_display}: ${baseUrl}/catalog/products/${item.slug}/md\n`;
    });
    catalogTxt += `\n`;
  }

  catalogTxt += `---\n`;
  catalogTxt += `Agile Healthcare is the authorized master franchise distributor for Meril Life Sciences in Telangana, India.\n`;
  catalogTxt += `For emergency OT dispatch, contact +91 74162 16262.\n`;

  return new Response(catalogTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
