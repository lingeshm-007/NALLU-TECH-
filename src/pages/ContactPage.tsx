import React, { useState } from 'react';
import { LocationSection } from '../components/LocationSection';
import { Send, ShieldCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../lib/utils';
import { useProducts } from '../context/ProductContext';

export const ContactPage: React.FC = () => {
  const { shopSettings } = useProducts();
  const [customerName, setCustomerName] = useState('');
  const [vehicleOrAppliance, setVehicleOrAppliance] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');

  const handleQuickWhatsAppEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    let text = 'Hello NALLU TECH, ';
    if (customerName.trim()) {
      text += `My name is ${customerName.trim()}. `;
    }
    if (vehicleOrAppliance.trim()) {
      text += `I am looking for a battery/inverter for: ${vehicleOrAppliance.trim()}. `;
    }
    if (enquiryMessage.trim()) {
      text += `Enquiry: ${enquiryMessage.trim()}`;
    } else {
      text += 'I would like to enquire about your battery products and pricing.';
    }

    const url = `https://wa.me/${shopSettings.whatsapp || WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800 mb-3 inline-block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
            Contact & Shop Location
          </h1>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            Have questions about battery fitment, inverter capacity, or repair diagnostics? Reach us
            instantly via phone call or WhatsApp message.
          </p>
        </div>
      </section>

      {/* Main Location Section */}
      <LocationSection />

      {/* Quick Direct Message Formulation Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Direct WhatsApp Enquiry
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                Send a Direct Battery or Inverter Request
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Fill out the quick fields below and it will open WhatsApp with your customized details pre-filled.
              </p>
            </div>

            <form onSubmit={handleQuickWhatsAppEnquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Vehicle or Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maruti Swift / Activa 6G / Home 150Ah Inverter"
                    value={vehicleOrAppliance}
                    onChange={(e) => setVehicleOrAppliance(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message / Question
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please let me know the price and availability for battery replacement."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>No login required &bull; Direct WhatsApp connection</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
