import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname, basename, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '..', 'shared', 'public', 'images');
const WEBP_OUTPUT_DIR = join(IMAGES_DIR, 'webp');
const SUPPORTED = new Set(['.png', '.jpg', '.jpeg']);
const MAX_WIDTH = 1200;

async function processDir(srcDir, outDir) {
  mkdirSync(outDir, { recursive: true });

  let converted = 0;
  let skipped = 0;

  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      if (entry === 'webp') continue;
      const result = await processDir(srcPath, join(outDir, entry));
      converted += result.converted;
      skipped += result.skipped;
      continue;
    }

    const ext = extname(entry).toLowerCase();
    if (!SUPPORTED.has(ext)) continue;

    const outPath = join(outDir, basename(entry, ext) + '.webp');

    if (existsSync(outPath)) {
      console.log(`skip  ${relative(IMAGES_DIR, outPath)}`);
      skipped++;
      continue;
    }

    // PNG → lossless WebP (화질 손실 없음)
    // JPEG → quality 90 WebP (JPEG 자체가 이미 손실 압축이므로 lossless 불필요)
    const options = ext === '.png' ? { lossless: true } : { quality: 90 };
    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp(options)
      .toFile(outPath);
    console.log(`done  ${relative(IMAGES_DIR, outPath)}`);
    converted++;
  }

  return { converted, skipped };
}

console.log(`이미지 WebP 변환 시작 (최대 ${MAX_WIDTH}px 리사이즈)...\n`);
const { converted, skipped } = await processDir(IMAGES_DIR, WEBP_OUTPUT_DIR);
console.log(`\n완료: ${converted}개 변환, ${skipped}개 건너뜀`);
