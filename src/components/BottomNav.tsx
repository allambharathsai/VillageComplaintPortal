import React from 'react';
import { Home, PlusCircle, ListChecks, Search, LayoutDashboard } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language, UserProfile } from '../types';

export type ActiveTab = 'home' | 'new' | 'my' | 'track' | 'panchayat';

interface BottomNavProps {
  lang: Language;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  lang,
  activeTab,
  onSelectTab,
  currentUser
}) => {
  const t = translations[lang];
  const isPanchayat = currentUser?.role === 'panchayat';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[52px] ${
            activeTab === 'home'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[11px] sm:text-xs mt-1 truncate max-w-[70px]">
            {t.navHome}
          </span>
        </button>

        {/* New Complaint (Big central CTA) */}
        <button
          onClick={() => onSelectTab('new')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[52px] ${
            activeTab === 'new'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-600 hover:text-emerald-700 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'new' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-emerald-100 text-emerald-800'}`}>
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs mt-0.5 truncate max-w-[75px]">
            {t.navNewComplaint}
          </span>
        </button>

        {/* My Complaints */}
        <button
          onClick={() => onSelectTab('my')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[52px] ${
            activeTab === 'my'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <ListChecks className={`w-5 h-5 transition-transform ${activeTab === 'my' ? 'scale-110' : ''}`} />
          <span className="text-[11px] sm:text-xs mt-1 truncate max-w-[75px]">
            {t.navMyComplaints}
          </span>
        </button>

        {/* Track by ID */}
        <button
          onClick={() => onSelectTab('track')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[52px] ${
            activeTab === 'track'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Search className={`w-5 h-5 transition-transform ${activeTab === 'track' ? 'scale-110' : ''}`} />
          <span className="text-[11px] sm:text-xs mt-1 truncate max-w-[70px]">
            {t.navTrack}
          </span>
        </button>

        {/* Panchayat Dashboard Tab if Panchayat user logged in */}
        {isPanchayat && (
          <button
            onClick={() => onSelectTab('panchayat')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[52px] ${
              activeTab === 'panchayat'
                ? 'text-blue-700 font-bold'
                : 'text-slate-500 hover:text-blue-800 font-medium'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 transition-transform ${activeTab === 'panchayat' ? 'scale-110' : ''}`} />
            <span className="text-[11px] sm:text-xs mt-1 truncate max-w-[70px]">
              {lang === 'te' ? 'డాష్‌బోర్డ్' : 'Staff'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
