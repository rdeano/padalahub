# CLAUDE.md — Philippine Remittance Comparison App

## Project Overview

A Filipino-first remittance fee comparison web app that helps users find the cheapest way to send money — both domestically (Palawan, Cebuana, LBC, GCash) and internationally (Wise, Remitly, Western Union). No equivalent exists for the Philippine local market.

**Working title:** PadalaHub
**Target users:** OFW families, Filipinos sending money to provinces
**Primary language:** Filipino/Tagalog UI with English fallback

---

## Tech Stack

- **Backend:** Laravel 13, PHP 8.3
- **Frontend:** React 18, Inertia.js v2, MUI v6
- **Build tool:** Vite 8
- **Database:** MySQL 8
- **Hosting:** DigitalOcean VPS + Cloudflare (DNS/SSL)
- **Auth:** Laravel Breeze
- **Permissions:** Spatie Laravel Permission

---

## Project Goals

### Phase 1 — Domestic Comparison (MVP)
Compare fixed-fee domestic providers:
- Palawan Express Pera Padala
- Cebuana Lhuillier
- M Lhuillier
- LBC
- GCash Padala

### Phase 2 — International Comparison
Compare live-rate international providers:
- Wise (official API)
- Remitly (scraping or partner API)
- Western Union (scraping)

### Phase 3 — Growth Features
- Rate change alerts (email/SMS)
- Historical rate charts
- Mobile app (PWA first)
- B2B API for embedding comparison widget

---

## Database Schema

### `providers`
```sql
id, name, slug, logo_url, type (domestic|international),
affiliate_url,       -- NULL for domestic providers
requires_account,    -- boolean: true for Wise/Remitly/WU
has_affiliate,       -- boolean: false for domestic providers
is_nationwide,       -- boolean: true for GCash Padala (skips region filter)
is_active, created_at, updated_at
```

### `provider_regions`
```sql
id, provider_id (FK → providers.id),
region (enum: ncr_luzon|visayas_mindanao),
created_at, updated_at
```

Example rows:
```
provider_id | region
----------- | ----------------
1 (Palawan) | ncr_luzon
1 (Palawan) | visayas_mindanao
2 (Cebuana) | ncr_luzon
2 (Cebuana) | visayas_mindanao
3 (LBC)     | ncr_luzon
3 (LBC)     | visayas_mindanao
4 (RD Pawn) | ncr_luzon
-- GCash has no rows here, is_nationwide = true on providers table
```

This allows a clean query:
```sql
SELECT p.* FROM providers p
LEFT JOIN provider_regions pr ON pr.provider_id = p.id
WHERE (pr.region = ? OR p.is_nationwide = true)
AND p.is_active = true
```

Admin can add/remove regions per provider in the admin panel — no code change needed when a provider expands to a new region.

### `domestic_fee_tiers`
```sql
id, provider_id (FK → providers.id),
region (enum: ncr_luzon|visayas_mindanao|nationwide),
amount_from, amount_to, fee, discount, net_fee,
effective_date, created_at, updated_at
```

### `international_rates`
```sql
id, provider_id, source_currency, target_currency,
exchange_rate, fee_fixed, fee_percent,
fetched_at, created_at, updated_at
```

### `rate_update_logs`
```sql
id, provider_id, type (manual|scrape|api),
status (success|failed), notes, created_at
```

---

## Key Business Logic

### Domestic Fee Lookup

**MVP approach — region-only filtering (no branch-level data)**

Getting exact branch addresses per province/city for all providers is not feasible at launch — no provider publishes a clean downloadable list. All have map-based locators only.

The MVP uses region-level filtering instead, which is still significantly more useful than anything that currently exists for Filipino users.

User inputs:
- Amount to send
- Sender region (where they are sending from)
- Recipient region (where the money is going)

System logic:
1. Filter providers that operate in the sender's region (stored in `providers.available_regions`)
2. Look up fee tier for that provider based on recipient region + amount
3. Exclude nationwide providers (GCash Padala) from region filter — they always appear
4. Return all matching providers sorted by `net_fee` ascending (cheapest first)
5. If no providers match, show empty state: *"Walang nahanap na provider. Subukan ang ibang rehiyon."*

**Region options shown to user:**
```
Sender region:    NCR | Luzon | Visayas | Mindanao
Recipient region: NCR | Luzon | Visayas | Mindanao
```

**Fee tier region mapping:**
```
ncr_luzon        → sender/recipient in NCR or Luzon
visayas_mindanao → sender/recipient in Visayas, Mindanao,
                   South Luzon, Masbate, Romblon, Palawan
nationwide       → GCash Padala and similar (no region filter)
```

**Provider availability per region** (stored in `providers.available_regions` as JSON array):
```json
Palawan Express  → ["ncr_luzon", "visayas_mindanao"]
Cebuana Lhuillier → ["ncr_luzon", "visayas_mindanao"]
LBC              → ["ncr_luzon", "visayas_mindanao"]
RD Pawnshop      → ["ncr_luzon"]
GCash Padala     → ["nationwide"]
```

**Phase 3 upgrade — crowdsourced branch data:**
After launch, add a "May branch ba dito?" (Is there a branch here?) feature where users can confirm or report branches in their area at the province/city level. This gradually improves filtering accuracy without needing to scrape or manually research 80 provinces. Think Waze — users build the data.

Branch data table for Phase 3:
```sql
provider_branches
  id, provider_id, region, province, city, 
  is_confirmed, confirmed_count, created_at, updated_at
```

Do NOT build `provider_branches` in Phase 1 or 2 — region-only filtering is enough to launch.

### Fees are static tiered tables
- Updated manually in admin when providers change rates (rarely, ~1-2x per year)
- Never hardcode in controllers — always read from `domestic_fee_tiers`

### International Rate Lookup
- User inputs: **send amount** + **source currency** + **target currency**
- Query `international_rates` for latest rate per provider
- Calculate: `recipient_gets = (amount - fee_fixed) * exchange_rate * (1 - fee_percent)`
- Return sorted by `recipient_gets` descending (most received = best)

---

## Data Sources

### Domestic Providers (static tables — manual updates)
| Provider | Rate Source | Update Frequency |
|---|---|---|
| Palawan Express | palawanpawnshop.com / branches | Rarely (~annually) |
| Cebuana Lhuillier | cebuanalhuillier.com | Rarely |
| M Lhuillier | mlhuillier.com | Rarely |
| LBC | lbcexpress.com | Rarely |
| GCash Padala | gcash.com | Rarely |

### International Providers (live rates)
| Provider | Method | Notes |
|---|---|---|
| Wise | Official API (free) | Best option — accurate and reliable |
| Remitly | Scraping | Check their rate calculator page |
| Western Union | Scraping | Fragile — monitor for HTML changes |

---

## Monetization Strategy

1. **Affiliate commissions** — Wise, Remitly, and Western Union have affiliate programs. When a user clicks our link and completes a transfer as a **new customer**, we earn a commission. Existing customers who already have an account do NOT trigger a commission.
2. **Featured listings** — providers pay to appear highlighted (label as "Sponsored")
3. **Premium alerts** — free users get daily rate summaries; paid users get real-time alerts
4. **B2B API** — sell rate data to fintech blogs or apps that want an embed widget

### Affiliate Link Details

An affiliate link is a normal provider URL with our unique referral code appended as a query parameter:

```
# Normal link
https://wise.com/send-money

# Affiliate link (we earn commission when user signs up + sends)
https://wise.com/send-money?ref=PadalaHub_REF_CODE
```

**Commission estimates per provider:**
| Provider | Has Affiliate? | Est. Commission | Triggers On |
|---|---|---|---|
| Wise | Yes | ~$10–25 per new customer | New signup + completed transfer |
| Remitly | Yes | ~$10–20 per new customer | New signup + completed transfer |
| Western Union | Yes | ~$5–10 per new customer | New signup + completed transfer |
| Palawan Express | No | None | N/A — walk-in only |
| Cebuana Lhuillier | No | None | N/A — walk-in only |
| M Lhuillier | No | None | N/A — walk-in only |
| LBC | No | None | N/A — walk-in only |
| GCash Padala | No | None | N/A — app-based, no program |

**Key rules for implementation:**
- Domestic providers (Palawan, Cebuana, LBC, GCash) get a plain informational link or no outbound link at all — no affiliate URL
- International providers (Wise, Remitly, WU) always use the affiliate URL stored in `providers.affiliate_url`
- Never hardcode affiliate URLs in views — always read from `providers.affiliate_url` so they can be updated in the admin panel
- All affiliate links must open in a new tab (`target="_blank" rel="noopener noreferrer"`)

### "Needs Account" UI Badge

International providers require the user to create a free account before sending. Show a small badge on their result card so users know upfront:

```jsx
// Show this badge on Wise, Remitly, Western Union result cards
{provider.requires_account && (
  <Chip label="Kailangan ng account (libre)" size="small" color="info" />
)}
```

Add `requires_account` boolean column to the `providers` table:
- Domestic providers → `false` (walk in, no account needed)
- International providers → `true`

### Database: providers table update
```sql
id, name, slug, logo_url, type (domestic|international),
affiliate_url,         -- NULL for domestic providers
requires_account,      -- boolean: true for Wise/Remitly/WU
has_affiliate,         -- boolean: false for domestic providers
is_active, created_at, updated_at
```

---

## Scraping Strategy (Phase 2)

- Use Laravel scheduled commands (`php artisan schedule:run`) with cron every 30 minutes
- Each provider has its own `App\Services\Scrapers\{Provider}Scraper` class
- On scrape failure: keep last known rate, log failure, send admin alert
- Mark rates as stale if older than 2 hours — show warning in UI
- Wise API is the only truly reliable source; others are best-effort

---

## Laravel Artisan Commands

```bash
# Seed all domestic fee tables from JSON fixtures
php artisan rates:seed-domestic

# Fetch latest international rates (run via scheduler)
php artisan rates:fetch-international

# Mark stale rates and notify admin
php artisan rates:check-staleness
```

---

## Key Laravel Files

```
app/
  Models/
    Provider.php
    DomesticFeeTier.php
    InternationalRate.php
  Services/
    DomesticComparisonService.php      # Fee lookup logic
    InternationalComparisonService.php # Live rate comparison
    Scrapers/
      WiseScraper.php
      RemitlyScraper.php
      WesternUnionScraper.php
  Console/Commands/
    FetchInternationalRates.php
    SeedDomesticRates.php

database/
  seeders/
    PalawanFeeTierSeeder.php
    CebuanaFeeTierSeeder.php
    LBCFeeTierSeeder.php
    GCashPadalaFeeTierSeeder.php
```

---

## React Pages (Inertia.js)

```
resources/js/Pages/
  Home.jsx              # Landing page with comparison form
  Compare/
    Domestic.jsx        # Domestic comparison results
    International.jsx   # International comparison results
  Admin/
    Providers/Index.jsx
    Rates/
      Domestic.jsx      # Manual fee table editor
      International.jsx # Live rate monitor
```

---

## MUI v6 Notes

- Grid uses `size={{ xs: 12, md: 6 }}` syntax (not `xs={12}`)
- Use `TableContainer`, `Table`, `TableRow`, `TableCell` for fee comparison tables
- Highlight the cheapest provider row with `sx={{ backgroundColor: 'success.light' }}`

---

## Environment Variables

```env
APP_NAME=PadalaHub
APP_URL=https://PadalaHub.com

DB_DATABASE=PadalaHub
DB_USERNAME=PadalaHub_user
DB_PASSWORD=

# Wise API
WISE_API_KEY=
WISE_API_URL=https://api.wise.com

# Admin alerts
ADMIN_EMAIL=
```

---

## MVP Scope (Phase 1 Only)

Build only this for launch:
- [ ] Home page with amount input + region selector
- [ ] Domestic comparison results page (Palawan, Cebuana, LBC, GCash)
- [ ] Seeded fee tables for all domestic providers
- [ ] Affiliate links on each result
- [ ] Mobile-responsive UI (Tagalog labels)
- [ ] Simple admin panel to update fee tables manually
- [ ] Basic SEO (`<title>`, meta description, OG tags)

Do NOT build in Phase 1:
- International rates (too complex for MVP)
- User accounts / alerts
- Scrapers
- Payment integration

---

## Deployment

- VPS: DigitalOcean (existing Setoria server or new droplet)
- DNS/SSL: Cloudflare
- PHP: 8.3-FPM + Nginx
- Add `URL::forceScheme('https')` in `AppServiceProvider` (required for all Cloudflare-proxied Laravel projects)
- Deploy script: `deploy.sh` following Setoria standard pattern

---

## Notes for Claude Code

- Domestic fee data is static — always seed via `DatabaseSeeder`, never hardcode in controllers
- Keep scraper classes isolated — one class per provider, easy to disable individually
- All comparison logic lives in Service classes, not controllers
- The comparison result must always show "last updated" timestamp so users know data freshness
- Tagalog UI strings should go in `lang/tl/` using Laravel localization
- Admin routes must be protected by `role:admin` middleware via Spatie
