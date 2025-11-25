import React, { useRef } from "react";
import { IconX } from "@tabler/icons-react";

interface ModalProps {
  open?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  open = true,
  onClose,
  children,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!open) return null;
  // Remove background blackout, add outside click handler
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <IconX size={20} stroke={1.5} />
        </button>
        {title && (
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
