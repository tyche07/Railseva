
export enum UserRole {
  OPERATOR = 'Operator',
  SUPERVISOR = 'Supervisor',
  MAINTENANCE = 'Maintenance',
  DEPOT_MANAGER = 'Depot Manager'
}

export enum ViewMode {
  MOBILE = 'mobile',
  WEB = 'web'
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi'
}

export enum ComponentType {
  ERC = 'Elastic Rail Clip',
  PAD = 'Pad',
  LINER = 'Liner',
  SLEEPER = 'Sleeper'
}

export enum IssueType {
    LOOSE_FITTING = 'Loose Fitting',
    PAD_WEAR_TEAR = 'Pad Wear & Tear',
    CRACKED_COMPONENT = 'Cracked Component',
    CONCRETE_SPALLING = 'Concrete Spalling / Sleeper Damage',
    CORROSION = 'Corrosion',
    VEGETATION_OVERGROWTH = 'Vegetation Overgrowth',
    MISALIGNED_TRACK = 'Misaligned Track',
    OTHER = 'Other',
}

export enum Severity {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error'
}

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

export interface Fitting {
  uid: string;
  type: ComponentType;
  vendor: string;
  lotNumber: string;
  installDate: string;
  warrantyEndDate: string;
  inspectionCert: string;
  sleeperUid?: string;
}

export interface Sleeper {
  uid: string;
  location: { lat: number, long: number, zone: string };
  installDate: string;
  fittings: {
      [ComponentType.ERC]?: string;
      [ComponentType.PAD]?: string;
      [ComponentType.LINER]?: string;
  }
}

export interface IssueReport {
    id: string;
    componentUid: string;
    issueType: IssueType;
    severity: Severity;
    photoUrl: string;
    location: { lat: number, long: number };
    reportedBy: string;
    timestamp: string;
    status: 'Pending' | 'Resolved';
}

export interface InspectionLog {
    id: string;
    sleeperUid: string;
    inspector: string;
    timestamp: string;
    status: 'Verified' | 'Mismatch' | 'Issue Reported';
    notes: string;
}