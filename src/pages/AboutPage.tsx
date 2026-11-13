import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { ShieldCheck, Target, HeartHandshake } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export const AboutPage: React.FC = () => {
  const { shopSettings } = useProducts();

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800 mb-3 inline-block">
            {shopSettings.experience || '15+ Years of Experience'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-2">
            About NALLU TECH
          </h1>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            {shopSettings.tagline || 'Trusted Battery Solutions'} &bull; Dedicated to reliable power for vehicles,
            homes, and businesses.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <AboutSection />

      {/* Focus & Values (Strictly respecting instructions: no fake reviews, no fake awards) */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              How we approach every battery installation and inverter consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Right Capacity Matching</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We recommend batteries and inverters specifically calculated for your real electrical loads,
                avoiding undersized draining or unnecessary expensive oversizing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Authentic Stock</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All inventory is sourced fresh from official supply channels, carrying complete manufacturer
                paperwork and standard manufacturer warranty periods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Long-term Relationship</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We support our customers long after the sale with complimentary terminal inspections,
                distilled water top-up guidance, and hassle-free warranty claims.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

