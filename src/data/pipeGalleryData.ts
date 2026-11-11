export type AvailabilityStatus = 'available_now' | 'coming_soon' | 'sold';

export type ProductCategory = 'Artisan Pipes' | 'Estate Pipes';

export interface PipeDimensions {
  lengthMm: number;
  weightGrams: number;
  bowlHeightMm: number;
  chamberDiameterMm: number;
  chamberDepthMm: number;
  briarOrigin: string;
  stemMaterial: string;
  finishType: string;
}

export interface PipeProduct {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  artistId: string;
  artistName: string;
  artistRegion: string;
  category: ProductCategory;
  price: number;
  status: AvailabilityStatus;
  /** Unix timestamp in ms when a 'coming_soon' product automatically goes live, or null if manual */
  releaseTimestamp: number | null;
  imageUrl: string;
  secondaryImageUrl?: string;
  description: string;
  dimensions: PipeDimensions;
}

export interface ArtistProfile {
  id: string;
  name: string;
  country: string;
  workshopCity: string;
  specialty: string;
  yearsCarving: number;
  portraitUrl: string;
  shortBio: string;
  fullBiography: string;
  socialOrder: number;
}

export interface ActionItemRecord {
  id: string;
  owner: 'Mike Moore (Client)' | 'Mohsin Zaheer (Lead Dev)' | 'Usman (Integrations & Analytics)';
  timestampRef: string;
  title: string;
  category: 'Existing Site' | 'New Multi-Store' | 'Design & Porto' | 'Analytics & Fulfillment';
  status: 'Ready in POC' | 'Client Input Pending' | 'Configured';
  implementationDetail: string;
}

const now = Date.now();

export const INITIAL_ARTISTS: ArtistProfile[] = [
  {
    id: 'artist-soren-lindqvist',
    name: 'Søren Lindqvist',
    country: 'Denmark',
    workshopCity: 'Roskilde',
    specialty: 'Danish Freehands & Asymmetrical Blowfish',
    yearsCarving: 28,
    portraitUrl: '/images/artists/artist1.jpg',
    shortBio:
      'Trained in Copenhagen workshops during the late 1990s, crafting organic silhouettes that follow the natural flame grain of aged Corsican briar.',
    fullBiography:
      'Every pipe begins as a 15-year air-cured Grecian or Corsican plateau block. Rather than imposing pre-drawn templates onto the wood, Søren Lindqvist reads the tightest grain striations first, turning the stummel on the lathe only for initial drilling before shaping the entire silhouette by hand with rasps and scrapers. His stems are hand-cut from German Ebonite and vintage brindle Cumberland rod.',
    socialOrder: 1
  },
  {
    id: 'artist-kenji-takahashi',
    name: 'Kenji Takahashi',
    country: 'Japan',
    workshopCity: 'Karuizawa',
    specialty: 'Sculptural Volcanoes & Bamboo-Shank Acorn Forms',
    yearsCarving: 19,
    portraitUrl: '/images/artists/artist2.jpg',
    shortBio:
      'Working from a quiet studio in Nagano Prefecture, blending Japanese joinery discipline with classic Anglo-Danish pipe architecture.',
    fullBiography:
      'Kenji Takahashi harvests and cures his own Susudake (smoked temple bamboo) for shank extensions, pairing its natural node rhythm with deeply sandblasted Calabrian briar. His internal airway engineering is prized among collectors for effortless draw and featherweight bite comfort.',
    socialOrder: 2
  },
  {
    id: 'artist-matteo-bellini',
    name: 'Matteo Bellini',
    country: 'Italy',
    workshopCity: 'Pesaro',
    specialty: 'Craggy Adriatic Sandblasts & Sterling Spigots',
    yearsCarving: 22,
    portraitUrl: '/images/artists/artist3.jpg',
    shortBio:
      'Carrying forward the Neo-Classical Pesaro school with muscular Italian proportions and custom-forged .925 sterling silver mounts.',
    fullBiography:
      'Matteo Bellini selects Ligurian and Tuscan radica burls personally, air-seasoning his blocks for eight years before carving. His high-pressure sandblasting reveals deeply terraced growth rings while preserving crisp rim chamfers.',
    socialOrder: 3
  },
  {
    id: 'artist-julian-vance',
    name: 'Julian Vance',
    country: 'United States',
    workshopCity: 'Asheville, NC',
    specialty: 'Appalachian Heritage Billiards & Faceted Pokers',
    yearsCarving: 14,
    portraitUrl: '/images/artists/artist4.jpg',
    shortBio:
      'A former fine cabinetmaker in the Blue Ridge Mountains bringing heirloom woodcraft and vintage Bakelite ferrule work to contemporary pipes.',
    fullBiography:
      'Known for oil-cured stummels that require zero break-in period, Julian Vance specializes in crisp octagonal paneling, canted Dublins, and vintage estate-inspired Rhodesians fitted with horn and stabilized hardwood accents.',
    socialOrder: 4
  },
  {
    id: 'artist-henrik-nygaard',
    name: 'Henrik Nygaard',
    country: 'Denmark',
    workshopCity: 'Odense',
    specialty: 'Reverse Calabash & Horn-Inlaid Dublins',
    yearsCarving: 31,
    portraitUrl: '/images/artists/artist5.jpg',
    shortBio:
      'Veteran Danish master engineering compact reverse-calabash cooling chambers hidden effortlessly inside slender shanks.',
    fullBiography:
      'Henrik Nygaard produces fewer than thirty pieces a year from his Odense studio. Each piece balances sculptural Danish lines with internal expansion chambers that deliver a remarkably dry, cool smoke.',
    socialOrder: 5
  },
  {
    id: 'artist-alistair-finch',
    name: 'Alistair Finch',
    country: 'United Kingdom',
    workshopCity: 'Cotswolds',
    specialty: 'English Classics & Curated Estate Restorations',
    yearsCarving: 25,
    portraitUrl: '/images/artists/artist6.jpg',
    shortBio:
      'Trained in London’s historic Jermyn Street repair shops, crafting traditional English Bulldogs and overseeing collector estate restorations.',
    fullBiography:
      'Using traditional Sheffield tooling and hand-forged silver hallmarks, Alistair Finch creates timeless Bulldogs, Rhodesians, and Lovat forms built for decades of daily companionship.',
    socialOrder: 6
  },
  {
    id: 'artist-luc-moreau',
    name: 'Luc Moreau',
    country: 'France',
    workshopCity: 'Saint-Claude',
    specialty: 'Jura Mountain Briar & Horn Stems',
    yearsCarving: 17,
    portraitUrl: '/images/artists/artist7.jpg',
    shortBio:
      'Operating from the historic birthplace of French briar turning in Saint-Claude, pairing centenary root wood with translucent horn mounts.',
    fullBiography:
      'Luc Moreau honors the 19th-century Saint-Claude guild craft while applying modern airway dynamics and hand-cut vulcanite stem work.',
    socialOrder: 7
  },
  {
    id: 'artist-thomas-calloway',
    name: 'Thomas Calloway',
    country: 'United States',
    workshopCity: 'Savannah, GA',
    specialty: 'Coastal Ring-Grain Sandblasts & Live Oak Accents',
    yearsCarving: 11,
    portraitUrl: '/images/artists/artist8.jpg',
    shortBio:
      'Georgia artisan integrating reclaimed coastal live oak and brass accents into deeply textured sandblasted pipes.',
    fullBiography:
      'Working on the Georgia coast, Thomas Calloway pairs aged Mediterranean briar with stabilized local hardwoods and hand-turned cumberland stems.',
    socialOrder: 8
  }
];

export const INITIAL_PRODUCTS: PipeProduct[] = [
  {
    id: 'pipe-tps-001',
    sku: 'TPS-001',
    title: 'Viking Horn III Asymmetrical Blowfish',
    subtitle: 'Corsican Flame Grain · Boxwood Mount · Hand-Cut Cumberland Stem',
    artistId: 'artist-soren-lindqvist',
    artistName: 'Søren Lindqvist',
    artistRegion: 'Roskilde, Denmark',
    category: 'Artisan Pipes',
    price: 1280,
    status: 'coming_soon',
    // Set live timer: 2 hours, 14 minutes, 35 seconds from load
    releaseTimestamp: now + (2 * 3600 + 14 * 60 + 35) * 1000,
    imageUrl: '/images/pipes/pipe1.jpg',
    description:
      'Carved from an 18-year air-cured Corsican plateau block. Diagonal flame grain tracks the asymmetrically bevelled flanks while dense birdseye blankets the rim and underside.',
    dimensions: {
      lengthMm: 142,
      weightGrams: 46,
      bowlHeightMm: 49,
      chamberDiameterMm: 20,
      chamberDepthMm: 41,
      briarOrigin: 'Corsica (18-Year Air Cured)',
      stemMaterial: 'German Brindle Cumberland',
      finishType: 'Smooth Contrast Flame'
    }
  },
  {
    id: 'pipe-tps-002',
    sku: 'TPS-002',
    title: 'Sabbiata .925 Sterling Spigot Billiard',
    subtitle: 'Tuscan Radica Briar · Hallmarked Silver Spigot · Vulcanite Saddle',
    artistId: 'artist-matteo-bellini',
    artistName: 'Matteo Bellini',
    artistRegion: 'Pesaro, Italy',
    category: 'Artisan Pipes',
    price: 890,
    status: 'available_now',
    releaseTimestamp: null,
    imageUrl: '/images/pipes/pipe2.jpg',
    description:
      'A muscular Pesaro canted billiard featuring a hand-soldered .925 sterling silver military spigot mount and deeply terraced ring-grain sandblast.',
    dimensions: {
      lengthMm: 146,
      weightGrams: 52,
      bowlHeightMm: 51,
      chamberDiameterMm: 21,
      chamberDepthMm: 44,
      briarOrigin: 'Tuscany, Italy',
      stemMaterial: 'German Vulcanite Saddle',
      finishType: 'Deep Craggy Sandblast'
    }
  },
  {
    id: 'pipe-tps-003',
    sku: 'TPS-003',
    title: 'Kiwami Susudake Bamboo Volcano',
    subtitle: 'Calabrian Ring-Grain Sandblast · Smoked Temple Bamboo · Ebonite',
    artistId: 'artist-kenji-takahashi',
    artistName: 'Kenji Takahashi',
    artistRegion: 'Karuizawa, Japan',
    category: 'Artisan Pipes',
    price: 1150,
    status: 'coming_soon',
    // Set live timer: 45 minutes, 20 seconds from load
    releaseTimestamp: now + (45 * 60 + 20) * 1000,
    imageUrl: '/images/pipes/pipe3.jpg',
    description:
      'Features a two-knuckle section of 120-year-old smoked Susudake bamboo joined seamlessly via stainless steel tenon to a sculpted Volcano stummel.',
    dimensions: {
      lengthMm: 151,
      weightGrams: 39,
      bowlHeightMm: 45,
      chamberDiameterMm: 19,
      chamberDepthMm: 38,
      briarOrigin: 'Calabria, Italy',
      stemMaterial: 'Japanese Hand-Cut Ebonite',
      finishType: 'Deep Ring Sandblast'
    }
  },
  {
    id: 'pipe-tps-004',
    sku: 'TPS-004',
    title: 'Blue Ridge Octagonal Faceted Sitter Poker',
    subtitle: 'Oil-Cured Grecian Briar · Vintage Amber Bakelite Ferrule',
    artistId: 'artist-julian-vance',
    artistName: 'Julian Vance',
    artistRegion: 'Asheville, NC',
    category: 'Artisan Pipes',
    price: 640,
    status: 'available_now',
    releaseTimestamp: null,
    imageUrl: '/images/pipes/pipe4.jpg',
    description:
      'Eight hand-planed facets frame vertical straight grain around the chamber. Engineered as a balanced desk sitter with a vintage 1940s amber Bakelite ring.',
    dimensions: {
      lengthMm: 134,
      weightGrams: 48,
      bowlHeightMm: 53,
      chamberDiameterMm: 20,
      chamberDepthMm: 45,
      briarOrigin: 'Grecian Plateau',
      stemMaterial: 'Hand-Cut German Ebonite',
      finishType: 'Smooth Walnut Contrast'
    }
  },
  {
    id: 'pipe-tps-005',
    sku: 'TPS-005',
    title: 'Crown II Reverse-Calabash Horn Dublin',
    subtitle: 'Internal Cooling Chamber · Blonde Water Buffalo Horn · Danish Freehand',
    artistId: 'artist-henrik-nygaard',
    artistName: 'Henrik Nygaard',
    artistRegion: 'Odense, Denmark',
    category: 'Artisan Pipes',
    price: 1420,
    status: 'coming_soon',
    // Set live timer: 5 hours, 10 minutes from load
    releaseTimestamp: now + (5 * 3600 + 10 * 60) * 1000,
    imageUrl: '/images/pipes/pipe5.jpg',
    description:
      'Houses a secondary expansion chamber inside the flaring shank that condenses moisture and delivers an extraordinarily cool, dry smoke.',
    dimensions: {
      lengthMm: 139,
      weightGrams: 54,
      bowlHeightMm: 50,
      chamberDiameterMm: 20,
      chamberDepthMm: 40,
      briarOrigin: 'Corsican Extra Plateau',
      stemMaterial: 'Hand-Cut Black Vulcanite',
      finishType: 'Smooth Contrast Birdseye'
    }
  },
  {
    id: 'pipe-tps-006',
    sku: 'TPS-006',
    title: 'Tidewater Coastal Sandblast Bent Acorn',
    subtitle: 'Grecian Briar · Reclaimed Georgia Live Oak Ring · Cumberland Saddle',
    artistId: 'artist-thomas-calloway',
    artistName: 'Thomas Calloway',
    artistRegion: 'Savannah, GA',
    category: 'Artisan Pipes',
    price: 580,
    status: 'available_now',
    releaseTimestamp: null,
    imageUrl: '/images/pipes/pipe6.jpg',
    description:
      'Handcrafted in Savannah, Georgia. Combines a deeply etched ring-grain sandblast with a stabilized 19th-century coastal Georgia live oak shank mount.',
    dimensions: {
      lengthMm: 138,
      weightGrams: 41,
      bowlHeightMm: 47,
      chamberDiameterMm: 20,
      chamberDepthMm: 41,
      briarOrigin: 'Greece',
      stemMaterial: 'Brindle Cumberland Saddle',
      finishType: 'Deep Craggy Sandblast'
    }
  },
  {
    id: 'pipe-tps-007',
    sku: 'TPS-EST-101',
    title: '1968 Dunhill Shell Briar Group 4 Bent Rhodesian',
    subtitle: 'Unsmoked Mint Estate Archive · Hallmarked Silver Band',
    artistId: 'artist-alistair-finch',
    artistName: 'Alistair Finch',
    artistRegion: 'Cotswolds, UK',
    category: 'Estate Pipes',
    price: 495,
    status: 'available_now',
    releaseTimestamp: null,
    imageUrl: '/images/pipes/pipe7.jpg',
    description:
      'Preserved in unsmoked estate condition with original London hallmarked sterling band and hand-cut vulcanite stem.',
    dimensions: {
      lengthMm: 140,
      weightGrams: 43,
      bowlHeightMm: 44,
      chamberDiameterMm: 20,
      chamberDepthMm: 37,
      briarOrigin: 'Algerian Vintage Briar (1968)',
      stemMaterial: 'Original Vulcanite',
      finishType: 'Shell Sandblast'
    }
  },
  {
    id: 'pipe-tps-008',
    sku: 'TPS-008',
    title: 'Saint-Claude Horn-Mounted Straight Billiard',
    subtitle: 'Aged Jura Briar · Translucent Blonde Horn Ferrule',
    artistId: 'artist-luc-moreau',
    artistName: 'Luc Moreau',
    artistRegion: 'Saint-Claude, France',
    category: 'Artisan Pipes',
    price: 720,
    status: 'coming_soon',
    // Set live timer: 1 hour, 25 minutes from load
    releaseTimestamp: now + (1 * 3600 + 25 * 60) * 1000,
    imageUrl: '/images/pipes/pipe8.jpg',
    description:
      'Turned on a traditional foot-powered lathe in Saint-Claude and fitted with a hand-polished blonde horn mount.',
    dimensions: {
      lengthMm: 145,
      weightGrams: 44,
      bowlHeightMm: 48,
      chamberDiameterMm: 20,
      chamberDepthMm: 42,
      briarOrigin: 'Mediterranean Plateau',
      stemMaterial: 'Hand-Cut Ebonite',
      finishType: 'Smooth Natural Carnauba'
    }
  },
  {
    id: 'pipe-tps-009',
    sku: 'TPS-009',
    title: 'Roskilde Smooth Flame Danish Dublin',
    subtitle: 'Straight Grain Corsican Briar · Sterling Silver Ring',
    artistId: 'artist-soren-lindqvist',
    artistName: 'Søren Lindqvist',
    artistRegion: 'Roskilde, Denmark',
    category: 'Artisan Pipes',
    price: 1190,
    status: 'available_now',
    releaseTimestamp: null,
    imageUrl: '/images/pipes/pipe9.jpg',
    description:
      'Available now from Søren Lindqvist’s latest studio batch. Features tight vertical flame grain and a hand-cut German ebonite stem.',
    dimensions: {
      lengthMm: 144,
      weightGrams: 45,
      bowlHeightMm: 50,
      chamberDiameterMm: 20,
      chamberDepthMm: 43,
      briarOrigin: 'Corsica',
      stemMaterial: 'German Ebonite',
      finishType: 'Smooth Contrast Flame'
    }
  }
];

export const MEETING_ACTION_ITEMS: ActionItemRecord[] = [
  {
    id: 'act-1',
    owner: 'Mike Moore (Client)',
    timestampRef: 'Call 01:44 – 02:19',
    title: 'Activate Google Maps Billing or Issue Paid API Key',
    category: 'Existing Site',
    status: 'Client Input Pending',
    implementationDetail:
      'Existing website store locator/map feature code is healthy; blocked only by expired Google Cloud free tier. Once Mike enables billing in GCP console or shares new key, inject into Stores > Configuration > General > Store Information.'
  },
  {
    id: 'act-2',
    owner: 'Mohsin Zaheer (Lead Dev)',
    timestampRef: 'Call 02:49 – 03:15',
    title: 'Hide Product Prices & Out-of-Stock Items on thepipeseller.com',
    category: 'Existing Site',
    status: 'Ready in POC',
    implementationDetail:
      'Scope to Website 1 (thepipeseller.com): Set Stores > Configuration > Catalog > Inventory > Display Out of Stock Products = No, and disable price output + Add-to-Cart template blocks via Store View layout XML override.'
  },
  {
    id: 'act-3',
    owner: 'Mohsin Zaheer (Lead Dev)',
    timestampRef: 'Call 03:36 – 03:53',
    title: 'Fix Stretched / Deformed Mobile Header Logo on Existing Site',
    category: 'Existing Site',
    status: 'Ready in POC',
    implementationDetail:
      'Replace fixed width/height pixel attributes on .logo img in mobile breakpoint (<768px) with max-width: 160px; width: auto; height: auto; object-fit: contain; so aspect ratio stays locked on iOS/Android.'
  },
  {
    id: 'act-4',
    owner: 'Mike Moore (Client)',
    timestampRef: 'Call 17:09 – 21:29',
    title: 'Approve Artist Showcase Layout, Visual Direction & New Domain',
    category: 'Design & Porto',
    status: 'Ready in POC',
    implementationDetail:
      'This interactive POC provides the exact dark gallery men’s-club aesthetic, photo-enhancing studio viewer, and unified Artist Showcase page based on Porto dark luxury grid.'
  },
  {
    id: 'act-5',
    owner: 'Mohsin Zaheer (Lead Dev)',
    timestampRef: 'Call 04:07, 10:29, 15:01',
    title: 'Configure Second Magento Store, Coming Soon Timers & Georgia Sales Tax',
    category: 'New Multi-Store',
    status: 'Ready in POC',
    implementationDetail:
      'Same Magento 2 installation & server. Create Website 2 + Store View 2 with separate root category, Stripe payment method, automatic 7.0% sales tax calculation, and release_timestamp custom attribute.'
  },
  {
    id: 'act-6',
    owner: 'Usman (Integrations & Analytics)',
    timestampRef: 'Call 20:30 & 25:07 – 28:39',
    title: 'Reuse ShipStation Store Integration & Setup GA4 + GTM Campaign Tracking',
    category: 'Analytics & Fulfillment',
    status: 'Configured',
    implementationDetail:
      'Connect Magento Store View 2 endpoint to Mike’s existing ShipStation account as a secondary store channel. Configure native Magento GA4/GTM dataLayer for Instagram & email campaign attribution.'
  }
];
