// frontend/src/components/IVRFallbackModal.jsx
import React, { useState } from 'react';
import { PhoneCall, MessageSquare, Building2, CheckCircle2, Volume2, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function IVRFallbackModal({ isOpen, onClose, lang, t, onBookingCreated }) {
  const [simulating, setSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [callerMobile, setCallerMobile] = useState('9812349900');
  const [selectedCrop, setSelectedCrop] = useState('WHEAT');
  const [quantity, setQuantity] = useState('30');

  if (!isOpen) return null;

  const handleSimulateCall = async () => {
    setSimulating(true);
    setSimulatedResult(null);
    try {
      const res = await api.simulateIvrBooking({
        mobile: callerMobile,
        centreId: 'KRN-01',
        cropId: selectedCrop,
        quantity: parseFloat(quantity) || 25
      });
      setSimulatedResult(res);
      if (onBookingCreated) {
        onBookingCreated(res.token);
      }
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <PhoneCall className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {t.ivrHeroTitle}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {t.ivrHeroSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Method 1: IVR Voice Call */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 transition-all hover:shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg mt-0.5">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    {t.ivrFeature1Title}
                  </h4>
                  <span className="bg-amber-200/80 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded">
                    Toll-Free 24x7
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {t.ivrFeature1Desc}
                </p>
                <div className="mt-3 bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between">
                  <div className="font-mono text-sm font-bold text-amber-950 flex items-center space-x-2">
                    <span className="text-lg">📞</span>
                    <span>1800-180-26032</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Hindi / English / Punjabi / Telugu
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Method 2: 2-Way SMS Service */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 transition-all hover:shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-sky-600 text-white rounded-lg mt-0.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    {t.ivrFeature2Title}
                  </h4>
                  <span className="bg-sky-200/80 text-sky-900 text-xs font-semibold px-2 py-0.5 rounded">
                    No Internet Required
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {t.ivrFeature2Desc}
                </p>
                <div className="mt-3 bg-white p-3 rounded-lg border border-sky-200 font-mono text-xs text-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">SMS Format: </span>
                    <strong className="text-sky-700">BOOK KRN WHEAT 40 2026-08-31</strong>
                  </div>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                    To: 56070
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Method 3: Gram Panchayat CSC Center */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 transition-all hover:shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-base">
                  {t.ivrFeature3Title}
                </h4>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {t.ivrFeature3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="border-t border-slate-200 pt-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {lang === 'ta'
                    ? 'IVR தானியங்கி முன்பதிவு டெமோ (செயலிழப்பு முறை)'
                    : lang === 'hi'
                    ? 'आईवीआर स्वचालित बुकिंग सिमुलेशन (डेमो)'
                    : 'Interactive IVR Call Simulation (Demo)'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">
                    {lang === 'ta' ? 'அழைப்பாளர் கைபேசி எண்' : lang === 'hi' ? 'कॉलर मोबाइल नंबर' : 'Caller Mobile'}
                  </label>
                  <input
                    type="text"
                    value={callerMobile}
                    onChange={(e) => setCallerMobile(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">
                    {lang === 'ta' ? 'பயிர்' : lang === 'hi' ? 'फसल' : 'Crop'}
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="WHEAT">{lang === 'ta' ? 'கோதுமை (Wheat)' : 'Wheat (गेहूं)'}</option>
                    <option value="PADDY">{lang === 'ta' ? 'நெல் / சம்பா (Paddy)' : 'Paddy (धान)'}</option>
                    <option value="MUSTARD">{lang === 'ta' ? 'கடுகு (Mustard)' : 'Mustard (सरसों)'}</option>
                    <option value="GRAM">{lang === 'ta' ? 'கொண்டைக்கடலை (Gram)' : 'Gram (चना)'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">
                    {lang === 'ta' ? 'அளவு (குவிண்டால்)' : lang === 'hi' ? 'मात्रा (क्विंटल)' : 'Quantity (Qtl)'}
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulateCall}
                disabled={simulating}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-50"
              >
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>
                  {simulating 
                    ? (lang === 'ta' ? 'குரல் அழைப்பு இணைக்கப்படுகிறது...' : lang === 'hi' ? 'कॉल कनेक्ट हो रही है...' : 'Simulating Voice Call & Slot Allocation...') 
                    : (lang === 'ta' ? 'கட்டணமில்லா IVR அழைப்பை இயக்கி டோக்கன் பெறவும்' : lang === 'hi' ? 'टोल-फ्री IVR कॉल सिमुलेट करें और टोकन बनाएं' : 'Simulate Toll-Free IVR Call Booking')}
                </span>
              </button>

              {simulatedResult && (
                <div className="mt-4 p-3.5 bg-emerald-100 border border-emerald-300 rounded-xl animate-fadeIn">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>
                      {lang === 'ta' ? 'IVR நேர ஒதுக்கீடு வெற்றிகரமாக முடிந்தது!' : lang === 'hi' ? 'IVR स्लॉट सफलतापूर्वक बुक हुआ!' : 'IVR Voice Booking Generated Successfully!'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-emerald-950 font-mono space-y-1 bg-white/70 p-2.5 rounded-lg border border-emerald-200">
                    <p><strong>Token:</strong> {simulatedResult.token}</p>
                    <p><strong>Mandi:</strong> {simulatedResult.centreName}</p>
                    <p><strong>Slot:</strong> {simulatedResult.slotTimeRange}</p>
                    <p><strong>SMS Sent:</strong> "{simulatedResult.smsLog?.[0]?.message || 'Slot confirmed'}"</p>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-2 italic">
                    {lang === 'ta'
                      ? '✓ இந்த டோக்கன் நேரடியாக நேரலை வரிசைக் கண்காணிப்பில் ஏற்றப்பட்டது.'
                      : lang === 'hi' 
                      ? '✓ टोकन को मुख्य ट्रैकर में स्वतः लोड कर दिया गया है।'
                      : '✓ Token has been automatically loaded into the Live Queue Tracker tab.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm py-2 px-5 rounded-xl transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
