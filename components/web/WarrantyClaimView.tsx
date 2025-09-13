
import React, { useState, useContext, useCallback } from 'react';
import { Fitting, ComponentType } from '../../types';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import { generateWarrantyClaimText } from '../../services/geminiService';

const mockFaultyFitting: Fitting = {
  uid: 'PAD-VB-L12-098',
  type: ComponentType.PAD,
  vendor: 'Vendor Beta',
  lotNumber: 'L12',
  installDate: '2024-03-15',
  warrantyEndDate: '2028-03-14',
  inspectionCert: 'CERT-B12',
  sleeperUid: 'SL-ZD-K80-112',
};

const WarrantyClaimView: React.FC = () => {
  const { language } = useContext(AppContext);
  const t = translations[language];
  const [issue, setIssue] = useState('Premature wear and cracking observed during routine inspection.');
  const [generatedClaim, setGeneratedClaim] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClaim = useCallback(async () => {
    setIsLoading(true);
    setGeneratedClaim('');
    try {
      const claimText = await generateWarrantyClaimText(mockFaultyFitting, issue);
      setGeneratedClaim(claimText);
    } catch (error) {
      console.error(error);
      setGeneratedClaim('Failed to generate claim.');
    } finally {
      setIsLoading(false);
    }
  }, [issue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">{t.generateClaim}</h2>
        
        <div>
          <h3 className="font-medium text-gray-700">Faulty Component Details</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm text-gray-600 space-y-1">
            <p><strong>UID:</strong> {mockFaultyFitting.uid}</p>
            <p><strong>Type:</strong> {mockFaultyFitting.type}</p>
            <p><strong>Vendor:</strong> {mockFaultyFitting.vendor}</p>
            <p><strong>Warranty End:</strong> {mockFaultyFitting.warrantyEndDate}</p>
          </div>
        </div>
        
        <div>
          <label htmlFor="issue-description" className="block text-sm font-medium text-gray-700">Issue Description</label>
          <textarea
            id="issue-description"
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleGenerateClaim}
          disabled={isLoading}
          className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-brand-blue-light disabled:bg-gray-400 flex items-center justify-center"
        >
          {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          {isLoading ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Generated Claim Document</h2>
        <div className="mt-4 p-4 h-96 overflow-y-auto bg-gray-50 rounded-md border border-gray-200">
          {generatedClaim ? (
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{generatedClaim}</pre>
          ) : (
            <p className="text-gray-500">The generated warranty claim will appear here...</p>
          )}
        </div>
        <button 
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
            disabled={!generatedClaim || isLoading}
        >
            Submit to TMS Portal
        </button>
      </div>
    </div>
  );
};

export default WarrantyClaimView;
