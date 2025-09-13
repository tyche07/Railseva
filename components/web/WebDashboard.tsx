import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import VendorFailureChart from './charts/VendorFailureChart';
import GisMapView from './GisMapView';

const OverviewCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        <p className={`text-sm mt-2 flex items-center ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            )}
            {change} vs last month
        </p>
    </div>
);

const WebDashboard: React.FC = () => {
    const { language } = useContext(AppContext);
    const t = translations[language];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <OverviewCard title={t.totalSleepers} value="25,480" change="+5.2%" changeType="increase" />
                <OverviewCard title={t.verifiedInstallations} value="18,921" change="+8.1%" changeType="increase" />
                <OverviewCard title={t.warrantyExpiring} value="312" change="+2.5%" changeType="increase" />
                <OverviewCard title={t.vendorFailureRate} value="1.8%" change="-0.3%" changeType="decrease" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">{t.vendorFailureTrends}</h3>
                    <div className="h-80 mt-4">
                        <VendorFailureChart />
                    </div>
                </div>
                 <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">Key Performance Indicators</h3>
                    <ul className="mt-4 space-y-4 text-sm text-gray-600">
                        <li className="flex justify-between"><span>Installation Accuracy</span> <span className="font-bold text-green-600">99.2%</span></li>
                        <li className="flex justify-between"><span>Avg. Inspection Time</span> <span className="font-bold">4.5 min</span></li>
                        <li className="flex justify-between"><span>Critical Issues (Month)</span> <span className="font-bold text-red-600">14</span></li>
                        <li className="flex justify-between"><span>Warranty Claims Success</span> <span className="font-bold">92%</span></li>
                    </ul>
                </div>
            </div>

            <div>
                <GisMapView />
            </div>
        </div>
    );
}

export default WebDashboard;