import React from 'react';
import { Languages, Building2, User, LogOut } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language, UserProfile } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenPanchayatLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  currentUser,
  onLogout,
  onOpenPanchayatLogin
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* App Title & Village Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 shrink-0 border border-emerald-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                గుర్రాజుపాలెం (GRP)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-none mt-0.5">
              {lang === 'te' ? 'ఎన్టీఆర్ జిల్లా • ఆంధ్రప్రదేశ్' : 'NTR District, Andhra Pradesh (521230)'}
            </p>
          </div>
        </div>

        {/* Right side controls: Language toggle + User profile / login */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-sm font-semibold transition-all active:scale-95 shadow-xs"
            title="Switch Language"
          >
            <Languages className="w-4 h-4 text-emerald-700" />
            <span>{t.switchLang}</span>
          </button>

          {/* User Status / Role Badge */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-semibold text-slate-800 max-w-[120px] truncate">
                  {currentUser.role === 'panchayat' ? (currentUser.name || 'Panchayat Staff') : `+91 ${currentUser.mobile}`}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium capitalize">
                  {currentUser.role === 'panchayat' ? (lang === 'te' ? 'పంచాయతీ సిబ్బంది' : 'Panchayat Officer') : (lang === 'te' ? 'గ్రామ నివాసి' : 'Resident')}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
                title={t.navLogout}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenPanchayatLogin}
              className="text-xs font-semibold px-2.5 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1 border border-transparent hover:border-emerald-200"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{t.navPanchayatLogin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
