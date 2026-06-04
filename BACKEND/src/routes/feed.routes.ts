import { Router } from 'express';
import {
  getCatalogFeedJson,
  getGoogleMerchantFeed,
  getMetaCatalogFeed,
} from '../controller/feed.controller';

const router = Router();

/** Google Merchant Center scheduled fetch URL */
router.get('/google.xml', getGoogleMerchantFeed);
/** Meta Commerce Manager catalog CSV URL */
router.get('/meta-catalog.csv', getMetaCatalogFeed);
/** Debug / internal verification */
router.get('/products.json', getCatalogFeedJson);

export default router;
