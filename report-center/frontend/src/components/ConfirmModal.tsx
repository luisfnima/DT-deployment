import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-dark-card border border-dark-border w-full max-w-md rounded-xl p-6 shadow-2xl relative z-10 space-y-6"
          >
            <div className="flex gap-4">
              <div className="p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg h-fit">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-dark-text tracking-tight">{title}</h3>
                <p className="text-sm text-dark-muted leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-dark-border text-xs font-semibold text-dark-text rounded-lg hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-xs font-semibold text-white rounded-lg transition"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
