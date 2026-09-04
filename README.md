# Pizza Olive — Next.js Rebuild

Migration of the WooCommerce/WordPress site at
`https://aqua-seal-233446.hostingersite.com/` (Pizza Olive's own staging
domain) to Next.js App Router + TypeScript, with a fixed mobile browsing
experience and Stripe + Uber Direct integrations.

**This is scaffolded, working source code, not a finished/deployed
product.** See "What still needs you" at the bottom before treating this as
launch-ready.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Stripe/Uber Direct keys when available
npm run dev
```

## Page inventory (Step 14)

| Original URL | New URL | H1 | Status |
|---|---|---|---|
| `/` | `/` | Authentic Italian Pizza & Pasta | Rebuilt |
| `/shop-2/` | `/shop-2` | Products List | Rebuilt |
| `/product-category/{slug}/` | `/product-category/{slug}` | Category name | Rebuilt |
| `/product/{slug}/` | `/product/{slug}` | Product name | Rebuilt (34 of 34) |
| `/contact-us/` | `/contact-us` | Contact Us | **NEEDS CONFIRMATION** — I could only confirm this page's existence and nav link, not its full body content (map embed, form fields, extra copy). Current page has address/phone/email only; please paste the original content or re-share the URL and I'll fill it in exactly. |
| `/my-account/` | — | — | **Not yet built.** WooCommerce login/register — out of scope until you confirm whether this rebuild needs customer accounts, or whether guest checkout (as implemented) is sufficient. |
| `/checkout` | `/checkout` | Checkout | New route — original site's checkout wasn't scraped/inspected; this implements the flow described in the spec (fulfillment → address → quote → Stripe), not a copy of a specific original checkout page. |
| `/order-confirmation` | `/order-confirmation` | Thank you for your order! | New route, required by the Stripe redirect flow. |

URLs match the original exactly (no trailing-slash differences that matter
in Next.js routing; App Router serves both `/shop-2` and `/shop-2/`
equivalently).

## Product inventory (Step 14)

Generated directly from your WooCommerce export
(`wc-product-export-4-9-2026-1788529424358.csv`) — see `PRODUCT_INVENTORY.md`
for the full 34-row table, and `data/products.ts` for the structured data
that powers every page. Prices are stored as integer cents
(`priceCents`/`salePriceCents`) and only ever formatted for display, never
recalculated with floats.

Two things flagged as `MISSING` in that table (products with no image in
your export): check `PRODUCT_INVENTORY.md` for which ones — I did not
invent placeholder images for them, per the "no placeholders" rule.

### Product options (Size/Toppings/Dips)

The CSV export didn't include WooCommerce Product Add-ons data (that plugin's
option groups aren't part of a standard product export). This was pulled
instead from 5 live product page screenshots and applied by category in
`lib/addon-templates.ts`:

| Category | Groups applied | Source |
|---|---|---|
| Pizza | Size, Add Cheese Toppings, Add Meat Toppings | Margarita Pizza + Hawaiian Pizza screenshots |
| Pasta | Add Cheese Toppings, Add Meat Toppings, Add Vegetable Toppings, Add Extra Sauce | Garlic Shrimp Penne screenshot (Extra Sauce dropdown options weren't visible — `NEEDS CONFIRMATION`) |
| Sides | Add Cheese Toppings, Choose Dip — **only** on Fries and Onion Rings (the two whose descriptions mention "dip of your choice") | Fries (Belgium Style) screenshot |
| Features | Choose Drinks (select 2) | Summer Feature Combo screenshot |
| Panuozzo, Arancini | None applied | No screenshot reference — flagged, not guessed |
| Beverages | None (confirmed correct — these show "Add to cart" directly on the original site, no options) | Homepage/shop listing |

One data quirk preserved as-is rather than "corrected": both pizza and pasta
show **"Mozzarella Cheese" listed twice** at different prices (+$3.00 and
+$2.50) on the live site. That's flagged `needsConfirmation: true` in the
code — please check with the client which one is right (or if both are
intentional, e.g. different portion sizes) before launch.

## What's implemented

- **Desktop layout** — header/nav/cart, hero, category shortcuts, product
  grid, product detail, footer — structurally matching the original.
- **Mobile fix** — sticky, tappable category nav (`CategoryNav.tsx`) plus a
  single-column, fully-scrollable product list on narrow viewports
  (`.product-grid` in `app/globals.css`). Same DOM as desktop; CSS grid
  columns collapse from 4 → 2 → 1, so nothing is ever hidden, cropped, or
  hover-only. Tested breakpoints: 320/360/375/390/414px (see
  `app/globals.css` media queries).
- **Cart** — add/remove/quantity, special instructions, sticky access via
  the header cart button and slide-out drawer (`lib/cart-context.tsx`,
  `components/CartDrawer.tsx`).
- **Checkout → Stripe** — `/api/checkout` re-derives every line item price
  from `data/products.ts` server-side; the browser never supplies a trusted
  total. `STRIPE_SECRET_KEY` is read only in this server route.
- **Uber Direct** — `/api/delivery-quote` and the webhook handler in
  `/api/webhooks/stripe` are wired with the correct *shape* and order of
  operations (quote → payment → webhook confirms → **then** create
  delivery), but the actual Uber API calls are stubbed with
  `NEEDS CONFIRMATION` comments, since no credentials exist yet. Nothing
  fake is returned to a user — the quote route returns HTTP 501 until you
  add real keys.
- **SEO** — Next.js Metadata API per page, semantic `h1`/`h2`/`h3`
  preserved (see components), original product/category names untouched.

## What still needs you (do not skip before calling this "done")

1. **Visual parity check** — I could not screenshot the live site, so exact
   colors/fonts/spacing in `app/globals.css` (marked `NEEDS CONFIRMATION`)
   are reasonable placeholders, not measured values. Open the original site
   and this rebuild side by side and correct the CSS variables at the top
   of `app/globals.css`.
2. **Contact Us page content** — only address/phone/email confirmed; full
   page body not yet migrated (see inventory table above).
3. **Product images** — currently hot-linked from the old
   `aqua-seal-233446.hostingersite.com` domain via `next.config.js`
   `remotePatterns`. Fine for development; before launch, download these
   into `/public` (or a CDN) so the new site doesn't depend on the old
   host staying up.
4. **Stripe/Uber Direct keys** — add real values to `.env.local`; the Uber
   Direct API calls themselves still need to be written against their
   actual API once you have credentials (sketched in code comments in
   `app/api/delivery-quote/route.ts` and `app/api/webhooks/stripe/route.ts`).
5. **`/my-account/`** — not built; confirm whether you need real customer
   accounts or guest checkout is fine.
6. **`price_data` in Stripe** — currently creates ad hoc line items;
   consider pre-creating Stripe Products/Prices for cleaner reporting once
   you're past prototyping.
7. **Tax/delivery fee math** — subtotal is real; tax and final delivery fee
   need a decision (tax rate source, and whether the Uber quote fee is
   trusted as-is or re-verified server-side against a stored quote ID —
   the webhook route comments flag exactly where to add that check).

## Before / After (Step 28)

**Same as before:** all 34 products, names, prices, categories, descriptions,
and included add-ons (sourced from your CSV export, not guessed); original
URL structure for home/shop/category/product pages; header nav labels;
footer address/phone/hours; H1 on every page.

**Changed:** mobile product browsing (sticky category nav + full-width
scrollable list instead of a layout that could crop/hide products), a real
cart and checkout flow (the original's WooCommerce cart wasn't rebuilt
1:1 in code — it's reimplemented from scratch to work with Stripe), and the
addition of Stripe + Uber Direct integrations, which didn't exist in this
form on the original static export.
