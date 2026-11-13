import React from 'react';
import { SERVICES_DATA } from '../data/services';
import {
  ShoppingBag,
  RefreshCw,
  Wrench,
  Car,
  Bike,
  Zap,
  Cpu,
  ShieldAlert,
  Settings,
  Layers,
  LucideIcon,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { PHONE_NUMBER, getWhatsAppUrl } from '../lib/utils';
import { useProducts } from '../context/ProductContext';

export const ServicesSection: React.FC = () => {
  const { shopSettings } = useProducts();

  const iconMap: Record<string, LucideIcon> = {
    ShoppingBag,
    RefreshCw,
    Wrench,
    Car,
    Bike,
    Zap,
    Cpu,
    ShieldAlert,
    Tool: Settings,
    Layers,
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50 border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Professional Battery & Power Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Our Core Services
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            From emergency automotive battery replacement to in-depth inverter and UPS board repair,
            our experienced technicians deliver prompt and dependable power solutions.
          </p>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Wrench;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-700 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Tested & Verified
                  </span>
                  <a
                    href={getWhatsAppUrl(`Service: ${service.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Enquire &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Help Callout banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Need immediate assistance or battery jump-start?
            </h3>
            <p className="text-sm text-slate-600">
              Speak directly with our battery specialist for quick diagnostics and availability.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${shopSettings.phone || PHONE_NUMBER}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call {shopSettings.phone || PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
