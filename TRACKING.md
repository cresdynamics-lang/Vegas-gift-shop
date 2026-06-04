# Vegas Gift Shop — Ads & catalog tracking

## Product ID alignment (critical)

Every product uses a **single canonical ID**: the storefront slug (e.g. `personalized-stainless-travel-mug`).

| System | Field | Example URL |
|--------|--------|-------------|
| Website | `product.id` | `/product/personalized-stainless-travel-mug` |
| Google Merchant | `g:id` | Same slug in feed |
| Meta catalog | `id` | Same slug in feed |
| Meta Pixel / CAPI | `content_ids` | Same slug (variant carts use `id__Size=M` → tracked as slug only) |
| GA4 | `item_id` | Same slug |

Admin and seed must keep **`product.id`** equal to the URL slug so Shopping / Dynamic Ads land on the correct PDP.

---

## Environment variables

### Frontend (`.env`)

```env
VITE_META_PIXEL_ID=your_pixel_id
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=https://api.yoursite.com
VITE_SITE_URL=https://vegasgifts.co.ke
```

### Backend (`BACKEND/.env`)

```env
PUBLIC_SITE_URL=https://vegasgifts.co.ke
META_PIXEL_ID=your_pixel_id
META_CAPI_ACCESS_TOKEN=your_capi_token
```

---

## Live catalog feeds (auto-sync from database)

Feeds read **PostgreSQL** on each request (5 min cache). Any product created/updated via admin or `upsertStorefrontProduct` appears automatically.

| Platform | Feed URL |
|----------|----------|
| **Google Merchant Center** | `https://YOUR-API-HOST/feeds/google.xml` |
| **Meta Commerce Manager** | `https://YOUR-API-HOST/feeds/meta-catalog.csv` |
| Debug JSON | `https://YOUR-API-HOST/feeds/products.json` |

In Merchant Center: **Products → Feeds → Add feed → Scheduled fetch** → paste `google.xml` URL.

In Meta: **Commerce Manager → Catalog → Data sources → Feed** → CSV from `meta-catalog.csv` URL (or upload CSV exported from that URL).

---

## Events implemented

| Funnel step | Meta Pixel | Meta CAPI | GA4 |
|-------------|------------|-----------|-----|
| Any page | `PageView` | — | `page_view` |
| Product page | `ViewContent` | — | `view_item` |
| Add to cart | `AddToCart` | — | `add_to_cart` |
| Order placed | `Purchase` | `Purchase` (deduped via `event_id`) | `purchase` |

Standard parameters: `content_ids`, `content_type: product`, `value`, `currency: KES`.

---

## Testing checklist

### Meta

1. Add `VITE_META_PIXEL_ID` and restart `npm run dev`.
2. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) Chrome extension.
3. Open a product → **ViewContent** with correct `content_ids`.
4. Add to cart → **AddToCart**.
5. Complete test checkout → **Purchase** (browser).
6. Events Manager → **Test events** → confirm **Purchase** also from server (CAPI) with same `event_id` when `META_CAPI_ACCESS_TOKEN` is set.

### Google / GA4

1. Add `VITE_GA4_MEASUREMENT_ID`.
2. GA4 → **Admin → DebugView** (or Tag Assistant).
3. Repeat funnel: `view_item` → `add_to_cart` → `purchase` with matching `item_id`.

### Feeds

1. Open `/feeds/products.json` — verify `id` and `link` point to `/product/{id}`.
2. In Merchant Center, run feed fetch — fix any image/link errors.
3. Confirm a Shopping test ad lands on the exact PDP, not homepage.

---

## Launch

After test events look correct:

1. Connect catalog in Meta Ads Manager to your Commerce catalog (fed from `meta-catalog.csv`).
2. Connect Google Merchant Center to `google.xml`.
3. Run **Dynamic remarketing** / **Shopping** campaigns using the same product IDs.
