import puppeteer from 'puppeteer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function extractImages() {
  console.log('Launching browser...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Load the HTML file
  const htmlPath = `file://${join(rootDir, 'diffsheets-social-v2.html')}`;
  console.log(`Loading ${htmlPath}...`);
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000)); // Extra wait for fonts

  const publicDir = join(rootDir, 'public');
  const appDir = join(rootDir, 'src/app');

  // Extract OG Image (1200x630)
  console.log('\nExtracting OG Image (1200x630)...');
  await page.evaluate(() => {
    const el = document.querySelector('.og-image');
    el.style.transform = 'none';
    el.style.marginBottom = '0';
  });

  const ogElement = await page.$('.og-image');
  await ogElement.screenshot({
    path: join(publicDir, 'og-image.png'),
    type: 'png'
  });
  console.log('  Saved public/og-image.png');

  // Copy to app folder for Next.js auto-detection
  await ogElement.screenshot({
    path: join(appDir, 'opengraph-image.png'),
    type: 'png'
  });
  console.log('  Saved src/app/opengraph-image.png');

  await ogElement.screenshot({
    path: join(appDir, 'twitter-image.png'),
    type: 'png'
  });
  console.log('  Saved src/app/twitter-image.png');

  // Reset and extract Twitter Header (1500x500)
  console.log('\nExtracting Twitter Header (1500x500)...');
  await page.evaluate(() => {
    const el = document.querySelector('.twitter-header');
    el.style.transform = 'none';
    el.style.marginBottom = '0';
  });

  const twitterElement = await page.$('.twitter-header');
  await twitterElement.screenshot({
    path: join(publicDir, 'twitter-header.png'),
    type: 'png'
  });
  console.log('  Saved public/twitter-header.png');

  // Extract Product Hunt Banner (1270x760)
  console.log('\nExtracting Product Hunt Banner (1270x760)...');
  await page.evaluate(() => {
    const el = document.querySelector('.ph-banner');
    el.style.transform = 'none';
    el.style.marginBottom = '0';
  });

  const phElement = await page.$('.ph-banner');
  await phElement.screenshot({
    path: join(publicDir, 'product-hunt-banner.png'),
    type: 'png'
  });
  console.log('  Saved public/product-hunt-banner.png');

  await browser.close();
  console.log('\nDone!');
}

extractImages().catch(console.error);
