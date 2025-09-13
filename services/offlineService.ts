
import { IssueReport, InspectionLog } from '../types';

const PENDING_REPORTS_KEY = 'pendingIssueReports';
const INSPECTION_LOGS_KEY = 'inspectionLogs';

// Helper to get items from localStorage
const getFromStorage = <T>(key: string): T[] => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return [];
    }
};

// Helper to set items in localStorage
const setInStorage = <T>(key:string, data: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};


// == Issue Reports ==

export const getPendingReports = (): IssueReport[] => {
    return getFromStorage<IssueReport>(PENDING_REPORTS_KEY);
};

export const saveIssueReport = (report: Omit<IssueReport, 'id' | 'timestamp' | 'status'>): IssueReport => {
    const reports = getPendingReports();
    const newReport: IssueReport = {
        ...report,
        id: `offline-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'Pending',
    };
    reports.push(newReport);
    setInStorage(PENDING_REPORTS_KEY, reports);
    return newReport;
};

const clearPendingReports = (): void => {
    setInStorage(PENDING_REPORTS_KEY, []);
};


// == Inspection Logs ==

export const getInspectionLogs = (): InspectionLog[] => {
    return getFromStorage<InspectionLog>(INSPECTION_LOGS_KEY);
};

export const saveInspectionLog = (log: Omit<InspectionLog, 'id' | 'timestamp'>): InspectionLog => {
    const logs = getInspectionLogs();
    const newLog: InspectionLog = {
        ...log,
        id: `offline-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    // Add to the beginning of the list
    logs.unshift(newLog);
    setInStorage(INSPECTION_LOGS_KEY, logs);
    return newLog;
};


// == Syncing ==
export const syncData = async (): Promise<{ success: boolean; message: string }> => {
    console.log("Starting sync process...");
    const pendingReports = getPendingReports();
    
    if (pendingReports.length === 0) {
        console.log("No pending reports to sync.");
        return { success: true, message: "No data to sync." };
    }

    console.log(`Syncing ${pendingReports.length} issue reports...`);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // On successful "upload", move pending reports to the main inspection log
    const uploadedReportsAsLogs: InspectionLog[] = pendingReports.map(report => ({
        id: report.id.replace('offline-', 'synced-'),
        sleeperUid: report.componentUid,
        inspector: report.reportedBy,
        timestamp: report.timestamp,
        status: 'Issue Reported',
        notes: `[Synced] ${report.issueType} (${report.severity}): Photo available.`,
    }));

    const currentLogs = getInspectionLogs();
    const combinedLogs = [...uploadedReportsAsLogs, ...currentLogs];
    setInStorage(INSPECTION_LOGS_KEY, combinedLogs);

    // Clear the pending queue
    clearPendingReports();
    
    console.log("Sync successful!");
    localStorage.setItem('lastSyncTimestamp', new Date().toISOString());

    return { success: true, message: `Successfully synced ${pendingReports.length} reports.` };
};

// Initial mock data if storage is empty
const initializeMockData = () => {
    if (getInspectionLogs().length === 0 && getPendingReports().length === 0) {
         const mockLogs: InspectionLog[] = [
            { id: 'log001', sleeperUid: 'SL-ZN1-KM25-010', inspector: 'Operator 01', timestamp: '2024-07-28T10:15:00Z', status: 'Verified', notes: 'All fittings match records.' },
            { id: 'log002', sleeperUid: 'SL-ZN1-KM25-011', inspector: 'Operator 01', timestamp: '2024-07-28T10:18:00Z', status: 'Mismatch', notes: 'ERC vendor does not match UDM data.' },
        ];
        setInStorage(INSPECTION_LOGS_KEY, mockLogs);
    }
};

initializeMockData();
