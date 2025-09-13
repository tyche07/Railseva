
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import VendorFailureChart from './charts/VendorFailureChart';
import ComponentLifespanChart from './charts/ComponentLifespanChart';

const RiskIndexCard: React.FC<{ title: string, score: number, description: string }> = ({ title, score, description }) => {
    const getColor = (s: number) => {
        if (s > 75) return 'text-red-500';
        if (s > 50) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className={`text-6xl font-bold my-4 ${getColor(score)}`}>{score}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
};

const AnalyticsView: React.FC = () => {
    const { language } = useContext(AppContext);
    const t = translations[language];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">AI Analytics Panel</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RiskIndexCard title={t.safetyRiskIndex} score={82} description="High risk detected in Zone D due to premature pad wear from Vendor Beta." />
                <RiskIndexCard title="Overall System Health" score={65} description="System is stable, but attention is needed for liner components nearing end-of-life." />
                <RiskIndexCard title="Predictive Maintenance" score={45} description="Low immediate need. Next major maintenance cycle predicted in 6 months for Zone A." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">{t.vendorFailureTrends}</h3>
                    <div className="h-80 mt-4">
                        <VendorFailureChart />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">{t.componentLifespan}</h3>
                     <div className="h-80 mt-4">
                        <ComponentLifespanChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
