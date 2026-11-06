import { Village, Complaint } from '../types';

export const SEED_VILLAGES: Village[] = [
  {
    id: 'gurrajupalem',
    name: 'Gurrajupalem',
    nameTe: 'గుర్రాజుపాలెం',
    mandal: 'Gaddamanugu Konduru (G.Konduru)',
    mandalTe: 'గడ్డమణుగు కొండూరు (జి.కొండూరు)',
    district: 'NTR District',
    districtTe: 'ఎన్టీఆర్ జిల్లా',
    pinCode: '521230',
    code: 'GRP',
    lat: 16.7348,
    lng: 80.6198
  },
  {
    id: 'gaddamanugu',
    name: 'Gaddamanugu',
    nameTe: 'గడ్డమణుగు',
    mandal: 'G.Konduru',
    mandalTe: 'జి.కొండూరు',
    district: 'NTR District',
    districtTe: 'ఎన్టీఆర్ జిల్లా',
    pinCode: '521230',
    code: 'GDM',
    lat: 16.7190,
    lng: 80.6050
  },
  {
    id: 'chevuturu',
    name: 'Chevuturu',
    nameTe: 'చెవుటూరు',
    mandal: 'G.Konduru',
    mandalTe: 'జి.కొండూరు',
    district: 'NTR District',
    districtTe: 'ఎన్టీఆర్ జిల్లా',
    pinCode: '521229',
    code: 'CVT',
    lat: 16.7550,
    lng: 80.6380
  },
  {
    id: 'konduru',
    name: 'Konduru',
    nameTe: 'కొండూరు',
    mandal: 'G.Konduru',
    mandalTe: 'జి.కొండూరు',
    district: 'NTR District',
    districtTe: 'ఎన్టీఆర్ జిల్లా',
    pinCode: '521229',
    code: 'KDR',
    lat: 16.7020,
    lng: 80.5910
  }
];

export const DEMO_PANCHAYAT_USER = {
  email: 'panchayat.gurrajupalem@example.com',
  password: 'panchayat123',
  villageId: 'gurrajupalem',
  name: 'Gurrajupalem Panchayat Secretary (పంచాయతీ కార్యదర్శి)'
};

export const DEMO_RESIDENT_PHONE = '9876543210';
export const DEMO_OTP = '123456';

// 10 Sample complaints for Gurrajupalem demo dashboard, clearly marked as demo data
// Note: 3 complaints in "BC Colony - Ramalayam Veedhi" have problemType 'drain' to trigger Repeated Problem badge!
export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_demo_1',
    complaintId: 'GRP-20261105-0001',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'drain',
    description: 'రామాలయం వీధి చివర మురుగు కాలువ పూడికతో మూసుకుపోయింది. వర్షం పడితే నీరు రోడ్డుపైకి వస్తోంది.',
    laneName: 'BC Colony - Ramalayam Veedhi',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7351,
      lng: 80.6201,
      accuracy: 8,
      capturedAt: '2026-11-05T09:15:00.000Z',
      verified: true
    },
    status: 'in_progress',
    remarks: 'పారిశుద్ధ్య సిబ్బందికి సమాచారం అందించడం జరిగింది. రేపు ఉదయం పూడిక తీత పనులు ప్రారంభమవుతాయి.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-05T09:15:00.000Z'
      },
      {
        status: 'in_progress',
        remark: 'పారిశుద్ధ్య సిబ్బంది కేటాయించబడ్డారు',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-05T14:30:00.000Z'
      }
    ],
    residentUid: 'demo_resident_1',
    residentMobile: '9876543210',
    createdAt: '2026-11-05T09:15:00.000Z',
    updatedAt: '2026-11-05T14:30:00.000Z'
  },
  {
    id: 'cmp_demo_2',
    complaintId: 'GRP-20261105-0002',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'drain',
    description: 'మా ఇంటి ముందు కాలువ ప్రవాహం ఆగిపోయింది, దుర్వాసన వస్తోంది.',
    laneName: 'BC Colony - Ramalayam Veedhi',
    photoUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7353,
      lng: 80.6203,
      accuracy: 12,
      capturedAt: '2026-11-05T11:20:00.000Z',
      verified: true
    },
    status: 'received',
    remarks: 'పరిశీలనలో ఉంది',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-05T11:20:00.000Z'
      }
    ],
    residentUid: 'demo_resident_2',
    residentMobile: '9848022334',
    createdAt: '2026-11-05T11:20:00.000Z',
    updatedAt: '2026-11-05T11:20:00.000Z'
  },
  {
    id: 'cmp_demo_3',
    complaintId: 'GRP-20261105-0003',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'drain',
    description: 'ప్లాస్టిక్ వ్యర్థాలు అడ్డుపడటం వల్ల కాలువ పొంగి రోడ్డుపైకి వస్తోంది.',
    laneName: 'BC Colony - Ramalayam Veedhi',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7350,
      lng: 80.6200,
      accuracy: 6,
      capturedAt: '2026-11-05T16:45:00.000Z',
      verified: true
    },
    status: 'received',
    remarks: 'రేపు పారిశుద్ధ్య వాహనం పంపబడుతుంది',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-05T16:45:00.000Z'
      }
    ],
    residentUid: 'demo_resident_3',
    residentMobile: '9988776655',
    createdAt: '2026-11-05T16:45:00.000Z',
    updatedAt: '2026-11-05T16:45:00.000Z'
  },
  {
    id: 'cmp_demo_4',
    complaintId: 'GRP-20261104-0001',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'street_light',
    description: 'పంచాయతీ ఆఫీస్ రోడ్డులోని స్తంభం వద్ద వీధి దీపం వారం రోజుల నుండి వెలగడం లేదు.',
    laneName: 'Panchayat Office Road',
    photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7342,
      lng: 80.6190,
      accuracy: 10,
      capturedAt: '2026-11-04T18:10:00.000Z',
      verified: true
    },
    status: 'resolved',
    remarks: 'కొత్త LED బల్బ్ అమర్చడం జరిగింది. లైట్ పనిచేస్తోంది.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-04T18:10:00.000Z'
      },
      {
        status: 'in_progress',
        remark: 'ఎలక్ట్రీషియన్‌కు ఆదేశాలు జారీ చేయబడ్డాయి',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-05T09:00:00.000Z'
      },
      {
        status: 'resolved',
        remark: 'కొత్త LED బల్బ్ అమర్చి సమస్య పరిష్కరించబడింది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-05T17:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_1',
    residentMobile: '9876543210',
    createdAt: '2026-11-04T18:10:00.000Z',
    updatedAt: '2026-11-05T17:00:00.000Z'
  },
  {
    id: 'cmp_demo_5',
    complaintId: 'GRP-20261104-0002',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'stagnant_water',
    description: 'స్కూల్ గ్రౌండ్ ప్రక్కన ఖాళీ స్థలంలో నీరు నిలిచి దుర్వాసన వస్తోంది, దోమలు ఎక్కువయ్యాయి.',
    laneName: 'ZPH School Road',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7360,
      lng: 80.6210,
      accuracy: 15,
      capturedAt: '2026-11-04T10:00:00.000Z',
      verified: true
    },
    status: 'in_progress',
    remarks: 'బ్లీచింగ్ పౌడర్ చల్లి మట్టితో నింపే పనులు చేపట్టాము.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-04T10:00:00.000Z'
      },
      {
        status: 'in_progress',
        remark: 'పారిశుద్ధ్య తనిఖీ జరిగింది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-05T11:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_4',
    residentMobile: '9440112233',
    createdAt: '2026-11-04T10:00:00.000Z',
    updatedAt: '2026-11-05T11:00:00.000Z'
  },
  {
    id: 'cmp_demo_6',
    complaintId: 'GRP-20261103-0001',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'mosquito',
    description: 'ఎస్సీ కాలనీలో విపరీతంగా దోమలు ఉన్నాయి. దయచేసి ఫాగింగ్ చేయించండి.',
    laneName: 'SC Colony, 2nd Cross',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7330,
      lng: 80.6180,
      accuracy: 20,
      capturedAt: '2026-11-03T16:30:00.000Z',
      verified: true
    },
    status: 'resolved',
    remarks: 'కాలనీ మొత్తం ఫాగింగ్ స్ప్రే చేయబడింది మరియు యాంటీ లార్వా ద్రావణం చల్లబడింది.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-03T16:30:00.000Z'
      },
      {
        status: 'resolved',
        remark: 'ఫాగింగ్ పూర్తయింది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-04T19:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_5',
    residentMobile: '9849556677',
    createdAt: '2026-11-03T16:30:00.000Z',
    updatedAt: '2026-11-04T19:00:00.000Z'
  },
  {
    id: 'cmp_demo_7',
    complaintId: 'GRP-20261103-0002',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'waste_collection',
    description: 'మెయిన్ బజారులో రోడ్డు పక్కన చెత్త కుప్పగా పేరుకుపోయింది. పశువులు లాగుతున్నాయి.',
    laneName: 'Main Bazaar Road',
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7345,
      lng: 80.6195,
      accuracy: 14,
      capturedAt: '2026-11-03T17:15:00.000Z',
      verified: true
    },
    status: 'resolved',
    remarks: 'ట్రాక్టర్ ద్వారా చెత్తను తరలించి బ్లీచింగ్ చల్లించాము.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-03T17:15:00.000Z'
      },
      {
        status: 'resolved',
        remark: 'చెత్త క్లియర్ చేయబడింది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-04T10:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_6',
    residentMobile: '9390223344',
    createdAt: '2026-11-03T17:15:00.000Z',
    updatedAt: '2026-11-04T10:00:00.000Z'
  },
  {
    id: 'cmp_demo_8',
    complaintId: 'GRP-20261102-0001',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'drinking_water',
    description: 'తాగునీటి కుళాయి పైప్ లీక్ అవుతోంది. నీరు వృధా అవుతోంది.',
    laneName: 'Rythu Seva Kendram Street',
    photoUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7355,
      lng: 80.6185,
      accuracy: 9,
      capturedAt: '2026-11-02T08:30:00.000Z',
      verified: true
    },
    status: 'resolved',
    remarks: 'ప్లంబర్ చేత పైప్ లైన్ జాయింట్ మార్చడం జరిగింది.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-02T08:30:00.000Z'
      },
      {
        status: 'resolved',
        remark: 'పైప్ రిపేర్ పూర్తయింది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-02T15:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_1',
    residentMobile: '9876543210',
    createdAt: '2026-11-02T08:30:00.000Z',
    updatedAt: '2026-11-02T15:00:00.000Z'
  },
  {
    id: 'cmp_demo_9',
    complaintId: 'GRP-20261102-0002',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'street_light',
    description: 'నీటి ట్యాంక్ రోడ్డులోని స్ట్రీట్ లైట్ వెలగడం లేదు.',
    laneName: 'Overhead Tank Lane',
    photoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7338,
      lng: 80.6205,
      accuracy: 0,
      capturedAt: '2026-11-02T19:00:00.000Z',
      verified: false,
      error: 'Location permission denied by user'
    },
    status: 'in_progress',
    remarks: 'లైన్ తనిఖీ చేయబడుతోంది',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-02T19:00:00.000Z'
      },
      {
        status: 'in_progress',
        remark: 'పరిశీలనలో ఉంది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-03T11:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_7',
    residentMobile: '9123456780',
    createdAt: '2026-11-02T19:00:00.000Z',
    updatedAt: '2026-11-03T11:00:00.000Z'
  },
  {
    id: 'cmp_demo_10',
    complaintId: 'GRP-20261101-0001',
    villageId: 'gurrajupalem',
    villageCode: 'GRP',
    problemType: 'other',
    description: 'గ్రామ ప్రాథమిక ఆరోగ్య ఉపకేంద్రం ముందు ముళ్ల పొదలు పెరిగి ఇబ్బందిగా ఉంది.',
    laneName: 'Health Sub-Centre Lane',
    photoUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80',
    location: {
      lat: 16.7365,
      lng: 80.6192,
      accuracy: 11,
      capturedAt: '2026-11-01T10:15:00.000Z',
      verified: true
    },
    status: 'resolved',
    remarks: 'పారిశుద్ధ్య సిబ్బంది ద్వారా ముళ్ల పొదలు తొలగించి శుభ్రం చేయించాము.',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది',
        byUid: 'system',
        byName: 'పోర్టల్ సిస్టమ్',
        at: '2026-11-01T10:15:00.000Z'
      },
      {
        status: 'resolved',
        remark: 'శుభ్రం చేయబడింది',
        byUid: 'officer_grp_1',
        byName: 'పంచాయతీ కార్యదర్శి',
        at: '2026-11-01T16:00:00.000Z'
      }
    ],
    residentUid: 'demo_resident_8',
    residentMobile: '9701122334',
    createdAt: '2026-11-01T10:15:00.000Z',
    updatedAt: '2026-11-01T16:00:00.000Z'
  }
];
