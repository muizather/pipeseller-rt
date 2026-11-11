import React, { useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, SunMedium } from 'lucide-react';

export interface PhotoAngleOption {
  label: string;
  imageUrl: string;
  objectPosition?: string;
  scalePreset?: number;
}

interface ProductPhotoViewerProps {
  imageUrl: string;
  alt: string;
  angles?: PhotoAngleOption[];
  enableCustomerControls?: boolean;
  className?: string;
  imageHeightClass?: string;
}

/**
 * Displays the uploaded product photograph from Magento backend
 * with optional multi-angle thumbnail selector and customer-facing gallery enhancements
 * (Interactive 2x Loupe Grain Zoom and Gallery Warmth Lighting).
 */
export const ProductPhotoViewer: React.FC<ProductPhotoViewerProps> = ({
  imageUrl,
  alt,
  angles,
  enableCustomerControls = false,
  className = '',
  imageHeightClass = 'h-64'
}) => {
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [studioLightMode, setStudioLightMode] = useState<'gallery_warm' | 'natural'>('gallery_warm');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setActiveAngleIdx(0);
    setIsZoomed(false);
    setImgError(false);
  }, [imageUrl]);

  const activePhotoUrl =
    angles && angles.length > 0 && angles[activeAngleIdx]
      ? angles[activeAngleIdx].imageUrl
      : imageUrl;

  const activeObjectPosition =
    angles && angles.length > 0 && angles[activeAngleIdx]?.objectPosition
      ? angles[activeAngleIdx].objectPosition
      : 'center center';

  const activeBaseScale =
    angles && angles.length > 0 && angles[activeAngleIdx]?.scalePreset
      ? angles[activeAngleIdx].scalePreset
      : 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-3">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
        className={`relative overflow-hidden bg-[#171513] select-none group ${imageHeightClass} ${className}`}
      >
        {!imgError ? (
          <img
            src={activePhotoUrl}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={
              isZoomed
                ? {
                    objectPosition: activeObjectPosition,
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: 'scale(2.15)'
                  }
                : {
                    objectPosition: activeObjectPosition,
                    transform: activeBaseScale !== 1 ? `scale(${activeBaseScale})` : undefined
                  }
            }
            className={`w-full h-full object-cover transition-transform duration-300 ease-out ${
              !isZoomed && activeBaseScale === 1 ? 'group-hover:scale-[1.03]' : ''
            } ${isZoomed ? 'cursor-zoom-out' : ''} ${
              studioLightMode === 'gallery_warm'
                ? 'brightness-95 contrast-110 saturate-95'
                : 'brightness-100 contrast-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#181614] p-6 text-center">
            <div className="text-xs font-mono-tabular text-[#C89D54] mb-1">MAGENTO MEDIA GALLERY</div>
            <div className="text-sm font-display text-[#F5F2EB]">{alt}</div>
          </div>
        )}

        {/* Subtle Gallery Vignette to Harmonize Different Artist Photo Backgrounds */}
        {studioLightMode === 'gallery_warm' && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(200,157,84,0.06) 0%, rgba(17,16,14,0.22) 65%, rgba(17,16,14,0.68) 100%)'
            }}
          />
        )}

        {/* Angle Caption Badge */}
        {enableCustomerControls && angles && angles[activeAngleIdx] && (
          <div className="pointer-events-none absolute top-3 left-3 px-2.5 py-1 bg-[#11100E]/85 backdrop-blur-xs border border-[#292524] text-[11px] font-mono-tabular text-[#D6D3D1]">
            0{activeAngleIdx + 1} / 0{angles.length} · {angles[activeAngleIdx].label}
          </div>
        )}

        {/* Customer-Facing Photo Enhancement Controls (shown on Product Detail view) */}
        {enableCustomerControls && (
          <div
            className="absolute bottom-3 right-3 z-10 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setStudioLightMode((prev) => (prev === 'gallery_warm' ? 'natural' : 'gallery_warm'))
              }
              className="px-2.5 py-1.5 text-[11px] font-medium bg-[#11100E]/85 backdrop-blur-xs border border-[#292524] text-[#D6D3D1] hover:text-[#F5F2EB] hover:border-[#C89D54] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Switch between Gallery Mat Lighting and Raw Uploaded Photo"
            >
              <SunMedium className="w-3.5 h-3.5 text-[#C89D54]" />
              <span>{studioLightMode === 'gallery_warm' ? 'Gallery Lighting' : 'Original Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="px-2.5 py-1.5 text-[11px] font-medium bg-[#11100E]/85 backdrop-blur-xs border border-[#292524] text-[#D6D3D1] hover:text-[#F5F2EB] hover:border-[#C89D54] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5 text-[#C89D54]" />
                  <span>Reset Zoom</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5 text-[#C89D54]" />
                  <span>Inspect Grain (2x)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Multi-Angle Thumbnail Strip (when enabled on Product Detail Page) */}
      {enableCustomerControls && angles && angles.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {angles.map((angle, idx) => {
            const isSelected = idx === activeAngleIdx;
            return (
              <button
                key={angle.label}
                type="button"
                onClick={() => {
                  setActiveAngleIdx(idx);
                  setIsZoomed(false);
                }}
                className={`group text-left border transition-colors cursor-pointer bg-[#181614] overflow-hidden ${
                  isSelected
                    ? 'border-[#C89D54]'
                    : 'border-[#292524] opacity-75 hover:opacity-100 hover:border-[#A8A29E]'
                }`}
              >
                <div className="h-16 sm:h-20 w-full overflow-hidden bg-[#11100E]">
                  <img
                    src={angle.imageUrl}
                    alt={angle.label}
                    referrerPolicy="no-referrer"
                    style={{
                      objectPosition: angle.objectPosition || 'center center',
                      transform: angle.scalePreset ? `scale(${angle.scalePreset})` : undefined
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-2 py-1.5 text-[10px] font-mono-tabular text-[#D6D3D1] truncate border-t border-[#292524]">
                  {angle.label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
