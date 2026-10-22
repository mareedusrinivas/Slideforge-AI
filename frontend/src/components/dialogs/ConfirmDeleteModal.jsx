import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this? This action cannot be undone."
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#a79fc4] hover:text-white font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
          >
            Delete
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-purple-200 leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </Modal>
  );
};
