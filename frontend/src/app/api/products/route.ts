import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isSlim = searchParams.get('slim') === 'true';
    
    const data = await getAllProducts();
    
    if (isSlim) {
      // Return only what's needed for the Command Search
      // This reduces payload from 7MB to ~300KB
      const slimData = data.map((p: any) => ({
        slug: p.slug,
        product_name_display: p.product_name_display,
        division_canonical: p.division_canonical,
        brand: p.brand,
        category: p.category,
        technical_specifications: p.technical_specifications ? {
          'Material': p.technical_specifications['Material'] || p.technical_specifications['Grade']
        } : {}
      }));
      return NextResponse.json(slimData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
