import React from 'react';
import {
  PlusCircle,
  Search,
  Building2,
  CheckCircle,
  PhoneCall,
  ShieldCheck,
  Droplets,
  Lightbulb,
  Trash2,
  Waves,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language, UserProfile } from '../types';
import { AwarenessBanner } from './AwarenessBanner';

interface LandingHeroProps {
  lang: Language;
  onRegisterClick: () => void;
  onTrackClick: () => void;
  onOpenPanchayat: () => void;
  currentUser: UserProfile | null;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  lang,
  onRegisterClick,
  onTrackClick,
  onOpenPanchayat,
  currentUser
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* Rotating Telugu Awareness Tip Banner */}
      <AwarenessBanner lang={lang} />

      {/* Hero Welcome Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'te'
                ? 'గుర్రాజుపాలెం గ్రామ పంచాయతీ పైలట్ పోర్టల్'
                : 'Gurrajupalem Gram Panchayat Pilot Portal'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {t.heroTitle}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            {t.heroDesc}
          </p>

          {/* Primary Action Buttons (Spacious, min 54px touch target) */}
          <div className="mt-6 space-y-3">
            <button
              onClick={onRegisterClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-base sm:text-lg shadow-xl shadow-emerald-700/25 active:scale-[0.99] transition-all flex items-center justify-center gap-3 min-h-[56px] border border-emerald-500/30"
            >
              <PlusCircle className="w-6 h-6 shrink-0" />
              <span>{t.registerComplaintBtn}</span>
              <ArrowRight className="w-5 h-5 ml-auto opacity-70 shrink-0" />
            </button>

            <button
              onClick={onTrackClick}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 transition-colors flex items-center justify-center gap-2.5 min-h-[50px]"
            >
              <Search className="w-5 h-5 text-slate-600 shrink-0" />
              <span>{t.trackComplaintBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem Categories Preview Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          {lang === 'te' ? 'పరిష్కరించబడే సమస్యల రకాలు' : 'Grievance Categories Handled'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.problemTypes.drain.title}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.problemTypes.street_light.title}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.problemTypes.waste_collection.title}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.problemTypes.stagnant_water.title}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.problemTypes.drinking_water.title}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.problemTypes.other.title}
            </span>
          </div>
        </div>
      </div>

      {/* Panchayat Office & College Service Card */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
        <div>
          <span className="font-bold text-slate-900 block">
            {lang === 'te' ? 'గుర్రాజుపాలెం గ్రామ పంచాయతీ సచివాలయం' : 'Gurrajupalem Gram Panchayat Secretariat'}
          </span>
          <span className="text-slate-500 mt-0.5 block">
            {t.avgResolutionTime}
          </span>
        </div>

        <button
          onClick={onOpenPanchayat}
          className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold border border-slate-200 transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{lang === 'te' ? 'సిబ్బంది లాగిన్' : 'Staff Login'}</span>
        </button>
      </div>
    </div>
  );
};
