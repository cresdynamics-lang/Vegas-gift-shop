import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_ROOT = path.resolve(__dirname, '../../../public');
const CACHE_DIR = path.join(PUBLIC_ROOT, '.cache', 'img');

function safePublicFile(requestPath: string): string | null {
  if (!requestPath.startsWith('/')) return null;
  const relative = path.normalize(requestPath.replace(/^\//, ''));
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;

  const publicResolved = path.resolve(PUBLIC_ROOT);
  const full = path.resolve(publicResolved, relative);
  const rel = path.relative(publicResolved, full);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return full;
}

export const serveOptimizedImage = async (req: Request, res: Response) => {
  try {
    const requestPath = decodeURIComponent(String(req.query.path || '')).trim();
    const width = Math.min(Math.max(parseInt(String(req.query.w || '480'), 10) || 480, 64), 1600);

    const filePath = safePublicFile(requestPath);
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid image path' });
    }

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Image not found' });
    }

    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cacheName = `${width}-${requestPath.replace(/[^a-zA-Z0-9._-]/g, '_')}.webp`;
    const cachePath = path.join(CACHE_DIR, cacheName);

    try {
      const cached = await fs.readFile(cachePath);
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(cached);
    } catch {
      /* generate below */
    }

    const output = await sharp(filePath, { failOn: 'none' })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 2 })
      .toBuffer();

    await fs.writeFile(cachePath, output);
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(output);
  } catch (error) {
    console.error('serveOptimizedImage:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
};
