const https = require('https');

const sitemapUrl = 'https://www.agilehealthcare.in/sitemap.xml';

const searchEngines = [
  { name: 'Google', url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}` },
  { name: 'Bing', url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}` }
];

console.log('🚀 Initiating active SEO crawler pings...');

searchEngines.forEach((engine) => {
  https.get(engine.url, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ Successfully pinged ${engine.name}. Crawler dispatched.`);
    } else {
      console.log(`❌ Failed to ping ${engine.name}. Status Code: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`🚨 Error pinging ${engine.name}:`, err.message);
  });
});
