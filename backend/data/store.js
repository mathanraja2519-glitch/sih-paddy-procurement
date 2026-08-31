// backend/data/store.js
// In-memory data store for DoCA Smart Procurement Platform with database-ready abstractions

const CROPS = [
  { id: 'WHEAT', nameEn: 'Wheat', nameHi: 'गेहूं', msp: 2275, moistureLimit: 12.0 },
  { id: 'PADDY', nameEn: 'Paddy (Common)', nameHi: 'धान (सामान्य)', msp: 2183, moistureLimit: 14.0 },
  { id: 'MUSTARD', nameEn: 'Mustard Seeds', nameHi: 'सरसों', msp: 5650, moistureLimit: 8.0 },
  { id: 'GRAM', nameEn: 'Gram (Chana)', nameHi: 'चना', msp: 5440, moistureLimit: 10.0 },
  { id: 'MAIZE', nameEn: 'Maize', nameHi: 'मक्का', msp: 2090, moistureLimit: 13.0 },
  { id: 'SOYBEAN', nameEn: 'Soybean', nameHi: 'सोयाबीन', msp: 4600, moistureLimit: 11.0 }
];

const STANDARD_SLOTS = [
  { id: 'SLOT-1', timeRange: '08:00 AM - 10:00 AM', labelHi: 'सुबह 08:00 - 10:00', maxCapacity: 12 },
  { id: 'SLOT-2', timeRange: '10:00 AM - 12:00 PM', labelHi: 'सुबह 10:00 - 12:00', maxCapacity: 12 },
  { id: 'SLOT-3', timeRange: '12:00 PM - 02:00 PM', labelHi: 'दोपहर 12:00 - 02:00', maxCapacity: 12 },
  { id: 'SLOT-4', timeRange: '02:00 PM - 04:00 PM', labelHi: 'दोपहर 02:00 - 04:00', maxCapacity: 12 },
  { id: 'SLOT-5', timeRange: '04:00 PM - 06:00 PM', labelHi: 'शाम 04:00 - 06:00', maxCapacity: 10 }
];

const CENTRES = [
  {
    id: 'KRN-01',
    code: 'KRN',
    name: 'Karnal Central APMC Mandi',
    nameHi: 'करनाल केंद्रीय कृषि उपज मंडी',
    district: 'Karnal',
    state: 'Haryana',
    address: 'GT Road, Near Grain Market Complex, Karnal, Haryana - 132001',
    contactNumber: '+91-184-2259012',
    capacityPerHour: 6,
    avgMinsPerFarmer: 10,
    acceptedCrops: ['WHEAT', 'PADDY', 'MUSTARD', 'GRAM'],
    maxSlotCapacity: 12
  },
  {
    id: 'BPL-02',
    code: 'BPL',
    name: 'Bhopal State Civil Supplies Hub (Karond Mandi)',
    nameHi: 'भोपाल राज्य नागरिक आपूर्ति केंद्र (करोंद मंडी)',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    address: 'Karond Mandi By-pass, Bhopal, Madhya Pradesh - 462038',
    contactNumber: '+91-755-2741190',
    capacityPerHour: 6,
    avgMinsPerFarmer: 12,
    acceptedCrops: ['WHEAT', 'GRAM', 'SOYBEAN', 'MAIZE'],
    maxSlotCapacity: 12
  },
  {
    id: 'GNT-03',
    code: 'GNT',
    name: 'Guntur Regional Procurement Hub',
    nameHi: 'गुंटूर क्षेत्रीय खरीद केंद्र',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Market Yard Road, Guntur, Andhra Pradesh - 522004',
    contactNumber: '+91-863-2234500',
    capacityPerHour: 5,
    avgMinsPerFarmer: 12,
    acceptedCrops: ['PADDY', 'MAIZE', 'GRAM'],
    maxSlotCapacity: 10
  },
  {
    id: 'LKO-04',
    code: 'LKO',
    name: 'Lucknow FCI Regional Depot (Dubagga)',
    nameHi: 'लखनऊ एफसीआई क्षेत्रीय डिपो (दुबग्गा)',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Dubagga Mandi Marg, Hardoi Road, Lucknow, UP - 226003',
    contactNumber: '+91-522-2418900',
    capacityPerHour: 6,
    avgMinsPerFarmer: 11,
    acceptedCrops: ['WHEAT', 'PADDY', 'MUSTARD'],
    maxSlotCapacity: 12
  }
];

// Helper to get today's date formatted as YYYY-MM-DD
function getTodayDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const todayStr = getTodayDateString(0);
const tomorrowStr = getTodayDateString(1);

// Initial Seed Bookings demonstrating various stages of the queue
let BOOKINGS = [
  {
    id: 'bkg-101',
    token: 'DOCA-KRN-101',
    farmerName: 'Ramesh Singh (रमेश सिंह)',
    mobile: '9876543210',
    aadhaarLast4: '4321',
    cropId: 'WHEAT',
    cropNameEn: 'Wheat',
    cropNameHi: 'गेहूं',
    quantity: 45, // in Quintals
    mspRate: 2275,
    totalExpectedPayout: 45 * 2275, // 102,375
    centreId: 'KRN-01',
    centreName: 'Karnal Central APMC Mandi',
    date: todayStr,
    slotId: 'SLOT-2',
    slotTimeRange: '10:00 AM - 12:00 PM',
    status: 'PAYMENT_CREDITED',
    qualityCheck: {
      moistureContent: 11.2,
      qualityGrade: 'Grade A (उत्कृष्ट)',
      passed: true,
      testedAt: `${todayStr}T10:45:00Z`
    },
    procurementDetails: {
      weighedQuantity: 45.2,
      grossAmount: 45.2 * 2275,
      procuredAt: `${todayStr}T11:15:00Z`,
      receiptNo: 'DOCA-KRN-REC-8821'
    },
    paymentDetails: {
      utrNumber: 'SBIN202608310098421',
      creditedAmount: 102830,
      bankName: 'State Bank of India (DBT)',
      creditedAt: `${todayStr}T11:30:00Z`
    },
    statusHistory: [
      { status: 'SLOT_BOOKED', timestamp: `${todayStr}T08:30:00Z`, note: 'Slot confirmed via Web Portal' },
      { status: 'ARRIVED', timestamp: `${todayStr}T10:05:00Z`, note: 'Gate entry verified. Tractor Token #01 issued' },
      { status: 'QUALITY_CHECK', timestamp: `${todayStr}T10:45:00Z`, note: 'Lab moisture test: 11.2% (Permissible <=12.0%). Quality: Grade A' },
      { status: 'PROCURED', timestamp: `${todayStr}T11:15:00Z`, note: 'Electronic weighbridge: 45.2 Quintals. Final Receipt #8821' },
      { status: 'PAYMENT_CREDITED', timestamp: `${todayStr}T11:30:00Z`, note: 'DBT Payment of ₹1,02,830 credited to SBI A/c ending in ...4321. UTR: SBIN202608310098421' }
    ],
    smsLog: [
      { id: 'sms-1', timestamp: `${todayStr}T08:30:00Z`, sender: 'DOCA-GOV', message: 'Dear Ramesh Singh, Your slot for 45 Qtl Wheat at Karnal Mandi is confirmed for today, 10:00 AM - 12:00 PM. Token: DOCA-KRN-101. Please arrive on time with valid ID.' },
      { id: 'sms-2', timestamp: `${todayStr}T10:05:00Z`, sender: 'DOCA-GOV', message: 'Gate Entry Confirmed: Welcome to Karnal Mandi. Token DOCA-KRN-101. Current queue position: 1. Estimated wait: ~10 mins.' },
      { id: 'sms-3', timestamp: `${todayStr}T10:45:00Z`, sender: 'DOCA-GOV', message: 'Quality Check Cleared! Moisture: 11.2%, Grade: A. Proceeding to Electronic Weighbridge #2.' },
      { id: 'sms-4', timestamp: `${todayStr}T11:15:00Z`, sender: 'DOCA-GOV', message: 'Procurement Complete: 45.2 Quintals of Wheat procured @ ₹2,275/Qtl. Total ₹1,02,830. Payment initiated via PFMS-DBT.' },
      { id: 'sms-5', timestamp: `${todayStr}T11:30:00Z`, sender: 'DOCA-GOV', message: 'Payment Credited! ₹1,02,830 has been credited to your bank account via DBT. Ref/UTR: SBIN202608310098421. Thank you for partnering with DoCA.' }
    ]
  },
  {
    id: 'bkg-102',
    token: 'DOCA-KRN-102',
    farmerName: 'Baldev Kumar (बलदेव कुमार)',
    mobile: '9811223344',
    aadhaarLast4: '8890',
    cropId: 'WHEAT',
    cropNameEn: 'Wheat',
    cropNameHi: 'गेहूं',
    quantity: 60,
    mspRate: 2275,
    totalExpectedPayout: 60 * 2275,
    centreId: 'KRN-01',
    centreName: 'Karnal Central APMC Mandi',
    date: todayStr,
    slotId: 'SLOT-2',
    slotTimeRange: '10:00 AM - 12:00 PM',
    status: 'PROCURED',
    qualityCheck: {
      moistureContent: 11.8,
      qualityGrade: 'Grade A',
      passed: true,
      testedAt: `${todayStr}T10:55:00Z`
    },
    procurementDetails: {
      weighedQuantity: 60.0,
      grossAmount: 60.0 * 2275,
      procuredAt: `${todayStr}T11:25:00Z`,
      receiptNo: 'DOCA-KRN-REC-8822'
    },
    statusHistory: [
      { status: 'SLOT_BOOKED', timestamp: `${todayStr}T08:40:00Z`, note: 'Booked via CSC Center' },
      { status: 'ARRIVED', timestamp: `${todayStr}T10:15:00Z`, note: 'Arrived at Gate 2' },
      { status: 'QUALITY_CHECK', timestamp: `${todayStr}T10:55:00Z`, note: 'Moisture 11.8% passed' },
      { status: 'PROCURED', timestamp: `${todayStr}T11:25:00Z`, note: 'Weighed 60.0 Quintals. DBT processing queue.' }
    ],
    smsLog: [
      { id: 'sms-102-1', timestamp: `${todayStr}T08:40:00Z`, sender: 'DOCA-GOV', message: 'Slot confirmed: Baldev Kumar, Token DOCA-KRN-102, 60 Qtl Wheat, 10:00 AM - 12:00 PM at Karnal Mandi.' },
      { id: 'sms-102-2', timestamp: `${todayStr}T10:15:00Z`, sender: 'DOCA-GOV', message: 'Welcome Baldev Kumar. Token DOCA-KRN-102 is checked in. Move to Testing Bay 1.' },
      { id: 'sms-102-3', timestamp: `${todayStr}T11:25:00Z`, sender: 'DOCA-GOV', message: 'Procurement Complete: 60 Quintals Wheat. Payout ₹1,36,500 queued for instant bank transfer.' }
    ]
  },
  {
    id: 'bkg-103',
    token: 'DOCA-KRN-103',
    farmerName: 'Gurpreet Singh (गुरप्रीत सिंह)',
    mobile: '9722334455',
    aadhaarLast4: '6712',
    cropId: 'MUSTARD',
    cropNameEn: 'Mustard Seeds',
    cropNameHi: 'सरसों',
    quantity: 30,
    mspRate: 5650,
    totalExpectedPayout: 30 * 5650,
    centreId: 'KRN-01',
    centreName: 'Karnal Central APMC Mandi',
    date: todayStr,
    slotId: 'SLOT-2',
    slotTimeRange: '10:00 AM - 12:00 PM',
    status: 'QUALITY_CHECK',
    qualityCheck: {
      moistureContent: 7.5,
      qualityGrade: 'Testing in progress',
      passed: true,
      testedAt: `${todayStr}T11:20:00Z`
    },
    statusHistory: [
      { status: 'SLOT_BOOKED', timestamp: `${todayStr}T08:50:00Z`, note: 'Booked via Online Portal' },
      { status: 'ARRIVED', timestamp: `${todayStr}T10:30:00Z`, note: 'Checked in at Gate 1' },
      { status: 'QUALITY_CHECK', timestamp: `${todayStr}T11:20:00Z`, note: 'Sample taken for moisture & foreign matter assay' }
    ],
    smsLog: [
      { id: 'sms-103-1', timestamp: `${todayStr}T08:50:00Z`, sender: 'DOCA-GOV', message: 'Token DOCA-KRN-103 booked for Gurpreet Singh (30 Qtl Mustard, Today 10-12 PM).' },
      { id: 'sms-103-2', timestamp: `${todayStr}T10:30:00Z`, sender: 'DOCA-GOV', message: 'Token DOCA-KRN-103 arrived at Mandi. Testing in progress at Lab Counter B.' }
    ]
  },
  {
    id: 'bkg-104',
    token: 'DOCA-KRN-104',
    farmerName: 'Suresh Chandra Yadav (सुरेश चंद्र यादव)',
    mobile: '9412345678',
    aadhaarLast4: '5543',
    cropId: 'WHEAT',
    cropNameEn: 'Wheat',
    cropNameHi: 'गेहूं',
    quantity: 50,
    mspRate: 2275,
    totalExpectedPayout: 50 * 2275,
    centreId: 'KRN-01',
    centreName: 'Karnal Central APMC Mandi',
    date: todayStr,
    slotId: 'SLOT-2',
    slotTimeRange: '10:00 AM - 12:00 PM',
    status: 'ARRIVED',
    statusHistory: [
      { status: 'SLOT_BOOKED', timestamp: `${todayStr}T09:00:00Z`, note: 'Slot Booked via Farmer App' },
      { status: 'ARRIVED', timestamp: `${todayStr}T10:40:00Z`, note: 'Vehicle entered waiting lane 2' }
    ],
    smsLog: [
      { id: 'sms-104-1', timestamp: `${todayStr}T09:00:00Z`, sender: 'DOCA-GOV', message: 'Booking confirmed for Suresh Chandra Yadav. Token DOCA-KRN-104. Slot: 10:00 AM - 12:00 PM.' },
      { id: 'sms-104-2', timestamp: `${todayStr}T10:40:00Z`, sender: 'DOCA-GOV', message: 'Gate entry verified. You are in queue. 1 farmer ahead in inspection. Estimated wait: ~10 mins.' }
    ]
  },
  {
    id: 'bkg-105',
    token: 'DOCA-KRN-105',
    farmerName: 'Kavita Devi (कविता देवी)',
    mobile: '9899112233',
    aadhaarLast4: '9012',
    cropId: 'WHEAT',
    cropNameEn: 'Wheat',
    cropNameHi: 'गेहूं',
    quantity: 35,
    mspRate: 2275,
    totalExpectedPayout: 35 * 2275,
    centreId: 'KRN-01',
    centreName: 'Karnal Central APMC Mandi',
    date: todayStr,
    slotId: 'SLOT-2',
    slotTimeRange: '10:00 AM - 12:00 PM',
    status: 'SLOT_BOOKED',
    statusHistory: [
      { status: 'SLOT_BOOKED', timestamp: `${todayStr}T09:10:00Z`, note: 'Slot Booked via IVR Toll-Free Helpline 1800-180-26032' }
    ],
    smsLog: [
      { id: 'sms-105-1', timestamp: `${todayStr}T09:10:00Z`, sender: 'DOCA-GOV', message: 'Namaste Kavita Devi. Your IVR booking is confirmed: Token DOCA-KRN-105 for 35 Qtl Wheat at Karnal Mandi (Slot 10:00 AM - 12:00 PM).' }
    ]
  },
  {
    id: 'bkg-201',
    token: 'DOCA-BPL-201',
    farmerName: 'Shivnarayan Sharma (शिवनारायण शर्मा)',
    mobile: '9826012345',
    aadhaarLast4: '3341',
    cropId: 'SOYBEAN',
    cropNameEn: 'Soybean',
    cropNameHi: 'सोयाबीन',
    quantity: 40,
    mspRate: 4600,
    totalExpectedPayout: 40 * 4600,
    centreId: 'BPL-02',
    centreName: 'Bhopal State Civil Supplies Hub (Karond Mandi)',
    date: todayStr,
    slotId: 'SLOT-1',
    slotTimeRange: '08:00 AM - 10:00 AM',
    status: 'PAYMENT_CREDITED',
    qualityCheck: {
      moistureContent: 9.8,
      qualityGrade: 'Grade A',
      passed: true,
      testedAt: `${todayStr}T09:15:00Z`
    },
    procurementDetails: {
      weighedQuantity: 40.5,
      grossAmount: 40.5 * 4600,
      procuredAt: `${todayStr}T09:40:00Z`,
      receiptNo: 'DOCA-BPL-REC-4410'
    },
    paymentDetails: {
      utrNumber: 'MPB202608310041239',
      creditedAmount: 186300,
      bankName: 'Bank of Baroda (DBT)',
      creditedAt: `${todayStr}T10:00:00Z`
    },
    statusHistory: [
      { status: 'SLOT_BOOKED', timestamp: `${todayStr}T07:30:00Z`, note: 'Booked via Portal' },
      { status: 'ARRIVED', timestamp: `${todayStr}T08:15:00Z`, note: 'Gate entry verified' },
      { status: 'QUALITY_CHECK', timestamp: `${todayStr}T09:15:00Z`, note: 'Moisture 9.8% passed' },
      { status: 'PROCURED', timestamp: `${todayStr}T09:40:00Z`, note: 'Weighed 40.5 Qtl' },
      { status: 'PAYMENT_CREDITED', timestamp: `${todayStr}T10:00:00Z`, note: 'DBT Credited ₹1,86,300. UTR: MPB202608310041239' }
    ],
    smsLog: [
      { id: 'sms-201-1', timestamp: `${todayStr}T07:30:00Z`, sender: 'DOCA-GOV', message: 'Token DOCA-BPL-201 confirmed for Shivnarayan Sharma (40 Qtl Soybean, Karond Mandi).' },
      { id: 'sms-201-2', timestamp: `${todayStr}T10:00:00Z`, sender: 'DOCA-GOV', message: 'Payment Success! ₹1,86,300 credited via DBT into your account for 40.5 Qtl Soybean. Ref: MPB202608310041239.' }
    ]
  }
];

// In-memory counter for auto-incrementing token ids
let tokenSequence = 106;

// Order of statuses in the lifecycle
const STATUS_ORDER = ['SLOT_BOOKED', 'ARRIVED', 'QUALITY_CHECK', 'PROCURED', 'PAYMENT_CREDITED'];

const STATUS_LABELS = {
  SLOT_BOOKED: { en: 'Slot Booked', hi: 'स्लॉट बुक हुआ', stepIndex: 1 },
  ARRIVED: { en: 'Arrived at Mandi', hi: 'मंडी में आगमन', stepIndex: 2 },
  QUALITY_CHECK: { en: 'Quality Check', hi: 'गुणवत्ता व नमी जांच', stepIndex: 3 },
  PROCURED: { en: 'Procured & Weighed', hi: 'खरीद व तौल संपन्न', stepIndex: 4 },
  PAYMENT_CREDITED: { en: 'Payment Credited', hi: 'खाते में भुगतान जमा', stepIndex: 5 }
};

// Store Operations

function getAllCentres() {
  return CENTRES;
}

function getCentreById(id) {
  return CENTRES.find(c => c.id === id || c.code === id) || null;
}

function getAllCrops() {
  return CROPS;
}

function getCropById(cropId) {
  return CROPS.find(c => c.id === cropId) || null;
}

function getSlotsForCentre(centreId, date) {
  const centre = getCentreById(centreId);
  if (!centre) return null;

  const targetDate = date || todayStr;
  const centreBookings = BOOKINGS.filter(b => b.centreId === centre.id && b.date === targetDate);

  return STANDARD_SLOTS.map(slot => {
    const bookedCount = centreBookings.filter(b => b.slotId === slot.id).length;
    const maxCapacity = centre.maxSlotCapacity || slot.maxCapacity;
    const remaining = Math.max(0, maxCapacity - bookedCount);

    let status = 'AVAILABLE';
    if (remaining === 0) {
      status = 'FULL';
    } else if (remaining <= 3) {
      status = 'FILLING_FAST';
    }

    return {
      ...slot,
      date: targetDate,
      maxCapacity,
      bookedCount,
      remainingCapacity: remaining,
      status // AVAILABLE, FILLING_FAST, FULL
    };
  });
}

function createBooking({ farmerName, mobile, aadhaarLast4, cropId, quantity, centreId, date, slotId, source = 'WEB' }) {
  const centre = getCentreById(centreId);
  if (!centre) throw new Error('Invalid Procurement Centre selected.');

  const crop = getCropById(cropId);
  if (!crop) throw new Error('Invalid Crop selected.');

  if (!centre.acceptedCrops.includes(cropId)) {
    throw new Error(`Centre ${centre.name} does not accept ${crop.nameEn}.`);
  }

  const targetDate = date || todayStr;
  const targetSlot = STANDARD_SLOTS.find(s => s.id === slotId) || STANDARD_SLOTS[0];

  // Check capacity
  const currentSlotBookings = BOOKINGS.filter(
    b => b.centreId === centre.id && b.date === targetDate && b.slotId === targetSlot.id
  );

  const maxCapacity = centre.maxSlotCapacity || targetSlot.maxCapacity;
  if (currentSlotBookings.length >= maxCapacity) {
    throw new Error(`Selected slot ${targetSlot.timeRange} on ${targetDate} is full. Please pick another slot.`);
  }

  tokenSequence += 1;
  const token = `DOCA-${centre.code}-${tokenSequence}`;
  const nowIso = new Date().toISOString();
  const qVal = parseFloat(quantity) || 10;
  const totalPayout = qVal * crop.msp;

  const newBooking = {
    id: `bkg-${Date.now()}-${tokenSequence}`,
    token,
    farmerName: farmerName.trim(),
    mobile: mobile.trim(),
    aadhaarLast4: aadhaarLast4 ? aadhaarLast4.slice(-4) : '0000',
    cropId: crop.id,
    cropNameEn: crop.nameEn,
    cropNameHi: crop.nameHi,
    quantity: qVal,
    mspRate: crop.msp,
    totalExpectedPayout: totalPayout,
    centreId: centre.id,
    centreName: centre.name,
    date: targetDate,
    slotId: targetSlot.id,
    slotTimeRange: targetSlot.timeRange,
    status: 'SLOT_BOOKED',
    source,
    createdAt: nowIso,
    statusHistory: [
      {
        status: 'SLOT_BOOKED',
        timestamp: nowIso,
        note: `Slot booked via ${source} for ${targetDate} (${targetSlot.timeRange}). Token ${token} generated.`
      }
    ],
    smsLog: [
      {
        id: `sms-${Date.now()}`,
        timestamp: nowIso,
        sender: 'DOCA-GOV',
        message: `Dear ${farmerName}, your slot for ${qVal} Qtl ${crop.nameEn} at ${centre.name} is confirmed for ${targetDate}, ${targetSlot.timeRange}. Digital Token: ${token}. Please bring a photo ID.`
      }
    ]
  };

  BOOKINGS.unshift(newBooking);
  return newBooking;
}

function calculateQueueMetrics(booking) {
  if (!booking) return null;
  const centre = getCentreById(booking.centreId);
  const avgMins = centre ? centre.avgMinsPerFarmer : 10;

  // Active queue consists of farmers at this centre today who have ARRIVED or are in QUALITY_CHECK
  const activeInMandi = BOOKINGS.filter(
    b => b.centreId === booking.centreId &&
         b.date === booking.date &&
         (b.status === 'ARRIVED' || b.status === 'QUALITY_CHECK')
  );

  let positionInQueue = 0;
  let estimatedWaitMins = 0;
  let aheadCount = 0;

  if (booking.status === 'SLOT_BOOKED') {
    // Has not arrived yet. Estimated wait upon arrival is based on current queue + earlier slots
    aheadCount = activeInMandi.length;
    positionInQueue = aheadCount + 1;
    estimatedWaitMins = aheadCount * avgMins;
  } else if (booking.status === 'ARRIVED') {
    // Count how many arrived BEFORE this booking that are still in ARRIVED or QUALITY_CHECK
    const arrivedTime = new Date(booking.statusHistory.find(h => h.status === 'ARRIVED')?.timestamp || booking.createdAt).getTime();
    aheadCount = activeInMandi.filter(b => {
      if (b.id === booking.id) return false;
      const bArrivedTime = new Date(b.statusHistory.find(h => h.status === 'ARRIVED')?.timestamp || b.createdAt).getTime();
      return bArrivedTime <= arrivedTime;
    }).length;

    positionInQueue = aheadCount + 1;
    estimatedWaitMins = Math.max(5, aheadCount * avgMins);
  } else if (booking.status === 'QUALITY_CHECK') {
    aheadCount = 0;
    positionInQueue = 1;
    estimatedWaitMins = 5; // Currently on testing table
  } else {
    // PROCURED or PAYMENT_CREDITED
    aheadCount = 0;
    positionInQueue = 0;
    estimatedWaitMins = 0;
  }

  return {
    aheadCount,
    positionInQueue,
    estimatedWaitMins,
    avgProcessingMinsPerFarmer: avgMins,
    totalActiveInMandi: activeInMandi.length
  };
}

function getBookingByTokenOrMobile(query) {
  const q = String(query).trim().toUpperCase();
  const found = BOOKINGS.find(b => b.token.toUpperCase() === q || b.mobile === q || b.id === query);
  if (!found) return null;

  const queueMetrics = calculateQueueMetrics(found);
  return {
    ...found,
    queueMetrics
  };
}

function getBookingsList(filters = {}) {
  let list = [...BOOKINGS];

  if (filters.centreId) {
    list = list.filter(b => b.centreId === filters.centreId);
  }
  if (filters.date) {
    list = list.filter(b => b.date === filters.date);
  }
  if (filters.status && filters.status !== 'ALL') {
    list = list.filter(b => b.status === filters.status);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      b => b.token.toLowerCase().includes(s) ||
           b.farmerName.toLowerCase().includes(s) ||
           b.mobile.includes(s)
    );
  }

  // Attach queue metrics to each booking
  return list.map(b => ({
    ...b,
    queueMetrics: calculateQueueMetrics(b)
  }));
}

function advanceBookingStatus(bookingId, newStatus, meta = {}) {
  const booking = BOOKINGS.find(b => b.id === bookingId || b.token === bookingId);
  if (!booking) throw new Error(`Booking with ID/Token '${bookingId}' not found.`);

  if (!STATUS_ORDER.includes(newStatus)) {
    throw new Error(`Invalid status '${newStatus}'. Allowed: ${STATUS_ORDER.join(', ')}`);
  }

  const nowIso = new Date().toISOString();
  booking.status = newStatus;

  let note = meta.note || `Status updated to ${STATUS_LABELS[newStatus]?.en || newStatus}`;
  let smsText = '';

  if (newStatus === 'ARRIVED') {
    note = meta.note || 'Farmer arrived at Mandi gate. Physical verification done.';
    smsText = `Gate Entry Verified: Welcome to ${booking.centreName}, ${booking.farmerName}. Token ${booking.token} is queued. Please proceed to Inspection Lane.`;
  } else if (newStatus === 'QUALITY_CHECK') {
    const moisture = meta.moistureContent !== undefined ? parseFloat(meta.moistureContent) : 11.5;
    const grade = meta.qualityGrade || 'Grade A (FAQ Standard)';
    booking.qualityCheck = {
      moistureContent: moisture,
      qualityGrade: grade,
      passed: true,
      testedAt: nowIso
    };
    note = meta.note || `Moisture tested: ${moisture}%. Grade: ${grade}. Standard met.`;
    smsText = `Quality Check Cleared! Token ${booking.token}: Moisture at ${moisture}% (Pass). Proceeding to Electronic Weighbridge.`;
  } else if (newStatus === 'PROCURED') {
    const weighedQty = meta.weighedQuantity ? parseFloat(meta.weighedQuantity) : booking.quantity;
    const grossAmt = weighedQty * booking.mspRate;
    const receiptNo = `DOCA-${booking.token.split('-')[1] || 'REC'}-${Math.floor(1000 + Math.random() * 9000)}`;

    booking.procurementDetails = {
      weighedQuantity: weighedQty,
      grossAmount: grossAmt,
      procuredAt: nowIso,
      receiptNo
    };
    note = meta.note || `Weighed: ${weighedQty} Qtl @ ₹${booking.mspRate}/Qtl. Total: ₹${grossAmt.toLocaleString('en-IN')}. Receipt #${receiptNo}`;
    smsText = `Procurement Completed: ${weighedQty} Qtl ${booking.cropNameEn} weighed & accepted. Total payout: ₹${grossAmt.toLocaleString('en-IN')}. Receipt: ${receiptNo}. DBT payment initiated.`;
  } else if (newStatus === 'PAYMENT_CREDITED') {
    const utr = meta.utrNumber || `DBT${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
    const amt = booking.procurementDetails?.grossAmount || booking.totalExpectedPayout;
    booking.paymentDetails = {
      utrNumber: utr,
      creditedAmount: amt,
      bankName: meta.bankName || 'Aadhaar Linked Bank A/c (DBT)',
      creditedAt: nowIso
    };
    note = meta.note || `DBT Payment of ₹${amt.toLocaleString('en-IN')} credited via PFMS. UTR: ${utr}`;
    smsText = `Payment Credited! ₹${amt.toLocaleString('en-IN')} has been transferred to your Aadhaar-linked Bank A/c. UTR Ref: ${utr}. Thank you for using DoCA Mandi Portal.`;
  }

  // Push status history
  booking.statusHistory.push({
    status: newStatus,
    timestamp: nowIso,
    note
  });

  // Push SMS log
  if (smsText) {
    booking.smsLog.push({
      id: `sms-${Date.now()}`,
      timestamp: nowIso,
      sender: 'DOCA-GOV',
      message: smsText
    });
  }

  return {
    ...booking,
    queueMetrics: calculateQueueMetrics(booking)
  };
}

function getCentreStats(centreId, date) {
  const targetDate = date || todayStr;
  const centre = getCentreById(centreId);
  const centreBookings = BOOKINGS.filter(
    b => (!centreId || b.centreId === centreId) && b.date === targetDate
  );

  const totalBooked = centreBookings.length;
  const arrivedCount = centreBookings.filter(b => b.status === 'ARRIVED').length;
  const qualityCheckCount = centreBookings.filter(b => b.status === 'QUALITY_CHECK').length;
  const procuredCount = centreBookings.filter(b => b.status === 'PROCURED').length;
  const paymentCreditedCount = centreBookings.filter(b => b.status === 'PAYMENT_CREDITED').length;
  const pendingCount = centreBookings.filter(b => b.status === 'SLOT_BOOKED').length;

  const totalTonnageQtl = centreBookings
    .filter(b => b.status === 'PROCURED' || b.status === 'PAYMENT_CREDITED')
    .reduce((sum, b) => sum + (b.procurementDetails?.weighedQuantity || b.quantity), 0);

  const totalPayout = centreBookings
    .filter(b => b.status === 'PAYMENT_CREDITED')
    .reduce((sum, b) => sum + (b.paymentDetails?.creditedAmount || b.totalExpectedPayout), 0);

  return {
    centreId: centre ? centre.id : 'ALL',
    centreName: centre ? centre.name : 'All Procurement Centres',
    date: targetDate,
    totalBooked,
    pendingArrival: pendingCount,
    inQueueArrived: arrivedCount,
    inQualityCheck: qualityCheckCount,
    procuredToday: procuredCount,
    paymentCreditedCount,
    activeCongestionScore: arrivedCount > 6 ? 'HIGH' : arrivedCount > 2 ? 'MODERATE' : 'OPTIMAL',
    totalTonnageQtl: Math.round(totalTonnageQtl * 10) / 10,
    totalPayoutDisbursed: totalPayout,
    avgWaitTimeMins: arrivedCount * (centre ? centre.avgMinsPerFarmer : 10)
  };
}

module.exports = {
  getAllCentres,
  getCentreById,
  getAllCrops,
  getCropById,
  getSlotsForCentre,
  createBooking,
  getBookingByTokenOrMobile,
  getBookingsList,
  advanceBookingStatus,
  getCentreStats,
  STATUS_ORDER,
  STATUS_LABELS,
  getTodayDateString
};
