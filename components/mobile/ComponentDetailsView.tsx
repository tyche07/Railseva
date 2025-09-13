import React, { useState, useEffect, useContext } from 'react';
import { getComponentByUid, ComponentDetails } from '../../services/componentService';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';

interface ComponentDetailsViewProps {
    componentUid: string;
    onBack: () => void;
}

const ComponentDetailsView: React.FC<ComponentDetailsViewProps> = ({ componentUid, onBack }) => {
    const [component, setComponent] = useState<ComponentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { language } = useContext(AppContext);
    const t = translations[language];

    useEffect(() => {
        const fetchComponent = async () => {
            setIsLoading(true);
            const data = await getComponentByUid(componentUid);
            setComponent(data);
            setIsLoading(false);
        };
        fetchComponent();
    }, [componentUid]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <svg className="animate-spin h-8 w-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
        );
    }

    if (!component) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-bold">Component Not Found</h2>
                <p>The component with UID {componentUid} could not be found.</p>
                <button onClick={onBack} className="mt-4 bg-brand-blue text-white px-4 py-2 rounded-lg">Go Back</button>
            </div>
        );
    }
    
    return (
        <div className="space-y-4 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-gray">Component Details</h2>
                <button onClick={onBack} className="text-sm text-brand-blue-light hover:underline">Back to Scan</button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                {component.photoUrl && <img src={component.photoUrl} alt="Component" className="w-full h-40 object-cover rounded-lg mb-4" />}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-brand-blue">{component.uid}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${component.status === 'Installed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {component.status}
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 border-t pt-4">
                    <p><strong>Type:</strong> {component.type}</p>
                    <p><strong>Vendor:</strong> {component.vendor}</p>
                    <p><strong>Lot No:</strong> {component.lotNumber}</p>
                    <p><strong>Install Date:</strong> {component.installDate}</p>
                    <p className="col-span-2"><strong>Warranty End:</strong> {component.warrantyEndDate}</p>
                </div>
            </div>

            {component.linkedComponents && component.linkedComponents.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Linked Components</h3>
                    <ul className="space-y-2">
                        {component.linkedComponents.map(linked => (
                            <li key={linked.uid} className="text-sm p-2 bg-gray-50 rounded-md">
                                <p className="font-semibold">{linked.uid}</p>
                                <p className="text-gray-500">{linked.type} - by {linked.vendor}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button className="bg-blue-500 text-white py-3 rounded-lg text-sm font-semibold">Inspect</button>
                    <button className="bg-yellow-500 text-white py-3 rounded-lg text-sm font-semibold">Replace Component</button>
                    <button className="bg-red-500 text-white py-3 rounded-lg text-sm font-semibold">Report Issue</button>
                    <button className="bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-semibold">View History</button>
                </div>
            </div>
        </div>
    );
};

export default ComponentDetailsView;
