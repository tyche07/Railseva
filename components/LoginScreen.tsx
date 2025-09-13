
import React, { useState, useContext } from 'react';
import { UserRole } from '../types';
import { AppContext } from '../context/AppContext';
import { translations } from '../constants';
import { GlobeAltIcon, SunIcon } from './icons';


interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.OPERATOR);
  const { language } = useContext(AppContext);
  const t = translations[language];

  const roles = [UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.MAINTENANCE, UserRole.DEPOT_MANAGER];

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-blue">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
            <div className="flex justify-center items-center gap-2">
                <SunIcon className="w-10 h-10 text-brand-accent" />
                <h1 className="text-3xl font-bold text-brand-blue">{t.appName}</h1>
            </div>
            <p className="mt-2 text-gray-600">Digitizing Railway Infrastructure</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
              {t.loginTitle}
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm rounded-md"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onLogin(selectedRole)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light"
          >
            {t.login}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
