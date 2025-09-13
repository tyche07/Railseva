
import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import WebDashboard from './WebDashboard';
import InventoryView from './InventoryView';
import AnalyticsView from './AnalyticsView';
import WarrantyClaimView from './WarrantyClaimView';
import { HomeIcon, InboxStackIcon, ChartBarIcon, DocumentTextIcon, GlobeAltIcon, SunIcon, LogoutIcon } from '../icons';


type WebViewTab = 'dashboard' | 'inventory' | 'analytics' | 'warranty';

const WebView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WebViewTab>('dashboard');
  const { language, toggleLanguage, logout } = useContext(AppContext);
  const t = translations[language];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <WebDashboard />;
      case 'inventory':
        return <InventoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'warranty':
        return <WarrantyClaimView />;
      default:
        return <WebDashboard />;
    }
  };

  const NavItem: React.FC<{ tab: WebViewTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <li>
      <button
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center p-2 text-base font-normal rounded-lg transition duration-75 group ${
          activeTab === tab
            ? 'bg-brand-blue-light text-white'
            : 'text-gray-200 hover:bg-gray-700'
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-200">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <SunIcon className="w-8 h-8 text-brand-accent"/>
          <span className="ml-2 text-2xl font-bold">{t.appName}</span>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            <NavItem tab="dashboard" icon={<HomeIcon className="w-6 h-6" />} label={t.dashboard} />
            <NavItem tab="inventory" icon={<InboxStackIcon className="w-6 h-6" />} label={t.inventory} />
            <NavItem tab="analytics" icon={<ChartBarIcon className="w-6 h-6" />} label={t.analytics} />
            <NavItem tab="warranty" icon={<DocumentTextIcon className="w-6 h-6" />} label={t.warrantyClaims} />
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <button onClick={logout} className="w-full flex items-center p-2 text-base font-normal text-gray-200 rounded-lg hover:bg-gray-700">
                <LogoutIcon className="w-6 h-6" />
                <span className="ml-3">Logout</span>
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
          <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-gray-100">
            <GlobeAltIcon className="w-6 h-6 text-brand-gray" />
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default WebView;
