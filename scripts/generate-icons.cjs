// Generate placeholder PNG icons for Tauri
const fs = require('fs');
const path = require('path');

// Create a simple 1x1 PNG (will be replaced with proper icons later)
function createMinimalPNG(width, height) {
  // Create a simple colored PNG using raw bytes
  const { createCanvas } = (() => {
    try { return require('canvas'); } catch { return { createCanvas: null }; }
  })();
  
  // Fallback: create a minimal valid PNG
  // PNG signature + IHDR + IDAT + IEND
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  ]);
  
  // For now, just create a simple placeholder
  // The actual icons should be created with proper tools
  return header;
}

// Create SVG-based icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#cba6f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#89b4fa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="#1e1e2e"/>
  <text x="64" y="52" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="40" fill="url(#grad)">M</text>
  <text x="64" y="85" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="24" fill="#89b4fa">SX</text>
  <rect x="30" y="95" width="68" height="3" rx="1.5" fill="#45475a"/>
</svg>`;

const iconDir = path.join(__dirname, '..', 'src-tauri', 'icons');
if (!fs.existsSync(iconDir)) fs.mkdirSync(iconDir, { recursive: true });

// Save SVG
fs.writeFileSync(path.join(iconDir, 'icon.svg'), svgIcon);
console.log('Created icon.svg');

// Create a simple .ico placeholder (valid ICO header with 1 pixel)
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);     // Reserved
icoHeader.writeUInt16LE(1, 2);     // Type: ICO
icoHeader.writeUInt16LE(1, 4);     // Count: 1 image
// Entry
icoHeader.writeUInt8(1, 6);        // Width
icoHeader.writeUInt8(1, 7);        // Height
icoHeader.writeUInt8(0, 8);        // Colors
icoHeader.writeUInt8(0, 9);        // Reserved
icoHeader.writeUInt16LE(1, 10);    // Planes
icoHeader.writeUInt16LE(32, 12);   // Bits per pixel
icoHeader.writeUInt32LE(0, 14);    // Size of image data
icoHeader.writeUInt32LE(22, 18);   // Offset to image data

fs.writeFileSync(path.join(iconDir, 'icon.ico'), icoHeader);
console.log('Created icon.ico placeholder');

// Note: For production, use `npx tauri icon <path-to-1024x1024-png>` to generate proper icons
console.log('');
console.log('NOTE: Run `npx tauri icon icon.svg` in src-tauri directory');
console.log('to generate proper sized icons for all platforms.');