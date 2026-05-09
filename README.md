# PadalaHub

A Filipino-first remittance fee comparison web app that helps users find the cheapest way to send money domestically across the Philippines. Compare fees from Palawan Express, Cebuana Lhuillier, LBC, GCash Padala, and more — all in one place.

> No equivalent tool exists for the Philippine local remittance market.

---

## Features

- **Domestic fee comparison** — enter an amount and region, instantly see all providers sorted by lowest fee
- **Region-aware filtering** — providers are filtered by sender and recipient region (NCR, Luzon, Visayas, Mindanao)
- **Admin panel** — manage providers, toggle active status, and edit fee tiers inline
- **Tagalog UI** — Filipino-first copy with English fallback
- **Mobile responsive** — built with MUI v6, works on any screen size

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.3 |
| Frontend | React 18, Inertia.js v2, MUI v6 |
| Build tool | Vite 8 |
| Database | MySQL 8 |
| Auth | Laravel Breeze |
| Permissions | Spatie Laravel Permission |
| Font | Plus Jakarta Sans |

---

## Getting Started

### Requirements

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/padalahub.git
cd padalahub

# Install PHP dependencies
composer install

# Install JS dependencies
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:

```env
DB_DATABASE=padalahub
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### Database Setup

```bash
php artisan migrate
php artisan db:seed
```

### Run Locally

```bash
# Start Laravel dev server
php artisan serve

# In a separate terminal, start Vite
npm run dev
```

Visit `http://localhost:8000`

---

## Admin Panel

The admin panel is at `/admin`. Log in with an account that has the `admin` role.

To grant admin access via Tinker:

```bash
php artisan tinker
```
```php
$user = \App\Models\User::where('email', 'you@example.com')->first();
$user->assignRole('admin');
```

Admin features:
- Dashboard with provider stats and recent activity
- Manage providers (add, toggle active/inactive)
- Edit domestic fee tiers inline per provider

---

## Project Structure

```
app/
  Http/Controllers/
    Admin/
      DashboardController.php
      ProviderController.php
      DomesticRateController.php
    CompareController.php
  Models/
    Provider.php
    DomesticFeeTier.php
    ProviderRegion.php
  Services/
    DomesticComparisonService.php

resources/js/
  Pages/
    Home.jsx                   # Landing page with comparison form
    Compare/Domestic.jsx       # Fee comparison results
    Admin/
      Dashboard.jsx
      Providers/Index.jsx
      Rates/Domestic.jsx
  Layouts/
    AdminLayout.jsx
```

---

## Roadmap

### Phase 1 — Domestic (current)
- [x] Home page with amount + region selector
- [x] Domestic comparison results (Palawan, Cebuana, LBC, GCash)
- [x] Seeded fee tables for all domestic providers
- [x] Admin panel with fee table editor
- [x] Mobile-responsive Tagalog UI

### Phase 2 — International
- [ ] Wise API integration
- [ ] Remitly and Western Union rate scraping
- [ ] Live exchange rate comparison

### Phase 3 — Growth
- [ ] Rate change email/SMS alerts
- [ ] Historical rate charts
- [ ] PWA / mobile app
- [ ] B2B embed widget API

---

## License

MIT
