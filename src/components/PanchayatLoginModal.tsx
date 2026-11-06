import React, { useState } from 'react';
import { Building2, Mail, Lock, LogIn, X, AlertCircle, ShieldAlert } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language, UserProfile } from '../types';
import { DEMO_PANCHAYAT_USER } from '../data/seedData';
import { auth, signInWithEmailAndPassword, isFirebaseConfigured } from '../services/firebase';

interface PanchayatLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess: (user: UserProfile) => void;
}

export const PanchayatLoginModal: React.FC<PanchayatLoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSuccess
}) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile: UserProfile = {
          uid: cred.user.uid,
          role: 'panchayat',
          email: cred.user.email || email,
          villageId: 'gurrajupalem', // Linked village
          name: 'Gurrajupalem Panchayat Secretary',
          createdAt: new Date().toISOString()
        };
        onSuccess(profile);
        onClose();
        return;
      } catch (err: any) {
        console.warn('Firebase email auth error, checking demo credentials:', err);
      }
    }

    // Check demo credentials
    if (
      email.trim().toLowerCase() === DEMO_PANCHAYAT_USER.email.toLowerCase() &&
      password === DEMO_PANCHAYAT_USER.password
    ) {
      const profile: UserProfile = {
        uid: 'officer_grp_1',
        role: 'panchayat',
        email: DEMO_PANCHAYAT_USER.email,
        villageId: DEMO_PANCHAYAT_USER.villageId,
        name: DEMO_PANCHAYAT_USER.name,
        createdAt: new Date().toISOString()
      };
      onSuccess(profile);
      onClose();
    } else {
      setError(
        lang === 'te'
          ? 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్. దయచేసి డెమో లాగిన్ ఉపయోగించండి.'
          : 'Invalid email or password. Please use the one-click demo login below.'
      );
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const profile: UserProfile = {
      uid: 'officer_grp_1',
      role: 'panchayat',
      email: DEMO_PANCHAYAT_USER.email,
      villageId: DEMO_PANCHAYAT_USER.villageId,
      name: DEMO_PANCHAYAT_USER.name,
      createdAt: new Date().toISOString()
    };
    onSuccess(profile);
    onClose();
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

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {t.panchayatPortalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'te' ? 'గుర్రాజుపాలెం గ్రామ పంచాయతీ కార్యాలయ సిబ్బంది కొరకు' : 'For Gurrajupalem Gram Panchayat staff only'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.panchayatEmailLabel}
            </label>
            <div className="flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-blue-600 bg-slate-50 focus-within:bg-white overflow-hidden transition-all shadow-inner">
              <span className="px-3 py-3 text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="panchayat.gurrajupalem@example.com"
                className="w-full px-2 py-3 text-sm text-slate-900 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.panchayatPasswordLabel}
            </label>
            <div className="flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-blue-600 bg-slate-50 focus-within:bg-white overflow-hidden transition-all shadow-inner">
              <span className="px-3 py-3 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-2 py-3 text-sm text-slate-900 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <LogIn className="w-5 h-5" />
            <span>{t.panchayatLoginBtn}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">డెమో ఖాతా (Demo Account)</span>
            </div>
          </div>

          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-3 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-xs sm:text-sm border border-blue-200 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>{t.useDemoPanchayat}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
