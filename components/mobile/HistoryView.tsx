
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import { InspectionLog } from '../../types';
import { getInspectionLogs } from '../../services/offlineService';

const HistoryView: React.FC = () => {
    const { language } = useContext(AppContext);
    const t = translations[language];
    const [logs, setLogs] = useState<InspectionLog[]>([]);

    useEffect(() => {
        setLogs(getInspectionLogs());
        // Listen for storage changes to auto-update the view
        const handleStorageChange = () => setLogs(getInspectionLogs());
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);


    const getStatusColor = (status: InspectionLog['status']) => {
        switch(status) {
            case 'Verified': return 'text-green-600 bg-green-100';
            case 'Mismatch': return 'text-yellow-600 bg-yellow-100';
            case 'Issue Reported': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    }
    
    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-brand-gray">{t.inspectionLogs}</h2>

            <div className="space-y-4">
                {logs.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p>No inspection logs found.</p>
                        <p className="text-sm">Scanned items and reports will appear here.</p>
                    </div>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-brand-gray">{log.sleeperUid}</p>
                                    <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()} by {log.inspector}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(log.status)}`}>
                                    {log.status}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-700 border-t pt-2">{log.notes}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryView;
