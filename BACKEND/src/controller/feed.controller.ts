import { Request, Response } from 'express';
import {
  buildCatalogJson,
  buildGoogleMerchantXml,
  buildMetaCatalogCsv,
  loadCatalogFeedItems,
} from '../lib/catalogFeed';

const CACHE_SECONDS = 300;

function setFeedCacheHeaders(res: Response) {
  res.setHeader('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
}

export const getGoogleMerchantFeed = async (_req: Request, res: Response) => {
  try {
    const items = await loadCatalogFeedItems();
    setFeedCacheHeaders(res);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(buildGoogleMerchantXml(items));
  } catch (error) {
    console.error('Google feed error:', error);
    res.status(500).json({ error: 'Failed to generate Google product feed' });
  }
};

export const getMetaCatalogFeed = async (_req: Request, res: Response) => {
  try {
    const items = await loadCatalogFeedItems();
    setFeedCacheHeaders(res);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(buildMetaCatalogCsv(items));
  } catch (error) {
    console.error('Meta feed error:', error);
    res.status(500).json({ error: 'Failed to generate Meta catalog feed' });
  }
};

export const getCatalogFeedJson = async (_req: Request, res: Response) => {
  try {
    const items = await loadCatalogFeedItems();
    setFeedCacheHeaders(res);
    res.json(buildCatalogJson(items));
  } catch (error) {
    console.error('Catalog JSON feed error:', error);
    res.status(500).json({ error: 'Failed to generate catalog feed' });
  }
};
