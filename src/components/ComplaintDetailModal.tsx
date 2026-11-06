import React from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Calendar,
  Share2
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { Complaint, Language, UserProfile } from '../types';
import { MapPreview } from './MapPreview';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentUser: UserProfile | null;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  lang,
  currentUser
}) => {
  const t = translations[lang];

  if (!isOpen || !complaint) return null;

  const isPanchayatStaff = currentUser?.role === 'panchayat';
  const categoryInfo = t.problemTypes[complaint.problemType];
  const statusInfo = t.statuses[complaint.status];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const handleOpenGoogleMaps = () => {
    if (complaint.location?.lat && complaint.location?.lng) {
      window.open(
        `https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`,
        '_blank'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Complaint Header */}
        <div className="pr-8">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-mono text-sm sm:text-base font-black text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              {complaint.complaintId}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${getStatusBadge(
                complaint.status
              )}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {categoryInfo.title}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(complaint.createdAt).toLocaleString(lang === 'te' ? 'te-IN' : 'en-IN')}</span>
          </p>
        </div>

        {/* Complaint Photo */}
        {complaint.photoUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video max-h-60 shadow-inner">
            <img
              src={complaint.photoUrl}
              alt="Grievance location"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Location & Lane Details */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                {t.laneLabel}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {complaint.laneName}
              </span>
            </div>

            {complaint.location?.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                <CheckCircle className="w-3 h-3" />
                {t.locationVerifiedBadge}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md shrink-0">
                <AlertCircle className="w-3 h-3" />
                {t.locationNotVerified}
              </span>
            )}
          </div>

          {complaint.description && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium block mb-0.5">
                {t.descriptionLabel}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200">
                "{complaint.description}"
              </p>
            </div>
          )}

          {/* Map Preview & Google Maps Link */}
          {complaint.location?.lat && complaint.location?.lng ? (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {t.mapPreviewTitle}
                </span>
                <button
                  type="button"
                  onClick={handleOpenGoogleMaps}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>{t.openGoogleMaps}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <MapPreview
                lat={complaint.location.lat}
                lng={complaint.location.lng}
                accuracy={complaint.location.accuracy}
                heightClass="h-40"
                popupText={`${complaint.complaintId} - ${complaint.laneName}`}
              />
            </div>
          ) : null}

          {/* Resident Contact: Visible ONLY to Panchayat Staff */}
          {isPanchayatStaff && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-blue-700 font-semibold block">
                  {t.residentContactLabel}
                </span>
                <span className="font-mono text-sm font-bold text-blue-950">
                  +91 {complaint.residentMobile}
                </span>
              </div>
              <a
                href={`tel:+91${complaint.residentMobile}`}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          )}
        </div>

        {/* Status Timeline Audit Trail */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            {t.timelineTitle}
          </h4>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaint.statusHistory?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 relative pl-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 bg-white ${
                    item.status === 'resolved'
                      ? 'border-emerald-500 text-emerald-600'
                      : item.status === 'in_progress'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-blue-500 text-blue-600'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'resolved'
                        ? 'bg-emerald-500'
                        : item.status === 'in_progress'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                </div>

                <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 capitalize">
                      {t.statuses[item.status]?.label || item.status}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.at).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-normal">{item.remark}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Panchayat Official Remark Box */}
        {complaint.remarks && (
          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-900 block mb-0.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              {t.panchayatRemarks}
            </span>
            <p className="text-emerald-950 font-medium leading-relaxed">
              {complaint.remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
