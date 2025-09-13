
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import { UserRole } from '../../types';
import { getPendingReports, getInspectionLogs, syncData } from '../../services/offlineService';

interface StatusCardProps {
    value: string;
    label: string;
    color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ value, label, color }) => (
    <div className={`p-4 rounded-lg shadow-md text-white ${color}`}>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm">{label}</p>
    </div>
);

const MobileDashboard: React.FC = () => {
  const { userRole, language, isOnline } = useContext(AppContext);
  const t = translations[language];

  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [totalVerifiedCount, setTotalVerifiedCount] = useState(0);
  const [mismatchesCount, setMismatchesCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const refreshDashboardData = useCallback(() => {
      const pending = getPendingReports();
      const logs = getInspectionLogs();
      setPendingReportsCount(pending.length);
      setTotalVerifiedCount(logs.filter(l => l.status === 'Verified').length);
      setMismatchesCount(logs.filter(l => l.status === 'Mismatch').length);
  }, []);

  useEffect(() => {
    refreshDashboardData();
    // Add an event listener for when data is synced from elsewhere
    const handleStorageChange = () => refreshDashboardData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshDashboardData]);

  const handleSync = async () => {
      if (!isOnline) {
          setSyncMessage("Cannot sync while offline.");
          setTimeout(() => setSyncMessage(''), 3000);
          return;
      }
      setIsSyncing(true);
      setSyncMessage('Syncing data...');
      const result = await syncData();
      setIsSyncing(false);
      setSyncMessage(result.message);
      refreshDashboardData(); // Refresh counts after sync
      setTimeout(() => setSyncMessage(''), 5000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-gray">{t.dashboard}</h2>
            <div className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isOnline ? 'Online' : 'Offline'}
            </div>
        </div>
        <p className="text-gray-500">Welcome, {userRole}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatusCard value={totalVerifiedCount.toString()} label={t.verifiedToday} color="bg-green-500" />
        <StatusCard value={mismatchesCount.toString()} label={t.mismatches} color="bg-yellow-500" />
        <StatusCard value={pendingReportsCount.toString()} label="Pending Sync" color="bg-orange-500" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Actions</h3>
          <div className="flex flex-col space-y-2">
            <button className="text-left p-2 bg-gray-100 rounded hover:bg-gray-200">Start New Inspection Route</button>
            <button className="text-left p-2 bg-gray-100 rounded hover:bg-gray-200">Review Mismatched Fittings</button>
            <button 
                onClick={handleSync}
                disabled={isSyncing || pendingReportsCount === 0}
                className="text-left p-2 bg-blue-50 text-brand-blue rounded hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex justify-between items-center"
            >
                <span>Sync Offline Data</span>
                {pendingReportsCount > 0 && <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{pendingReportsCount}</span>}
            </button>
            {syncMessage && <p className="text-sm text-center text-gray-600 mt-2">{syncMessage}</p>}
          </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
