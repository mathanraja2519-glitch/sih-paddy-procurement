// frontend/src/i18n.js
// Complete English, Hindi, and Tamil localization dictionaries

export const translations = {
  en: {
    // Header & Navigation
    appTitle: 'DoCA Smart Mandi Platform',
    appSubtitle: 'Dept. of Consumer Affairs, Food & Public Distribution',
    govtOfIndia: 'Government of India | SIH 2026',
    farmerPortal: 'Farmer Portal',
    staffDashboard: 'Mandi Staff Dashboard',
    offlineHelp: 'Offline Helpline / IVR',
    language: 'Language',
    
    // Status badges & Steps
    status_SLOT_BOOKED: 'Slot Booked',
    status_ARRIVED: 'Arrived at Mandi',
    status_QUALITY_CHECK: 'Quality Check',
    status_PROCURED: 'Procured & Weighed',
    status_PAYMENT_CREDITED: 'Payment Credited',

    statusDesc_SLOT_BOOKED: 'Your procurement slot is confirmed. Arrive at Mandi within the slot window.',
    statusDesc_ARRIVED: 'Entry verified at gate. You are currently in the queue for inspection.',
    statusDesc_QUALITY_CHECK: 'Grain sample undergoing moisture & foreign matter assay in Mandi lab.',
    statusDesc_PROCURED: 'Quality approved and weighed on electronic weighbridge. Procurement receipt issued.',
    statusDesc_PAYMENT_CREDITED: 'Direct Benefit Transfer (DBT) completed directly to your bank account.',

    // Farmer Portal Tabs
    tabBookSlot: 'Book New Slot',
    tabTrackToken: 'Live Queue & Token Tracker',
    tabOfflineHelp: 'Non-Smartphone / IVR Guide',

    // Booking Form
    bookingTitle: 'Farmer Registration & Slot Booking',
    bookingSubtitle: 'Book your guaranteed Mandi slot in 3 simple steps to avoid long queues',
    farmerNameLabel: 'Farmer Full Name',
    farmerNamePlaceholder: 'e.g. Ramesh Singh',
    mobileLabel: '10-Digit Mobile Number (For SMS)',
    mobilePlaceholder: '9876543210',
    aadhaarLabel: 'Aadhaar Card (Last 4 Digits)',
    aadhaarPlaceholder: 'XXXX',
    cropLabel: 'Select Crop for Procurement',
    cropPlaceholder: '-- Choose Crop --',
    mspLabel: 'Official MSP Rate',
    quantityLabel: 'Estimated Quantity (in Quintals / क्विंटल)',
    quantityPlaceholder: 'e.g. 40',
    totalEstimatedValue: 'Total Estimated Value at MSP',
    centreLabel: 'Select Procurement Centre / Mandi',
    centrePlaceholder: '-- Choose Nearest Mandi --',
    dateLabel: 'Procurement Date',
    selectSlotLabel: 'Select Time Slot',
    slotAvailable: 'Available',
    slotFillingFast: 'Filling Fast',
    slotFull: 'Full',
    capacityLeft: 'slots left',
    bookSlotButton: 'Confirm & Generate Digital Token',
    bookingInProgress: 'Confirming Slot with Mandi...',
    autoFillDemo: 'Auto-fill Demo Data',

    // Token & Tracker View
    tokenLookupTitle: 'Track Digital Token & Live Queue',
    tokenLookupSubtitle: 'Enter your Token ID (e.g. DOCA-KRN-101) or 10-digit Mobile Number',
    tokenSearchPlaceholder: 'Enter Token Number or Mobile...',
    searchBtn: 'Search Status',
    recentTokens: 'Quick Demo Tokens:',
    
    // Live Queue Card
    digitalToken: 'Digital Token',
    farmerDetails: 'Farmer Information',
    procurementDetails: 'Procurement Summary',
    queuePositionHeading: 'Your Live Queue Position',
    farmersAhead: 'Vehicles / Farmers Ahead of You',
    estimatedWaitTime: 'Estimated Wait Time',
    minsApprox: 'Minutes (Approx.)',
    turnSoon: 'Please stay near your vehicle. Your turn is coming up next!',
    inTesting: 'Your grain lot is currently under testing at the laboratory bay.',
    completedNotice: 'Procurement & payment transfer completed successfully.',
    scheduledNotice: 'Your slot is scheduled. Please arrive at the Mandi during your designated window.',
    refreshStatus: 'Refresh Live Status',
    autoSyncNotice: 'Live sync active • Auto-refreshes every 3 seconds',

    // Timeline
    progressTimeline: 'Live Procurement Lifecycle Timeline',
    auditLog: 'Status Log & Mandi Notes',
    
    // SMS Simulator
    smsFeedTitle: 'Simulated Mobile SMS Inbox',
    smsFeedSubtitle: 'Real-time SMS messages sent to registered mobile number',
    noSmsYet: 'No SMS messages received yet.',

    // Staff Dashboard
    staffTitle: 'Mandi Management & Queue Control Station',
    staffSubtitle: 'Live gate check-in, quality testing verification, and DBT disbursement',
    selectMandiFilter: 'Select Procurement Centre:',
    selectDateFilter: 'Filter Date:',
    searchFarmerPlaceholder: 'Search by Token, Farmer Name or Mobile...',
    filterAll: 'All Bookings',
    filterBooked: 'Booked',
    filterArrived: 'Arrived (In Queue)',
    filterQuality: 'In Quality Check',
    filterProcured: 'Procured',
    filterPaid: 'Payment Credited',

    // Staff Stats Cards
    statTotalBookings: 'Total Today',
    statInQueue: 'Arrived / In Queue',
    statTesting: 'Under Inspection',
    statCompleted: 'Procured Lots',
    statTonnage: 'Tonnage (Qtl)',
    statDisbursed: 'DBT Disbursed',

    // Staff Actions
    actionMarkArrived: 'Mark Arrived',
    actionStartQuality: 'Start Quality Check',
    actionCompleteProcure: 'Complete Procurement',
    actionDisbursePayment: 'Disburse DBT Payment',
    actionDone: 'Completed',

    // Quality Modal
    qualityModalTitle: 'Quality & Moisture Inspection Record',
    moisturePercent: 'Moisture Content (%)',
    moistureMaxPermissible: 'Max Permissible Limit:',
    qualityGrade: 'Quality Grade',
    gradeA: 'Grade A (FAQ - Fair Average Quality)',
    gradeB: 'Grade B (Acceptable with deduction)',
    inspectionNotes: 'Assay Officer Notes',
    approveQualityBtn: 'Approve & Move to Weighbridge',

    // Procurement Modal
    weighbridgeModalTitle: 'Electronic Weighbridge & Procurement',
    finalWeight: 'Net Weighed Quantity (Quintals)',
    mspCalculatedAmount: 'Calculated Gross Payout (₹)',
    confirmProcurementBtn: 'Generate Procurement Receipt',

    // Payment Modal
    paymentModalTitle: 'Direct Benefit Transfer (DBT) Payout',
    bankAccountTarget: 'Aadhaar-Linked Bank Account',
    payoutAmount: 'Disbursement Amount (₹)',
    utrNumberLabel: 'PFMS / Bank UTR Reference Number',
    processPaymentBtn: 'Authorize DBT Bank Credit',

    // IVR & Feature Phone Assistance
    ivrHeroTitle: 'Assistance for Farmers Without Smartphones',
    ivrHeroSubtitle: 'The DoCA platform is 100% accessible via Basic Phone Call (IVR), SMS, and Village CSC Centers',
    ivrFeature1Title: '1. Toll-Free IVR Voice Booking',
    ivrFeature1Desc: 'Dial 1800-180-26032 (Toll Free). An automated voice assistant in your local language guides you through choosing your crop, quantity, and slot.',
    ivrFeature2Title: '2. 2-Way SMS Slot Booking',
    ivrFeature2Desc: 'Send an SMS: "BOOK <MANDI_CODE> <CROP> <QTY>" to 56070. You receive your digital token and slot confirmation via return SMS instantly.',
    ivrFeature3Title: '3. Gram Panchayat Common Service Centres (CSC)',
    ivrFeature3Desc: 'Visit your local Village Level Entrepreneur (VLE) at the CSC or Kisan Call Centre for assisted slot booking and printout.',
    simulateIvrCall: 'Simulate Incoming IVR Phone Call Booking',
    closeBtn: 'Close Guide',

    // Footer
    copyright: 'Ministry of Consumer Affairs, Food & Public Distribution | SIH 2026 Smart Automation Solution',
    techStack: 'Node.js Express + React SPA • Real-time Queue Algorithm'
  },

  hi: {
    // Header & Navigation
    appTitle: 'उपभोक्ता मामले मंत्रालय - स्मार्ट मंडी खरीद पोर्टल',
    appSubtitle: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय, भारत सरकार',
    govtOfIndia: 'भारत सरकार | स्मार्ट इंडिया हैकाथॉन 2026',
    farmerPortal: 'किसान पोर्टल (किसान सुविधा)',
    staffDashboard: 'मंडी अधिकारी डैशबोर्ड',
    offlineHelp: 'ऑफ़लाइन हेल्पलाइन / आईवीआर',
    language: 'भाषा',
    
    // Status badges & Steps
    status_SLOT_BOOKED: 'स्लॉट बुक हुआ',
    status_ARRIVED: 'मंडी में आगमन',
    status_QUALITY_CHECK: 'गुणवत्ता व नमी जांच',
    status_PROCURED: 'खरीद व तौल संपन्न',
    status_PAYMENT_CREDITED: 'खाते में भुगतान जमा',

    statusDesc_SLOT_BOOKED: 'आपका खरीद स्लॉट सफलतापूर्वक बुक हो गया है। निर्धारित समय पर मंडी पहुंचें।',
    statusDesc_ARRIVED: 'गेट पर प्रवेश सत्यापित। आप वर्तमान में जांच कतार में हैं।',
    statusDesc_QUALITY_CHECK: 'प्रयोगशाला में फसल के नमूने की नमी व गुणवत्ता परीक्षण जारी है।',
    statusDesc_PROCURED: 'गुणवत्ता पास हुई और इलेक्ट्रॉनिक कांटे पर तौल पूरी हुई। रसीद जारी।',
    statusDesc_PAYMENT_CREDITED: 'डीबीटी (DBT) के माध्यम से आपके बैंक खाते में राशि जमा कर दी गई है।',

    // Farmer Portal Tabs
    tabBookSlot: 'नया स्लॉट बुक करें',
    tabTrackToken: 'लाइव कतार एवं टोकन ट्रैकर',
    tabOfflineHelp: 'बिना स्मार्टफोन / आईवीआर सुविधा',

    // Booking Form
    bookingTitle: 'किसान पंजीकरण एवं टोकन स्लॉट बुकिंग',
    bookingSubtitle: 'लंबी कतारों से बचने के लिए 3 आसान चरणों में अपनी मंडी का समय बुक करें',
    farmerNameLabel: 'किसान का पूरा नाम',
    farmerNamePlaceholder: 'उदा. रमेश सिंह',
    mobileLabel: '10 अंकों का मोबाइल नंबर (एसएमएस के लिए)',
    mobilePlaceholder: '9876543210',
    aadhaarLabel: 'आधार कार्ड (अंतिम 4 अंक)',
    aadhaarPlaceholder: 'XXXX',
    cropLabel: 'खरीद के लिए फसल चुनें',
    cropPlaceholder: '-- फसल का चयन करें --',
    mspLabel: 'सरकारी न्यूनतम समर्थन मूल्य (MSP)',
    quantityLabel: 'अनुमानित मात्रा (क्विंटल में)',
    quantityPlaceholder: 'उदा. 40',
    totalEstimatedValue: 'एमएसपी पर कुल अनुमानित मूल्य',
    centreLabel: 'खरीद केंद्र / मंडी चुनें',
    centrePlaceholder: '-- नजदीकी मंडी चुनें --',
    dateLabel: 'खरीद की तिथि',
    selectSlotLabel: 'समय स्लॉट चुनें',
    slotAvailable: 'उपलब्ध',
    slotFillingFast: 'शीघ्र भर रहा है',
    slotFull: 'भर चुका है',
    capacityLeft: 'स्लॉट शेष',
    bookSlotButton: 'पुष्टि करें और डिजिटल टोकन प्राप्त करें',
    bookingInProgress: 'मंडी स्लॉट सुरक्षित किया जा रहा है...',
    autoFillDemo: 'डेमो डेटा भरें',

    // Token & Tracker View
    tokenLookupTitle: 'डिजिटल टोकन एवं लाइव कतार स्थिति',
    tokenLookupSubtitle: 'अपना टोकन नंबर (उदा. DOCA-KRN-101) या 10 अंकों का मोबाइल नंबर दर्ज करें',
    tokenSearchPlaceholder: 'टोकन नंबर या मोबाइल दर्ज करें...',
    searchBtn: 'स्थिति खोजें',
    recentTokens: 'डेमो टोकन शीघ्र चुनें:',
    
    // Live Queue Card
    digitalToken: 'डिजिटल टोकन',
    farmerDetails: 'किसान विवरण',
    procurementDetails: 'खरीद विवरण',
    queuePositionHeading: 'आपकी लाइव कतार स्थिति',
    farmersAhead: 'आपसे आगे किसान / गाड़ियां',
    estimatedWaitTime: 'अनुमानित प्रतीक्षा समय',
    minsApprox: 'मिनट (लगभग)',
    turnSoon: 'कृपया अपने वाहन के पास रहें। आपकी बारी जल्द ही आने वाली है!',
    inTesting: 'आपकी फसल का परीक्षण लैब काउंटर पर चल रहा है।',
    completedNotice: 'खरीद प्रक्रिया और भुगतान सफलतापूर्वक पूर्ण हो चुका है।',
    scheduledNotice: 'आपका स्लॉट निर्धारित है। कृपया अपने आवंटित समय पर मंडी पधारें।',
    refreshStatus: 'लाइव स्थिति रीफ्रेश करें',
    autoSyncNotice: 'लाइव सिंक सक्रिय • प्रत्येक 3 सेकंड में स्वतः अपडेट',

    // Timeline
    progressTimeline: 'लाइव खरीद प्रगति समयरेखा',
    auditLog: 'स्थिति विवरण एवं मंडी टिप्पणी',
    
    // SMS Simulator
    smsFeedTitle: 'मोबाइल एसएमएस संदेश (सिमुलेटर)',
    smsFeedSubtitle: 'पंजीकृत मोबाइल नंबर पर भेजे गए वास्तविक समय के एसएमएस',
    noSmsYet: 'अभी तक कोई एसएमएस संदेश प्राप्त नहीं हुआ है।',

    // Staff Dashboard
    staffTitle: 'मंडी प्रबंधन एवं कतार नियंत्रण स्टेशन',
    staffSubtitle: 'लाइव गेट एंट्री, गुणवत्ता परीक्षण और डीबीटी भुगतान प्रबंधन',
    selectMandiFilter: 'खरीद केंद्र चुनें:',
    selectDateFilter: 'तिथि चुनें:',
    searchFarmerPlaceholder: 'टोकन, किसान का नाम या मोबाइल से खोजें...',
    filterAll: 'सभी बुकिंग',
    filterBooked: 'बुक किया गया',
    filterArrived: 'आगमन (कतार में)',
    filterQuality: 'जांच जारी',
    filterProcured: 'खरीद संपन्न',
    filterPaid: 'भुगतान जमा',

    // Staff Stats Cards
    statTotalBookings: 'आज की कुल बुकिंग',
    statInQueue: 'मंडी में कतार',
    statTesting: 'जांच प्रक्रियाधीन',
    statCompleted: 'सफल खरीद',
    statTonnage: 'कुल मात्रा (क्विंटल)',
    statDisbursed: 'कुल भुगतान (₹)',

    // Staff Actions
    actionMarkArrived: 'आगमन दर्ज करें',
    actionStartQuality: 'जांच शुरू करें',
    actionCompleteProcure: 'तौल व खरीद पूरी करें',
    actionDisbursePayment: 'डीबीटी भुगतान करें',
    actionDone: 'पूर्ण',

    // Quality Modal
    qualityModalTitle: 'गुणवत्ता एवं नमी परीक्षण रिपोर्ट',
    moisturePercent: 'नमी की मात्रा (%)',
    moistureMaxPermissible: 'अधिकतम अनुमेय सीमा:',
    qualityGrade: 'गुणवत्ता ग्रेड',
    gradeA: 'ग्रेड A (मानक FAQ गुणवत्ता)',
    gradeB: 'ग्रेड B (कटौती सहित स्वीकार्य)',
    inspectionNotes: 'परीक्षण अधिकारी की टिप्पणी',
    approveQualityBtn: 'स्वीकृत करें और कांटा तौल पर भेजें',

    // Procurement Modal
    weighbridgeModalTitle: 'इलेक्ट्रॉनिक कांटा एवं खरीद स्वीकृति',
    finalWeight: 'अंतिम शुद्ध तौल (क्विंटल में)',
    mspCalculatedAmount: 'एमएसपी के आधार पर कुल देय राशि (₹)',
    confirmProcurementBtn: 'खरीद रसीद जारी करें',

    // Payment Modal
    paymentModalTitle: 'प्रत्यक्ष लाभ अंतरण (DBT) भुगतान',
    bankAccountTarget: 'आधार लिंक बैंक खाता',
    payoutAmount: 'भुगतान की जाने वाली राशि (₹)',
    utrNumberLabel: 'PFMS / बैंक यूटीआर संदर्भ संख्या',
    processPaymentBtn: 'डीबीटी खाते में राशि भेजें',

    // IVR & Feature Phone Assistance
    ivrHeroTitle: 'बिना स्मार्टफोन वाले किसान भाइयों के लिए विशेष सुविधा',
    ivrHeroSubtitle: 'यह प्रणाली साधारण कीपैड फोन, आईवीआर कॉल, एसएमएस और सीएससी केंद्रों के माध्यम से 100% सुलभ है',
    ivrFeature1Title: '1. टोल-फ्री आईवीआर वॉइस कॉल',
    ivrFeature1Desc: 'टोल-फ्री 1800-180-26032 पर कॉल करें। स्वचालित वॉइस सहायक आपकी मातृभाषा में फसल, मात्रा और स्लॉट चुनने में मदद करेगा।',
    ivrFeature2Title: '2. 2-तरफ़ा एसएमएस स्लॉट बुकिंग',
    ivrFeature2Desc: 'संदेश भेजें: "BOOK <मंडी_कोड> <फसल> <मात्रा>" 56070 पर। तुरंत वापसी एसएमएस में टोकन और समय प्राप्त होगा।',
    ivrFeature3Title: '3. ग्राम पंचायत सीएससी केंद्र',
    ivrFeature3Desc: 'अपने नजदीकी कॉमन सर्विस सेंटर (CSC) या किसान कॉल सेंटर पर जाकर आसानी से स्लॉट बुक करवाएं।',
    simulateIvrCall: 'आईवीआर फोन कॉल बुकिंग का डेमो देखें',
    closeBtn: 'बंद करें',

    // Footer
    copyright: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय | स्मार्ट इंडिया हैकाथॉन 2026',
    techStack: 'Node.js Express + React • लाइव कतार गणना एल्गोरिदम'
  },

  ta: {
    // Header & Navigation
    appTitle: 'DoCA ஸ்மார்ட் மண்டி கொள்முதல் தளம்',
    appSubtitle: 'நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்',
    govtOfIndia: 'இந்திய அரசு | ஸ்மார்ட் இந்தியா ஹேக்கத்தான் 2026',
    farmerPortal: 'விவசாயிகள் தளம் (உழவர் சேவை)',
    staffDashboard: 'மண்டி அலுவலர் கட்டுப்பாட்டு அறை',
    offlineHelp: 'ஆஃப்லைன் உதவி / IVR சேவை',
    language: 'மொழி',
    
    // Status badges & Steps
    status_SLOT_BOOKED: 'நேர ஒதுக்கீடு செய்யப்பட்டது',
    status_ARRIVED: 'மண்டிக்கு வருகை தந்தார்',
    status_QUALITY_CHECK: 'தர மற்றும் ஈரப்பத சோதனை',
    status_PROCURED: 'கொள்முதல் மற்றும் எடை சரிபார்ப்பு',
    status_PAYMENT_CREDITED: 'வங்கிக் கணக்கில் பணம் செலுத்தப்பட்டது',

    statusDesc_SLOT_BOOKED: 'உங்கள் கொள்முதல் நேரம் உறுதி செய்யப்பட்டது. ஒதுக்கப்பட்ட நேரத்தில் மண்டிக்கு வரவும்.',
    statusDesc_ARRIVED: 'நுழைவு வாயிலில் சரிபார்க்கப்பட்டது. தற்போது ஆய்வுக் காத்திருப்பு வரிசையில் உள்ளீர்கள்.',
    statusDesc_QUALITY_CHECK: 'ஆய்வகத்தில் தானிய மாதிரியின் ஈரப்பதம் மற்றும் தரம் பரிசோதிக்கப்படுகிறது.',
    statusDesc_PROCURED: 'தரம் ஏற்கப்பட்டு மின்னணு எடை மேடையில் எடை போடப்பட்டது. ரசீது வழங்கப்பட்டது.',
    statusDesc_PAYMENT_CREDITED: 'நேரடி மானியப் பரிமாற்றம் (DBT) மூலம் உங்கள் வங்கிக் கணக்கில் பணம் வரவு வைக்கப்பட்டது.',

    // Farmer Portal Tabs
    tabBookSlot: 'புதிய நேர ஸ்லாட் பதிவு',
    tabTrackToken: 'நேரலை வரிசை & டோக்கன் நிலை',
    tabOfflineHelp: 'ஸ்மார்ட்போன் இல்லாதோருக்கான IVR வழிகாட்டி',

    // Booking Form
    bookingTitle: 'விவசாயி பதிவு மற்றும் டோக்கன் முன்பதிவு',
    bookingSubtitle: 'நீண்ட வரிசைகளைத் தவிர்க்க 3 எளிய படிகளில் உங்கள் மண்டி கொள்முதல் நேரத்தை பதிவு செய்யுங்கள்',
    farmerNameLabel: 'விவசாயியின் முழு பெயர்',
    farmerNamePlaceholder: 'எ.கா: சுப்பிரமணியன் (Ramesh Singh)',
    mobileLabel: '10 இலக்க கைபேசி எண் (SMS பெற)',
    mobilePlaceholder: '9876543210',
    aadhaarLabel: 'ஆதார் அட்டை (கடைசி 4 இலக்கங்கள்)',
    aadhaarPlaceholder: 'XXXX',
    cropLabel: 'கொள்முதல் செய்ய வேண்டிய பயிர்',
    cropPlaceholder: '-- பயிரைத் தேர்ந்தெடுக்கவும் --',
    mspLabel: 'அரசு குறைந்தபட்ச ஆதரவு விலை (MSP)',
    quantityLabel: 'மதிப்பிடப்பட்ட அளவு (குவிண்டாலில்)',
    quantityPlaceholder: 'எ.கா: 40',
    totalEstimatedValue: 'MSP அடிப்படையிலான மொத்த மதிப்பு',
    centreLabel: 'கொள்முதல் நிலையம் / மண்டி',
    centrePlaceholder: '-- அருகிலுள்ள மண்டியைத் தேர்ந்தெடுக்கவும் --',
    dateLabel: 'கொள்முதல் தேதி',
    selectSlotLabel: 'நேர ஸ்லாட்டைத் தேர்ந்தெடுக்கவும்',
    slotAvailable: 'கிடைக்கிறது',
    slotFillingFast: 'விரைவில் நிறைகிறது',
    slotFull: 'நிறைந்துவிட்டது',
    capacityLeft: 'இடங்கள் உள்ளன',
    bookSlotButton: 'உறுதி செய்து டிஜிட்டல் டோக்கன் பெறவும்',
    bookingInProgress: 'மண்டி ஸ்லாட் முன்பதிவு செய்யப்படுகிறது...',
    autoFillDemo: 'மாதிரி தரவை நிரப்பவும்',

    // Token & Tracker View
    tokenLookupTitle: 'டிஜிட்டல் டோக்கன் மற்றும் நேரலை வரிசை நிலை',
    tokenLookupSubtitle: 'உங்கள் டோக்கன் எண் (எ.கா: DOCA-KRN-101) அல்லது 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
    tokenSearchPlaceholder: 'டோக்கன் எண் அல்லது மொபைல் உள்ளிடவும்...',
    searchBtn: 'நிலையைத் தேடவும்',
    recentTokens: 'மாதிரி டோக்கன்கள்:',
    
    // Live Queue Card
    digitalToken: 'டிஜிட்டல் டோக்கன்',
    farmerDetails: 'விவசாயி விவரங்கள்',
    procurementDetails: 'கொள்முதல் சுருக்கம்',
    queuePositionHeading: 'உங்கள் நேரலை வரிசை நிலை',
    farmersAhead: 'உங்களுக்கு முன்னால் உள்ள வாகனங்கள் / விவசாயிகள்',
    estimatedWaitTime: 'மதிப்பிடப்பட்ட காத்திருப்பு நேரம்',
    minsApprox: 'நிமிடங்கள் (தோராயமாக)',
    turnSoon: 'தயவுசெய்து உங்கள் வாகனத்தின் அருகே இருங்கள். உங்கள் முறை விரைவில் வருகிறது!',
    inTesting: 'உங்கள் தானிய மாதிரி ஆய்வகத்தில் சோதனை செய்யப்படுகிறது.',
    completedNotice: 'கொள்முதல் மற்றும் வங்கிப் பணப் பரிமாற்றம் வெற்றிகரமாக முடிந்தது.',
    scheduledNotice: 'உங்கள் நேரம் ஒதுக்கப்பட்டுள்ளது. தயவுசெய்து குறித்த நேரத்தில் மண்டிக்கு வரவும்.',
    refreshStatus: 'நேரலை நிலையை புதுப்பிக்கவும்',
    autoSyncNotice: 'நேரலை இணைப்பு இயங்குகிறது • ஒவ்வொரு 3 வினாடிக்கும் புதுப்பிக்கப்படும்',

    // Timeline
    progressTimeline: 'கொள்முதல் செயல்முறை நேரவரிசை',
    auditLog: 'மண்டி அலுவலர் குறிப்புகள் & பதிவு',
    
    // SMS Simulator
    smsFeedTitle: 'மொபைல் SMS செய்திப்பெட்டி (செயலிழப்பு)',
    smsFeedSubtitle: 'பதிவு செய்யப்பட்ட கைபேசி எண்ணுக்கு அனுப்பப்பட்ட உடனடி SMS செய்திகள்',
    noSmsYet: 'இதுவரை SMS செய்திகள் எதுவும் பெறப்படவில்லை.',

    // Staff Dashboard
    staffTitle: 'மண்டி மேலாண்மை மற்றும் வரிசைக் கட்டுப்பாட்டு மையம்',
    staffSubtitle: 'நேரலை வாயில் சரிபார்ப்பு, தரப் பரிசோதனை மற்றும் DBT பணப்பட்டுவாடா',
    selectMandiFilter: 'கொள்முதல் நிலையத்தைத் தேர்ந்தெடுக்கவும்:',
    selectDateFilter: 'தேதியை வடிகட்டவும்:',
    searchFarmerPlaceholder: 'டோக்கன், விவசாயி பெயர் அல்லது மொபைல் மூலம் தேடவும்...',
    filterAll: 'அனைத்து பதிவுகள்',
    filterBooked: 'முன்பதிவு செய்தவை',
    filterArrived: 'வந்தவை (வரிசையில்)',
    filterQuality: 'தரப் பரிசோதனையில்',
    filterProcured: 'கொள்முதல் செய்யப்பட்டவை',
    filterPaid: 'பணம் செலுத்தப்பட்டவை',

    // Staff Stats Cards
    statTotalBookings: 'இன்றைய மொத்த முன்பதிவு',
    statInQueue: 'மண்டியில் காத்திருப்போர்',
    statTesting: 'சோதனையில் உள்ளவை',
    statCompleted: 'கொள்முதல் முடிந்தது',
    statTonnage: 'மொத்த அளவு (குவிண்டால்)',
    statDisbursed: 'DBT பட்டுவாடா (₹)',

    // Staff Actions
    actionMarkArrived: 'வருகையைப் பதிவுசெய்',
    actionStartQuality: 'தரப் பரிசோதனை தொடங்கு',
    actionCompleteProcure: 'கொள்முதலை உறுதிசெய்',
    actionDisbursePayment: 'DBT பணம் அனுப்பு',
    actionDone: 'முடிந்தது',

    // Quality Modal
    qualityModalTitle: 'தர மற்றும் ஈரப்பத சோதனை அறிக்கை',
    moisturePercent: 'ஈரப்பத அளவு (%)',
    moistureMaxPermissible: 'அனுமதிக்கப்பட்ட அதிகபட்ச வரம்பு:',
    qualityGrade: 'தர நிலை (Grade)',
    gradeA: 'தரம் A (FAQ - நிலையான நல்ல தரம்)',
    gradeB: 'தரம் B (சிறு கழிவுடன் ஏற்றுக்கொள்ளத்தக்கது)',
    inspectionNotes: 'ஆய்வு அலுவலர் குறிப்புகள்',
    approveQualityBtn: 'ஏற்றுக்கொண்டு எடை மேடைக்கு அனுப்பவும்',

    // Procurement Modal
    weighbridgeModalTitle: 'மின்னணு எடை மேடை மற்றும் கொள்முதல்',
    finalWeight: 'இறுதி எடை அளவு (குவிண்டாலில்)',
    mspCalculatedAmount: 'MSP அடிப்படையில் கணக்கிடப்பட்ட தொகை (₹)',
    confirmProcurementBtn: 'கொள்முதல் ரசீதை உருவாக்கவும்',

    // Payment Modal
    paymentModalTitle: 'நேரடிப் பலன் பரிமாற்றம் (DBT) பட்டுவாடா',
    bankAccountTarget: 'ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கு',
    payoutAmount: 'செலுத்தப்படும் தொகை (₹)',
    utrNumberLabel: 'PFMS / வங்கி UTR குறிப்பு எண்',
    processPaymentBtn: 'DBT வங்கிக் கணக்கில் பணத்தைச் செலுத்து',

    // IVR & Feature Phone Assistance
    ivrHeroTitle: 'ஸ்மார்ட்போன் இல்லாத விவசாயிகளுக்கான சிறப்பு வசதி',
    ivrHeroSubtitle: 'இத்தளம் சாதாரண பட்டன் போன், IVR குரல் அழைப்பு, SMS மற்றும் CSC மையங்கள் மூலமாகவும் இயங்கும்',
    ivrFeature1Title: '1. கட்டணமில்லா IVR குரல் அழைப்பு',
    ivrFeature1Desc: 'கட்டணமில்லா எண் 1800-180-26032 ஐ அழைக்கவும். உங்கள் தாய்மொழியில் தானியங்கி உதவியாளர் பயிர், அளவு மற்றும் நேரத்தைத் தேர்வு செய்ய வழிகாட்டும்.',
    ivrFeature2Title: '2. 2-வழி SMS முன்பதிவு',
    ivrFeature2Desc: '"BOOK <மண்டி_குறியீடு> <பயிர்> <அளவு>" என 56070 க்கு SMS அனுப்பவும். உடனடி மறு SMS-ல் டோக்கன் மற்றும் நேரம் அனுப்பப்படும்.',
    ivrFeature3Title: '3. கிராம பஞ்சாயத்து இ-சேவை மையம் (CSC)',
    ivrFeature3Desc: 'உங்கள் கிராம இ-சேவை மையம் (CSC) அல்லது உழவர் உதவி மையத்திற்குச் சென்று எளிதாக ஸ்லாட் முன்பதிவு செய்து அச்சிடப்பட்ட டோக்கனைப் பெறலாம்.',
    simulateIvrCall: 'IVR குரல் அழைப்பு முன்பதிவு டெமோவை முயற்சிக்கவும்',
    closeBtn: 'மூடவும்',

    // Footer
    copyright: 'நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம் | SIH 2026',
    techStack: 'Node.js Express + React • நேரலை வரிசைக் கணிப்பு அல்காரிதம்'
  }
};

// Crop localization helper
export const getCropDisplayName = (crop, lang) => {
  if (!crop) return '';
  if (lang === 'hi') return crop.nameHi || crop.nameEn;
  if (lang === 'ta') {
    const tamilCrops = {
      'WHEAT': 'கோதுமை (Wheat)',
      'PADDY': 'நெல் / சம்பா (Paddy)',
      'MUSTARD': 'கடுகு (Mustard)',
      'GRAM': 'கொண்டைக்கடலை / சுண்டல் (Gram)',
      'MAIZE': 'மக்காச்சோளம் (Maize)',
      'SOYBEAN': 'சோயாபீன்ஸ் (Soybean)'
    };
    return tamilCrops[crop.id] || crop.nameEn;
  }
  return crop.nameEn;
};

// Mandi localization helper
export const getCentreDisplayName = (centre, lang) => {
  if (!centre) return '';
  if (lang === 'hi') return centre.nameHi || centre.name;
  if (lang === 'ta') {
    const tamilCentres = {
      'KRN-01': 'கர்னால் மத்திய வேளாண் சந்தை (ஹரியானா)',
      'BPL-02': 'போபால் மாநில குடிமைப் பொருட்கள் மையம் (ம.பி)',
      'GNT-03': 'குண்டூர் பிராந்திய கொள்முதல் மையம் (ஆ.பி)',
      'LKO-04': 'லக்னோ எஃப்சிஐ மண்டல கிடங்கு (உ.பி)'
    };
    return tamilCentres[centre.id] || centre.name;
  }
  return centre.name;
};
