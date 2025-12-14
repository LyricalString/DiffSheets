import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// SVG content for the favicon (simplified version for small sizes)
const svgContent = `
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="4" width="28" height="36" rx="4" fill="#3f3f46"/>
  <rect x="14" y="8" width="28" height="36" rx="4" fill="#22c55e"/>
  <rect x="14" y="8" width="20" height="32" rx="4" fill="#16a34a" fill-opacity="0.6"/>
  <rect x="18" y="14" width="12" height="3" rx="1" fill="#fafafa" fill-opacity="0.9"/>
  <rect x="18" y="20" width="8" height="3" rx="1" fill="#fafafa" fill-opacity="0.9"/>
  <rect x="18" y="26" width="10" height="3" rx="1" fill="#fafafa" fill-opacity="0.9"/>
</svg>
`;

async function generateFavicon() {
  console.log('Generating favicon...');

  const sizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of sizes) {
    console.log(`  Creating ${size}x${size} PNG...`);
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push(pngBuffer);
  }

  console.log('  Converting to ICO...');
  const icoBuffer = await pngToIco(pngBuffers);

  const outputPath = join(rootDir, 'src/app/favicon.ico');
  writeFileSync(outputPath, icoBuffer);
  console.log(`  Saved to ${outputPath}`);

  // Also generate apple-touch-icon
  console.log('Generating apple-touch-icon (180x180)...');
  const appleTouchIcon = await sharp(Buffer.from(svgContent))
    .resize(180, 180)
    .png()
    .toBuffer();

  const appleIconPath = join(rootDir, 'src/app/apple-icon.png');
  writeFileSync(appleIconPath, appleTouchIcon);
  console.log(`  Saved to ${appleIconPath}`);

  console.log('Done!');
}

generateFavicon().catch(console.error);
