import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Globe,
  Layers,
  Mail,
  Play,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Wrench,
  X
} from 'lucide-react';
import {
  AvailabilityStatus,
  MEETING_ACTION_ITEMS,
  PipeProduct
} from '../data/pipeGalleryData';

interface DevBlueprintSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: PipeProduct[];
  onUpdateProductStatusAndTimer: (
    productId: string,
    newStatus: AvailabilityStatus,
    newReleaseTimestamp: number | null
  ) => void;
  onUpdateProductImage: (productId: string, newImageUrl: string) => void;
}

export const DevBlueprintSideDrawer: React.FC<DevBlueprintSideDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductStatusAndTimer,
  onUpdateProductImage
}) => {
  const [activeSection, setActiveSection] = useState<
    'backend_simulator' | 'multistore_arch' | 'existing_fixes' | 'campaigns'
  >('backend_simulator');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [customImageInput, setCustomImageInput] = useState<string>('');

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-2xl bg-[#141311] border-l border-[#292524] h-full flex flex-col justify-between overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Side Drawer Header */}
        <div className="px-6 py-5 border-b border-[#292524] flex items-center justify-between bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-[#C89D54]" />
            <div>
              <h2 className="text-lg font-display font-semibold text-[#F5F2EB]">
                Developer &amp; Magento Backend Console
              </h2>
              <p className="text-[11px] text-[#A8A29E]">
                Hidden from client UI when Dev Mode is off · Manage timers, product states &amp; Magento specs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A8A29E] hover:text-[#F5F2EB] cursor-pointer"
            aria-label="Close developer drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Strip */}
        <div className="px-6 py-3 bg-[#161412] border-b border-[#292524] flex flex-wrap gap-2">
          {[
            { id: 'backend_simulator', label: 'Magento Product & Timer Manager' },
            { id: 'multistore_arch', label: 'Multi-Store & Porto Specs' },
            { id: 'existing_fixes', label: 'Existing Site Fixes' },
            { id: 'campaigns', label: 'Insta/Email & Action Items' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveSection(
                  tab.id as 'backend_simulator' | 'multistore_arch' | 'existing_fixes' | 'campaigns'
                )
              }
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-[#C89D54] text-[#11100E]'
                  : 'bg-[#1C1917] text-[#A8A29E] hover:text-[#F5F2EB] border border-[#292524]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: MAGENTO BACKEND PRODUCT & TIMER MANAGER */}
          {activeSection === 'backend_simulator' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#1C1917] border border-[#292524]">
                <h3 className="text-base font-display font-semibold text-[#F5F2EB] mb-1">
                  Simulate Magento Admin: &ldquo;Coming Soon&rdquo; Timers &amp; Instant Live Publish
                </h3>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  Control product visibility and timers just like Mike will in the Magento backend. Set a{' '}
                  <strong className="text-[#C89D54]">15-second demo timer</strong> on any product and close this drawer
                  to watch it count down live on the storefront and automatically switch to{' '}
                  <strong className="text-[#F5F2EB]">Available Now</strong> when the timer finishes.
                </p>
              </div>

              <div className="space-y-3">
                {products.map((product) => {
                  const isComingSoon = product.status === 'coming_soon';
                  const isAvailable = product.status === 'available_now';

                  return (
                    <div
                      key={product.id}
                      className="p-4 bg-[#1C1917] border border-[#292524] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover border border-[#292524] bg-[#11100E] shrink-0"
                          />
                          <div>
                            <div className="text-[11px] font-mono-tabular text-[#A8A29E]">
                              {product.sku} · {product.artistName}
                            </div>
                            <div className="text-sm font-display font-semibold text-[#F5F2EB]">
                              {product.title}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-mono-tabular px-2 py-0.5 border ${
                            isAvailable
                              ? 'border-[#C89D54]/50 text-[#C89D54]'
                              : isComingSoon
                              ? 'border-[#A8A29E]/40 text-[#D6D3D1]'
                              : 'border-[#292524] text-[#78716C]'
                          }`}
                        >
                          {isAvailable ? 'LIVE NOW' : isComingSoon ? 'COMING SOON' : 'SOLD'}
                        </span>
                      </div>

                      {/* Controls Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#292524]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() =>
                              onUpdateProductStatusAndTimer(product.id, 'available_now', null)
                            }
                            className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                              isAvailable
                                ? 'bg-[#C89D54] text-[#11100E]'
                                : 'bg-[#11100E] border border-[#292524] text-[#D6D3D1] hover:border-[#C89D54]'
                            }`}
                          >
                            Make Live Now
                          </button>

                          <button
                            onClick={() =>
                              onUpdateProductStatusAndTimer(
                                product.id,
                                'coming_soon',
                                Date.now() + 15 * 1000
                              )
                            }
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#11100E] border border-[#C89D54]/60 text-[#C89D54] hover:bg-[#C89D54] hover:text-[#11100E] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Set 15s Demo Timer</span>
                          </button>

                          <button
                            onClick={() =>
                              onUpdateProductStatusAndTimer(
                                product.id,
                                'coming_soon',
                                Date.now() + 3600 * 1000
                              )
                            }
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#11100E] border border-[#292524] text-[#A8A29E] hover:text-[#F5F2EB] transition-colors cursor-pointer"
                          >
                            Set 1h Timer
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (editingImageId === product.id) {
                              setEditingImageId(null);
                            } else {
                              setEditingImageId(product.id);
                              setCustomImageInput(product.imageUrl);
                            }
                          }}
                          className="text-[11px] text-[#A8A29E] hover:text-[#C89D54] underline cursor-pointer"
                        >
                          Change Photo URL
                        </button>
                      </div>

                      {editingImageId === product.id && (
                        <div className="pt-2 flex gap-2">
                          <input
                            type="url"
                            value={customImageInput}
                            onChange={(e) => setCustomImageInput(e.target.value)}
                            placeholder="Paste product image URL..."
                            className="flex-1 px-2.5 py-1.5 text-xs bg-[#11100E] border border-[#292524] text-[#F5F2EB]"
                          />
                          <button
                            onClick={() => {
                              if (customImageInput.trim()) {
                                onUpdateProductImage(product.id, customImageInput.trim());
                                setEditingImageId(null);
                              }
                            }}
                            className="px-3 py-1.5 text-xs bg-[#C89D54] text-[#11100E] font-medium cursor-pointer"
                          >
                            Save Photo
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: MULTI-STORE ARCHITECTURE & PORTO SPECS */}
          {activeSection === 'multistore_arch' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#1C1917] border border-[#292524] space-y-2">
                <div className="text-xs font-mono-tabular text-[#C89D54]">
                  SAME MAGENTO 2 SERVER · MULTI-WEBSITE TOPOLOGY
                </div>
                <h3 className="text-base font-display font-semibold text-[#F5F2EB]">
                  Website 1 (thepipeseller.com) + Website 2 (New Artisan Gallery)
                </h3>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  Both sites run on Mike’s existing Magento installation. Mike manages all artist profiles, product
                  photos, and Coming Soon timers centrally without needing separate artist logins.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#1C1917] border border-[#292524]">
                  <div className="flex items-center justify-between text-xs text-[#C89D54] mb-1.5">
                    <span>1. PORTO THEME &amp; ARTIST PAGES</span>
                    <Layers className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Apply a dark gallery child theme (<span className="font-mono-tabular text-[#F5F2EB]">Smartwave/porto_gallery</span>) on Website 2. Model each Artist as a category under <span className="font-mono-tabular text-[#F5F2EB]">Root &gt; Artisans</span> with biography, portrait, and automatic product collection loading. Query <span className="font-mono-tabular text-[#F5F2EB]">is_salable</span> count to display the &ldquo;Available Now&rdquo; icon on the artist directory.
                  </p>
                </div>

                <div className="p-4 bg-[#1C1917] border border-[#292524]">
                  <div className="flex items-center justify-between text-xs text-[#C89D54] mb-1.5">
                    <span>2. COMING SOON CATEGORY &amp; TIMER ATTRIBUTE</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Add a <span className="font-mono-tabular text-[#F5F2EB]">release_timestamp</span> datetime attribute and a <span className="font-mono-tabular text-[#F5F2EB]">Coming Soon</span> category. Products with a future timestamp or manual toggle disable Add-to-Cart and display the live JavaScript countdown timer until the timer reaches zero or Mike switches them live in the backend.
                  </p>
                </div>

                <div className="p-4 bg-[#1C1917] border border-[#292524]">
                  <div className="flex items-center justify-between text-xs text-[#C89D54] mb-1.5">
                    <span>3. AUTOMATIC GEORGIA SALES TAX &amp; STRIPE + SHIPSTATION</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Configure native Magento Tax Rule (<span className="font-mono-tabular text-[#F5F2EB]">US-GA-* = 7.0%</span>) so tax is automatically calculated and included in the customer’s checkout total. Reuse Mike’s existing Stripe and ShipStation extensions by enabling them on Website 2 scope.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: EXISTING WEBSITE FIXES (thepipeseller.com) */}
          {activeSection === 'existing_fixes' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#1C1917] border border-[#292524]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-display font-semibold text-[#F5F2EB]">
                    1. Mobile Logo Stretch Fix (thepipeseller.com)
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(
                        'logo-css',
                        `@media (max-width: 767px) {\n  .page-header .logo img {\n    max-width: 155px !important;\n    width: auto !important;\n    height: auto !important;\n    object-fit: contain;\n  }\n}`
                      )
                    }
                    className="px-2.5 py-1 text-[11px] bg-[#11100E] border border-[#292524] text-[#C89D54] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'logo-css' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'logo-css' ? 'Copied' : 'Copy CSS'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#11100E] border border-[#292524] text-[11px] font-mono-tabular text-[#D6D3D1] overflow-x-auto">
{`@media (max-width: 767px) {
  .page-header .logo img {
    max-width: 155px !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain;
  }
}`}
                </pre>
              </div>

              <div className="p-4 bg-[#1C1917] border border-[#292524]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-display font-semibold text-[#F5F2EB]">
                    2. Hide Prices &amp; Out-of-Stock on Legacy Website 1
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(
                        'hide-xml',
                        `<referenceBlock name="product.info.price" remove="true" />\n<referenceBlock name="product.info.addtocart" remove="true" />`
                      )
                    }
                    className="px-2.5 py-1 text-[11px] bg-[#11100E] border border-[#292524] text-[#C89D54] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'hide-xml' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'hide-xml' ? 'Copied' : 'Copy XML'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#A8A29E] mb-2">
                  Apply layout XML override to Website 1 only so legacy site acts as an archive while Website 2 sells pipes:
                </p>
                <pre className="p-3 bg-[#11100E] border border-[#292524] text-[11px] font-mono-tabular text-[#D6D3D1] overflow-x-auto">
{`<referenceBlock name="product.info.price" remove="true" />
<referenceBlock name="product.info.addtocart" remove="true" />`}
                </pre>
              </div>

              <div className="p-4 bg-[#1C1917] border border-[#292524]">
                <h3 className="text-sm font-display font-semibold text-[#F5F2EB] mb-1">
                  3. Google Maps API Billing Key (Call 01:44)
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Map feature code on existing site is healthy; once Mike enables billing in Google Cloud Console and
                  provides the active API key, paste into <span className="font-mono-tabular text-[#D6D3D1]">Stores &gt; Configuration &gt; General</span>.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: CAMPAIGNS & ACTION ITEMS */}
          {activeSection === 'campaigns' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#1C1917] border border-[#292524] space-y-2">
                <div className="text-xs font-mono-tabular text-[#C89D54]">
                  INSTAGRAM + EMAIL + GOOGLE ANALYTICS 4
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  Use <strong className="text-[#F5F2EB]">Klaviyo for Magento 2</strong> (or Mailchimp / Native Magento Newsletter) for &ldquo;Coming Soon&rdquo; email notifications with compliant 1-click unsubscribe, and track Instagram drop traffic via standard UTM parameters in Google Analytics 4 + Google Tag Manager.
                </p>
              </div>

              <div className="space-y-2.5">
                {MEETING_ACTION_ITEMS.map((item) => (
                  <div key={item.id} className="p-3.5 bg-[#1C1917] border border-[#292524]">
                    <div className="flex items-center justify-between text-[11px] text-[#C89D54] mb-1">
                      <span>{item.owner}</span>
                      <span className="font-mono-tabular text-[#A8A29E]">{item.timestampRef}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#F5F2EB]">{item.title}</div>
                    <p className="text-[11px] text-[#A8A29E] mt-1">{item.implementationDetail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#292524] bg-[#181614] flex items-center justify-between text-xs text-[#A8A29E]">
          <span>Dev Mode Side Drawer</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#292524] text-[#F5F2EB] hover:bg-[#C89D54] hover:text-[#11100E] transition-colors cursor-pointer"
          >
            Return to Client View
          </button>
        </div>
      </aside>
    </div>
  );
};
