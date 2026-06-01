/**
 * Compress storefront images in public/ and src/assets.
 * Usage: node scripts/compress-images.mjs [--dry-run] [--dir=public/products]
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 82;
const WEBP_QUALITY = 80;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dirArg = args.find((a) => a.startsWith('--dir='));
const targets = dirArg
  ? [path.resolve(ROOT, dirArg.split('=')[1])]
  : [
      path.join(ROOT, 'public', 'products'),
      path.join(ROOT, 'public'),
      path.join(ROOT, 'src', 'assets'),
    ];

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      await walk(full, files);
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = (await fs.stat(filePath)).size;

  const input = await fs.readFile(filePath);
  const image = sharp(input, { failOn: 'none' }).rotate();
  const meta = await image.metadata();

  let pipeline = image;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let output;
  const hasAlpha = meta.hasAlpha;

  if (ext === '.png') {
    output = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 }).toBuffer();
  } else if (ext === '.webp') {
    output = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
  } else {
    output = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  if (output.length >= before) {
    return { before, after: before, skipped: true };
  }

  if (!dryRun) {
    await fs.writeFile(filePath, output);
  }

  return { before, after: output.length, skipped: false };
}

async function main() {
  const allFiles = [];
  for (const target of targets) {
    const files = await walk(target);
    allFiles.push(...files);
  }

  const unique = [...new Set(allFiles)];
  console.log(
    `${dryRun ? '[dry-run] ' : ''}Compressing ${unique.length} images (max width ${MAX_WIDTH}px)…`
  );

  let saved = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < unique.length; i++) {
    const file = unique[i];
    try {
      const result = await compressFile(file);
      processed++;
      if (result.skipped) {
        skipped++;
      } else {
        saved += result.before - result.after;
      }
      if ((i + 1) % 500 === 0 || i === unique.length - 1) {
        const mb = (saved / 1024 / 1024).toFixed(1);
        console.log(`  ${i + 1}/${unique.length} — saved ${mb} MB so far`);
      }
    } catch (err) {
      errors++;
      if (errors <= 10) {
        console.warn(`  skip ${path.relative(ROOT, file)}: ${err.message}`);
      }
    }
  }

  console.log('\nDone.');
  console.log(`  Processed: ${processed}`);
  console.log(`  Unchanged: ${skipped}`);
  console.log(`  Errors:    ${errors}`);
  console.log(`  Saved:     ${(saved / 1024 / 1024).toFixed(2)} MB`);
  if (dryRun) console.log('  (no files written — run without --dry-run to apply)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
