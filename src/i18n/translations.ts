import { ProblemType, ComplaintStatus } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  switchLang: string;
  
  // Navigation
  navHome: string;
  navNewComplaint: string;
  navMyComplaints: string;
  navTrack: string;
  navPanchayatLogin: string;
  navPanchayatDashboard: string;
  navLogout: string;

  // Hero & Landing
  heroTitle: string;
  heroDesc: string;
  registerComplaintBtn: string;
  trackComplaintBtn: string;
  panchayatStaffPortal: string;
  quickStatsTitle: string;
  resolvedComplaints: string;
  activeComplaints: string;
  avgResolutionTime: string;

  // Awareness tips
  awarenessTipsTitle: string;
  awarenessTips: string[];

  // Problem types
  problemTypes: Record<ProblemType, { title: string; desc: string }>;

  // Statuses
  statuses: Record<ComplaintStatus, { label: string; desc: string }>;

  // Form Steps
  stepAuth: string;
  stepVillage: string;
  stepCategory: string;
  stepPhotoGps: string;
  stepDetails: string;
  stepReview: string;

  // Auth / Login
  phoneAuthTitle: string;
  phoneAuthDesc: string;
  enterMobileNumber: string;
  mobilePlaceholder: string;
  sendOtp: string;
  sendingOtp: string;
  enterOtp: string;
  otpPlaceholder: string;
  verifyOtp: string;
  verifyingOtp: string;
  resendOtp: string;
  resendIn: string;
  changeNumber: string;
  useDemoResident: string;
  phoneConsentNote: string;
  invalidPhoneError: string;
  invalidOtpError: string;

  // Village select
  selectVillageTitle: string;
  selectVillageDesc: string;
  pilotVillageBadge: string;
  villageLabel: string;
  mandalLabel: string;
  districtLabel: string;
  pinLabel: string;

  // Category select
  chooseCategoryTitle: string;
  chooseCategoryDesc: string;

  // GPS & Photo
  photoGpsTitle: string;
  photoGpsDesc: string;
  takePhotoBtn: string;
  retakePhotoBtn: string;
  uploadingPhoto: string;
  gpsCapturing: string;
  gpsSuccess: string;
  gpsFailed: string;
  gpsAccuracy: string;
  gpsLatLong: string;
  locationNotVerified: string;
  locationNotVerifiedMsg: string;
  cameraPermissionDenied: string;
  mapPreviewTitle: string;

  // Complaint details
  detailsTitle: string;
  laneLabel: string;
  lanePlaceholder: string;
  laneRequired: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  voiceInputTooltip: string;
  listening: string;
  voiceNotSupported: string;
  charCount: string;

  // Review & Submit
  reviewTitle: string;
  reviewDesc: string;
  consentCheckbox: string;
  submitComplaintBtn: string;
  submitting: string;

  // Success
  submissionSuccess: string;
  complaintRegisteredMsg: string;
  yourComplaintId: string;
  copyId: string;
  copied: string;
  shareWhatsApp: string;
  trackNowBtn: string;
  backToHome: string;

  // Tracking & My Complaints
  myComplaintsTitle: string;
  myComplaintsDesc: string;
  noComplaintsFound: string;
  trackByIdTitle: string;
  trackByIdDesc: string;
  enterComplaintId: string;
  enterRegisteredMobile: string;
  trackSearchBtn: string;
  timelineTitle: string;
  panchayatRemarks: string;
  noRemarksYet: string;
  openGoogleMaps: string;
  locationVerifiedBadge: string;

  // Panchayat Dashboard
  panchayatPortalTitle: string;
  panchayatEmailLabel: string;
  panchayatPasswordLabel: string;
  panchayatLoginBtn: string;
  useDemoPanchayat: string;
  dashboardGreeting: string;
  totalComplaintsCard: string;
  receivedCard: string;
  inProgressCard: string;
  resolvedCard: string;
  topProblemHighlight: string;
  problemDistributionChart: string;
  filterByStatus: string;
  filterByType: string;
  filterByLane: string;
  searchByIdOrMobile: string;
  allOption: string;
  exportCsvBtn: string;
  repeatedProblemBadge: string;
  repeatedProblemTooltip: string;
  updateStatusBtn: string;
  updateStatusModalTitle: string;
  newStatusLabel: string;
  officialRemarkLabel: string;
  officialRemarkPlaceholder: string;
  saveStatusBtn: string;
  savingStatus: string;
  residentContactLabel: string;
  staffOnlyNote: string;

  // Common & Errors
  next: string;
  back: string;
  cancel: string;
  save: string;
  errorGeneric: string;
  offlineNotice: string;
  retryBtn: string;
  demoModeNotice: string;
}

export const translations: Record<'te' | 'en', Translations> = {
  te: {
    appName: 'గ్రామ ఫిర్యాదుల పోర్టల్',
    appSubtitle: 'గ్రామ పంచాయతీ పౌర సేవల వేదిక',
    switchLang: 'English',

    navHome: 'హోమ్',
    navNewComplaint: 'ఫిర్యాదు నమోదు',
    navMyComplaints: 'నా ఫిర్యాదులు',
    navTrack: 'ఫిర్యాదు ట్రాక్',
    navPanchayatLogin: 'సిబ్బంది లాగిన్',
    navPanchayatDashboard: 'పంచాయతీ డాష్‌బోర్డ్',
    navLogout: 'లాగ్ అవుట్',

    heroTitle: 'మీ గ్రామంలోని సమస్యలను సులభంగా పరిష్కరించుకోండి',
    heroDesc: 'మురుగు కాలువలు, వీధి దీపాలు, చెత్త సేకరణ, తాగునీటి సమస్యలను ఫోటో మరియు జీపీఎస్ లొకేషన్‌తో నేరుగా మీ గ్రామ పంచాయతీకి తెలియజేయండి.',
    registerComplaintBtn: 'ఫిర్యాదు నమోదు చేయండి',
    trackComplaintBtn: 'ఫిర్యాదు స్థితి తెలుసుకోండి',
    panchayatStaffPortal: 'పంచాయతీ సిబ్బంది లాగిన్',
    quickStatsTitle: 'గుర్రాజుపాలెం పంచాయతీ నివేదిక',
    resolvedComplaints: 'పరిష్కరించబడినవి',
    activeComplaints: 'పరిశీలనలో ఉన్నవి',
    avgResolutionTime: 'సగటు పరిష్కార సమయం: 48 గంటలు',

    awarenessTipsTitle: 'ఆరోగ్య & పారిశుద్ధ్య అవగాహన',
    awarenessTips: [
      'మురుగునీరు నిల్వ ఉండకుండా చూడండి - దోమల వ్యాప్తిని మరియు డెంగ్యూని అరికట్టండి.',
      'తాగునీటి పాత్రలపై ఎల్లప్పుడూ శుభ్రమైన మూతలు ఉంచండి - స్వచ్ఛమైన నీటిని మాత్రమే తాగండి.',
      'మురుగు కాలువల్లో ప్లాస్టిక్ సంచులు మరియు చెత్త వేయకండి - కాలువల ప్రవాహానికి ఆటంకం కలిగించకండి.',
      'తడి చెత్త మరియు పొడి చెత్తను వేరు చేసి రోజూ పంచాయతీ పారిశుద్ధ్య వాహనానికే అందించండి.',
      'మీ వీధిలో వీధి దీపం వెలగకపోతే వెంటనే ఈ పోర్టల్ ద్వారా పంచాయతీకి తెలియజేయండి.'
    ],

    problemTypes: {
      drain: {
        title: 'మురుగు కాలువ',
        desc: 'కాలువ మూసుకుపోవడం లేదా కాలువ ప్రవాహం ఆగిపోవడం'
      },
      stagnant_water: {
        title: 'నిలిచిన నీరు',
        desc: 'రోడ్డు లేదా ఖాళీ స్థలాలలో మురికి నీరు నిల్వ ఉండటం'
      },
      mosquito: {
        title: 'దోమల సమస్య',
        desc: 'తీవ్రమైన దోమల సమస్య లేదా ఫాగింగ్ అవసరం'
      },
      street_light: {
        title: 'వీధి దీపం',
        desc: 'వీధి దీపం వెలగకపోవడం లేదా వైర్లు తెగిపోవడం'
      },
      waste_collection: {
        title: 'చెత్త సేకరణ',
        desc: 'రోడ్లపై లేదా బహిరంగ ప్రదేశాలలో చెత్త పేరుకుపోవడం'
      },
      drinking_water: {
        title: 'తాగునీరు',
        desc: 'తాగునీటి సరఫరా నిలిచిపోవడం లేదా కలుషిత నీరు రావడం'
      },
      other: {
        title: 'ఇతర సమస్య',
        desc: 'ఇతర గ్రామ పంచాయతీ పారిశుద్ధ్య లేదా పౌర సమస్యలు'
      }
    },

    statuses: {
      received: {
        label: 'స్వీకరించబడింది',
        desc: 'మీ ఫిర్యాదు నమోదు చేయబడింది, పంచాయతీ పరిశీలనకు చేరింది'
      },
      in_progress: {
        label: 'పురోగతిలో ఉంది',
        desc: 'పంచాయతీ సిబ్బంది సమస్య పరిష్కారానికి చర్యలు తీసుకుంటున్నారు'
      },
      resolved: {
        label: 'పరిష్కరించబడింది',
        desc: 'సమస్య విజయవంతంగా పరిష్కరించబడింది'
      }
    },

    stepAuth: 'మొబైల్ ధృవీకరణ',
    stepVillage: 'గ్రామం ఎంపిక',
    stepCategory: 'సమస్య రకం',
    stepPhotoGps: 'ఫోటో & లొకేషన్',
    stepDetails: 'వీధి వివరాలు',
    stepReview: 'సమీక్ష & నమోదు',

    phoneAuthTitle: 'మొబైల్ నంబర్ ద్వారా ప్రవేశించండి',
    phoneAuthDesc: 'OTP ద్వారా సురక్షితంగా మీ ఖాతాలోకి ప్రవేశించండి. పాస్‌వర్డ్ అవసరం లేదు.',
    enterMobileNumber: 'మీ 10 అంకెల మొబైల్ నంబర్',
    mobilePlaceholder: 'ఉదా: 9876543210',
    sendOtp: 'OTP పంపండి',
    sendingOtp: 'OTP పంపుతున్నాము...',
    enterOtp: 'వచ్చిన 6 అంకెల OTP నమోదు చేయండి',
    otpPlaceholder: 'OTP నమోదు చేయండి',
    verifyOtp: 'OTP ధృవీకరించండి',
    verifyingOtp: 'ధృవీకరిస్తున్నాము...',
    resendOtp: 'మరలా OTP పంపండి',
    resendIn: 'సెకన్లలో మళ్లీ పంపవచ్చు',
    changeNumber: 'నంబర్ మార్చండి',
    useDemoResident: 'డెమో నివాసిగా కొనసాగండి (OTP అవసరం లేదు)',
    phoneConsentNote: 'మీ మొబైల్ నంబర్ పంచాయతీ అధికారులకు మాత్రమే కనిపిస్తుంది.',
    invalidPhoneError: 'దయచేసి సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.',
    invalidOtpError: 'తప్పు OTP. దయచేసి సరైన 6 అంకెల కోడ్ నమోదు చేయండి.',

    selectVillageTitle: 'మీ గ్రామాన్ని ఎంచుకోండి',
    selectVillageDesc: 'మీ ఫిర్యాదు మీరు ఎంచుకున్న గ్రామ పంచాయతీకి మాత్రమే చేరుతుంది.',
    pilotVillageBadge: 'పైలట్ ప్రాజెక్ట్ గ్రామం',
    villageLabel: 'గ్రామ పంచాయతీ',
    mandalLabel: 'మండలం',
    districtLabel: 'జిల్లా',
    pinLabel: 'పిన్ కోడ్',

    chooseCategoryTitle: 'సమస్య వర్గాన్ని ఎంచుకోండి',
    chooseCategoryDesc: 'మీ సమస్యకు సరిపోయే విభాగాన్ని తాకండి.',

    photoGpsTitle: 'సమస్య ఉన్న ప్రదేశం ఫోటో తీయండి',
    photoGpsDesc: 'ఫోటో తీసిన క్షణంలోనే ఆటోమేటిక్‌గా మీ ఫోన్ GPS లొకేషన్ రికార్డ్ అవుతుంది.',
    takePhotoBtn: 'కెమెరా తెరవండి / ఫోటో తీయండి',
    retakePhotoBtn: 'మరలా ఫోటో తీయండి',
    uploadingPhoto: 'ఫోటో సిద్ధం అవుతోంది...',
    gpsCapturing: 'జీపీఎస్ (GPS) లొకేషన్ గుర్తిస్తున్నాము...',
    gpsSuccess: 'లొకేషన్ విజయవంతంగా గుర్తించబడింది',
    gpsFailed: 'GPS లొకేషన్ అనుమతి లభించలేదు. చింతించకండి, వీధి పేరు టైప్ చేసి కొనసాగవచ్చు.',
    gpsAccuracy: 'ఖచ్చితత్వం (Accuracy)',
    gpsLatLong: 'అక్షాంశం / రేఖాంశం (Lat / Long)',
    locationNotVerified: 'లొకేషన్ ధృవీకరించబడలేదు',
    locationNotVerifiedMsg: 'GPS అందుబాటులో లేదు. దయచేసి క్రింద మీ వీధి లేదా గుర్తు పేరును స్పష్టంగా రాయండి.',
    cameraPermissionDenied: 'కెమెరా అనుమతి లభించలేదు. దయచేసి గ్యాలరీ నుండి ఫోటో ఎంచుకోండి లేదా కెమెరా అనుమతించండి.',
    mapPreviewTitle: 'మ్యాప్‌లో గుర్తించబడిన ప్రదేశం',

    detailsTitle: 'వీధి పేరు మరియు వివరాలు',
    laneLabel: 'వీధి / కాలనీ / బజారు పేరు (తప్పనిసరి)',
    lanePlaceholder: 'ఉదా: రామాలయం వీధి, బీసీ కాలనీ, మెయిన్ రోడ్డు...',
    laneRequired: 'దయచేసి వీధి పేరు నమోదు చేయండి.',
    descriptionLabel: 'సమస్య వివరణ (ఐచ్ఛికం)',
    descriptionPlaceholder: 'సమస్య గురించి వివరించండి లేదా పక్కనున్న మైక్ నొక్కి తెలుగులో మాట్లాడండి...',
    voiceInputTooltip: 'తెలుగులో మాట్లాడటానికి మైక్ బటన్ నొక్కండి',
    listening: 'వింటున్నాము... తెలుగులో మాట్లాడండి',
    voiceNotSupported: 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సదుపాయం లేదు.',
    charCount: 'అక్షరాలు',

    reviewTitle: 'ఫిర్యాదు వివరాలను పరిశీలించండి',
    reviewDesc: 'సమర్పించే ముందు వివరాలు సరిచూసుకోండి.',
    consentCheckbox: 'నా లొకేషన్ మరియు ఫోటో నా గ్రామ పంచాయతీ సిబ్బందికి మాత్రమే పంపబడునని అంగీకరిస్తున్నాను.',
    submitComplaintBtn: 'ఫిర్యాదు సమర్పించండి',
    submitting: 'సమర్పిస్తున్నాము...',

    submissionSuccess: 'మీ ఫిర్యాదు విజయవంతంగా నమోదైంది!',
    complaintRegisteredMsg: 'మీ సమస్య పంచాయతీ కార్యాలయానికి చేరింది. త్వరలోనే తగిన చర్యలు తీసుకుంటారు.',
    yourComplaintId: 'మీ ఫిర్యాదు సంఖ్య (Complaint ID)',
    copyId: 'నంబర్ కాపీ చేయండి',
    copied: 'కాపీ అయ్యింది!',
    shareWhatsApp: 'వాట్సాప్‌లో షేర్ చేయండి',
    trackNowBtn: 'ఇప్పుడే ట్రాక్ చేయండి',
    backToHome: 'హోమ్ పేజీకి వెళ్లండి',

    myComplaintsTitle: 'నా ఫిర్యాదులు',
    myComplaintsDesc: 'మీరు నమోదు చేసిన ఫిర్యాదులు మరియు వాటి ప్రస్తుత స్థితి.',
    noComplaintsFound: 'మీరు ఇంకా ఎటువంటి ఫిర్యాదులు నమోదు చేయలేదు.',
    trackByIdTitle: 'ఫిర్యాదును శోధించండి',
    trackByIdDesc: 'ఫిర్యాదు సంఖ్య మరియు మొబైల్ నంబర్ ద్వారా స్థితిని తెలుసుకోండి.',
    enterComplaintId: 'ఫిర్యాదు సంఖ్య (ఉదా: GRP-20261106-0001)',
    enterRegisteredMobile: 'నమోదు చేసిన మొబైల్ నంబర్',
    trackSearchBtn: 'స్థితి చూడండి',
    timelineTitle: 'పరిష్కార పురోగతి టైమ్‌లైన్',
    panchayatRemarks: 'పంచాయతీ సిబ్బంది సూచన/సమాధానం',
    noRemarksYet: 'ఇంకా ఎటువంటి సూచన నమోదు కాలేదు.',
    openGoogleMaps: 'గూగుల్ మ్యాప్స్‌లో తెరవండి',
    locationVerifiedBadge: 'GPS ధృవీకరించబడింది',

    panchayatPortalTitle: 'గ్రామ పంచాయతీ అధికారి పోర్టల్',
    panchayatEmailLabel: 'సిబ్బంది ఇమెయిల్',
    panchayatPasswordLabel: 'పాస్‌వర్డ్',
    panchayatLoginBtn: 'లాగిన్ అవ్వండి',
    useDemoPanchayat: 'గుర్రాజుపాలెం పంచాయతీ డెమో లాగిన్ (ఒకే క్లిక్)',
    dashboardGreeting: 'గుర్రాజుపాలెం గ్రామ పంచాయతీ డాష్‌బోర్డ్',
    totalComplaintsCard: 'మొత్తం ఫిర్యాదులు',
    receivedCard: 'స్వీకరించినవి (పెండింగ్)',
    inProgressCard: 'పురోగతిలో ఉన్నవి',
    resolvedCard: 'పరిష్కరించబడినవి',
    topProblemHighlight: 'ప్రధాన సమస్య (అత్యధిక ఫిర్యాదులు)',
    problemDistributionChart: 'సమస్యల విభాగాల వారిగా నివేదిక',
    filterByStatus: 'స్థితి ప్రకారం వడపోత',
    filterByType: 'సమస్య రకం ప్రకారం',
    filterByLane: 'వీధి పేరు ప్రకారం',
    searchByIdOrMobile: 'ఫిర్యాదు సంఖ్య లేదా వీధి ద్వారా శోధించండి...',
    allOption: 'అన్ని',
    exportCsvBtn: 'CSV ఎగుమతి (డౌన్‌లోడ్)',
    repeatedProblemBadge: 'పునరావృత సమస్య (హెచ్చరిక)',
    repeatedProblemTooltip: 'ఈ వీధిలో ఇదే సమస్యపై 3 లేదా అంతకంటే ఎక్కువ ఫిర్యాదులు నమోదయ్యాయి! తక్షణ దృష్టి అవసరం.',
    updateStatusBtn: 'స్థితిని మార్చండి',
    updateStatusModalTitle: 'ఫిర్యాదు పరిష్కార స్థితి అప్‌డేట్',
    newStatusLabel: 'కొత్త స్థితిని ఎంచుకోండి',
    officialRemarkLabel: 'అధికారిక సూచన / చేసిన పని వివరాలు',
    officialRemarkPlaceholder: 'ఉదా: పారిశుద్ధ్య సిబ్బంది ద్వారా కాలువ పూడిక తీయబడింది...',
    saveStatusBtn: 'స్థితిని సేవ్ చేయండి',
    savingStatus: 'సేవ్ చేస్తున్నాము...',
    residentContactLabel: 'నివాసి ఫోన్ నంబర్ (సిబ్బందికి మాత్రమే)',
    staffOnlyNote: 'ఈ సమాచారం గ్రామ పంచాయతీ సిబ్బందికి మాత్రమే అందుబాటులో ఉంటుంది.',

    next: 'తరువాత',
    back: 'వెనుకకు',
    cancel: 'రద్దు',
    save: 'సేవ్ చేయండి',
    errorGeneric: 'ఏదో పొరపాటు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    offlineNotice: 'ఇంటర్నెట్ కనెక్షన్ మందగించింది. వివరాలు సురక్షితంగా ఉన్నాయి, మళ్లీ ప్రయత్నించండి.',
    retryBtn: 'మళ్లీ ప్రయత్నించండి',
    demoModeNotice: 'డెమో మోడ్: డేటా బ్రౌజర్‌లో సేవ్ చేయబడుతోంది.'
  },
  en: {
    appName: 'Village Complaint Portal',
    appSubtitle: 'Gram Panchayat Citizen Grievance Redressal Portal',
    switchLang: 'తెలుగు',

    navHome: 'Home',
    navNewComplaint: 'New Complaint',
    navMyComplaints: 'My Complaints',
    navTrack: 'Track Complaint',
    navPanchayatLogin: 'Staff Login',
    navPanchayatDashboard: 'Panchayat Dashboard',
    navLogout: 'Logout',

    heroTitle: 'Resolve Village Civic Issues Directly with Your Gram Panchayat',
    heroDesc: 'Report drainage, street light, stagnant water, waste collection, and drinking water problems directly to your village Gram Panchayat with GPS photo verification.',
    registerComplaintBtn: 'Register a Complaint',
    trackComplaintBtn: 'Track My Complaint',
    panchayatStaffPortal: 'Panchayat Staff Login',
    quickStatsTitle: 'Gurrajupalem Panchayat Overview',
    resolvedComplaints: 'Resolved',
    activeComplaints: 'Active / In Progress',
    avgResolutionTime: 'Average Resolution: 48 Hours',

    awarenessTipsTitle: 'Public Health & Sanitation Awareness',
    awarenessTips: [
      'Do not allow stagnant water around your home — prevent mosquito breeding and dengue.',
      'Always keep drinking water storage vessels covered and clean.',
      'Do not throw plastic bags or solid waste into drains — protect natural drainage flow.',
      'Segregate wet and dry waste daily and hand it over to the Panchayat sanitation vehicle.',
      'Report any non-working or flickering street lights immediately through this portal.'
    ],

    problemTypes: {
      drain: {
        title: 'Drain / Sewage',
        desc: 'Blocked drainage, overflowing sewage or silt accumulation'
      },
      stagnant_water: {
        title: 'Stagnant Water',
        desc: 'Water pooling on roads or open plots causing foul smell'
      },
      mosquito: {
        title: 'Mosquito Problem',
        desc: 'High mosquito prevalence or urgent fogging needed'
      },
      street_light: {
        title: 'Street Light',
        desc: 'Fused bulb, non-functional light, or broken wiring'
      },
      waste_collection: {
        title: 'Waste Collection',
        desc: 'Uncollected garbage or accumulation of roadside waste'
      },
      drinking_water: {
        title: 'Drinking Water',
        desc: 'Water supply disruption, pipeline leakage or contamination'
      },
      other: {
        title: 'Other Issue',
        desc: 'Other village sanitation, civil or public health issue'
      }
    },

    statuses: {
      received: {
        label: 'Received',
        desc: 'Complaint received and queued for Panchayat inspection'
      },
      in_progress: {
        label: 'In Progress',
        desc: 'Panchayat ground staff has taken up corrective action'
      },
      resolved: {
        label: 'Resolved',
        desc: 'Issue resolved and verified by Gram Panchayat staff'
      }
    },

    stepAuth: 'Mobile OTP',
    stepVillage: 'Select Village',
    stepCategory: 'Problem Type',
    stepPhotoGps: 'GPS Photo',
    stepDetails: 'Street Details',
    stepReview: 'Review & Submit',

    phoneAuthTitle: 'Sign In with Mobile Number',
    phoneAuthDesc: 'Quick OTP verification. No password required for village residents.',
    enterMobileNumber: 'Enter 10-Digit Mobile Number',
    mobilePlaceholder: 'e.g. 9876543210',
    sendOtp: 'Send OTP',
    sendingOtp: 'Sending OTP...',
    enterOtp: 'Enter 6-Digit OTP',
    otpPlaceholder: 'Enter 6 digits',
    verifyOtp: 'Verify OTP',
    verifyingOtp: 'Verifying...',
    resendOtp: 'Resend OTP',
    resendIn: 'Resend in',
    changeNumber: 'Change Number',
    useDemoResident: 'Continue as Demo Resident (Instant)',
    phoneConsentNote: 'Your mobile number is only shared with your Gram Panchayat officials.',
    invalidPhoneError: 'Please enter a valid 10-digit Indian mobile number (+91).',
    invalidOtpError: 'Invalid OTP. Please check the 6-digit code received.',

    selectVillageTitle: 'Select Your Gram Panchayat',
    selectVillageDesc: 'Your complaint will be sent directly and exclusively to the selected Panchayat.',
    pilotVillageBadge: 'Pilot Project Village',
    villageLabel: 'Gram Panchayat',
    mandalLabel: 'Mandal',
    districtLabel: 'District',
    pinLabel: 'PIN Code',

    chooseCategoryTitle: 'Choose Problem Type',
    chooseCategoryDesc: 'Select the category that best describes the issue.',

    photoGpsTitle: 'Capture GPS Photo of Problem',
    photoGpsDesc: 'When you take a photo, your phone GPS coordinates are automatically recorded at that exact moment.',
    takePhotoBtn: 'Open Camera / Capture Photo',
    retakePhotoBtn: 'Retake Photo',
    uploadingPhoto: 'Preparing photo...',
    gpsCapturing: 'Acquiring GPS coordinates...',
    gpsSuccess: 'GPS Location successfully captured',
    gpsFailed: 'GPS location denied or unavailable. You can proceed by typing your lane name.',
    gpsAccuracy: 'Accuracy',
    gpsLatLong: 'Latitude / Longitude',
    locationNotVerified: 'Location not verified',
    locationNotVerifiedMsg: 'GPS could not be acquired. Please clearly enter your lane or landmark below.',
    cameraPermissionDenied: 'Camera access denied. Please allow camera permissions or upload an image file.',
    mapPreviewTitle: 'Captured GPS Location on Map',

    detailsTitle: 'Street Name & Description',
    laneLabel: 'Lane / Street / Colony Name (Required)',
    lanePlaceholder: 'e.g. Ramalayam Veedhi, BC Colony, Main Road...',
    laneRequired: 'Please enter the street or lane name.',
    descriptionLabel: 'Description (Optional)',
    descriptionPlaceholder: 'Describe the problem, or tap the microphone to speak in Telugu...',
    voiceInputTooltip: 'Tap microphone to speak in Telugu',
    listening: 'Listening... speak now in Telugu',
    voiceNotSupported: 'Speech recognition is not supported in this browser.',
    charCount: 'Characters',

    reviewTitle: 'Review Your Complaint',
    reviewDesc: 'Confirm all details before sending to the Gram Panchayat.',
    consentCheckbox: 'I agree that my location and photo will be shared only with my village Panchayat.',
    submitComplaintBtn: 'Submit Complaint',
    submitting: 'Submitting complaint...',

    submissionSuccess: 'Complaint Registered Successfully!',
    complaintRegisteredMsg: 'Your grievance has been forwarded to the Gram Panchayat office for action.',
    yourComplaintId: 'Complaint ID',
    copyId: 'Copy ID',
    copied: 'Copied!',
    shareWhatsApp: 'Share on WhatsApp',
    trackNowBtn: 'Track Status Now',
    backToHome: 'Return to Home',

    myComplaintsTitle: 'My Complaints',
    myComplaintsDesc: 'All grievances submitted from this mobile number and their current status.',
    noComplaintsFound: 'No complaints submitted yet.',
    trackByIdTitle: 'Track by Complaint ID',
    trackByIdDesc: 'Check the real-time resolution status of any complaint using its ID and mobile number.',
    enterComplaintId: 'Complaint ID (e.g. GRP-20261106-0001)',
    enterRegisteredMobile: 'Registered Mobile Number',
    trackSearchBtn: 'Check Status',
    timelineTitle: 'Resolution Timeline',
    panchayatRemarks: 'Panchayat Staff Remarks',
    noRemarksYet: 'No remarks added by staff yet.',
    openGoogleMaps: 'Open in Google Maps',
    locationVerifiedBadge: 'GPS Verified',

    panchayatPortalTitle: 'Gram Panchayat Staff Portal',
    panchayatEmailLabel: 'Staff Email',
    panchayatPasswordLabel: 'Password',
    panchayatLoginBtn: 'Login to Dashboard',
    useDemoPanchayat: 'Gurrajupalem Demo Staff Login (One-click)',
    dashboardGreeting: 'Gurrajupalem Gram Panchayat Dashboard',
    totalComplaintsCard: 'Total Complaints',
    receivedCard: 'Received (Pending)',
    inProgressCard: 'In Progress',
    resolvedCard: 'Resolved',
    topProblemHighlight: 'Top Grievance Category',
    problemDistributionChart: 'Complaints by Problem Type',
    filterByStatus: 'Filter by Status',
    filterByType: 'Filter by Problem Type',
    filterByLane: 'Filter by Lane',
    searchByIdOrMobile: 'Search by ID or Lane...',
    allOption: 'All',
    exportCsvBtn: 'Export CSV',
    repeatedProblemBadge: 'Repeated Problem Alert',
    repeatedProblemTooltip: '3 or more complaints of this category reported in this lane/area! Requires immediate attention.',
    updateStatusBtn: 'Update Status',
    updateStatusModalTitle: 'Update Grievance Resolution Status',
    newStatusLabel: 'Select New Status',
    officialRemarkLabel: 'Official Staff Remark / Action Taken',
    officialRemarkPlaceholder: 'e.g. Drain desilted and cleared by sanitation team today...',
    saveStatusBtn: 'Save Status Update',
    savingStatus: 'Saving...',
    residentContactLabel: 'Resident Mobile (Visible only to staff)',
    staffOnlyNote: 'This information is visible strictly to authorized Gram Panchayat personnel.',

    next: 'Next',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    errorGeneric: 'Something went wrong. Please try again.',
    offlineNotice: 'Network connection is slow or offline. Your inputs are saved.',
    retryBtn: 'Retry',
    demoModeNotice: 'Demo Mode: Data saved locally in browser storage.'
  }
};
