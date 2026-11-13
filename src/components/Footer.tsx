import React from 'react';
import { Link } from 'react-router-dom';
import { BatteryCharging, Phone, MessageCircle, MapPin, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { PHONE_NUMBER, GOOGLE_MAPS_URL, getWhatsAppUrl } from '../lib/utils';
import { useProducts } from '../context/ProductContext';
import { PRODUCT_CATEGORIES } from '../types';

export const Footer: React.FC = () => {
  const { shopSettings } = useProducts();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">NALLU TECH</span>
                <p className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                  {shopSettings.tagline || 'Trusted Battery Solutions'}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Powering every journey, home, and business. With 15+ years of trusted experience, we provide
              genuine batteries, high-performance inverters, and professional UPS systems.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700/80 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{shopSettings.experience || '15+ Years of Experience'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> All Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Services & Repairs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> About NALLU TECH
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></span>
                    <span>{cat}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products"
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 pt-1"
                >
                  View all categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact & Location</h3>

            <div className="space-y-3 text-sm">
              <a
                href={`tel:${shopSettings.phone || PHONE_NUMBER}`}
                className="flex items-start gap-3 hover:text-emerald-400 transition-colors group"
              >
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs text-slate-400">Direct Call</span>
                  <span className="font-medium text-white group-hover:text-emerald-400">
                    {shopSettings.phone || PHONE_NUMBER}
                  </span>
                </div>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-emerald-400 transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs text-slate-400">WhatsApp Chat</span>
                  <span className="font-medium text-white group-hover:text-emerald-400">
                    +{shopSettings.whatsapp || '91 8248949759'}
                  </span>
                </div>
              </a>

              <a
                href={shopSettings.maps_url || GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-emerald-400 transition-colors group"
              >
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs text-slate-400">Shop Location</span>
                  <span className="font-medium text-emerald-400 inline-flex items-center gap-1 group-hover:underline">
                    View on Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </span>
                  {shopSettings.address && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{shopSettings.address}</p>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright Bar */}
      <div className="border-t border-slate-800 bg-slate-950/70 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-slate-300">NALLU TECH</strong>. All rights
            reserved. Trusted Battery Solutions.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              About Us
            </Link>
            <Link to="/services" className="hover:text-slate-300 transition-colors">
              Services
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Location
            </Link>
            <Link to="/admin/login" className="hover:text-emerald-400 text-slate-500 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

