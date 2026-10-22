import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  footer = null
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#080612]/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full ${maxWidth} bg-[#0e0b1f] text-purple-100 rounded-2xl shadow-modal border border-[#2a1f56] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#2a1f56]">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
              {subtitle && <p className="text-sm text-[#a79fc4] mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#a79fc4] hover:text-white rounded-lg p-1.5 hover:bg-[#1a1438] transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#15102d] border-t border-[#2a1f56]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
