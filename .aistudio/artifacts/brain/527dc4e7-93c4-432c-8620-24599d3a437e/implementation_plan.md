# The Pipe Seller — Artisan Gallery Storefront POC & Magento Multi-Store Blueprint

An interactive dual-mode Proof of Concept (POC) designed for your client presentation with Mike Moore (`thepipeseller.com`), combining a live, functional luxury storefront prototype for the new Artisan & Estate Pipe retail store with a comprehensive Magento 2 Multi-Store technical implementation blueprint and existing-site remediation tracker.

## User Review & Critical Decisions

> [!IMPORTANT]
> The decisions below reflect your confirmed choices from Phase 1 and define how the interactive POC and Magento engineering blueprint are structured.

- **Confirmed Application Structure**: **Interactive Storefront POC + Magento Blueprint Hub** — Users and stakeholders can seamlessly explore the customer-facing luxury pipe gallery experience and switch to the engineering & architecture hub covering Magento Multi-Store configuration, Porto theme customization, third-party integrations, and existing site fixes.
- **Confirmed Aesthetic Direction**: **Dark Heritage Men's Club Gallery with Warm Brass Accents** — Engineered around deep charcoal and espresso slate surfaces (`#11100E` / `#1A1815`) with warm burnished brass accents (`#C89D54`) and neutral museum framing (`#181715`) so varied photography backgrounds provided by individual pipe makers look unified and gallery-grade.
- **Confirmed Interactive Simulations**:
  1. **Scheduled Friday Drop Countdown & State Simulator**: Live toggle between *"Pre-Drop Preview (Coming Soon)"* and *"Friday Drop Live (Purchase Unlocked)"* to demonstrate how 1-of-1 SKU drops transition from preview-only to fixed-price purchasing without bidding.
  2. **Artist Directory & Individual Showcase Pages**: Directory of 12+ launch artisans (scalable to 30–40) with Social Order vs. Alphabetical sorting, an explicit *"Available Now"* indicator for makers with in-stock pieces, and full artist profile views combining biography, studio gallery, and available work.
  3. **Cart & Checkout Simulator with Georgia Tax & Stripe**: Interactive slide-over cart and checkout simulator computing **7.0% Georgia State/Local Sales Tax** strictly when a Georgia (`GA`) shipping address is selected ($0.00 tax for out-of-state/international), paired with Stripe payment capture and ShipStation fulfillment payload preview.
  4. **Existing Site (`thepipeseller.com`) Fixes & Magento Multi-Store Guide**: Interactive before/after visual verification of Mike's immediate action items (responsive mobile logo fix, hiding prices & out-of-stock products, Google Maps billing key diagnosis) alongside step-by-step Magento 2 configuration specs.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a tangible, clickable storefront prototype for Mike Moore's new artisan and estate pipe marketplace while giving your development team (Mohsin, Usman, and you) a turnkey Magento 2 Multi-Store architectural reference, campaign tracking simulator, and scope estimator to finalize design approval and cost estimation.
- **Target Audience / Persona**:
  - **Client Stakeholder (Mike Moore & Business Partner)**: Evaluates the gallery visual direction, artist showcase layout (replacing the need to guess from raw Porto demos), Friday drop mechanics, and artist directory sorting.
  - **Pipe Collectors & Enthusiasts**: Experience the curated 1-of-1 artisan pipe drops, estate pipe catalog, and maker biographies.
  - **Engineering & Delivery Team (Mohsin & Usman)**: Reference exact Magento 2 multi-store settings, Porto child-theme overrides, scheduled attribute logic, Georgia tax rules, ShipStation store-view mapping, and GA4/GTM + Instagram/Email UTM tracking structures.
- **Key Value**: Bridges the gap between the client's hand-sketched layout ideas and Magento's technical capabilities—accelerating design sign-off before the targeted February launch drop.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Storefront Gallery & Friday Drop Simulation**:
   - Visitors land on a refined split-screen exhibition hero highlighting the upcoming **February Artisan Drop** with a live countdown timer and a single interactive **Drop State Simulator Toolbar** below the fold (*Preview Mode: Coming Soon* vs. *Friday 12:00 PM EST: Live Drop*).
   - Below the hero, visitors browse the **Curated Collection Grid** filtering between **Artisan Pipes** (primary focus, 1-of-1 unique SKUs), **Estate Pipes** (curated routine inventory), and future expansion previews (**Cellar Tobacco & High-End Cigars**).
   - Clicking any pipe opens a **Museum Accession Product Detail Modal/View** featuring a sticky high-resolution multi-angle viewer on the left and a contiguous purchase module on the right (displaying fixed price, maker link, briar/stem specifications, 1-of-1 SKU badge, and either a *"Notify Me for Friday Drop"* email capture or *"Acquire Piece — Add to Cart"* depending on the simulated drop state).

2. **Artist Directory & Custom Artist Showcase Page**:
   - Navigating to **Artisans** opens the **Maker Directory** (displaying the 12 launch pipe makers with scaling preview up to 40 makers).
   - Users can sort by **Curated / Social Engagement Order** or **Alphabetical (A–Z)**, and filter strictly to makers with **"Pieces Available Now"** (indicated by a refined burnished-brass flame/pipe emblem and unboxed availability label).
   - Selecting an artisan opens the **Artist Showcase Page** (designed directly around Mike's specification: centrally managed by Mike with no artist login required). It combines the maker's portrait, workshop location, biography with editorial drop-cap typography, a **Past Works Archive Gallery**, and their **Currently Available / Upcoming Drop Pipes** integrated directly on the same page.

3. **Slide-Over Acquisition Cart, Georgia Tax Engine & Stripe Checkout**:
   - Adding a 1-of-1 pipe opens the **Collector's Cart Drawer** (preventing duplicate quantity increments beyond `1` for unique artisan SKUs).
   - Proceeding to checkout lets the user test shipping states (e.g., **Georgia (GA)** vs. **New York (NY)** vs. **United Kingdom**). Selecting **Georgia** automatically applies the Magento Tax Rule (`GA State + Local 7.0%`), while out-of-state and international addresses calculate `$0.00` tax per Mike's launch requirement.
   - Completing the simulated **Stripe Payment Intent** generates an **Order Confirmation & ShipStation Sync Receipt** showing how the order routes to Mike's existing ShipStation account and triggers email/Instagram conversion events.

4. **Magento 2 Multi-Store Blueprint & Existing Site Remediation Hub**:
   - Accessible from the workspace switcher, this view equips your team with:
     - **Existing Site (`thepipeseller.com`) Fixes Preview**: Interactive toggle demonstrating the CSS fix for the stretched mobile logo (`max-width: 100%; height: auto; object-fit: contain`), Magento catalog configuration for hiding prices & out-of-stock items on Store View 1, and the Google Maps API billing activation checklist.
     - **Magento 2 Multi-Store Architecture & Staging DNS Plan**: Single Magento instance hosting Website 1 (`thepipeseller.com` — Archive/Catalog Mode) and Website 2 (New Artisan Gallery Domain — Porto Child Theme, Stripe, Georgia Tax, ShipStation Store Mapping, and zero-downtime staging-to-production DNS cutover).
     - **Campaigns, Mailing & GA4/GTM Simulator**: Interactive UTM link builder for Mike's weekly Instagram Drop Reels/Stories and Email Drop blasts, comparing lightweight Magento-native mailing integrations (Klaviyo / Mailchimp / Mageplaza) and showing real-time `dataLayer` events (`view_item`, `notify_drop_signup`, `add_to_cart`, `purchase`).
     - **Meeting Action Items & Delivery Roadmap**: Interactive tracker mapped to **Mike Moore**, **Mohsin Zaheer**, and **Usman** with dry-run milestones leading to the February drop.

### Visual Identity & Theme

- **Aesthetic Direction**: **Dark Heritage Men's Club & Curatorial Art Gallery** — Inspired by private collector lounges, Dunhill heritage rooms, and contemporary object museums. Designed specifically to solve Mike's concern that photos come from different artists with varying backgrounds: each product frame uses a consistent neutral museum mat surround (`#181715`) with subtle inner hairline framing so heterogeneous studio photos harmonize effortlessly.
- **Color Palette & Mood** (60-30-10 Discipline):
  - **60% Dominant Neutral Canvas (`--background`)**: Deep Briardust Charcoal (`#11100E`) and Aged Espresso Slate (`#161412`).
  - **30% Structural Surfaces (`--card` / `--muted`)**: Warm Museum Plinth (`#1C1917`), subtle hairline borders (`#292524`), Parchment Ivory primary typography (`#F5F2EB`), and Warm Stone secondary text (`#A8A29E`).
  - **10% Accent Budget (`--primary` / `--accent`)**: Burnished Estate Brass (`#C89D54`) for primary CTAs, active filter states, and "Available Now" maker indicators; semantic status paired with explicit labels (`Available Now`, `Coming Friday`, `Acquired`).
- **Typography & Hierarchy** (2+1 Font Rule):
  - **Display / Headings**: `Cormorant Garamond` (SemiBold 600 / Italic) — evokes gallery exhibition catalogues, heritage tobacconists, and bespoke craftsmanship.
  - **Body Prose & UI Controls**: `Plus Jakarta Sans` (Regular 400 / Medium 500) — crisp, high-legibility modern sans-serif with subtle optical tracking on dark backgrounds.
  - **Specifications, SKUs, Timers & Tax Math**: `JetBrains Mono` (`tabular-nums`) — used strictly for 1-of-1 SKU codes, chamber/weight dimensions, countdown timers, and checkout tax calculations.
- **Component Styling & Layout**:
  - **Top Bar Contract**: Strict 1-row, 3-zone header (`gap-8`) featuring the single-line brand wordmark (`The Pipe Seller · Atelier`), 4 concise navigation links (`Collection`, `Artisans`, `Friday Drops`, `Magento Blueprint`), and 1 primary action button (`Collector Bag (N)`).
  - **Zero-Pill Metadata Discipline**: Pipe metadata (e.g., `Danish Freehand · Briar & Cumberland · SKU #TPS-014`) is rendered as clean, unboxed inline text with `·` separators—never cluttered with rounded pill badges or thick left borders.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified Gallery Storefront + Magento Engineering Blueprint**
  - *Chosen Approach*: Build a rich, interactive React application that functions first as the live storefront prototype (built around Porto Theme's structural grid capabilities so it translates 1:1 to Magento 2) and second as an interactive technical specification and client presentation deck.
  - *Why*: Magento 2 requires a PHP/MySQL server environment, whereas your immediate bottleneck before development and cost estimation (at `38:08` in the call) is getting Mike's sign-off on the **Artist Showcase layout**, **Dark Men's Club aesthetic**, and **Drop workflow**. This POC lets Mike click through the exact experience while giving Mohsin and Usman exact Magento implementation specs.
  - *Alternatives Considered*: Static wireframes or text-only documentation (passed over because interactive drop toggles and live artist showcase pages make client approval dramatically faster).

- **Decision 2: Scheduled Friday Drop Architecture ("Coming Soon" to "Fixed-Price Buy")**
  - *Chosen Approach*: Model products with a custom Magento attribute set (`drop_release_timestamp`, `is_one_of_one`, `artist_id`) where items automatically render in **Preview / Coming Soon Mode** prior to Friday launch time and unlock the **Add to Cart** action strictly when `currentTime >= drop_release_timestamp`, with fixed pricing and zero bidding.
  - *Why*: Directly fulfills Mike's core retail strategy (`05:08` and `10:29`): building anticipation via Instagram and email previews earlier in the week before opening sales on Friday.

- **Decision 3: Multi-Photography Harmonization Frame**
  - *Chosen Approach*: Wrap product and artist gallery imagery in a standardized neutral gallery plinth container (`4:3` and `1:1` aspect ratios with subtle museum matting and tonal edge vignette).
  - *Why*: Directly solves the challenge discussed at `18:11` where individual artists submit photos with inconsistent lighting and backgrounds, ensuring the catalog still feels cohesive and luxury-grade.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     TOP NAVIGATION BAR (3-Zone Contract)                         │
│  [The Pipe Seller]  ──  [Collection | Artisans | Friday Drops | Blueprint] ── [Bag] │
└───────────────────┬──────────────────────────────────────────┬───────────────────┘
                    │                                          │
                    ▼                                          ▼
┌─────────────────────────────────────────┐  ┌─────────────────────────────────────┐
│    STOREFRONT GALLERY POC WORKSPACE     │  │   MAGENTO 2 MULTI-STORE BLUEPRINT   │
│                                         │  │                                     │
│  ┌───────────────────────────────────┐  │  │  ┌───────────────────────────────┐  │
│  │ Exhibition Hero & Drop Simulator  │  │  │  │ Existing Site Fixes Simulator │  │
│  │ • Countdown Timer (Feb Drop)      │  │  │  │ • Mobile Logo Stretch Fix     │  │
│  │ • Toggle: Coming Soon ↔ Drop Live │  │  │  │ • Hide Prices & OOS Toggle    │  │
│  └─────────────────┬─────────────────┘  │  │  │ • Google Maps Key Diagnostics │  │
│                    │                    │  │  └───────────────┬───────────────┘  │
│                    ▼                    │  │                  │                  │
│  ┌───────────────────────────────────┐  │  │                  ▼                  │
│  │ Curated Pipe Collection Grid      │  │  │  ┌───────────────────────────────┐  │
│  │ • Filter: Artisan | Estate | All  │  │  │  │ Multi-Store & Porto Spec      │  │
│  │ • Filter: Available | Coming Soon │  │  │  │ • Website 1 vs Website 2      │  │
│  │ • 1-of-1 Accession Product Modal  │  │  │  │ • Scheduled Drop Attribute    │  │
│  └─────────────────┬─────────────────┘  │  │  │ • Staging & DNS Cutover Flow  │  │
│                    │                    │  │  └───────────────┬───────────────┘  │
│                    ▼                    │  │                  │                  │
│  ┌───────────────────────────────────┐  │  │                  ▼                  │
│  │ Artist Directory & Showcase View  │  │  │  ┌───────────────────────────────┐  │
│  │ • 12 Launch Makers (30-40 scale)  │  │  │  │ Instagram + Email + GA4/GTM   │  │
│  │ • Sort: Social Order ↔ A-Z        │  │  │  │ • UTM Drop Campaign Builder   │  │
│  │ • "Available Now" Emblem Filter   │  │  │  │ • Live GTM DataLayer Inspector│  │
│  │ • Full Artist Bio + Gallery + SKU │  │  │  │ • Action Items (Mike/Mohsin/  │  │
│  └───────────────────────────────────┘  │  │  │   Usman) & Cost Scope Tracker │  │
└────────────────────┬────────────────────┘  └─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│            SLIDE-OVER COLLECTOR BAG, GEORGIA TAX & STRIPE SIMULATOR              │
│  • 1-of-1 SKU Lock  • State Selector (GA = 7% Tax / Non-GA = 0%)                 │
│  • Stripe Payment Intent Simulator  • ShipStation Order Sync Payload Preview     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **Artisan Entity (`Artist`)**: `id`, `name`, `region`, `specialty`, `socialRank` (for social-order sorting), `biography`, `studioStory`, `portraitImage`, `pastWorksGallery[]`, and dynamically computed `availableCount` & `upcomingDropCount` (driving the "Products Available Now" icon).
- **Pipe Catalog Entity (`PipeProduct`)**: `id`, `sku` (1-of-1 unique identifier), `title`, `artistId`, `category` (`Artisan` | `Estate` | `Tobacco & Cigars Preview`), `price` (fixed USD), `availabilityState` (`available_now` | `coming_friday_drop` | `acquired`), `dropDate`, `dimensions` (length, weight, bowl height, chamber depth/diameter, stem material, finish), and `galleryImages[]`.
- **Drop & Cart State**:
  - `dropSimulationMode`: `'preview_coming_soon'` | `'friday_drop_live'` — globally switches all `"coming_friday_drop"` pipes between pre-release preview mode (Waitlist / Drop Reminder capture) and active fixed-price purchasing.
  - `cartItems[]`, `shippingDestination` (`stateCode`: `'GA'` | `'NY'` | `'CA'` | `'TX'` | `'INTL'`), `gaTaxRate` (`0.07`), `dropWaitlistEmails[]`, and `gtmDataLayerEvents[]` (logging real user clicks in the POC so the client can see how Google Analytics 4 + GTM tracks Instagram/Email drop funnel events).

### Interactive Component & State Mapping

- **Drop State Simulator Bar**: Clicking *"Simulate Friday Drop Live"* immediately transitions all scheduled Friday release pipes from `"Coming Soon — Drops Friday 12:00 PM EST"` to `"Available Now — Add to Collector Bag"`, updating artist availability icons across the directory in real time.
- **Artist Directory Controls**: Clicking *"Sort: Social Priority"* vs. *"Sort: Alphabetical (A–Z)"* reorders the maker grid; toggling *"Available Now Only"* filters to artisans with currently purchasable pipes; clicking any artisan opens their dedicated **Artist Showcase Page** with bio, archive gallery, and live shoppable inventory.
- **Contiguous Product Detail & Waitlist Capture**: Opening any pipe lets the user inspect macro finishes and briar grain, switch to the maker's profile, add available pieces to the bag, or submit an email for `"Coming Soon"` drop alerts (which logs a live event to the Campaign & GTM Inspector).
- **Checkout & Georgia Tax Calculator**: Switching the shipping state dropdown between **Georgia (GA)** and out-of-state options dynamically recalculates the order total (`7.0%` vs `0.0%`), and clicking *"Complete Order via Stripe"* generates a complete order receipt alongside the exact JSON payload transmitted to **ShipStation**.
