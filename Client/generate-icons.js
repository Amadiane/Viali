// ══════════════════════════════════════════════
// generate-icons.js
// Lance avec : node generate-icons.js
// Nécessite : npm install sharp
// Place ton logo source dans logo-source.png
// ══════════════════════════════════════════════
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, "public", "icons");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const source = path.join(__dirname, "logo-source.png");

Promise.all(
  sizes.map((size) =>
    sharp(source)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 140, b: 0, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
      .then(() => console.log(`✅ icon-${size}x${size}.png généré`))
  )
).then(() => console.log("\n🎉 Toutes les icônes générées dans public/icons/"));