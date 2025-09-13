import React, { useState, useContext } from 'react';
import MobileDashboard from './MobileDashboard';
import ScannerView from './ScannerView';
import ReportIssueView from './ReportIssueView';
import HistoryView from './HistoryView';
import ComponentDetailsView from './ComponentDetailsView';
import { HomeIcon, QrCodeIcon, ExclamationTriangleIcon, ClockIcon, GlobeAltIcon, LogoutIcon } from '../icons';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';

type MobileViewTab = 'dashboard' | 'scan' | 'report' | 'history';
type ActiveScreen = {
  view: 'tabs' | 'details';
  uid: string | null;
};

const MobileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MobileViewTab>('dashboard');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>({ view: 'tabs', uid: null });
  const { language, toggleLanguage, logout } = useContext(AppContext);
  const t = translations[language];

  const handleScanSuccess = (scannedUid: string) => {
    setActiveScreen({ view: 'details', uid: scannedUid });
  };

  const handleBackToTabs = () => {
    setActiveScreen({ view: 'tabs', uid: null });
    setActiveTab('scan'); // Go back to scanner tab after viewing details
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'scan':
        return <ScannerView onScanSuccess={handleScanSuccess} />;
      case 'report':
        return <ReportIssueView />;
      case 'history':
        return <HistoryView />;
      default:
        return <MobileDashboard />;
    }
  };

  const renderContent = () => {
    if (activeScreen.view === 'details' && activeScreen.uid) {
      return <ComponentDetailsView componentUid={activeScreen.uid} onBack={handleBackToTabs} />;
    }
    return renderTabContent();
  };

  const NavItem: React.FC<{ tab: MobileViewTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      disabled={activeScreen.view === 'details'}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 ${
        activeTab === tab && activeScreen.view === 'tabs' ? 'text-brand-blue' : 'text-gray-500'
      } disabled:text-gray-300`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <header className="bg-brand-blue text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">{t.appName}</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleLanguage} className="focus:outline-none">
            <GlobeAltIcon className="w-6 h-6" />
          </button>
          <button onClick={logout} className="focus:outline-none">
            <LogoutIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {renderContent()}
      </main>

      {activeScreen.view === 'tabs' && (
        <footer className="w-full max-w-md fixed bottom-0 left-1/2 -translate-x-1/2 bg-white shadow-t border-t border-gray-200">
          <div className="flex justify-around">
            <NavItem tab="dashboard" icon={<HomeIcon className="w-6 h-6" />} label={t.dashboard} />
            <NavItem tab="scan" icon={<QrCodeIcon className="w-6 h-6" />} label={t.scan} />
            <NavItem tab="report" icon={<ExclamationTriangleIcon className="w-6 h-6" />} label={t.reportIssue} />
            <NavItem tab="history" icon={<ClockIcon className="w-6 h-6" />} label={t.history} />
          </div>
        </footer>
      )}
    </div>
  );
};

export default MobileView;
