import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'info', // 'success' | 'error' | 'info'
  onClose
}) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
  };

  const bgClasses = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-slate-900 border-slate-800 text-white shadow-xl'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${bgClasses[type] || bgClasses.info}`}>
        {icons[type]}
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
