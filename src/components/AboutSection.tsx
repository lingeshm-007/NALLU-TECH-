import React from 'react';
import { Shield, Clock, BatteryMedium, Cpu, CheckCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export const AboutSection: React.FC = () => {
  const { shopSettings } = useProducts();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-gray-200 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Battery and Inverter Workshop"
                className="w-full h-80 sm:h-96 object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>

              {/* Float badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-lg text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shrink-0">
                    15+
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Years in Business</h4>
                    <p className="text-xs text-slate-500">
                      Serving vehicle owners, homeowners, and commercial enterprises.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>About NALLU TECH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Dedicated to Long-Lasting Power & Customer Trust
            </h2>

            {/* Exactly as requested in prompt */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal bg-emerald-50/40 p-5 rounded-xl border border-emerald-100">
              “NALLU TECH provides battery, UPS and inverter solutions for different customer needs. With 15+ years
              of experience, we focus on providing trusted products and reliable battery-related services for
              homes, vehicles and businesses.”
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <BatteryMedium className="w-4 h-4 text-emerald-600" />
                  <span>Genuine Products</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We supply factory-fresh batteries with authentic manufacturer warranty cards and direct
                  replacement support.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{shopSettings.experience || '15+ Years Experience'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In-depth practical diagnostic knowledge across automotive electricals, tubular batteries,
                  and UPS charging circuits.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Skilled Technical Service</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Precision inverter PCB repairs, battery desulphation testing, electrolyte balancing, and
                  terminal restoration.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Transparent Advice</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear recommendations on whether a battery only needs recharging or requires genuine
                  replacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

