import React, { useState } from 'react';
import { Search, X, AlertCircle, RefreshCw, CheckCircle, MapPin } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Complaint, Language, UserProfile } from '../types';
import { trackComplaintById } from '../services/db';
import { ComplaintDetailModal } from './ComplaintDetailModal';

interface TrackComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentUser: UserProfile | null;
}

export const TrackComplaintModal: React.FC<TrackComplaintModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentUser
}) => {
  const t = translations[lang];
  const [complaintId, setComplaintId] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Complaint | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId.trim()) return;

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const found = await trackComplaintById(complaintId, mobile);
      if (found) {
        setResult(found);
      } else {
        setError(
          lang === 'te'
            ? 'ఫిర్యాదు కనుగొనబడలేదు. దయచేసి ఫిర్యాదు సంఖ్య మరియు మొబైల్ నంబర్ సరిచూసుకోండి.'
            : 'Complaint not found. Please verify the Complaint ID and registered mobile number.'
        );
      }
    } catch (err) {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Search className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {t.trackByIdTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {t.trackByIdDesc}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {t.enterComplaintId}
            </label>
            <input
              type="text"
              required
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
              placeholder="e.g. GRP-20261105-0001"
              className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 bg-slate-50 focus:bg-white text-base font-mono font-bold text-slate-900 focus:outline-hidden transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {t.enterRegisteredMobile} ({lang === 'te' ? 'ఐచ్ఛికం' : 'Optional'})
            </label>
            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit mobile"
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:outline-hidden transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !complaintId.trim()}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-base shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t.submitting}</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>{t.trackSearchBtn}</span>
              </>
            )}
          </button>
        </form>

        {/* Found Result Preview Card */}
        {result && (
          <div className="mt-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-950">
                {result.complaintId}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                  result.status
                )}`}
              >
                {t.statuses[result.status]?.label || result.status}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 text-sm">
                {t.problemTypes[result.problemType]?.title}
              </p>
              <p className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{result.laneName}</span>
              </p>
              {result.remarks && (
                <p className="text-emerald-900 italic pt-1 border-t border-emerald-200">
                  "{result.remarks}"
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowDetail(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t.trackNowBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* Full Detail Modal */}
      {showDetail && result && (
        <ComplaintDetailModal
          complaint={result}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          lang={lang}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
