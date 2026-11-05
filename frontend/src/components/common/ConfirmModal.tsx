import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"; // আপনার হুক পাথ অনুযায়ী
import { closeModal } from "../../features/alert/modalSlice";

export const ConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, title, message, onConfirm } = useAppSelector((state) => state.modal);

  if (!isOpen) return null;

  const handleConfirmAction = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-borderLight animate-in fade-in zoom-in duration-200">
        {/* হেডার */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-primary">
              {title}
            </h3>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* message */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* ফুটার / বাটনস */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-5 py-2.5 border border-borderLight text-gray-700 font-medium text-sm rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAction}
            className="px-5 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>
  );
};