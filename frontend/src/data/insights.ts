import fs from 'fs';
import path from 'path';

const INSIGHTS_DIR = path.join(process.cwd(), 'src/data/insights');

export interface InsightMetadata {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
}

export interface Insight extends InsightMetadata {
  content: string;
}

// Basic Frontmatter parser since we don't have gray-matter installed
function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = frontmatterRegex.exec(fileContent);
  
  if (!match) {
    return { metadata: {} as any, content: fileContent };
  }

  const rawMetadata = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();

  const metadata: any = {};
  rawMetadata.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      metadata[key.trim()] = valueParts.join(':').replace(/^["']|["']$/g, '').trim();
    }
  });

  return { metadata, content };
}

export function getAllInsights(): InsightMetadata[] {
  if (!fs.existsSync(INSIGHTS_DIR)) return [];

  const files = fs.readdirSync(INSIGHTS_DIR).filter(file => file.endsWith('.md'));

  const insights = files.map(filename => {
    const slug = filename.replace('.md', '');
    const fullPath = path.join(INSIGHTS_DIR, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content } = parseFrontmatter(fileContent);
    
    return {
      slug,
      title: metadata.title || slug,
      date: metadata.date || '',
      category: metadata.category || 'Article',
      excerpt: content.substring(0, 150) + '...',
    };
  });

  return insights.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getInsightBySlug(slug: string): Insight | null {
  try {
    const fullPath = path.join(INSIGHTS_DIR, `${slug}.md`);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content } = parseFrontmatter(fileContent);

    return {
      slug,
      title: metadata.title || slug,
      date: metadata.date || '',
      category: metadata.category || 'Article',
      content,
    };
  } catch (error) {
    return null;
  }
}
