// frontend/src/components/FarmerPortal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Clock, CheckCircle, AlertTriangle, Shield, Truck,
  CheckCircle2, ArrowRight, RefreshCw, Smartphone, PhoneCall,
  FileText, IndianRupee, QrCode, Search, User, MapPin, Scale,
  Layers, Check, Sparkles, AlertCircle, Eye
} from 'lucide-react';
import { api } from '../api';
import { getCropDisplayName, getCentreDisplayName } from '../i18n';

const STATUS_STEPS = [
  { key: 'SLOT_BOOKED', icon: Calendar, step: 1 },
  { key: 'ARRIVED', icon: Truck, step: 2 },
  { key: 'QUALITY_CHECK', icon: Scale, step: 3 },
  { key: 'PROCURED', icon: CheckCircle2, step: 4 },
  { key: 'PAYMENT_CREDITED', icon: IndianRupee, step: 5 }
];

export default function FarmerPortal({ lang, t, onOpenIVR, activeTokenFromIVR }) {
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'track' | 'ivr'
  
  // Data lists
  const [centres, setCentres] = useState([]);
  const [crops, setCrops] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Booking Form State
  const [formData, setFormData] = useState({
    farmerName: '',
    mobile: '',
    aadhaarLast4: '',
    cropId: 'WHEAT',
    quantity: '40',
    centreId: 'KRN-01',
    date: new Date().toISOString().split('T')[0],
    slotId: 'SLOT-2'
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [newlyCreatedToken, setNewlyCreatedToken] = useState(null);

  // Tracking State
  const [searchQuery, setSearchQuery] = useState('DOCA-KRN-104');
  const [activeBooking, setActiveBooking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  // Load centres & crops on mount
  useEffect(() => {
    async function initData() {
      try {
        const [cList, crList] = await Promise.all([
          api.getCentres(),
          api.getCrops()
        ]);
        setCentres(cList);
        setCrops(crList);
        if (cList.length > 0) {
          loadSlots(cList[0].id, formData.date);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    initData();
  }, []);

  // When IVR simulation creates a token, switch to tracker and load it
  useEffect(() => {
    if (activeTokenFromIVR) {
      setSearchQuery(activeTokenFromIVR);
      setActiveTab('track');
      fetchBookingDetails(activeTokenFromIVR);
    }
  }, [activeTokenFromIVR]);

  // Load slots whenever centre or date changes
  const loadSlots = async (centreId, date) => {
    try {
      const slotList = await api.getCentreSlots(centreId, date);
      setSlots(slotList);
      if (slotList.length > 0 && !slotList.some(s => s.id === formData.slotId)) {
        const firstAvailable = slotList.find(s => s.status !== 'FULL') || slotList[0];
        setFormData(prev => ({ ...prev, slotId: firstAvailable.id }));
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    }
  };

  const handleCentreChange = (centreId) => {
    setFormData(prev => ({ ...prev, centreId }));
    loadSlots(centreId, formData.date);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    loadSlots(formData.centreId, date);
  };

  // Auto-fill demo details for rapid evaluator testing
  const fillDemoData = () => {
    const demoProfiles = [
      { name: 'M. Subramanian (மு. சுப்பிரமணியன்)', mobile: '9840123456', aadhaar: '8832', crop: 'PADDY', qty: '50' },
      { name: 'Sukhwinder Singh (ਸੁਖਵਿੰਦਰ ਸਿੰਘ)', mobile: '9872199882', aadhaar: '7721', crop: 'WHEAT', qty: '45' },
      { name: 'Rajendra Prasad Patel (राजेन्द्र प्रसाद पटेल)', mobile: '9425112345', aadhaar: '3312', crop: 'GRAM', qty: '30' },
      { name: 'Harishankar Meena (हरिशंकर मीणा)', mobile: '9829044556', aadhaar: '9045', crop: 'MUSTARD', qty: '25' },
      { name: 'Venkata Ramanujam (వెంకట రామానుజం)', mobile: '9848033221', aadhaar: '5561', crop: 'PADDY', qty: '40' }
    ];
    const p = demoProfiles[Math.floor(Math.random() * demoProfiles.length)];
    setFormData(prev => ({
      ...prev,
      farmerName: p.name,
      mobile: p.mobile,
      aadhaarLast4: p.aadhaar,
      cropId: p.crop,
      quantity: p.qty
    }));
  };

  // Submit Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingLoading(true);

    try {
      const res = await api.createBooking(formData);
      setNewlyCreatedToken(res);
      setSearchQuery(res.token);
      setActiveBooking(res);
      // Reload slots to reflect updated capacity
      loadSlots(formData.centreId, formData.date);
    } catch (err) {
      setBookingError(err.message || 'Failed to book slot');
    } finally {
      setBookingLoading(false);
    }
  };

  // Track Booking
  const fetchBookingDetails = async (tokenOrMobile, silent = false) => {
    if (!tokenOrMobile) return;
    if (!silent) setTrackingLoading(true);
    setTrackingError('');

    try {
      const data = await api.getBookingByToken(tokenOrMobile);
      setActiveBooking(data);
    } catch (err) {
      if (!silent) {
        setTrackingError(err.message || 'No booking found matching this token');
        setActiveBooking(null);
      }
    } finally {
      if (!silent) setTrackingLoading(false);
    }
  };

  // Initial load of demo tracker
  useEffect(() => {
    fetchBookingDetails('DOCA-KRN-104', true);
  }, []);

  // Real-Time Polling Hook: Poll every 3 seconds for live updates
  useEffect(() => {
    if (!activeBooking?.token || activeTab !== 'track') return;

    const interval = setInterval(async () => {
      try {
        setIsAutoSyncing(true);
        const latest = await api.getBookingByToken(activeBooking.token);
        setActiveBooking(latest);
      } catch (e) {
        // Silent fail during background polling
      } finally {
        setTimeout(() => setIsAutoSyncing(false), 600);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBooking?.token, activeTab]);

  // Selected crop details for MSP calculation
  const selectedCropObj = crops.find(c => c.id === formData.cropId);
  const selectedCropMsp = selectedCropObj ? selectedCropObj.msp : 2275;
  const estimatedTotalPayout = (parseFloat(formData.quantity) || 0) * selectedCropMsp;

  // Compute step active index
  const getStepIndex = (status) => {
    const map = {
      'SLOT_BOOKED': 1,
      'ARRIVED': 2,
      'QUALITY_CHECK': 3,
      'PROCURED': 4,
      'PAYMENT_CREDITED': 5
    };
    return map[status] || 1;
  };

  const currentStepIndex = activeBooking ? getStepIndex(activeBooking.status) : 1;

  return (
    <div className="space-y-6">
      {/* Top Banner for Offline Support */}
      <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3 text-slate-800">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm flex-shrink-0">
            <PhoneCall className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {lang === 'ta' ? 'ஸ்மார்ட்போன் இல்லையா? கவலை வேண்டாம்!' : lang === 'hi' ? 'स्मार्टफोन नहीं है? चिंता न करें!' : 'No Smartphone? No Problem!'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              {lang === 'ta'
                ? 'கட்டணமில்லா எண் 1800-180-26032 ஐ அழைக்கவும் அல்லது 56070 க்கு SMS அனுப்பி நேரத்தை முன்பதிவு செய்யவும்.'
                : lang === 'hi'
                ? 'टोल-फ्री नंबर 1800-180-26032 पर डायल करें या 56070 पर एसएमएस भेजकर तुरंत स्लॉट बुक करें।'
                : 'Dial Toll-Free 1800-180-26032 or SMS 56070 for instant automated voice slot booking.'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenIVR}
          className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <span>{lang === 'ta' ? 'IVR வழிகாட்டியைப் பார்க்கவும்' : lang === 'hi' ? 'आईवीआर डेमो देखें' : 'View IVR / SMS Guide'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl shadow-inner max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'book'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.tabBookSlot}</span>
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'track'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.tabTrackToken}</span>
          {activeBooking && (
            <span className="ml-1 px-1.5 py-0.5 bg-emerald-900/50 text-[10px] rounded-full">
              Live
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: BOOK SLOT FORM */}
      {activeTab === 'book' && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-700/60 rounded-full text-xs font-semibold text-emerald-200 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'விரைவு மண்டி முன்பதிவு' : lang === 'hi' ? 'सुगम मंडी बुकिंग' : 'Fast-Track Mandi Allocation'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">{t.bookingTitle}</h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                {t.bookingSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>⚡</span>
              <span>{t.autoFillDemo}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-6">
            {bookingError && (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Section 1: Farmer Credentials */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ta' ? '1. விவசாயி விவரங்கள்' : lang === 'hi' ? '1. किसान विवरण' : '1. Farmer Identification'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.farmerNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.farmerName}
                    onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                    placeholder={t.farmerNamePlaceholder}
                    className="w-full text-sm font-medium border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.mobileLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder={t.mobilePlaceholder}
                    className="w-full text-sm font-mono border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.aadhaarLabel}
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.aadhaarLast4}
                    onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value.replace(/\D/g, '') })}
                    placeholder={t.aadhaarPlaceholder}
                    className="w-full text-sm font-mono border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Crop & Quantity */}
            <div className="pt-2 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ta' ? '2. பயிர் மற்றும் அளவு' : lang === 'hi' ? '2. फसल एवं उपज मात्रा' : '2. Crop & Estimated Quantity'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.cropLabel} *
                  </label>
                  <select
                    value={formData.cropId}
                    onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                    className="w-full text-sm font-medium border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white transition-all"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {getCropDisplayName(c, lang)} - MSP: ₹{c.msp.toLocaleString('en-IN')}/Qtl
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.quantityLabel} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder={t.quantityPlaceholder}
                    className="w-full text-sm font-mono border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Live MSP Calculation Pill */}
              <div className="mt-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-900">
                  <span className="font-semibold">{t.mspLabel}:</span>
                  <span className="font-bold text-emerald-700">₹{selectedCropMsp.toLocaleString('en-IN')} / Qtl</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-950">
                  <span className="text-slate-600 font-medium">{t.totalEstimatedValue}:</span>
                  <span className="font-extrabold text-emerald-800 text-base font-mono">
                    ₹{estimatedTotalPayout.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Mandi & Slot Selection */}
            <div className="pt-2 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ta' ? '3. மண்டி மற்றும் நேர ஸ்லாட்' : lang === 'hi' ? '3. मंडी एवं समय स्लॉट' : '3. Mandi Centre & Time Window'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.centreLabel} *
                  </label>
                  <select
                    value={formData.centreId}
                    onChange={(e) => handleCentreChange(e.target.value)}
                    className="w-full text-sm font-medium border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white transition-all"
                  >
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>
                        {getCentreDisplayName(c, lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.dateLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-sm font-medium border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Slot Cards with Live Capacity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t.selectSlotLabel} (Real-time Live Capacity)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots.map((slot) => {
                    const isSelected = formData.slotId === slot.id;
                    const isFull = slot.status === 'FULL';

                    return (
                      <div
                        key={slot.id}
                        onClick={() => !isFull && setFormData({ ...formData, slotId: slot.id })}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-600/20'
                            : isFull
                            ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {lang === 'hi' ? slot.labelHi : slot.timeRange}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                              ✓
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs mt-2">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                              slot.status === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : slot.status === 'FILLING_FAST'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {slot.status === 'AVAILABLE'
                              ? t.slotAvailable
                              : slot.status === 'FILLING_FAST'
                              ? t.slotFillingFast
                              : t.slotFull}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {slot.remainingCapacity} {t.capacityLeft}
                          </span>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              slot.remainingCapacity <= 2
                                ? 'bg-rose-500'
                                : slot.remainingCapacity <= 5
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                ((slot.maxCapacity - slot.remainingCapacity) / slot.maxCapacity) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 touch-target"
              >
                {bookingLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t.bookingInProgress}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-300" />
                    <span>{t.bookSlotButton}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL AFTER BOOKING */}
      {newlyCreatedToken && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-emerald-300 overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-9 h-9 text-emerald-200" />
              </div>
              <h3 className="text-xl font-bold">
                {lang === 'hi' ? 'स्लॉट सफलतापूर्वक बुक हुआ!' : 'Mandi Slot Booked Successfully!'}
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                {lang === 'hi' ? 'डिजिटल टोकन जनरेट हो चुका है' : 'Your Digital Token is ready'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  {t.digitalToken}
                </div>
                <div className="text-2xl font-black font-mono text-emerald-950 mt-1">
                  {newlyCreatedToken.token}
                </div>
                <div className="text-xs text-emerald-800 mt-1">
                  {newlyCreatedToken.date} • {newlyCreatedToken.slotTimeRange}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p><strong>{t.farmerDetails}:</strong> {newlyCreatedToken.farmerName}</p>
                <p><strong>{t.centreLabel}:</strong> {newlyCreatedToken.centreName}</p>
                <p><strong>{t.cropLabel}:</strong> {newlyCreatedToken.quantity} Qtl {newlyCreatedToken.cropNameEn}</p>
                <p><strong>{t.totalEstimatedValue}:</strong> ₹{newlyCreatedToken.totalExpectedPayout?.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-start space-x-2">
                <Smartphone className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'hi'
                    ? `आपके मोबाइल नंबर ${newlyCreatedToken.mobile} पर पुष्टिकरण एसएमएस भेज दिया गया है।`
                    : `SMS confirmation dispatched to +91-${newlyCreatedToken.mobile}.`}
                </span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setNewlyCreatedToken(null);
                    setActiveTab('track');
                  }}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all"
                >
                  {lang === 'hi' ? 'लाइव कतार देखें' : 'Go to Live Queue Tracker'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE QUEUE & TOKEN TRACKER */}
      {activeTab === 'track' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              {t.tokenLookupTitle}
            </h3>
            <p className="text-xs text-slate-600 mb-4">{t.tokenLookupSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchBookingDetails(searchQuery)}
                  placeholder={t.tokenSearchPlaceholder}
                  className="w-full pl-11 pr-4 py-3 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                />
              </div>
              <button
                onClick={() => fetchBookingDetails(searchQuery)}
                disabled={trackingLoading}
                className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {trackingLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{t.searchBtn}</span>
              </button>
            </div>

            {/* Quick Demo Tokens */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">{t.recentTokens}</span>
              {['DOCA-KRN-104', 'DOCA-KRN-103', 'DOCA-KRN-102', 'DOCA-KRN-101', 'DOCA-BPL-201'].map((tok) => (
                <button
                  key={tok}
                  onClick={() => {
                    setSearchQuery(tok);
                    fetchBookingDetails(tok);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                    activeBooking?.token === tok
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking Error Message */}
          {trackingError && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-sm flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {/* ACTIVE BOOKING LIVE TRACKER DISPLAY */}
          {activeBooking && (
            <div className="space-y-6">
              {/* Top Digital Card & Live Queue Position */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Digital Token Pass */}
                <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌾</span>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                          {t.govtOfIndia}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-mono font-bold">
                        {activeBooking.source || 'PORTAL'}
                      </span>
                    </div>

                    <div className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
                      {t.digitalToken}
                    </div>
                    <div className="text-3xl font-black font-mono tracking-tight text-white mt-1">
                      {activeBooking.token}
                    </div>
                    <div className="mt-3 text-xs text-emerald-100 space-y-1">
                      <p className="font-semibold text-sm text-white">{activeBooking.farmerName}</p>
                      <p className="font-mono text-emerald-200">+91-{activeBooking.mobile}</p>
                      <p>{activeBooking.centreName}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-300 block text-[10px] uppercase font-bold">Slot</span>
                      <span className="font-semibold">{activeBooking.date}</span>
                      <p className="text-[11px] text-emerald-200">{activeBooking.slotTimeRange}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-300 block text-[10px] uppercase font-bold">Crop Lot</span>
                      <span className="font-bold text-white text-sm">{activeBooking.quantity} Qtl</span>
                      <p className="text-[11px] text-emerald-200">{activeBooking.cropNameEn}</p>
                    </div>
                  </div>
                </div>

                {/* Real-time Dynamic Queue Indicator */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {t.queuePositionHeading}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isAutoSyncing && (
                        <span className="text-[11px] font-medium text-emerald-700 flex items-center space-x-1">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Syncing...</span>
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        {t.autoSyncNotice}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    {/* Metric 1: Farmers Ahead */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">
                        {t.farmersAhead}
                      </div>
                      <div className="text-4xl font-extrabold text-slate-900 font-mono">
                        {activeBooking.queueMetrics?.aheadCount ?? 0}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {activeBooking.status === 'SLOT_BOOKED'
                          ? (lang === 'hi' ? 'मंडी में सक्रिय कतार' : 'Active queue at Mandi')
                          : (lang === 'hi' ? 'आपसे पहले लाइन में' : 'Ahead of your vehicle')}
                      </p>
                    </div>

                    {/* Metric 2: Estimated Wait Time (Dynamic) */}
                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                      <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider mb-1">
                        {t.estimatedWaitTime}
                      </div>
                      <div className="text-4xl font-extrabold text-emerald-800 font-mono">
                        ~{activeBooking.queueMetrics?.estimatedWaitMins ?? 0}
                        <span className="text-base font-sans font-semibold text-emerald-700 ml-1.5">
                          {t.minsApprox}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 mt-1">
                        {lang === 'hi'
                          ? `वास्तविक गति: ${activeBooking.queueMetrics?.avgProcessingMinsPerFarmer || 10} मिनट प्रति किसान`
                          : `Calculated at ~${activeBooking.queueMetrics?.avgProcessingMinsPerFarmer || 10} min/farmer`}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Status Callout Message */}
                  <div className="p-3.5 rounded-xl border flex items-center space-x-3 bg-slate-900 text-white">
                    <div className="p-2 bg-emerald-500 rounded-lg text-slate-950 font-bold text-xs flex-shrink-0">
                      Phase {currentStepIndex}/5
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-emerald-400 block font-semibold">
                        {t[`status_${activeBooking.status}`] || activeBooking.status}
                      </strong>
                      <span className="text-slate-300">
                        {activeBooking.status === 'SLOT_BOOKED' && t.scheduledNotice}
                        {activeBooking.status === 'ARRIVED' && t.turnSoon}
                        {activeBooking.status === 'QUALITY_CHECK' && t.inTesting}
                        {(activeBooking.status === 'PROCURED' || activeBooking.status === 'PAYMENT_CREDITED') && t.completedNotice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Visual Timeline */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-base sm:text-lg mb-6 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  <span>{t.progressTimeline}</span>
                </h4>

                <div className="relative">
                  {/* Step Progress Line */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {STATUS_STEPS.map((stepItem, idx) => {
                      const isCompleted = currentStepIndex > stepItem.step;
                      const isCurrent = currentStepIndex === stepItem.step;
                      const isPending = currentStepIndex < stepItem.step;
                      const Icon = stepItem.icon;

                      return (
                        <div
                          key={stepItem.key}
                          className={`relative p-4 rounded-2xl border-2 transition-all ${
                            isCurrent
                              ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-4 ring-emerald-500/10'
                              : isCompleted
                              ? 'border-emerald-300 bg-emerald-50/30'
                              : 'border-slate-200 bg-slate-50 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-emerald-700 text-white animate-pulse'
                                  : 'bg-slate-300 text-slate-700'
                              }`}
                            >
                              {isCompleted ? '✓' : stepItem.step}
                            </span>
                            <Icon
                              className={`w-5 h-5 ${
                                isCurrent || isCompleted ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            />
                          </div>

                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {t[`status_${stepItem.key}`]}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {t[`statusDesc_${stepItem.key}`]}
                          </p>

                          {/* Extra metadata badges if available */}
                          {stepItem.key === 'QUALITY_CHECK' && activeBooking.qualityCheck && (
                            <div className="mt-2 pt-2 border-t border-emerald-200 text-[10px] font-mono text-emerald-900 space-y-0.5">
                              <div>Moisture: <strong>{activeBooking.qualityCheck.moistureContent}%</strong></div>
                              <div>Grade: <strong>{activeBooking.qualityCheck.qualityGrade}</strong></div>
                            </div>
                          )}

                          {stepItem.key === 'PROCURED' && activeBooking.procurementDetails && (
                            <div className="mt-2 pt-2 border-t border-emerald-200 text-[10px] font-mono text-emerald-900 space-y-0.5">
                              <div>Net Qty: <strong>{activeBooking.procurementDetails.weighedQuantity} Qtl</strong></div>
                              <div>Receipt: <strong>#{activeBooking.procurementDetails.receiptNo}</strong></div>
                            </div>
                          )}

                          {stepItem.key === 'PAYMENT_CREDITED' && activeBooking.paymentDetails && (
                            <div className="mt-2 pt-2 border-t border-emerald-200 text-[10px] font-mono text-emerald-900 space-y-0.5">
                              <div className="text-emerald-700 font-bold">₹{activeBooking.paymentDetails.creditedAmount?.toLocaleString('en-IN')}</div>
                              <div className="truncate">UTR: {activeBooking.paymentDetails.utrNumber}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Trail Log */}
                {activeBooking.statusHistory && activeBooking.statusHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      {t.auditLog}
                    </h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {activeBooking.statusHistory.map((h, i) => (
                        <div key={i} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-emerald-800">
                              {t[`status_${h.status}`] || h.status}:
                            </span>
                            <span className="text-slate-700">{h.note}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 flex-shrink-0 ml-2">
                            {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated SMS Notification Feed */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-sky-600 text-white rounded-xl">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{t.smsFeedTitle}</h4>
                      <p className="text-xs text-slate-500">{t.smsFeedSubtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-sky-100 text-sky-900 px-2.5 py-1 rounded-full font-bold">
                    +91-{activeBooking.mobile}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeBooking.smsLog && activeBooking.smsLog.length > 0 ? (
                    activeBooking.smsLog.map((sms, i) => (
                      <div
                        key={sms.id || i}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3 transition-all hover:bg-sky-50/50 hover:border-sky-200"
                      >
                        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold font-mono mt-0.5">
                          {sms.sender || 'DOCA-GOV'}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {sms.message}
                          </p>
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            {new Date(sms.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-6">
                      {t.noSmsYet}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
