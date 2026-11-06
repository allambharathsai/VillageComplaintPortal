import React, { useState, useEffect } from 'react';
import {
  ListChecks,
  PlusCircle,
  Clock,
  Calendar,
  ChevronRight,
  MapPin,
  Building2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { Complaint, Language, UserProfile } from '../types';
import { fetchComplaints } from '../services/db';
import { ComplaintDetailModal } from './ComplaintDetailModal';

interface MyComplaintsListProps {
  lang: Language;
  currentUser: UserProfile;
  onNavigateNew: () => void;
}

export const MyComplaintsList: React.FC<MyComplaintsListProps> = ({
  lang,
  currentUser,
  onNavigateNew
}) => {
  const t = translations[lang];
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaints({ residentUid: currentUser.uid });
      setComplaints(data);
    } catch (err) {
      console.warn('Error loading my complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
    const handleUpdate = () => loadComplaints();
    window.addEventListener('vpc_complaints_updated', handleUpdate);
    return () => window.removeEventListener('vpc_complaints_updated', handleUpdate);
  }, [currentUser.uid]);

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

  return (
    <div className="max-w-xl mx-auto pb-24 px-4 pt-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.myComplaintsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.myComplaintsDesc}
          </p>
        </div>

        <button
          onClick={loadComplaints}
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          title="Refresh"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="text-sm font-medium">{t.submitting}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-4 my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ListChecks className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {t.noComplaintsFound}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              {lang === 'te'
                ? 'మీ వీధిలో ఉన్న మురుగు, వీధి దీపాలు లేదా చెత్త సమస్యను వెంటనే నివేదించండి.'
                : 'Report drainage, street light, or garbage issues in your lane directly to the Panchayat.'}
            </p>
          </div>
          <button
            onClick={onNavigateNew}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.registerComplaintBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((item) => {
            const categoryInfo = t.problemTypes[item.problemType] || { title: item.problemType };
            const statusInfo = t.statuses[item.status] || { label: item.status };

            return (
              <div
                key={item.id}
                onClick={() => setSelectedComplaint(item)}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex gap-3.5 items-start"
              >
                {/* Photo Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.complaintId}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {categoryInfo.title}
                  </h3>

                  <p className="text-xs text-slate-600 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.laneName}</span>
                  </p>

                  {item.remarks && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded-lg mt-2 truncate flex items-center gap-1">
                      <Building2 className="w-3 h-3 shrink-0 text-emerald-600" />
                      <span className="truncate">{item.remarks}</span>
                    </p>
                  )}
                </div>

                <div className="self-center text-slate-300 pl-1">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        lang={lang}
        currentUser={currentUser}
      />
    </div>
  );
};
