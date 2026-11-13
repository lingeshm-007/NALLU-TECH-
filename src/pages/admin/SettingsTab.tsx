import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Save, ExternalLink, MapPin, Phone, MessageCircle, Building2 } from 'lucide-react';

export const SettingsTab: React.FC<{ onSaved: (msg: string) => void }> = ({ onSaved }) => {
  const { shopSettings, updateShopSettings } = useProducts();

  const [shopName, setShopName] = useState(shopSettings.shop_name);
  const [tagline, setTagline] = useState(shopSettings.tagline);
  const [experience, setExperience] = useState(shopSettings.experience);
  const [phone, setPhone] = useState(shopSettings.phone);
  const [whatsapp, setWhatsapp] = useState(shopSettings.whatsapp);
  const [mapsUrl, setMapsUrl] = useState(shopSettings.maps_url);
  const [address, setAddress] = useState(shopSettings.address || '');

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updateShopSettings({
      shop_name: shopName.trim(),
      tagline: tagline.trim(),
      experience: experience.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      maps_url: mapsUrl.trim(),
      address: address.trim(),
    });

    setSaving(false);
    if (res.success) {
      onSaved('Shop settings and address saved successfully.');
    } else {
      alert(res.error || 'Failed to save shop settings.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 sm:p-8 max-w-4xl">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          Store Configuration
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
          Shop Address & Contact Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Changes made here are permanently saved and instantly reflected across all website sections,
          call buttons, WhatsApp triggers, and the footer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Editable Address Section (Highlighted as per requirement) */}
        <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <label className="text-sm font-bold text-slate-900">
              Editable Physical Shop Address
            </label>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your exact shop door number, street, landmark, and pin code here. This address will
            appear in the Contact & Location section and the website footer.
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Door No. 12, Main Road, Near Bus Stand, Landmark..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 bg-white text-slate-900"
          ></textarea>
        </div>

        {/* Shop Name & Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Shop Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Business Experience
            </label>
            <input
              type="text"
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
            />
          </div>
        </div>

        {/* Phone & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number (For Dialler)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              WhatsApp Number
            </label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="918248949759"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Google Maps Location URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Google Maps URL
            </label>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <span>Test Google Maps Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="url"
            required
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
          />
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
