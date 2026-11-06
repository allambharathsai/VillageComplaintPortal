import React, { useState } from 'react';
import { Language, UserProfile, Complaint } from './types';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { LandingHero } from './components/LandingHero';
import { NewComplaintWizard } from './components/NewComplaintWizard';
import { MyComplaintsList } from './components/MyComplaintsList';
import { PanchayatDashboard } from './components/PanchayatDashboard';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { PanchayatLoginModal } from './components/PanchayatLoginModal';
import { TrackComplaintModal } from './components/TrackComplaintModal';

export default function App() {
  // 1. Language state: Telugu is DEFAULT, saved in browser
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vpc_lang');
      if (saved === 'en' || saved === 'te') return saved;
    }
    return 'te';
  });

  const handleToggleLang = () => {
    const nextLang = lang === 'te' ? 'en' : 'te';
    setLang(nextLang);
    localStorage.setItem('vpc_lang', nextLang);
  };

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // 3. User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vpc_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {}
      }
    }
    return null;
  });

  // 4. Modals State
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [showPanchayatLogin, setShowPanchayatLogin] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [postAuthAction, setPostAuthAction] = useState<ActiveTab | null>(null);

  // Sync user changes to localStorage
  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('vpc_user', JSON.stringify(user));

    if (user.role === 'panchayat') {
      setActiveTab('panchayat');
    } else if (postAuthAction) {
      setActiveTab(postAuthAction);
      setPostAuthAction(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vpc_user');
    setActiveTab('home');
  };

  // Navigation handlers with Auth interception
  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'new') {
      if (!currentUser) {
        setPostAuthAction('new');
        setShowPhoneAuth(true);
        return;
      }
    } else if (tab === 'my') {
      if (!currentUser) {
        setPostAuthAction('my');
        setShowPhoneAuth(true);
        return;
      }
    } else if (tab === 'track') {
      setShowTrackModal(true);
      return;
    } else if (tab === 'panchayat') {
      if (!currentUser || currentUser.role !== 'panchayat') {
        setShowPanchayatLogin(true);
        return;
      }
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Main App Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenPanchayatLogin={() => setShowPanchayatLogin(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <LandingHero
            lang={lang}
            currentUser={currentUser}
            onRegisterClick={() => handleSelectTab('new')}
            onTrackClick={() => setShowTrackModal(true)}
            onOpenPanchayat={() => {
              if (currentUser?.role === 'panchayat') {
                setActiveTab('panchayat');
              } else {
                setShowPanchayatLogin(true);
              }
            }}
          />
        )}

        {activeTab === 'new' && (
          currentUser ? (
            <NewComplaintWizard
              lang={lang}
              currentUser={currentUser}
              onComplaintSubmitted={(_c: Complaint) => {
                setActiveTab('my');
              }}
              onCancel={() => setActiveTab('home')}
            />
          ) : (
            <div className="py-20 text-center text-slate-400">
              Please sign in to register a complaint.
            </div>
          )
        )}

        {activeTab === 'my' && (
          currentUser ? (
            <MyComplaintsList
              lang={lang}
              currentUser={currentUser}
              onNavigateNew={() => setActiveTab('new')}
            />
          ) : (
            <div className="py-20 text-center text-slate-400">
              Please sign in to view your complaints.
            </div>
          )
        )}

        {activeTab === 'panchayat' && (
          currentUser?.role === 'panchayat' ? (
            <PanchayatDashboard
              lang={lang}
              currentUser={currentUser}
            />
          ) : (
            <div className="py-20 text-center text-slate-400">
              Please sign in as Panchayat Staff.
            </div>
          )
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        lang={lang}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
      />

      {/* Modals */}
      <PhoneAuthModal
        isOpen={showPhoneAuth}
        onClose={() => setShowPhoneAuth(false)}
        lang={lang}
        onSuccess={handleUserLogin}
      />

      <PanchayatLoginModal
        isOpen={showPanchayatLogin}
        onClose={() => setShowPanchayatLogin(false)}
        lang={lang}
        onSuccess={handleUserLogin}
      />

      <TrackComplaintModal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        lang={lang}
        currentUser={currentUser}
      />
    </div>
  );
}
