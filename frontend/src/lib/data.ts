import fs from 'fs';
import path from 'path';

const SEED_DATA_PATH = path.join(process.cwd(), 'src/data/catalog_products.json');

export async function getAllProducts() {
  try {
    const fileContent = fs.readFileSync(SEED_DATA_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading catalog_products.json:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((p: any) => p.slug === slug);
}
