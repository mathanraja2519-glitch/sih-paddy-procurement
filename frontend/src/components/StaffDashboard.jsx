// frontend/src/components/StaffDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Building2, Users, CheckCircle2, Clock, Scale, IndianRupee,
  RefreshCw, Search, Filter, AlertCircle, ArrowRight, ShieldCheck,
  Check, X, FileSpreadsheet, PlusCircle, AlertTriangle, Truck
} from 'lucide-react';
import { api } from '../api';
import { getCropDisplayName, getCentreDisplayName } from '../i18n';

export default function StaffDashboard({ lang, t }) {
  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState('KRN-01');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals for Quality Check, Procurement Weighing, and DBT Payment
  const [qualityModalBooking, setQualityModalBooking] = useState(null);
  const [qualityMoisture, setQualityMoisture] = useState('11.4');
  const [qualityGrade, setQualityGrade] = useState('Grade A (FAQ Standard)');
  const [qualityNotes, setQualityNotes] = useState('Clean grain lot, moisture within safe threshold.');

  const [procureModalBooking, setProcureModalBooking] = useState(null);
  const [weighedQty, setWeighedQty] = useState('');

  const [paymentModalBooking, setPaymentModalBooking] = useState(null);
  const [customUtr, setCustomUtr] = useState('');

  // Initial load
  useEffect(() => {
    async function loadCentres() {
      try {
        const cList = await api.getCentres();
        setCentres(cList);
        if (cList.length > 0) {
          setSelectedCentreId(cList[0].id);
        }
      } catch (err) {
        console.error('Failed to load centres:', err);
      }
    }
    loadCentres();
  }, []);

  // Fetch dashboard data
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [bList, sData] = await Promise.all([
        api.getBookings({
          centreId: selectedCentreId,
          date: selectedDate,
          status: statusFilter,
          search: searchQuery
        }),
        api.getCentreStats(selectedCentreId, selectedDate)
      ]);
      setBookings(bList);
      setStats(sData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    fetchData();
  }, [selectedCentreId, selectedDate, statusFilter, searchQuery]);

  // Live auto-polling every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedCentreId, selectedDate, statusFilter, searchQuery]);

  // Actions
  const handleMarkArrived = async (booking) => {
    setActionLoadingId(booking.id);
    try {
      await api.updateBookingStatus(booking.id, 'ARRIVED', {
        note: `Farmer arrived at gate. Physical token verified by Mandi Gate Officer.`
      });
      await fetchData(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitQualityCheck = async () => {
    if (!qualityModalBooking) return;
    setActionLoadingId(qualityModalBooking.id);
    try {
      await api.updateBookingStatus(qualityModalBooking.id, 'QUALITY_CHECK', {
        moistureContent: parseFloat(qualityMoisture) || 11.5,
        qualityGrade: qualityGrade,
        note: qualityNotes
      });
      setQualityModalBooking(null);
      await fetchData(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitProcurement = async () => {
    if (!procureModalBooking) return;
    setActionLoadingId(procureModalBooking.id);
    try {
      const qty = parseFloat(weighedQty) || procureModalBooking.quantity;
      await api.updateBookingStatus(procureModalBooking.id, 'PROCURED', {
        weighedQuantity: qty,
        note: `Weighed: ${qty} Quintals on Electronic Weighbridge #1. Quality Certified.`
      });
      setProcureModalBooking(null);
      await fetchData(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitPayment = async () => {
    if (!paymentModalBooking) return;
    setActionLoadingId(paymentModalBooking.id);
    try {
      const utr = customUtr || `SBIN${Date.now().toString().slice(-8)}`;
      await api.updateBookingStatus(paymentModalBooking.id, 'PAYMENT_CREDITED', {
        utrNumber: utr,
        bankName: 'PFMS Direct Benefit Transfer',
        note: `Payment disbursed via PFMS. Bank Ref UTR: ${utr}`
      });
      setPaymentModalBooking(null);
      await fetchData(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const selectedCentre = centres.find(c => c.id === selectedCentreId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-800 text-white rounded-2xl shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{t.staffTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500">{t.staffSubtitle}</p>
            </div>
          </div>

          {/* Mandi & Date Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                {t.selectMandiFilter}
              </label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              >
                {centres.map(c => (
                  <option key={c.id} value={c.id}>
                    {getCentreDisplayName(c, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                {t.selectDateFilter}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t.statTotalBookings}
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {stats.totalBooked}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Slots allocated</span>
            </div>

            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                {t.statInQueue}
              </div>
              <div className="text-2xl font-black text-amber-900 font-mono mt-1">
                {stats.inQueueArrived}
              </div>
              <span className="text-[10px] text-amber-700 font-medium">Waiting in yard</span>
            </div>

            <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200">
              <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                {t.statTesting}
              </div>
              <div className="text-2xl font-black text-sky-900 font-mono mt-1">
                {stats.inQualityCheck}
              </div>
              <span className="text-[10px] text-sky-700 font-medium">In lab assay</span>
            </div>

            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                {t.statCompleted}
              </div>
              <div className="text-2xl font-black text-emerald-900 font-mono mt-1">
                {stats.procuredToday}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Weighed & accepted</span>
            </div>

            <div className="bg-teal-50/80 p-3.5 rounded-2xl border border-teal-200">
              <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                {t.statTonnage}
              </div>
              <div className="text-2xl font-black text-teal-900 font-mono mt-1">
                {stats.totalTonnageQtl}
              </div>
              <span className="text-[10px] text-teal-700 font-medium">Quintals procured</span>
            </div>

            <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-200">
              <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                {t.statDisbursed}
              </div>
              <div className="text-xl font-black text-indigo-900 font-mono mt-1 truncate">
                ₹{stats.totalPayoutDisbursed ? (stats.totalPayoutDisbursed / 100000).toFixed(2) + 'L' : '0'}
              </div>
              <span className="text-[10px] text-indigo-700 font-medium">Direct to farmers</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'ALL', label: t.filterAll },
              { id: 'SLOT_BOOKED', label: t.filterBooked },
              { id: 'ARRIVED', label: t.filterArrived },
              { id: 'QUALITY_CHECK', label: t.filterQuality },
              { id: 'PROCURED', label: t.filterProcured },
              { id: 'PAYMENT_CREDITED', label: t.filterPaid }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchFarmerPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Live Queue Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Token & Source</th>
                <th className="p-3.5">Farmer & Contact</th>
                <th className="p-3.5">Crop & Qty</th>
                <th className="p-3.5">Slot Window</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Queue / Wait</th>
                <th className="p-3.5 text-right">Advance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No bookings found matching the current filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const isActionLoading = actionLoadingId === b.id;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Token */}
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {b.token}
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {b.source || 'WEB'}
                        </span>
                      </td>

                      {/* Farmer */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{b.farmerName}</div>
                        <div className="font-mono text-slate-500 text-[11px]">
                          +91-{b.mobile} {b.aadhaarLast4 ? `(..${b.aadhaarLast4})` : ''}
                        </div>
                      </td>

                      {/* Crop & Quantity */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{b.quantity} Qtl</div>
                        <div className="text-slate-500 text-[11px]">
                          {getCropDisplayName({ id: b.cropId, nameEn: b.cropNameEn, nameHi: b.cropNameHi }, lang)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold font-mono">
                          ₹{b.totalExpectedPayout?.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Slot */}
                      <td className="p-3.5">
                        <div className="text-slate-800 font-semibold">{b.slotTimeRange}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{b.date}</div>
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            b.status === 'PAYMENT_CREDITED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'PROCURED'
                              ? 'bg-teal-100 text-teal-800'
                              : b.status === 'QUALITY_CHECK'
                              ? 'bg-sky-100 text-sky-800'
                              : b.status === 'ARRIVED'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t[`status_${b.status}`] || b.status}
                        </span>
                      </td>

                      {/* Queue / Wait */}
                      <td className="p-3.5">
                        {b.status === 'ARRIVED' ? (
                          <div>
                            <span className="font-bold text-amber-800">
                              ~{b.queueMetrics?.estimatedWaitMins || 10}m
                            </span>
                            <div className="text-[10px] text-slate-500">
                              {b.queueMetrics?.aheadCount || 0} ahead
                            </div>
                          </div>
                        ) : b.status === 'QUALITY_CHECK' ? (
                          <span className="text-sky-700 font-bold">In Lab</span>
                        ) : b.status === 'PROCURED' || b.status === 'PAYMENT_CREDITED' ? (
                          <span className="text-emerald-700 font-bold">Cleared</span>
                        ) : (
                          <span className="text-slate-400">Scheduled</span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="p-3.5 text-right">
                        {b.status === 'SLOT_BOOKED' && (
                          <button
                            onClick={() => handleMarkArrived(b)}
                            disabled={isActionLoading}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1 ml-auto disabled:opacity-50"
                          >
                            {isActionLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Truck className="w-3 h-3" />}
                            <span>{t.actionMarkArrived}</span>
                          </button>
                        )}

                        {b.status === 'ARRIVED' && (
                          <button
                            onClick={() => {
                              setQualityModalBooking(b);
                              setQualityMoisture('11.2');
                              setQualityGrade('Grade A (FAQ Standard)');
                            }}
                            disabled={isActionLoading}
                            className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1 ml-auto disabled:opacity-50"
                          >
                            <Scale className="w-3 h-3" />
                            <span>{t.actionStartQuality}</span>
                          </button>
                        )}

                        {b.status === 'QUALITY_CHECK' && (
                          <button
                            onClick={() => {
                              setProcureModalBooking(b);
                              setWeighedQty(b.quantity.toString());
                            }}
                            disabled={isActionLoading}
                            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1 ml-auto disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t.actionCompleteProcure}</span>
                          </button>
                        )}

                        {b.status === 'PROCURED' && (
                          <button
                            onClick={() => {
                              setPaymentModalBooking(b);
                              setCustomUtr(`SBIN${Date.now().toString().slice(-8)}`);
                            }}
                            disabled={isActionLoading}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1 ml-auto disabled:opacity-50"
                          >
                            <IndianRupee className="w-3 h-3" />
                            <span>{t.actionDisbursePayment}</span>
                          </button>
                        )}

                        {b.status === 'PAYMENT_CREDITED' && (
                          <span className="inline-flex items-center text-emerald-700 font-bold space-x-1 text-xs">
                            <Check className="w-4 h-4" />
                            <span>{t.actionDone}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: QUALITY & MOISTURE ASSAY */}
      {qualityModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-sky-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-sky-200" />
                <h3 className="font-bold text-base">{t.qualityModalTitle}</h3>
              </div>
              <button
                onClick={() => setQualityModalBooking(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p><strong>Farmer:</strong> {qualityModalBooking.farmerName}</p>
                <p><strong>Token:</strong> {qualityModalBooking.token} • {qualityModalBooking.cropNameEn}</p>
                <p><strong>Lot Size:</strong> {qualityModalBooking.quantity} Quintals</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.moisturePercent} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={qualityMoisture}
                  onChange={(e) => setQualityMoisture(e.target.value)}
                  className="w-full font-mono border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-600"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {t.moistureMaxPermissible} 12.0% (Standard FAQ limit)
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.qualityGrade} *
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-600"
                >
                  <option value="Grade A (FAQ Standard)">{t.gradeA}</option>
                  <option value="Grade B (Permissible)">{t.gradeB}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.inspectionNotes}
                </label>
                <textarea
                  rows={2}
                  value={qualityNotes}
                  onChange={(e) => setQualityNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setQualityModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={submitQualityCheck}
                  className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl"
                >
                  {t.approveQualityBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WEIGHBRIDGE & PROCUREMENT */}
      {procureModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-teal-200" />
                <h3 className="font-bold text-base">{t.weighbridgeModalTitle}</h3>
              </div>
              <button
                onClick={() => setProcureModalBooking(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p><strong>Farmer:</strong> {procureModalBooking.farmerName}</p>
                <p><strong>Crop:</strong> {procureModalBooking.cropNameEn} @ MSP ₹{procureModalBooking.mspRate}/Qtl</p>
                <p><strong>Quality Lab:</strong> Moisture {procureModalBooking.qualityCheck?.moistureContent}% (Passed)</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.finalWeight} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weighedQty}
                  onChange={(e) => setWeighedQty(e.target.value)}
                  className="w-full font-mono font-bold text-base border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                <span className="font-bold text-teal-900">{t.mspCalculatedAmount}:</span>
                <span className="font-black text-teal-900 text-lg font-mono">
                  ₹{((parseFloat(weighedQty) || procureModalBooking.quantity) * procureModalBooking.mspRate).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setProcureModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={submitProcurement}
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl"
                >
                  {t.confirmProcurementBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DBT PAYMENT DISBURSEMENT */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">{t.paymentModalTitle}</h3>
              </div>
              <button
                onClick={() => setPaymentModalBooking(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p><strong>Beneficiary:</strong> {paymentModalBooking.farmerName}</p>
                <p><strong>Mobile:</strong> +91-{paymentModalBooking.mobile}</p>
                <p><strong>Account:</strong> Aadhaar-linked Bank A/c ending in ...{paymentModalBooking.aadhaarLast4 || '4321'}</p>
                <p><strong>Procured Weight:</strong> {paymentModalBooking.procurementDetails?.weighedQuantity || paymentModalBooking.quantity} Quintals</p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
                <span className="font-bold text-emerald-900">{t.payoutAmount}:</span>
                <span className="font-black text-emerald-950 text-xl font-mono">
                  ₹{(paymentModalBooking.procurementDetails?.grossAmount || paymentModalBooking.totalExpectedPayout).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.utrNumberLabel} *
                </label>
                <input
                  type="text"
                  value={customUtr}
                  onChange={(e) => setCustomUtr(e.target.value)}
                  className="w-full font-mono text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setPaymentModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPayment}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  {t.processPaymentBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
