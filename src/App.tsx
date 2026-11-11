/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  Lock,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Wrench,
  X
} from 'lucide-react';
import {
  ArtistProfile,
  AvailabilityStatus,
  INITIAL_ARTISTS,
  INITIAL_PRODUCTS,
  PipeProduct
} from './data/pipeGalleryData';
import { PhotoAngleOption, ProductPhotoViewer } from './components/ProductPhotoViewer';
import { DevBlueprintSideDrawer } from './components/MagentoBlueprintModal';

type StorefrontPage =
  | 'shop'
  | 'product_detail'
  | 'artisans'
  | 'artist_detail'
  | 'coming_soon'
  | 'cart'
  | 'checkout'
  | 'order_success';

interface CompletedOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: PipeProduct[];
  subtotal: number;
  taxAmount: number;
  totalWithTax: number;
  placedAt: string;
}

const SALES_TAX_RATE = 0.07; // 7% automatic sales tax calculation

function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return '00h : 00m : 00s';
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  if (days > 0) {
    return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  }
  return `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
}

/**
 * Generates 4 gallery angles from the uploaded product image so customers
 * can inspect Full Profile, Bowl & Flame Grain, Stem & Ferrule, and Rim View.
 */
function buildProductAngles(pipe: PipeProduct): PhotoAngleOption[] {
  return [
    {
      label: 'Full Profile',
      imageUrl: pipe.imageUrl,
      objectPosition: 'center center',
      scalePreset: 1
    },
    {
      label: 'Bowl & Grain',
      imageUrl: pipe.imageUrl,
      objectPosition: '25% 50%',
      scalePreset: 1.35
    },
    {
      label: 'Stem & Mount',
      imageUrl: pipe.imageUrl,
      objectPosition: '78% 50%',
      scalePreset: 1.35
    },
    {
      label: 'Chamber & Rim',
      imageUrl: pipe.imageUrl,
      objectPosition: '35% 25%',
      scalePreset: 1.5
    }
  ];
}

export default function App() {
  // Storefront Catalog & Artist State
  const [products, setProducts] = useState<PipeProduct[]>(INITIAL_PRODUCTS);
  const [artists] = useState<ArtistProfile[]>(INITIAL_ARTISTS);

  // Navigation & Simulated Frontend Loader State
  const [currentPage, setCurrentPage] = useState<StorefrontPage>('shop');
  const [previousPage, setPreviousPage] = useState<StorefrontPage>('shop');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);

  // Clean Shop Category Filter ('All' | 'Artisan Pipes' | 'Estate Pipes') & Real-Time Header Search
  const [shopCategory, setShopCategory] = useState<'All' | 'Artisan Pipes' | 'Estate Pipes'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Checkout State
  const [cartIds, setCartIds] = useState<string[]>(['pipe-tps-002']);
  const [notifiedProductIds, setNotifiedProductIds] = useState<string[]>([]);
  const [notifyEmailInput, setNotifyEmailInput] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Checkout Form Inputs
  const [fullName, setFullName] = useState<string>('Jameson Beauregard');
  const [email, setEmail] = useState<string>('j.beauregard@savannahclub.com');
  const [streetAddress, setStreetAddress] = useState<string>('114 Bull Street, Suite 4B');
  const [city, setCity] = useState<string>('Savannah');
  const [stateRegion, setStateRegion] = useState<string>('GA');
  const [zipCode, setZipCode] = useState<string>('31401');
  const [cardName, setCardName] = useState<string>('Jameson Beauregard');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvc, setCardCvc] = useState<string>('842');

  // Developer Mode State ( strictly OFF by default so Client only sees pure storefront UI )
  const [devMode, setDevMode] = useState<boolean>(false);
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState<boolean>(false);

  // Live 1-second ticker for all "Coming Soon" product timers
  const [nowMs, setNowMs] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      setNowMs(current);

      // Automatically transition any 'coming_soon' product whose timer hits zero to 'available_now'
      setProducts((prevProducts) => {
        let changed = false;
        const updated = prevProducts.map((p) => {
          if (
            p.status === 'coming_soon' &&
            p.releaseTimestamp !== null &&
            p.releaseTimestamp <= current
          ) {
            changed = true;
            return { ...p, status: 'available_now' as AvailabilityStatus, releaseTimestamp: null };
          }
          return p;
        });
        return changed ? updated : prevProducts;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Smooth page transition with realistic frontend loader
  const navigateTo = (
    page: StorefrontPage,
    options?: { artistId?: string; productId?: string }
  ) => {
    setIsPageLoading(true);
    setPreviousPage(currentPage);
    if (options?.artistId) {
      setSelectedArtistId(options.artistId);
    }
    if (options?.productId) {
      setSelectedProductId(options.productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setCurrentPage(page);
      setIsPageLoading(false);
    }, 240);
  };

  // Active Product for Full-Page Product View
  const activeProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const activeProductArtist = useMemo(() => {
    if (!activeProduct) return null;
    return artists.find((a) => a.id === activeProduct.artistId) ?? null;
  }, [artists, activeProduct]);

  const relatedArtistProducts = useMemo(() => {
    if (!activeProduct) return [];
    const sameArtist = products.filter(
      (p) => p.artistId === activeProduct.artistId && p.id !== activeProduct.id
    );
    if (sameArtist.length >= 3) return sameArtist.slice(0, 3);
    const others = products.filter(
      (p) => p.artistId !== activeProduct.artistId && p.id !== activeProduct.id
    );
    return [...sameArtist, ...others].slice(0, 3);
  }, [products, activeProduct]);

  // Compute per-artist product stats (Available Now & Coming Soon)
  const artistStats = useMemo(() => {
    const map: Record<string, { availableCount: number; comingSoonCount: number; total: number }> = {};
    artists.forEach((a) => {
      map[a.id] = { availableCount: 0, comingSoonCount: 0, total: 0 };
    });
    products.forEach((p) => {
      if (!map[p.artistId]) {
        map[p.artistId] = { availableCount: 0, comingSoonCount: 0, total: 0 };
      }
      map[p.artistId].total += 1;
      if (p.status === 'available_now') map[p.artistId].availableCount += 1;
      if (p.status === 'coming_soon') map[p.artistId].comingSoonCount += 1;
    });
    return map;
  }, [products, artists]);

  // Filtered products for main Shop view (real-time search by title or artisan name + category filter)
  const shopProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = shopCategory === 'All' || p.category === shopCategory;
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.artistName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, shopCategory, searchQuery]);

  // Products in "Coming Soon" category (also respects real-time search)
  const comingSoonProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (p.status !== 'coming_soon') return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.artistName.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  // Selected Artist & their split sections (Available Now vs Coming Soon)
  const selectedArtist = useMemo(() => {
    if (!selectedArtistId) return null;
    return artists.find((a) => a.id === selectedArtistId) ?? null;
  }, [artists, selectedArtistId]);

  const selectedArtistAvailablePipes = useMemo(() => {
    if (!selectedArtistId) return [];
    return products.filter(
      (p) => p.artistId === selectedArtistId && p.status !== 'coming_soon'
    );
  }, [products, selectedArtistId]);

  const selectedArtistComingSoonPipes = useMemo(() => {
    if (!selectedArtistId) return [];
    return products.filter(
      (p) => p.artistId === selectedArtistId && p.status === 'coming_soon'
    );
  }, [products, selectedArtistId]);

  // Cart & Automatic Tax Calculation
  const cartItems = useMemo(() => {
    return products.filter((p) => cartIds.includes(p.id) && p.status === 'available_now');
  }, [products, cartIds]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  const automaticTax = useMemo(() => {
    return Math.round(subtotal * SALES_TAX_RATE * 100) / 100;
  }, [subtotal]);

  const totalIncludingTax = useMemo(() => {
    return subtotal + automaticTax;
  }, [subtotal, automaticTax]);

  // Actions
  const handleAddToCart = (product: PipeProduct) => {
    if (product.status !== 'available_now') return;
    setAddingToCartId(product.id);
    setTimeout(() => {
      if (!cartIds.includes(product.id)) {
        setCartIds((prev) => [...prev, product.id]);
      }
      setAddingToCartId(null);
    }, 320);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleAutoPrefillCheckout = () => {
    setFullName('Jameson Beauregard');
    setEmail('j.beauregard@savannahclub.com');
    setStreetAddress('114 Bull Street, Suite 4B');
    setCity('Savannah');
    setStateRegion('GA');
    setZipCode('31401');
    setCardName('Jameson Beauregard');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('08/29');
    setCardCvc('842');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setIsProcessingCheckout(true);

    setTimeout(() => {
      const order: CompletedOrder = {
        orderId: `TPS-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: fullName,
        customerEmail: email,
        shippingAddress: `${streetAddress}, ${city}, ${stateRegion} ${zipCode}`,
        items: [...cartItems],
        subtotal,
        taxAmount: automaticTax,
        totalWithTax: totalIncludingTax,
        placedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      // Mark purchased 1-of-1 items as sold
      const purchasedIds = cartItems.map((i) => i.id);
      setProducts((prev) =>
        prev.map((p) => (purchasedIds.includes(p.id) ? { ...p, status: 'sold' } : p))
      );
      setCartIds([]);
      setCompletedOrder(order);
      setIsProcessingCheckout(false);
      setCurrentPage('order_success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 950);
  };

  // Dev Mode Backend Handlers
  const handleUpdateProductStatusAndTimer = (
    productId: string,
    newStatus: AvailabilityStatus,
    newReleaseTimestamp: number | null
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: newStatus, releaseTimestamp: newReleaseTimestamp }
          : p
      )
    );
  };

  const handleUpdateProductImage = (productId: string, newImageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, imageUrl: newImageUrl } : p))
    );
  };

  // Reusable Product Card Component
  const renderProductCard = (pipe: PipeProduct) => {
    const isComingSoon = pipe.status === 'coming_soon';
    const isAvailable = pipe.status === 'available_now';
    const isSold = pipe.status === 'sold';
    const inCart = cartIds.includes(pipe.id);
    const isAdding = addingToCartId === pipe.id;
    const remainingMs =
      isComingSoon && pipe.releaseTimestamp ? Math.max(0, pipe.releaseTimestamp - nowMs) : 0;

    return (
      <article
        key={pipe.id}
        className="group bg-[#181614] border border-[#292524] hover:border-[#C89D54]/50 transition-colors flex flex-col justify-between"
      >
        <div>
          {/* Product Image Container */}
          <div
            onClick={() => navigateTo('product_detail', { productId: pipe.id })}
            className="relative cursor-pointer overflow-hidden"
          >
            <ProductPhotoViewer
              imageUrl={pipe.imageUrl}
              alt={pipe.title}
              imageHeightClass="h-64"
              className="w-full border-b border-[#292524]"
            />

            {/* Status Indicator / Live Countdown Overlay */}
            {isComingSoon && (
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-[#11100E]/92 backdrop-blur-xs border border-[#C89D54]/60 flex items-center justify-between text-xs">
                <span className="text-[#C89D54] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Coming Soon</span>
                </span>
                <span className="font-mono-tabular text-[#F5F2EB] font-medium">
                  {pipe.releaseTimestamp ? formatCountdown(remainingMs) : 'Scheduled'}
                </span>
              </div>
            )}

            {isSold && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#11100E]/90 border border-[#292524] text-[11px] text-[#A8A29E]">
                Sold · Private Collection
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="flex items-center gap-1.5 text-xs text-[#A8A29E] mb-1.5">
              <button
                onClick={() => navigateTo('artist_detail', { artistId: pipe.artistId })}
                className="text-[#C89D54] hover:underline cursor-pointer"
              >
                {pipe.artistName}
              </button>
              <span aria-hidden="true">·</span>
              <span>{pipe.category}</span>
            </div>

            <h3
              onClick={() => navigateTo('product_detail', { productId: pipe.id })}
              className="text-xl font-display font-semibold text-[#F5F2EB] group-hover:text-[#C89D54] transition-colors cursor-pointer"
            >
              {pipe.title}
            </h3>

            <p className="text-xs text-[#A8A29E] mt-1.5 line-clamp-2 leading-relaxed">
              {pipe.subtitle}
            </p>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-[#292524]/80 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-base font-mono-tabular font-semibold text-[#F5F2EB]">
                ${pipe.price.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#A8A29E]">
                +${Math.round(pipe.price * SALES_TAX_RATE)} est. tax
              </div>
            </div>

            {isAvailable && (
              <button
                onClick={() => (inCart ? navigateTo('cart') : handleAddToCart(pipe))}
                disabled={isAdding}
                className="px-4 py-2 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : inCart ? (
                  <span>View in Cart</span>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            )}

            {isComingSoon && (
              <button
                onClick={() => navigateTo('product_detail', { productId: pipe.id })}
                className="px-4 py-2 text-xs font-medium bg-[#11100E] border border-[#C89D54]/60 text-[#C89D54] hover:bg-[#C89D54] hover:text-[#11100E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {notifiedProductIds.includes(pipe.id) ? 'Notification Set' : 'View Release'}
              </button>
            )}

            {isSold && (
              <span className="text-xs font-mono-tabular text-[#78716C]">Acquired</span>
            )}
          </div>

          {/* Dev-Mode-Only Quick Controls on Card (Strictly hidden unless Dev Mode is enabled) */}
          {devMode && (
            <div className="pt-2 border-t border-dashed border-[#292524] flex items-center justify-between gap-2 text-[11px]">
              <span className="font-mono-tabular text-[#C89D54]">DEV:</span>
              <div className="flex items-center gap-1.5">
                {isComingSoon ? (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateProductStatusAndTimer(
                          pipe.id,
                          'coming_soon',
                          Date.now() + 12 * 1000
                        )
                      }
                      className="px-2 py-0.5 bg-[#11100E] border border-[#292524] text-[#D6D3D1] hover:border-[#C89D54] cursor-pointer"
                    >
                      12s Timer
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateProductStatusAndTimer(pipe.id, 'available_now', null)
                      }
                      className="px-2 py-0.5 bg-[#C89D54]/20 border border-[#C89D54] text-[#C89D54] cursor-pointer"
                    >
                      Make Live
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      handleUpdateProductStatusAndTimer(
                        pipe.id,
                        'coming_soon',
                        Date.now() + 15 * 1000
                      )
                    }
                    className="px-2 py-0.5 bg-[#11100E] border border-[#292524] text-[#A8A29E] hover:text-[#F5F2EB] cursor-pointer"
                  >
                    Set Coming Soon (15s)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#11100E] text-[#F5F2EB] flex flex-col">
      {/* =====================================================================
          CLEAN CLIENT-FACING TOP NAVIGATION BAR (3-ZONE CONTRACT)
         ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#11100E]/95 backdrop-blur-md border-b border-[#292524]">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => navigateTo('shop')}
            className="text-2xl font-display font-semibold tracking-tight text-[#F5F2EB] whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            The Pipe Seller
          </button>

          {/* Zone 2: Clean Storefront Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A8A29E]">
            <button
              onClick={() => navigateTo('shop')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b ${
                currentPage === 'shop' || currentPage === 'product_detail'
                  ? 'text-[#F5F2EB] border-[#C89D54]'
                  : 'border-transparent hover:text-[#F5F2EB]'
              }`}
            >
              Shop Collection
            </button>
            <button
              onClick={() => navigateTo('artisans')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b ${
                currentPage === 'artisans' || currentPage === 'artist_detail'
                  ? 'text-[#F5F2EB] border-[#C89D54]'
                  : 'border-transparent hover:text-[#F5F2EB]'
              }`}
            >
              Artisans
            </button>
            <button
              onClick={() => navigateTo('coming_soon')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b ${
                currentPage === 'coming_soon'
                  ? 'text-[#F5F2EB] border-[#C89D54]'
                  : 'border-transparent hover:text-[#F5F2EB]'
              }`}
            >
              Coming Soon ({comingSoonProducts.length})
            </button>
          </nav>

          {/* Zone 3: Real-Time Search Bar & Primary Cart Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim() && currentPage !== 'shop' && currentPage !== 'coming_soon') {
                    setCurrentPage('shop');
                  }
                }}
                placeholder="Search pipe or artisan..."
                aria-label="Search products by title or artisan name"
                className="w-44 sm:w-56 pl-8 pr-7 py-1.5 text-xs bg-[#181614] border border-[#292524] text-[#F5F2EB] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C89D54] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 text-[#A8A29E] hover:text-[#F5F2EB] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => navigateTo('cart')}
              className="px-4 py-2 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({cartItems.length})</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Row */}
        <div className="flex md:hidden items-center justify-around border-t border-[#292524] px-4 py-2.5 text-xs text-[#A8A29E] bg-[#161412]">
          <button
            onClick={() => navigateTo('shop')}
            className={currentPage === 'shop' ? 'text-[#C89D54] font-semibold' : ''}
          >
            Shop
          </button>
          <button
            onClick={() => navigateTo('artisans')}
            className={
              currentPage === 'artisans' || currentPage === 'artist_detail'
                ? 'text-[#C89D54] font-semibold'
                : ''
            }
          >
            Artisans
          </button>
          <button
            onClick={() => navigateTo('coming_soon')}
            className={currentPage === 'coming_soon' ? 'text-[#C89D54] font-semibold' : ''}
          >
            Coming Soon ({comingSoonProducts.length})
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN CLIENT-FACING VIEWPORT WITH SMOOTH PAGE TRANSITION LOADER
         ===================================================================== */}
      <main className="flex-1">
        {isPageLoading ? (
          <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-[#C89D54] animate-spin" />
            <span className="text-xs tracking-widest uppercase text-[#A8A29E]">
              Loading Gallery...
            </span>
          </div>
        ) : (
          <>
            {/* ===============================================================
                PAGE 1: SHOP COLLECTION (HERO + COLLECTION + FEATURED ARTISANS)
               =============================================================== */}
            {currentPage === 'shop' && (
              <div>
                {/* Section 1: Storefront Hero */}
                <section className="border-b border-[#292524] bg-[#161412]">
                  <div className="max-w-[1240px] mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-6 space-y-5">
                      <p className="text-xs tracking-widest uppercase text-[#C89D54]">
                        Fine Artisan &amp; Estate Tobacco Pipes
                      </p>
                      <h1
                        className="text-4xl sm:text-5xl font-display font-semibold text-[#F5F2EB] leading-[1.12]"
                        style={{ textWrap: 'balance' }}
                      >
                        Handcrafted One-of-One Briar &amp; Collector Estate Pieces.
                      </h1>
                      <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed max-w-xl">
                        Explore individually carved pipes from independent master artisans alongside restored vintage
                        estate pieces. Preview upcoming releases with live countdowns or acquire in-stock pieces
                        directly.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button
                          onClick={() => navigateTo('artisans')}
                          className="px-5 py-3 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors cursor-pointer"
                        >
                          Meet the Artisans
                        </button>
                        <button
                          onClick={() => navigateTo('coming_soon')}
                          className="px-5 py-3 text-xs font-medium bg-[#181614] border border-[#292524] text-[#F5F2EB] hover:border-[#C89D54] transition-colors cursor-pointer"
                        >
                          View Coming Soon ({comingSoonProducts.length})
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-6">
                      <div
                        onClick={() => navigateTo('product_detail', { productId: products[0].id })}
                        className="bg-[#181614] border border-[#292524] p-4 cursor-pointer group hover:border-[#C89D54]/60 transition-colors"
                      >
                        <ProductPhotoViewer
                          imageUrl={products[0].imageUrl}
                          alt={products[0].title}
                          imageHeightClass="h-72 sm:h-80"
                          className="w-full border border-[#292524]"
                        />
                        <div className="pt-4 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#C89D54]">{products[0].artistName}</span>
                            <h2 className="text-lg font-display font-semibold text-[#F5F2EB] group-hover:text-[#C89D54] transition-colors">
                              {products[0].title}
                            </h2>
                          </div>
                          <div className="text-right font-mono-tabular">
                            <div className="text-base font-semibold text-[#F5F2EB]">
                              ${products[0].price.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-[#C89D54]">
                              {products[0].status === 'coming_soon' && products[0].releaseTimestamp
                                ? `Live in ${formatCountdown(Math.max(0, products[0].releaseTimestamp - nowMs))}`
                                : 'Available Now'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Clean Catalog Section */}
                <section className="max-w-[1240px] mx-auto px-6 py-12 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#292524]">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#F5F2EB]">
                        Current Collection
                      </h2>
                      <p className="text-xs text-[#A8A29E] mt-1">
                        Showing {shopProducts.length} handcrafted pieces (Available Now &amp; Coming Soon)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(['All', 'Artisan Pipes', 'Estate Pipes'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setShopCategory(cat)}
                          className={`px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            shopCategory === cat
                              ? 'bg-[#C89D54] text-[#11100E]'
                              : 'bg-[#181614] text-[#A8A29E] hover:text-[#F5F2EB] border border-[#292524]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {shopProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {shopProducts.map((pipe) => renderProductCard(pipe))}
                    </div>
                  ) : (
                    <div className="p-12 bg-[#181614] border border-[#292524] text-center space-y-3">
                      <p className="text-lg font-display text-[#F5F2EB]">
                        No pipes found matching &ldquo;{searchQuery}&rdquo;.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setShopCategory('All');
                        }}
                        className="px-4 py-2 text-xs font-medium bg-[#C89D54] text-[#11100E] cursor-pointer"
                      >
                        Clear Search &amp; Filters
                      </button>
                    </div>
                  )}
                </section>

                {/* Section 3: Horizontal "Featured Artisans" Strip on Homepage */}
                <section className="border-t border-[#292524] bg-[#161412]">
                  <div className="max-w-[1240px] mx-auto px-6 py-14 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-[#C89D54] mb-1">
                          The Makers Behind the Collection
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#F5F2EB]">
                          Featured Artisans
                        </h2>
                      </div>
                      <button
                        onClick={() => navigateTo('artisans')}
                        className="text-xs font-medium text-[#C89D54] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View All {artists.length} Represented Artisans</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {artists.slice(0, 4).map((artist) => {
                        const st = artistStats[artist.id] || {
                          availableCount: 0,
                          comingSoonCount: 0,
                          total: 0
                        };
                        return (
                          <article
                            key={artist.id}
                            onClick={() => navigateTo('artist_detail', { artistId: artist.id })}
                            className="group bg-[#181614] border border-[#292524] hover:border-[#C89D54]/60 transition-colors cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative h-52 w-full overflow-hidden bg-[#11100E] border-b border-[#292524]">
                                <img
                                  src={artist.portraitUrl}
                                  alt={artist.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {st.availableCount > 0 && (
                                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#11100E]/90 border border-[#C89D54] text-[#C89D54] text-[11px] font-medium flex items-center gap-1">
                                    <Flame className="w-3 h-3 fill-[#C89D54]" />
                                    <span>{st.availableCount} Available Now</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-5">
                                <div className="text-xs text-[#A8A29E]">
                                  {artist.workshopCity}, {artist.country}
                                </div>
                                <h3 className="text-xl font-display font-semibold text-[#F5F2EB] group-hover:text-[#C89D54] transition-colors mt-0.5">
                                  {artist.name}
                                </h3>
                                <p className="text-xs text-[#C89D54] mt-0.5">{artist.specialty}</p>
                              </div>
                            </div>
                            <div className="px-5 pb-4 pt-3 border-t border-[#292524] flex items-center justify-between text-xs text-[#A8A29E]">
                              <span>
                                {st.availableCount} Live · {st.comingSoonCount} Upcoming
                              </span>
                              <span className="text-[#C89D54]">Profile →</span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ===============================================================
                PAGE 2: DEDICATED FULL-PAGE PRODUCT DETAIL VIEW
               =============================================================== */}
            {currentPage === 'product_detail' && activeProduct && (
              <section className="max-w-[1240px] mx-auto px-6 py-10 space-y-14">
                {/* Breadcrumb / Back Navigation */}
                <div className="flex items-center justify-between pb-4 border-b border-[#292524]">
                  <button
                    onClick={() =>
                      navigateTo(
                        previousPage === 'artist_detail' || previousPage === 'coming_soon'
                          ? previousPage
                          : 'shop'
                      )
                    }
                    className="flex items-center gap-2 text-xs font-medium text-[#C89D54] hover:text-[#F5F2EB] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {previousPage === 'artist_detail'
                        ? `Back to ${activeProduct.artistName}`
                        : previousPage === 'coming_soon'
                        ? 'Back to Coming Soon'
                        : 'Back to Collection'}
                    </span>
                  </button>

                  <div className="text-xs font-mono-tabular text-[#A8A29E]">
                    SKU {activeProduct.sku} · {activeProduct.category}
                  </div>
                </div>

                {/* 2-Column Contiguous Gallery & Acquisition Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Left 7 Cols (Sticky): Multi-Angle Photo Viewer + Grain Zoom */}
                  <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-3">
                    <ProductPhotoViewer
                      imageUrl={activeProduct.imageUrl}
                      alt={activeProduct.title}
                      angles={buildProductAngles(activeProduct)}
                      enableCustomerControls={true}
                      imageHeightClass="h-[380px] sm:h-[440px]"
                      className="w-full border border-[#292524]"
                    />
                    <p className="text-xs text-[#A8A29E]">
                      Select any thumbnail above to inspect different angles, or click &ldquo;Inspect Grain (2x)&rdquo;
                      to magnify the briar grain.
                    </p>
                  </div>

                  {/* Right 5 Cols: Purchase / Coming Soon Module + Specs + Maker Card */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 sm:p-7 bg-[#181614] border border-[#292524] space-y-5">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#A8A29E] mb-1">
                          <button
                            onClick={() =>
                              navigateTo('artist_detail', { artistId: activeProduct.artistId })
                            }
                            className="text-[#C89D54] hover:underline font-medium cursor-pointer"
                          >
                            {activeProduct.artistName}
                          </button>
                          <span>·</span>
                          <span>{activeProduct.artistRegion}</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[#F5F2EB]">
                          {activeProduct.title}
                        </h1>
                        <p className="text-xs text-[#A8A29E] mt-1">{activeProduct.subtitle}</p>

                        <div className="mt-4 pt-4 border-t border-[#292524] flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-mono-tabular font-semibold text-[#F5F2EB]">
                              ${activeProduct.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#A8A29E] ml-2">
                              (${(activeProduct.price * (1 + SALES_TAX_RATE)).toFixed(2)} incl. tax)
                            </span>
                          </div>
                          <span className="text-xs font-mono-tabular text-[#C89D54]">
                            One-of-One Piece
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#D6D3D1] leading-relaxed">
                        {activeProduct.description}
                      </p>

                      {/* Primary Action Box (Available Now vs Coming Soon Countdown) */}
                      {activeProduct.status === 'available_now' ? (
                        <div className="space-y-3 pt-1">
                          <button
                            onClick={() => {
                              if (cartIds.includes(activeProduct.id)) {
                                navigateTo('cart');
                              } else {
                                handleAddToCart(activeProduct);
                              }
                            }}
                            disabled={addingToCartId === activeProduct.id}
                            className="w-full py-3.5 px-5 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            {addingToCartId === activeProduct.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Adding to Cart...</span>
                              </>
                            ) : cartIds.includes(activeProduct.id) ? (
                              <span>In Your Cart — View Cart &amp; Checkout →</span>
                            ) : (
                              <span>Add to Cart — ${activeProduct.price.toLocaleString()}</span>
                            )}
                          </button>
                        </div>
                      ) : activeProduct.status === 'coming_soon' ? (
                        <div className="p-4 bg-[#11100E] border border-[#C89D54]/60 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#C89D54] font-medium flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Coming Soon · Releases In</span>
                            </span>
                            <span className="font-mono-tabular text-[#F5F2EB] font-semibold">
                              {activeProduct.releaseTimestamp
                                ? formatCountdown(
                                    Math.max(0, activeProduct.releaseTimestamp - nowMs)
                                  )
                                : 'Scheduled'}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                            This piece will automatically unlock for purchase when the timer reaches zero. Leave your
                            email below to receive an instant release alert.
                          </p>

                          {notifiedProductIds.includes(activeProduct.id) ? (
                            <div className="p-2.5 bg-[#181614] border border-[#C89D54]/50 text-xs text-[#C89D54]">
                              ✓ Release notification active for {activeProduct.sku}.
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!notifyEmailInput.trim()) return;
                                setNotifiedProductIds((prev) => [...prev, activeProduct.id]);
                                setNotifyEmailInput('');
                              }}
                              className="flex gap-2"
                            >
                              <input
                                type="email"
                                required
                                value={notifyEmailInput}
                                onChange={(e) => setNotifyEmailInput(e.target.value)}
                                placeholder="Enter your email..."
                                className="flex-1 px-3 py-2 text-xs bg-[#181614] border border-[#292524] text-[#F5F2EB]"
                              />
                              <button
                                type="submit"
                                className="px-4 py-2 text-xs font-medium bg-[#C89D54] text-[#11100E] cursor-pointer whitespace-nowrap"
                              >
                                Notify Me
                              </button>
                            </form>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 bg-[#11100E] border border-[#292524] text-xs text-[#A8A29E] text-center">
                          Sold · Private Collection
                        </div>
                      )}

                      {/* Specifications Table */}
                      <div className="pt-3 border-t border-[#292524]">
                        <div className="text-xs font-semibold text-[#F5F2EB] mb-3">
                          Measurements &amp; Specifications
                        </div>
                        <dl className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-[#292524]/60">
                            <dt className="text-[#A8A29E]">Briar Origin</dt>
                            <dd className="text-[#F5F2EB]">{activeProduct.dimensions.briarOrigin}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#292524]/60">
                            <dt className="text-[#A8A29E]">Stem Material</dt>
                            <dd className="text-[#F5F2EB]">{activeProduct.dimensions.stemMaterial}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#292524]/60">
                            <dt className="text-[#A8A29E]">Finish</dt>
                            <dd className="text-[#F5F2EB]">{activeProduct.dimensions.finishType}</dd>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#292524]/60">
                            <dt className="text-[#A8A29E]">Length / Weight</dt>
                            <dd className="text-[#F5F2EB] font-mono-tabular">
                              {activeProduct.dimensions.lengthMm}mm · {activeProduct.dimensions.weightGrams}g
                            </dd>
                          </div>
                          <div className="flex justify-between py-1">
                            <dt className="text-[#A8A29E]">Chamber Bore</dt>
                            <dd className="text-[#F5F2EB] font-mono-tabular">
                              Ø {activeProduct.dimensions.chamberDiameterMm}mm ×{' '}
                              {activeProduct.dimensions.chamberDepthMm}mm
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Crafted By Artisan Card */}
                    {activeProductArtist && (
                      <div className="p-5 bg-[#181614] border border-[#292524] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={activeProductArtist.portraitUrl}
                            alt={activeProductArtist.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover border border-[#292524] shrink-0"
                          />
                          <div>
                            <div className="text-[11px] text-[#C89D54]">Crafted By</div>
                            <div className="text-base font-display font-semibold text-[#F5F2EB]">
                              {activeProductArtist.name}
                            </div>
                            <div className="text-xs text-[#A8A29E]">
                              {activeProductArtist.workshopCity}, {activeProductArtist.country}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            navigateTo('artist_detail', { artistId: activeProductArtist.id })
                          }
                          className="px-3.5 py-2 text-xs font-medium bg-[#11100E] border border-[#292524] text-[#F5F2EB] hover:border-[#C89D54] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Artist Page →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* More Pieces Section Below the Fold */}
                <div className="pt-8 border-t border-[#292524] space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-semibold text-[#F5F2EB]">
                      More from the Collection
                    </h2>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="text-xs text-[#C89D54] hover:underline cursor-pointer"
                    >
                      View Full Catalog →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedArtistProducts.map((pipe) => renderProductCard(pipe))}
                  </div>
                </div>
              </section>
            )}

            {/* ===============================================================
                PAGE 3: ARTISANS DIRECTORY PAGE
               =============================================================== */}
            {currentPage === 'artisans' && (
              <section className="max-w-[1240px] mx-auto px-6 py-12 space-y-8">
                <div className="pb-6 border-b border-[#292524]">
                  <p className="text-xs tracking-widest uppercase text-[#C89D54] mb-1">
                    Represented Carvers
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F2EB]">
                    Master Pipe Artisans
                  </h1>
                  <p className="text-sm text-[#A8A29E] mt-2 max-w-2xl">
                    Select any artisan below to view their biography, studio background, and available or upcoming
                    pipes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {artists.map((artist) => {
                    const st = artistStats[artist.id] || {
                      availableCount: 0,
                      comingSoonCount: 0,
                      total: 0
                    };
                    const hasAvailable = st.availableCount > 0;

                    return (
                      <article
                        key={artist.id}
                        onClick={() => navigateTo('artist_detail', { artistId: artist.id })}
                        className="group bg-[#181614] border border-[#292524] hover:border-[#C89D54]/60 transition-colors cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-60 w-full overflow-hidden bg-[#11100E] border-b border-[#292524]">
                            <img
                              src={artist.portraitUrl}
                              alt={artist.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-95 contrast-105"
                            />
                            {/* Available Now Emblem on Artist Card */}
                            {hasAvailable && (
                              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#11100E]/90 border border-[#C89D54] text-[#C89D54] text-[11px] font-medium flex items-center gap-1">
                                <Flame className="w-3 h-3 fill-[#C89D54]" />
                                <span>{st.availableCount} Available Now</span>
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <div className="text-xs text-[#A8A29E]">
                              {artist.workshopCity}, {artist.country}
                            </div>
                            <h2 className="text-xl font-display font-semibold text-[#F5F2EB] group-hover:text-[#C89D54] transition-colors mt-0.5">
                              {artist.name}
                            </h2>
                            <p className="text-xs text-[#C89D54] mt-0.5">{artist.specialty}</p>
                            <p className="text-xs text-[#A8A29E] mt-2.5 line-clamp-2 leading-relaxed">
                              {artist.shortBio}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-4 pt-3 border-t border-[#292524] flex items-center justify-between text-xs">
                          <span className="text-[#D6D3D1]">
                            {st.availableCount} Live · {st.comingSoonCount} Coming Soon
                          </span>
                          <span className="text-[#C89D54] font-medium flex items-center gap-1">
                            <span>View Pipes</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ===============================================================
                PAGE 4: INDIVIDUAL ARTIST PAGE (SPLIT INTO AVAILABLE NOW & COMING SOON)
               =============================================================== */}
            {currentPage === 'artist_detail' && selectedArtist && (
              <section className="max-w-[1240px] mx-auto px-6 py-10 space-y-12">
                <button
                  onClick={() => navigateTo('artisans')}
                  className="flex items-center gap-2 text-xs font-medium text-[#C89D54] hover:text-[#F5F2EB] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Artisans</span>
                </button>

                {/* Artist Header Profile */}
                <div className="bg-[#181614] border border-[#292524] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4">
                    <div className="aspect-square max-w-[260px] overflow-hidden border border-[#292524] bg-[#11100E]">
                      <img
                        src={selectedArtist.portraitUrl}
                        alt={selectedArtist.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#A8A29E]">
                      <span>
                        {selectedArtist.workshopCity}, {selectedArtist.country}
                      </span>
                      <span>·</span>
                      <span>{selectedArtist.yearsCarving} Years Carving</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F2EB]">
                      {selectedArtist.name}
                    </h1>
                    <p className="text-sm text-[#C89D54]">{selectedArtist.specialty}</p>
                    <p className="text-sm text-[#D6D3D1] leading-relaxed max-w-2xl">
                      {selectedArtist.fullBiography}
                    </p>
                  </div>
                </div>

                {/* Split Row 1: Available for Immediate Acquisition */}
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#292524] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#C89D54] fill-[#C89D54]" />
                      <h2 className="text-2xl font-display font-semibold text-[#F5F2EB]">
                        Available Now from {selectedArtist.name} ({selectedArtistAvailablePipes.length})
                      </h2>
                    </div>
                    <span className="text-xs text-[#A8A29E]">Ready for immediate dispatch</span>
                  </div>

                  {selectedArtistAvailablePipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {selectedArtistAvailablePipes.map((pipe) => renderProductCard(pipe))}
                    </div>
                  ) : (
                    <div className="p-6 bg-[#181614] border border-[#292524] text-xs text-[#A8A29E]">
                      No pieces are currently in stock from {selectedArtist.name}. See upcoming releases below.
                    </div>
                  )}
                </div>

                {/* Split Row 2: Coming Soon from This Workshop */}
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#292524] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C89D54]" />
                      <h2 className="text-2xl font-display font-semibold text-[#F5F2EB]">
                        Coming Soon from {selectedArtist.name} ({selectedArtistComingSoonPipes.length})
                      </h2>
                    </div>
                    <span className="text-xs text-[#A8A29E]">
                      Unlocks automatically when countdown finishes
                    </span>
                  </div>

                  {selectedArtistComingSoonPipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {selectedArtistComingSoonPipes.map((pipe) => renderProductCard(pipe))}
                    </div>
                  ) : (
                    <div className="p-6 bg-[#181614] border border-[#292524] text-xs text-[#A8A29E]">
                      All scheduled releases from {selectedArtist.name} are now live above.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ===============================================================
                PAGE 5: COMING SOON CATEGORY PAGE (WITH LIVE WORKING TIMERS)
               =============================================================== */}
            {currentPage === 'coming_soon' && (
              <section className="max-w-[1240px] mx-auto px-6 py-12 space-y-8">
                <div className="pb-6 border-b border-[#292524] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#C89D54] mb-1">
                      Scheduled Inventory Preview
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F2EB]">
                      Coming Soon
                    </h1>
                    <p className="text-sm text-[#A8A29E] mt-2 max-w-2xl">
                      Preview upcoming artisan and estate pipes before they go live. Each piece unlocks automatically
                      for purchase as soon as its countdown completes.
                    </p>
                  </div>
                </div>

                {comingSoonProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comingSoonProducts.map((pipe) => renderProductCard(pipe))}
                  </div>
                ) : (
                  <div className="p-12 bg-[#181614] border border-[#292524] text-center space-y-3">
                    <p className="text-xl font-display text-[#F5F2EB]">
                      All scheduled pipes are now live in the collection.
                    </p>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-5 py-2.5 text-xs font-medium bg-[#C89D54] text-[#11100E] cursor-pointer"
                    >
                      Browse Live Collection
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* ===============================================================
                PAGE 6: DEDICATED VIEW CART PAGE (WITH STICKY SUMMARY & TRUST GUARANTEES)
               =============================================================== */}
            {currentPage === 'cart' && (
              <section className="max-w-[1140px] mx-auto px-6 py-12 space-y-8">
                <div className="pb-6 border-b border-[#292524] flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F2EB]">
                      Shopping Cart
                    </h1>
                    <p className="text-xs text-[#A8A29E] mt-1">
                      {cartItems.length} {cartItems.length === 1 ? 'piece' : 'pieces'} selected
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="text-xs text-[#C89D54] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Continue Shopping</span>
                  </button>
                </div>

                {cartItems.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 bg-[#181614] border border-[#292524] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              onClick={() => navigateTo('product_detail', { productId: item.id })}
                              className="w-24 h-20 object-cover border border-[#292524] bg-[#11100E] shrink-0 cursor-pointer"
                            />
                            <div>
                              <div className="text-xs text-[#C89D54]">{item.artistName}</div>
                              <h3
                                onClick={() => navigateTo('product_detail', { productId: item.id })}
                                className="text-lg font-display font-semibold text-[#F5F2EB] hover:text-[#C89D54] cursor-pointer"
                              >
                                {item.title}
                              </h3>
                              <div className="text-xs text-[#A8A29E] mt-0.5">
                                {item.category} · SKU {item.sku} · Qty: 1 (One-of-One)
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                            <div className="text-base font-mono-tabular font-semibold text-[#F5F2EB]">
                              ${item.price.toLocaleString()}
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-xs text-[#A8A29E] hover:text-[#F5F2EB] flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sticky Order Summary Box with Collector Assurances */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 p-6 bg-[#181614] border border-[#292524] space-y-5">
                      <h2 className="text-xl font-display font-semibold text-[#F5F2EB] pb-3 border-b border-[#292524]">
                        Order Summary
                      </h2>

                      <div className="space-y-2.5 text-xs font-mono-tabular">
                        <div className="flex justify-between text-[#A8A29E]">
                          <span>Subtotal</span>
                          <span className="text-[#F5F2EB]">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#A8A29E]">
                          <span>Insured Shipping</span>
                          <span className="text-[#F5F2EB]">Free</span>
                        </div>
                        <div className="flex justify-between text-[#A8A29E]">
                          <span>Sales Tax (Auto-Calculated)</span>
                          <span className="text-[#F5F2EB]">${automaticTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-[#292524] text-sm font-semibold">
                          <span className="text-[#F5F2EB]">Total (Including Tax)</span>
                          <span className="text-[#C89D54]">${totalIncludingTax.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateTo('checkout')}
                        className="w-full py-3.5 px-5 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Collector Trust Assurances */}
                      <div className="pt-4 border-t border-[#292524] space-y-2 text-[11px] text-[#A8A29E]">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C89D54] shrink-0" />
                          <span>Exact 1-of-1 piece photographed in studio</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-[#C89D54] shrink-0" />
                          <span>Complimentary insured priority delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-[#C89D54] shrink-0" />
                          <span>Encrypted direct Stripe checkout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 bg-[#181614] border border-[#292524] text-center space-y-4">
                    <p className="text-xl font-display text-[#F5F2EB]">Your cart is currently empty.</p>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-5 py-2.5 text-xs font-medium bg-[#C89D54] text-[#11100E] cursor-pointer"
                    >
                      Explore Collection
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* ===============================================================
                PAGE 7: DEDICATED CHECKOUT PAGE (WITH STICKY SUMMARY & AUTO-PREFILL)
               =============================================================== */}
            {currentPage === 'checkout' && (
              <section className="max-w-[1140px] mx-auto px-6 py-12 space-y-8">
                <div className="pb-6 border-b border-[#292524] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <button
                      onClick={() => navigateTo('cart')}
                      className="text-xs text-[#C89D54] hover:underline flex items-center gap-1.5 mb-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Cart</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F2EB]">
                      Secure Checkout
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoPrefillCheckout}
                    className="px-3.5 py-2 text-xs font-medium bg-[#181614] border border-[#C89D54]/60 text-[#C89D54] hover:bg-[#C89D54] hover:text-[#11100E] transition-colors cursor-pointer"
                  >
                    Auto-Prefill Sample Details
                  </button>
                </div>

                <form
                  onSubmit={handlePlaceOrder}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left 7 Cols: Shipping & Stripe Payment Inputs */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Shipping Information */}
                    <div className="p-6 bg-[#181614] border border-[#292524] space-y-4">
                      <h2 className="text-lg font-display font-semibold text-[#F5F2EB]">
                        1. Shipping Address
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A8A29E] mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={stateRegion}
                            onChange={(e) => setStateRegion(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">ZIP Code</label>
                          <input
                            type="text"
                            required
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB] font-mono-tabular"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Details (Stripe) */}
                    <div className="p-6 bg-[#181614] border border-[#292524] space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-display font-semibold text-[#F5F2EB]">
                          2. Card Payment (Stripe)
                        </h2>
                        <span className="text-xs text-[#A8A29E] flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-[#C89D54]" />
                          <span>Encrypted</span>
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A8A29E] mb-1">Name on Card</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#A8A29E] mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB] font-mono-tabular"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">Expiration (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB] font-mono-tabular"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A29E] mb-1">Security Code (CVC)</label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB] font-mono-tabular"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Cols (Sticky): Final Order Summary with Automatic Sales Tax */}
                  <div className="lg:col-span-5 lg:sticky lg:top-24 p-6 bg-[#181614] border border-[#292524] space-y-5">
                    <h2 className="text-xl font-display font-semibold text-[#F5F2EB] pb-3 border-b border-[#292524]">
                      Order Review
                    </h2>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover border border-[#292524]"
                            />
                            <div>
                              <div className="font-medium text-[#F5F2EB]">{item.title}</div>
                              <div className="text-[#A8A29E]">{item.artistName}</div>
                            </div>
                          </div>
                          <span className="font-mono-tabular text-[#F5F2EB]">
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-[#292524] space-y-2 text-xs font-mono-tabular">
                      <div className="flex justify-between text-[#A8A29E]">
                        <span>Subtotal</span>
                        <span className="text-[#F5F2EB]">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#A8A29E]">
                        <span>Shipping</span>
                        <span className="text-[#F5F2EB]">Free</span>
                      </div>
                      <div className="flex justify-between text-[#A8A29E]">
                        <span>Sales Tax</span>
                        <span className="text-[#F5F2EB]">${automaticTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#292524] text-base font-semibold">
                        <span className="text-[#F5F2EB]">Total (Including Tax)</span>
                        <span className="text-[#C89D54]">${totalIncludingTax.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingCheckout}
                      className="w-full py-3.5 px-5 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isProcessingCheckout ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <span>Pay ${totalIncludingTax.toFixed(2)} &amp; Place Order</span>
                      )}
                    </button>

                    <div className="pt-3 border-t border-[#292524] space-y-1.5 text-[11px] text-[#A8A29E]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C89D54] shrink-0" />
                        <span>1-of-1 authenticity &amp; insured dispatch included</span>
                      </div>
                    </div>
                  </div>
                </form>
              </section>
            )}

            {/* ===============================================================
                PAGE 8: ORDER CONFIRMATION PAGE
               =============================================================== */}
            {currentPage === 'order_success' && completedOrder && (
              <section className="max-w-[760px] mx-auto px-6 py-16">
                <div className="p-8 bg-[#181614] border border-[#292524] space-y-6">
                  <div className="flex items-center gap-3 text-[#C89D54]">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-xs font-mono-tabular uppercase tracking-widest">
                      Order Confirmed · #{completedOrder.orderId}
                    </span>
                  </div>

                  <div>
                    <h1 className="text-3xl font-display font-semibold text-[#F5F2EB]">
                      Thank you for your acquisition, {completedOrder.customerName}.
                    </h1>
                    <p className="text-sm text-[#A8A29E] mt-1">
                      A confirmation receipt has been sent to{' '}
                      <span className="text-[#F5F2EB]">{completedOrder.customerEmail}</span>. Your pipe is being
                      prepared for insured dispatch.
                    </p>
                  </div>

                  <div className="p-5 bg-[#11100E] border border-[#292524] space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#A8A29E]">Shipping Address</span>
                      <span className="text-[#F5F2EB] text-right">{completedOrder.shippingAddress}</span>
                    </div>
                    <div className="flex justify-between font-mono-tabular">
                      <span className="text-[#A8A29E]">Subtotal</span>
                      <span className="text-[#F5F2EB]">${completedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-mono-tabular">
                      <span className="text-[#A8A29E]">Sales Tax Included</span>
                      <span className="text-[#F5F2EB]">${completedOrder.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#292524] font-mono-tabular text-sm font-semibold">
                      <span className="text-[#F5F2EB]">Total Paid</span>
                      <span className="text-[#C89D54]">${completedOrder.totalWithTax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-6 py-3 text-xs font-medium bg-[#C89D54] text-[#11100E] hover:bg-[#D6AF68] transition-colors cursor-pointer"
                    >
                      Return to Gallery
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* =====================================================================
          CLEAN STOREFRONT FOOTER
         ===================================================================== */}
      <footer className="border-t border-[#292524] bg-[#11100E] py-10 px-6">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#A8A29E]">
          <div>
            <span className="font-display text-lg font-semibold text-[#F5F2EB] mr-3">
              The Pipe Seller
            </span>
            <span>Fine Artisan &amp; Estate Tobacco Pipes</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => navigateTo('shop')} className="hover:text-[#F5F2EB] cursor-pointer">
              Shop Collection
            </button>
            <button onClick={() => navigateTo('artisans')} className="hover:text-[#F5F2EB] cursor-pointer">
              Artisans
            </button>
            <button onClick={() => navigateTo('coming_soon')} className="hover:text-[#F5F2EB] cursor-pointer">
              Coming Soon
            </button>
            <button onClick={() => navigateTo('cart')} className="hover:text-[#F5F2EB] cursor-pointer">
              Cart ({cartItems.length})
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          FLOATING DEV MODE SWITCH & SIDE DRAWER TRIGGER
          (Keeps all developer / Magento architecture specs out of client view)
         ===================================================================== */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {devMode && (
          <button
            onClick={() => setIsDevDrawerOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-[#C89D54] text-[#11100E] shadow-lg hover:bg-[#D6AF68] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Open Magento Blueprint &amp; Timer Admin</span>
          </button>
        )}

        <button
          onClick={() => {
            const next = !devMode;
            setDevMode(next);
            if (!next) setIsDevDrawerOpen(false);
          }}
          className={`px-3 py-2 text-xs font-mono-tabular border shadow-lg transition-colors cursor-pointer ${
            devMode
              ? 'bg-[#181614] border-[#C89D54] text-[#C89D54]'
              : 'bg-[#181614]/90 border-[#292524] text-[#A8A29E] hover:text-[#F5F2EB]'
          }`}
          title="Toggle Developer Mode to view Magento Blueprint and Backend Timer controls"
        >
          Dev Mode: {devMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Developer & Magento Blueprint Side Drawer (Only mounted when Dev Mode is ON) */}
      {devMode && (
        <DevBlueprintSideDrawer
          isOpen={isDevDrawerOpen}
          onClose={() => setIsDevDrawerOpen(false)}
          products={products}
          onUpdateProductStatusAndTimer={handleUpdateProductStatusAndTimer}
          onUpdateProductImage={handleUpdateProductImage}
        />
      )}
    </div>
  );
}
