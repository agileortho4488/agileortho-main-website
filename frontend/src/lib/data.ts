import products from '../data/catalog_products.json';

export async function getAllProducts() {
  return products;
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((p: any) => p.slug === slug);
}
