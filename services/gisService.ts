import { IssueType, Severity } from '../types';

export interface GisSleeper {
  uid: string;
  location: { lat: number; lng: number };
  status: 'Healthy' | 'Issue';
  issue?: {
    type: IssueType;
    severity: Severity;
    notes: string;
  };
}

const centralLat = 28.6139; // Delhi
const centralLng = 77.2090;

const issueTypes = Object.values(IssueType);
const severities = Object.values(Severity);

const mockGisData: GisSleeper[] = [];

for (let i = 0; i < 100; i++) {
    const hasIssue = Math.random() < 0.3; // 30% chance of having an issue
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];

    mockGisData.push({
        uid: `SL-GIS-${1000 + i}`,
        location: {
            lat: centralLat + (Math.random() - 0.5) * 0.1,
            lng: centralLng + (Math.random() - 0.5) * 0.1,
        },
        status: hasIssue ? 'Issue' : 'Healthy',
        issue: hasIssue ? {
            type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
            severity: randomSeverity,
            notes: `Randomly generated issue with ${randomSeverity.toLowerCase()} severity.`
        } : undefined,
    });
}


export const getGisData = (): GisSleeper[] => {
    return mockGisData;
};
