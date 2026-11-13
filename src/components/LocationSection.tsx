import React from 'react';
import { MapPin, Phone, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER, GOOGLE_MAPS_URL, getWhatsAppUrl } from '../lib/utils';
import { useProducts } from '../context/ProductContext';

export const LocationSection: React.FC = () => {
  const { shopSettings } = useProducts();
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);

  // Official Google Maps Embed URL centered at NALLU TECH coordinates (clean embed without extra overlapping widgets)
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1955.5!2d79.1315204!3d11.541912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMyJzMwLjkiTiA3OcKwMDcnNTMuNSJF!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin`;

  return (
    <section id="location" className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Visit Our Store
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Contact & Shop Location
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Reach out by phone, message us on WhatsApp, or navigate directly to our shop on Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Shop Identity Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                  Shop Name
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {shopSettings.shop_name || 'NALLU TECH'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {shopSettings.tagline || 'Trusted Battery Solutions'} &bull; {shopSettings.experience || '15+ Years of Experience'}
                </p>
              </div>

              {/* Editable Shop Address */}
              <div className="pt-3 border-t border-gray-200/80">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Shop Address
                </span>
                {shopSettings.address && shopSettings.address.trim().length > 0 ? (
                  <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                    {shopSettings.address}
                  </p>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-slate-600">
                    <p className="font-medium text-slate-800">
                      Located at the verified Google Maps pin below.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      (Address details can be configured directly in Admin Dashboard &rarr; Settings)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Connect Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {/* Phone Dial */}
              <a
                href={`tel:${shopSettings.phone || PHONE_NUMBER}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-500/60 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-slate-500 block">Call Directly</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {shopSettings.phone || PHONE_NUMBER}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium block">Click to dial</span>
                </div>
              </a>

              {/* WhatsApp Contact */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-500/60 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-slate-500 block">WhatsApp Enquiry</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    +{shopSettings.whatsapp || WHATSAPP_NUMBER}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium block">Chat directly</span>
                </div>
              </a>
            </div>

            {/* Prominent Get Directions CTA Button */}
            <a
              href={shopSettings.maps_url || GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-lg transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions to NALLU TECH</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>
          </div>

          {/* Right Column: Google Maps View */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-slate-100">
              {/* Instant High-Resolution Map View (0ms load time - zero white delay) */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/map-preview.jpg')" }}
              >
                {/* Visual Location Pin in center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none drop-shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-red-500/30">
                    <MapPin className="w-5 h-5 fill-white" />
                  </div>
                  <div className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg mt-1.5 backdrop-blur-xs whitespace-nowrap border border-white/20">
                    NALLU TECH
                  </div>
                </div>
              </div>

              {/* Official Google Maps Interactive Layer */}
              <iframe
                title="NALLU TECH Google Maps Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={true}
                loading="eager"
                onLoad={() => setIsMapLoaded(true)}
                referrerPolicy="no-referrer-when-downgrade"
                className={`relative z-10 w-full h-full transition-opacity duration-700 ${
                  isMapLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              ></iframe>

              {/* Overlay card linking to Google Maps */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200/90 text-left">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      NALLU TECH Location
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Click below to open the exact coordinates in Google Maps app or browser.
                    </p>
                    <a
                      href={shopSettings.maps_url || GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline mt-2"
                    >
                      <span>Open Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
