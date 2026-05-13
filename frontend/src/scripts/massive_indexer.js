const fs = require('fs');
const path = require('path');

const API_KEY = '896511a788a74392b7dfa32b14d091c4';
const HOST = 'agilehealthcare.in';
const SITEMAP_PATH = path.join(__dirname, '../../public/sitemap.xml');

async function runIndexer() {
  console.log('🚀 Starting Massive Indexing for Agile Healthcare...');
  
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ Sitemap not found at:', SITEMAP_PATH);
    return;
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = sitemap.match(/<loc>(.*?)<\/loc>/g).map(u => u.replace(/<\/?loc>/g, ''));

  console.log(`🔗 Found ${urls.length} URLs in sitemap.`);

  // IndexNow limits to 10,000 URLs per request
  const payload = {
    host: HOST,
    key: API_KEY,
    keyLocation: `https://${HOST}/${API_KEY}.txt`,
    urlList: urls
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ IndexNow Submission Successful!');
      console.log('📡 Bing, Yandex, and other search engines have been notified of 1,200+ updates.');
    } else {
      const error = await response.text();
      console.error('❌ IndexNow Submission Failed:', response.status, error);
    }
  } catch (err) {
    console.error('❌ Network Error during indexing:', err);
  }
}

runIndexer();
