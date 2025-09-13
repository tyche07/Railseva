
import { createContext } from 'react';
import { UserRole, Language, Notification, NotificationType } from '../types';

export interface AppContextType {
  userRole: UserRole;
  language: Language;
  isOnline: boolean;
  toggleLanguage: () => void;
  logout: () => void;
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

export const AppContext = createContext<AppContextType>({
  userRole: UserRole.OPERATOR,
  language: Language.ENGLISH,
  isOnline: true,
  toggleLanguage: () => {},
  logout: () => {},
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});