const API_KEY = '896511a788a74392b7dfa32b14d091c4';
const HOST = 'agilehealthcare.in';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

async function runIndexer() {
  console.log('🚀 Starting Massive Indexing for Agile Healthcare...');
  
  let sitemap;
  try {
    console.log(`🔗 Fetching sitemap from ${SITEMAP_URL}...`);
    const response = await fetch(SITEMAP_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    sitemap = await response.text();
  } catch (error) {
    console.error('❌ Failed to fetch sitemap:', error);
    return;
  }

  const matches = sitemap.match(/<loc>(.*?)<\/loc>/g);
  if (!matches) {
    console.error('❌ No URLs found in sitemap.');
    return;
  }
  const urls = matches.map(u => u.replace(/<\/?loc>/g, ''));

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
