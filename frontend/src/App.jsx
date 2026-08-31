// frontend/src/App.jsx
import React, { useState } from 'react';
import {
  Wheat, Building2, PhoneCall, Languages, Shield, CheckCircle,
  HelpCircle, ExternalLink, Sparkles, User, RefreshCw
} from 'lucide-react';
import { translations } from './i18n';
import FarmerPortal from './components/FarmerPortal';
import StaffDashboard from './components/StaffDashboard';
import IVRFallbackModal from './components/IVRFallbackModal';

export default function App() {
  const [currentView, setCurrentView] = useState('farmer'); // 'farmer' | 'staff'
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [isIvrModalOpen, setIsIvrModalOpen] = useState(false);
  const [ivrCreatedToken, setIvrCreatedToken] = useState(null);

  const t = translations[lang] || translations.en;

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleIvrBookingCreated = (token) => {
    setIvrCreatedToken(token);
    setCurrentView('farmer');
    setIsIvrModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-emerald-200">
      {/* Top Tricolor Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Main Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Logo & National Brand */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                  <Wheat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      DoCA • Govt of India
                    </span>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-mono text-emerald-400">
                      PS #26032
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                    {t.appTitle}
                  </h1>
                </div>
              </div>

              {/* Mobile Language Selector */}
              <div className="flex md:hidden items-center">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="px-2 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg border border-slate-700 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
            </div>

            {/* Navigation Switcher & Tools */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full md:w-auto">
              {/* Role Switcher Pill */}
              <div className="bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80 flex items-center shadow-inner">
                <button
                  onClick={() => setCurrentView('farmer')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                    currentView === 'farmer'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t.farmerPortal}</span>
                </button>
                <button
                  onClick={() => setCurrentView('staff')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                    currentView === 'staff'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t.staffDashboard}</span>
                </button>
              </div>

              {/* IVR Helpline Trigger */}
              <button
                onClick={() => setIsIvrModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition-all"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>{t.offlineHelp}</span>
              </button>

              {/* Desktop 3-Language Selector */}
              <div className="hidden md:flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <Languages className="w-4 h-4 text-emerald-400 ml-1.5 mr-0.5" />
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'ta', label: 'தமிழ்' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      lang === item.code
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'farmer' ? (
          <FarmerPortal
            lang={lang}
            t={t}
            onOpenIVR={() => setIsIvrModalOpen(true)}
            activeTokenFromIVR={ivrCreatedToken}
          />
        ) : (
          <StaffDashboard lang={lang} t={t} />
        )}
      </main>

      {/* Offline IVR Modal */}
      <IVRFallbackModal
        isOpen={isIvrModalOpen}
        onClose={() => setIsIvrModalOpen(false)}
        lang={lang}
        t={t}
        onBookingCreated={handleIvrBookingCreated}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-semibold text-slate-200">{t.copyright}</div>
            <p className="text-slate-500 mt-0.5">{t.techStack}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-[11px] font-mono text-emerald-400 border border-slate-700">
              SIH 2026 • PS ID 26032
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
