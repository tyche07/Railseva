
import React, { useContext, useState, useRef, ChangeEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { translations } from '../../constants';
import { IssueType, Severity } from '../../types';
import { analyzeIssueImage, AIVisualAnalysis } from '../../services/geminiService';
import { saveIssueReport } from '../../services/offlineService';
import { SparklesIcon } from '../icons';

const ReportIssueView: React.FC = () => {
    const { language, userRole, isOnline } = useContext(AppContext);
    const t = translations[language];
    
    // Form state
    const [uid] = useState('ERC-VD1-L45-20240715-00123'); // Mocked UID
    const [issueType, setIssueType] = useState<IssueType>(IssueType.LOOSE_FITTING);
    const [severity, setSeverity] = useState<Severity>(Severity.LOW);
    const [notes, setNotes] = useState('');
    
    // UI/Flow state
    const [submitted, setSubmitted] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<Partial<AIVisualAnalysis>>({});
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setAiSuggestions({}); // Reset suggestions on new image
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!selectedImage) return;
        if (!isOnline) {
            setError("AI analysis requires an internet connection.");
            return;
        }
        
        setIsAnalyzing(true);
        setAiSuggestions({});
        setError(null);
        try {
            const result = await analyzeIssueImage(selectedImage);
            setIssueType(result.issueType);
            setSeverity(result.severity);
            setNotes(result.notes);
            setAiSuggestions(result); // Store all suggestions
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveIssueReport({
            componentUid: uid,
            issueType,
            severity,
            photoUrl: imagePreviewUrl || 'no-photo', // In a real app, we'd handle blob storage
            location: { lat: 28.6139, long: 77.2090 }, // Mock coordinates
            reportedBy: userRole,
        });
        
        setSubmitted(true);
        setTimeout(() => {
            // Reset form
            setSubmitted(false);
            setIssueType(IssueType.LOOSE_FITTING);
            setSeverity(Severity.LOW);
            setNotes('');
            setSelectedImage(null);
            setImagePreviewUrl(null);
            setAiSuggestions({});
            setError(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }, 4000);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full pb-20">
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Report Saved!</p>
                    <p>Your issue report has been saved locally. It will be synced automatically when you're online.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-brand-gray">{t.reportIssue}</h2>
            <form className="space-y-4 bg-white p-4 rounded-lg shadow" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="component-uid" className="block text-sm font-medium text-gray-700">Component UID (from scan)</label>
                    <input type="text" id="component-uid" value={uid} readOnly className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">{t.uploadPhoto}</label>
                    {imagePreviewUrl && (
                        <div className="mt-2 relative">
                            <img src={imagePreviewUrl} alt="Issue preview" className="w-full h-auto rounded-lg max-h-60 object-cover" />
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
                                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <p className="text-white mt-2 text-sm">Analyzing image...</p>
                                </div>
                            )}
                        </div>
                    )}
                     <div className="mt-2 flex items-center gap-4">
                        <input ref={fileInputRef} type="file" id="photo" accept="image/*" onChange={handleImageChange} className="sr-only"/>
                        <label htmlFor="photo" className="cursor-pointer bg-blue-50 text-brand-blue hover:bg-blue-100 text-sm font-semibold py-2 px-4 rounded-full border-0">Choose File</label>
                        <span className="text-sm text-gray-500">{selectedImage ? selectedImage.name : 'No file chosen'}</span>
                     </div>
                     {selectedImage && !isAnalyzing && (
                        <button type="button" onClick={handleAnalyzeClick} disabled={!isOnline} className="mt-2 w-full flex justify-center items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-md font-semibold hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                           <SparklesIcon className="w-5 h-5" /> Analyze with AI
                        </button>
                    )}
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                 
                 <div className="relative">
                    <label htmlFor="issue-type" className="block text-sm font-medium text-gray-700">{t.issueType}</label>
                    <select id="issue-type" value={issueType} onChange={e => setIssueType(e.target.value as IssueType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        {Object.values(IssueType).map(it => <option key={it} value={it}>{it}</option>)}
                    </select>
                    {aiSuggestions.issueType && <SparklesIcon title="AI Suggestion" className="w-4 h-4 text-brand-accent absolute top-8 right-3"/>}
                </div>

                <div className="relative">
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700">{t.severity}</label>
                    <select id="severity" value={severity} onChange={e => setSeverity(e.target.value as Severity)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {aiSuggestions.severity && <SparklesIcon title="AI Suggestion" className="w-4 h-4 text-brand-accent absolute top-8 right-3"/>}
                </div>

                <div className="relative">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Add any additional details..."></textarea>
                    {aiSuggestions.notes && <SparklesIcon title="AI Suggestion" className="w-4 h-4 text-brand-accent absolute top-8 right-3"/>}
                </div>

                <div className="flex items-center">
                    <input id="gps" type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-brand-blue-light focus:ring-brand-blue-light" />
                    <label htmlFor="gps" className="ml-2 block text-sm text-gray-900">Attach GPS Coordinates</label>
                </div>
                <button type="submit" className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                    {t.submitReport}
                </button>
            </form>
        </div>
    );
}

export default ReportIssueView;
