import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Phone,
  Zap,
  Battery,
  Cpu,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import { PHONE_NUMBER } from '../lib/utils';
import { useProducts } from '../context/ProductContext';

const SLIDES = [
  {
    image: '/images/slider/slide-1.jpg',
    title: 'NALLU TECH Power Solutions',
    subtitle: 'Powering Every Journey, Every Home',
    badge: 'Flagship Store',
    position: 'object-center',
  },
  {
    image: '/images/slider/slide-2.jpg',
    title: 'Battery & Vehicle Services',
    subtitle: 'Testing, Diagnostics & EV/Auto Service',
    badge: 'Expert Service',
    position: 'object-center',
  },
  {
    image: '/images/slider/slide-3.jpg',
    title: '15+ Years of Customer Trust',
    subtitle: 'Meet Our Shop & Dedicated Team',
    badge: 'Owner Verified',
    position: 'object-[center_20%]',
  },
  {
    image: '/images/slider/slide-4.jpg',
    title: 'NALLU BATTERY Solutions',
    subtitle: 'Longer Life & Reliable Performance',
    badge: 'High Backup',
    position: 'object-[center_30%]',
  },
];

export const Hero: React.FC = () => {
  const { shopSettings } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance slider every 3.0 seconds
  useEffect(() => {
    if (isHovered || fullscreenImage !== null) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered, fullscreenImage]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-gray-50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-gray-100">
      {/* Background pattern elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Highlights pills */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {shopSettings.experience || '15+ Years of Experience'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-emerald-300 border border-slate-800 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                {shopSettings.tagline || 'Trusted Battery Solutions'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Powering Every Journey, <br />
              <span className="text-emerald-700">Every Home.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Your one-stop destination for automotive batteries, two-wheeler batteries, heavy vehicle power,
              pure sine wave inverters, and commercial UPS systems. Genuine products, backed by expert
              replacement and repair service.
            </p>

            {/* Key Value Points */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Genuine Brand Batteries</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quick Model Fitment</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Expert Inverter Repair</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-hidden"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl shadow-2xs hover:shadow-sm transition-all focus:outline-hidden"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase with Auto-Sliding Images */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Card */}
              <div className="rounded-2xl overflow-hidden bg-white border border-gray-200/90 shadow-xl shadow-gray-200/50 p-6 space-y-6">
                
                {/* Image Slider Container with Full-Ratio Coverage */}
                <div
                  className="relative h-72 sm:h-80 lg:h-[340px] rounded-xl overflow-hidden bg-slate-950 group select-none shadow-inner"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Slider Track with Smooth Sliding Transition */}
                  <div
                    className="flex h-full w-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {SLIDES.map((slide, idx) => (
                      <div
                        key={idx}
                        className="min-w-full h-full relative cursor-pointer overflow-hidden"
                        onClick={() => setFullscreenImage(slide.image)}
                      >
                        {/* Edge-to-edge full ratio image cover */}
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className={`w-full h-full object-cover ${slide.position} group-hover:scale-105 transition-transform duration-700`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Gradient overlay for bottom captions and top buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none z-20"></div>

                  {/* Top Right: Fullscreen View & Slide Dots */}
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFullscreenImage(SLIDES[currentSlide].image)}
                      title="View Fullscreen"
                      aria-label="View Fullscreen"
                      className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1.5 rounded-full backdrop-blur-xs">
                      {SLIDES.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setCurrentSlide(dotIdx)}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentSlide === dotIdx
                              ? 'w-4 bg-emerald-400'
                              : 'w-1.5 bg-white/60 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Captions & Active Slide Badge */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white z-30 pointer-events-none">
                    <div className="max-w-[75%]">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block drop-shadow-sm">
                        {SLIDES[currentSlide].title}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-sm">
                        {SLIDES[currentSlide].subtitle}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-md">
                      {SLIDES[currentSlide].badge}
                    </span>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    aria-label="Previous slide"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 border border-white/20 shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    aria-label="Next slide"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 border border-white/20 shadow-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub-cards row */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-center">
                    <Battery className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Vehicles</span>
                    <span className="text-[10px] text-slate-500">Cars & Bikes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-center">
                    <Zap className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Inverters</span>
                    <span className="text-[10px] text-slate-500">Sine Wave Home</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-center">
                    <Cpu className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">UPS Systems</span>
                    <span className="text-[10px] text-slate-500">Office & Retail</span>
                  </div>
                </div>

                {/* Quick direct line info */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block uppercase tracking-wider">
                        Quick Assistance
                      </span>
                      <span className="text-sm font-bold text-slate-900">{shopSettings.phone || PHONE_NUMBER}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${shopSettings.phone || PHONE_NUMBER}`}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              {/* Notice: Floating "Direct Battery Service / Doorstep delivery & installation" badge has been completely removed as requested */}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal Lightbox */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen View"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
