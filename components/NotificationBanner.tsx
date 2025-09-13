import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { NotificationType } from '../types';
import { InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from './icons';

const NotificationBanner: React.FC = () => {
    const { notifications, removeNotification } = useContext(AppContext);

    if (notifications.length === 0) {
        return null;
    }

    const notificationConfig = {
        [NotificationType.INFO]: {
            bgColor: 'bg-blue-500',
            icon: <InformationCircleIcon className="h-6 w-6 text-white" />,
        },
        [NotificationType.SUCCESS]: {
            bgColor: 'bg-green-500',
            icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
        },
        [NotificationType.WARNING]: {
            bgColor: 'bg-yellow-500',
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-white" />,
        },
        [NotificationType.ERROR]: {
            bgColor: 'bg-red-500',
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-white" />,
        },
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 space-y-2">
            {notifications.map((notification) => {
                const config = notificationConfig[notification.type];
                return (
                    <div
                        key={notification.id}
                        className={`w-full max-w-4xl mx-auto ${config.bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-between animate-slide-down`}
                        role="alert"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {config.icon}
                            </div>
                            <div className="ml-3">
                                <p className="font-bold text-sm">{notification.message}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Dismiss"
                        >
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    </div>
                );
            })}
             <style>{`
              @keyframes slide-down {
                0% {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-slide-down {
                animation: slide-down 0.5s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default NotificationBanner;
