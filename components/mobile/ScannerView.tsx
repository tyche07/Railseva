import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { QrCodeIcon, NfcIcon } from '../icons';
import { ComponentType } from '../../types';
import { getBulkRfidScanData } from '../../services/componentService';

interface ScannerViewProps {
    onScanSuccess: (uid: string) => void;
}

type ScanMode = 'idle' | 'qr-scanning' | 'rfid-scanning' | 'rfid-results';

const ScannerView: React.FC<ScannerViewProps> = ({ onScanSuccess }) => {
    const { language } = useContext(AppContext);
    const [scanMode, setScanMode] = useState<ScanMode>('idle');
    const [rfidResults, setRfidResults] = useState<{uid: string, type: ComponentType}[]>([]);

    const handleQrScan = () => {
        setScanMode('qr-scanning');
        // Simulate a scan after 2.5 seconds
        setTimeout(() => {
            onScanSuccess("SL-ZN1-KM25-013");
            setScanMode('idle');
        }, 2500);
    };

    const handleRfidScan = async () => {
        setScanMode('rfid-scanning');
        const results = await getBulkRfidScanData();
        setRfidResults(results);
        setScanMode('rfid-results');
    };

    const resetScanner = () => {
        setScanMode('idle');
        setRfidResults([]);
    }
    
    const renderContent = () => {
        switch (scanMode) {
            case 'qr-scanning':
                return (
                    <div className="w-full max-w-xs aspect-square bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <p className="text-white z-10 text-center text-sm p-4 bg-black bg-opacity-50 rounded-lg">Place QR Code inside the frame</p>
                        <div className="absolute w-3/4 h-3/4 border-4 border-white rounded-lg"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[scan-line_2.5s_ease-in-out_1]"></div>
                        <style>{`
                            @keyframes scan-line {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(250px); }
                            }
                        `}</style>
                    </div>
                );
            case 'rfid-scanning':
                 return (
                    <div className="flex flex-col items-center justify-center h-64">
                        <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="mt-4 text-lg font-semibold text-brand-gray">Scanning for RFID tags...</p>
                    </div>
                );
             case 'rfid-results':
                return (
                    <div className="w-full animate-fade-in">
                        <h3 className="text-lg font-bold text-center mb-2">RFID Scan Results</h3>
                        <div className="bg-white p-2 rounded-lg shadow-md max-h-80 overflow-y-auto">
                            <ul className="divide-y divide-gray-200">
                                {rfidResults.map(item => (
                                    <li key={item.uid} onClick={() => onScanSuccess(item.uid)} className="p-3 hover:bg-gray-100 cursor-pointer">
                                        <p className="font-semibold text-brand-blue">{item.uid}</p>
                                        <p className="text-sm text-gray-500">{item.type}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <>
                        <p className="text-gray-600 text-center mb-6">Select a method to scan a component or a pallet.</p>
                        <div className="w-full grid grid-cols-1 gap-4">
                            <button onClick={handleQrScan} className="flex flex-col items-center justify-center p-6 bg-brand-blue text-white rounded-lg shadow-lg hover:bg-brand-blue-light transition-transform hover:scale-105">
                                <QrCodeIcon className="w-12 h-12 mb-2" />
                                <span className="font-bold text-lg">Scan QR (Camera)</span>
                            </button>
                             <button onClick={handleRfidScan} className="flex flex-col items-center justify-center p-6 bg-brand-accent text-white rounded-lg shadow-lg hover:bg-amber-600 transition-transform hover:scale-105">
                                <NfcIcon className="w-12 h-12 mb-2" />
                                <span className="font-bold text-lg">Scan RFID / NFC</span>
                            </button>
                        </div>
                    </>
                );
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-brand-gray">Scan Component</h2>
            
            <div className="w-full">
                {renderContent()}
            </div>

            {scanMode !== 'idle' && (
                 <button onClick={resetScanner} className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-gray-600">
                    Cancel
                </button>
            )}
             <style>{`
              @keyframes fade-in {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
}

export default ScannerView;
