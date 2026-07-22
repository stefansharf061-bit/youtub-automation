import React from 'react';
import { X, CheckCheck, Bell, Youtube, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 sm:p-6 transition-all">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Notifications Center
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {notifications.filter((n) => !n.read).length} Unread Alerts
            </span>
            <button
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 mt-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => {
                let icon = <Info className="w-4 h-4 text-blue-500" />;
                if (item.type === 'success')
                  icon = <Youtube className="w-4 h-4 text-emerald-500" />;
                if (item.type === 'publishing')
                  icon = <Sparkles className="w-4 h-4 text-purple-500" />;
                if (item.type === 'failure')
                  icon = <AlertTriangle className="w-4 h-4 text-red-500" />;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.read
                        ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                        : 'bg-white dark:bg-slate-800 border-red-500/30 dark:border-red-500/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                          {item.message}
                        </p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-[11px] font-semibold text-red-500 hover:underline"
                          >
                            View on YouTube &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
