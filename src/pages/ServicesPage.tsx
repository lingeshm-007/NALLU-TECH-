import React from 'react';
import { ServicesSection } from '../components/ServicesSection';
import { ShieldCheck, Wrench, CheckCircle, PhoneCall, MessageCircle } from 'lucide-react';
import { PHONE_NUMBER, getWhatsAppUrl } from '../lib/utils';
import { useProducts } from '../context/ProductContext';

export const ServicesPage: React.FC = () => {
  const { shopSettings } = useProducts();

  return (
    <div className="bg-white">
      {/* Services Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
            <Wrench className="w-3.5 h-3.5" />
            <span>Expert Technical Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Battery & Inverter Services
          </h1>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Professional diagnostic testing, fast on-site replacement, jump-start assistance,
            and component-level repair for power inverters and commercial UPS systems.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${shopSettings.phone || PHONE_NUMBER}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call For Service: {shopSettings.phone || PHONE_NUMBER}</span>
            </a>
            <a
              href={getWhatsAppUrl('Service Enquiry')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Diagnostic Request</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main 10 Services Listing */}
      <ServicesSection />

      {/* Quality Commitment Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 sm:p-12 border border-emerald-200">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-emerald-700 mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Work Ethic & Service Standard
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                With 15+ years of hands-on expertise, every service job at NALLU TECH begins with honest
                diagnostics. If a battery is healthy and merely needs recharging, we will never push for an
                unnecessary replacement.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    Accurate Testing
                  </div>
                  <p className="text-xs text-slate-600">
                    High-rate discharge and digital load testing to verify true cranking amps.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    Clean Terminal Fitment
                  </div>
                  <p className="text-xs text-slate-600">
                    Sulphate clearing, anti-corrosion petroleum gel coating, and secure torque fitting.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    Old Battery Exchange
                  </div>
                  <p className="text-xs text-slate-600">
                    Generous scrap rebate discounts when replacing your existing worn-out battery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

