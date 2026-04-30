import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url, 'https://agilehealthcare.in');
    const isSlim = url.searchParams.get('slim') === 'true';
    
    const data = await getAllProducts();
    
    if (isSlim) {
      // Return only what's needed for the Command Search
      const slimData = data.map((p: any) => ({
        slug: p.slug,
        product_name_display: p.product_name_display,
        division_canonical: p.division_canonical,
        brand: p.brand,
        category: p.category,
        salient_features: p.salient_features || [],
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
