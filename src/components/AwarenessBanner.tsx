import React, { useState, useEffect } from 'react';
import { Volume2, ChevronRight, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';

interface AwarenessBannerProps {
  lang: Language;
}

export const AwarenessBanner: React.FC<AwarenessBannerProps> = ({ lang }) => {
  const t = translations[lang];
  const tips = t.awarenessTips;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [tips.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden border border-emerald-700/50">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-emerald-700/60 rounded-xl text-emerald-200 shrink-0 mt-0.5 border border-emerald-600/40">
          <Sparkles className="w-5 h-5 text-emerald-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.awarenessTipsTitle}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-emerald-200/80 font-mono">
                {currentIndex + 1} / {tips.length}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium leading-relaxed text-emerald-50 min-h-[44px] flex items-center transition-all duration-300">
            {tips[currentIndex]}
          </p>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-emerald-700/40">
            <div className="flex gap-1.5">
              {tips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-emerald-300' : 'w-2 bg-emerald-700 hover:bg-emerald-600'
                  }`}
                  aria-label={`Go to tip ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition-colors"
                title="Previous"
                aria-label="Previous tip"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition-colors"
                title="Next"
                aria-label="Next tip"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
