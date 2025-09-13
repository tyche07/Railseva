import { ComponentType, Fitting } from '../types';

export interface ComponentDetails extends Fitting {
    status: 'Installed' | 'In Stock' | 'Requires Inspection';
    photoUrl?: string;
    linkedComponents?: Fitting[];
}

const db: ComponentDetails[] = [
    {
        uid: 'SL-ZN1-KM25-013',
        type: ComponentType.SLEEPER,
        vendor: 'Vendor Delta',
        lotNumber: 'L01-2024',
        installDate: '2024-03-10',
        warrantyEndDate: '2034-03-09',
        inspectionCert: 'CERT-D01-11A',
        status: 'Installed',
        photoUrl: 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/railroad-track.jpeg',
        linkedComponents: [
            { uid: 'ERC-VA-L45-081', type: ComponentType.ERC, vendor: 'Vendor Alpha', lotNumber: 'L45', installDate: '2024-03-10', warrantyEndDate: '2029-03-09', inspectionCert: 'CERT-A45' },
            { uid: 'ERC-VA-L45-082', type: ComponentType.ERC, vendor: 'Vendor Alpha', lotNumber: 'L45', installDate: '2024-03-10', warrantyEndDate: '2029-03-09', inspectionCert: 'CERT-A45' },
            { uid: 'PAD-VB-L12-113', type: ComponentType.PAD, vendor: 'Vendor Beta', lotNumber: 'L12', installDate: '2024-03-10', warrantyEndDate: '2028-03-09', inspectionCert: 'CERT-B12' },
            { uid: 'LIN-VC-L88-204', type: ComponentType.LINER, vendor: 'Vendor Charlie', lotNumber: 'L88', installDate: '2024-03-10', warrantyEndDate: '2027-03-09', inspectionCert: 'CERT-C88' },
        ]
    },
    {
        uid: "ERC-VD1-L45-20240715-00123",
        type: ComponentType.ERC,
        vendor: "Vendor Alpha",
        installDate: "2024-01-20",
        warrantyEndDate: "2029-01-19",
        inspectionCert: 'CERT-A45-99B',
        lotNumber: 'L45',
        status: 'Installed',
        sleeperUid: 'SL-ZN1-KM25-013'
    },
];

const rfidScanResults = [
    { uid: 'SL-ZN1-KM25-013', type: ComponentType.SLEEPER },
    { uid: 'C-0001-ERC', type: ComponentType.ERC },
    { uid: 'C-0002-PAD', type: ComponentType.PAD },
    { uid: 'C-0003-LIN', type: ComponentType.LINER },
    { uid: 'SL-ZN1-KM25-014', type: ComponentType.SLEEPER },
];

export const getComponentByUid = (uid: string): Promise<ComponentDetails | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const component = db.find(c => c.uid === uid) || null;
            resolve(component);
        }, 500);
    });
};

export const getBulkRfidScanData = (): Promise<{uid: string, type: ComponentType}[]> => {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve(rfidScanResults);
        }, 1500);
    });
}
