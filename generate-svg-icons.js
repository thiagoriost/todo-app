/**
 * Script para generar iconos SVG con la letra "R"
 * Ejecutar: node generate-svg-icons.js
 *
 * Genera iconos SVG que pueden ser convertidos a PNG usando herramientas online
 * o el comando: npx sharp-cli --input icon.svg --output icon.png --width 512
 */

const fs = require('fs');
const path = require('path');

// Tamaños de iconos a generar
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Función para generar SVG con la letra R
function generateSVG(size) {
  const fontSize = size * 0.6;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradiente de fondo futurista -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>

    <radialGradient id="glowGradient" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
    </radialGradient>

    <filter id="shadow">
      <feDropShadow dx="${size * 0.01}" dy="${size * 0.01}" stdDeviation="${size * 0.01}" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Fondo con gradiente -->
  <rect width="${size}" height="${size}" fill="url(#bgGradient)" rx="${size * 0.05}"/>

  <!-- Efecto de brillo -->
  <rect width="${size}" height="${size}" fill="url(#glowGradient)" rx="${size * 0.05}"/>

  <!-- Letra R -->
  <text
    x="50%"
    y="50%"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="central"
    filter="url(#shadow)">R</text>
</svg>`;
}

// Crear directorio icons si no existe
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generar todos los iconos SVG
iconSizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svg, 'utf8');
  console.log(`✅ Generado: ${filename}`);
});

// Generar favicon SVG
const faviconSVG = generateSVG(32);
const faviconPath = path.join(__dirname, 'public', 'favicon.svg');
fs.writeFileSync(faviconPath, faviconSVG, 'utf8');
console.log(`✅ Generado: favicon.svg`);

console.log('\n📋 Próximos pasos:');
console.log('1. Instala una herramienta de conversión: npm install -g sharp-cli');
console.log('2. Convierte los SVG a PNG con el siguiente comando:');
console.log('   cd public/icons');
console.log('   for file in *.svg; do npx @squoosh/cli --resize "{width: 512}" "$file"; done');
console.log('\n O usa una herramienta online como: https://cloudconvert.com/svg-to-png');
