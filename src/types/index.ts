export type Language = 'te' | 'en';

export type ProblemType =
  | 'drain'
  | 'stagnant_water'
  | 'mosquito'
  | 'street_light'
  | 'waste_collection'
  | 'drinking_water'
  | 'other';

export type ComplaintStatus = 'received' | 'in_progress' | 'resolved';

export type UserRole = 'resident' | 'panchayat' | 'admin';

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number; // in meters
  capturedAt: string;
  verified: boolean;
  error?: string;
}

export interface StatusHistoryItem {
  status: ComplaintStatus;
  remark: string;
  byUid: string;
  byName?: string;
  at: string;
}

export interface Complaint {
  id: string; // Firestore document ID
  complaintId: string; // formatted GRP-YYYYMMDD-0001
  villageId: string;
  villageCode: string;
  problemType: ProblemType;
  description: string;
  laneName: string;
  photoUrl: string;
  location: LocationData;
  status: ComplaintStatus;
  remarks: string;
  statusHistory: StatusHistoryItem[];
  residentUid: string;
  residentMobile: string;
  createdAt: string;
  updatedAt: string;
}

export interface Village {
  id: string;
  name: string;
  nameTe: string;
  mandal: string;
  mandalTe?: string;
  district: string;
  districtTe?: string;
  pinCode: string;
  code: string;
  lat: number;
  lng: number;
}

export interface UserProfile {
  uid: string;
  role: UserRole;
  mobile?: string;
  email?: string;
  villageId?: string;
  name?: string;
  createdAt: string;
}
