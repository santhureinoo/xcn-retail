import React from 'react';
import { createPortal } from 'react-dom';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ 
  isOpen, 
  onClose, 
  position = 'right',
  children 
}) => {
  if (!isOpen) return null;

  const positionClasses = {
    left: 'inset-y-0 left-0 w-full sm:w-96',
    right: 'inset-y-0 right-0 w-full sm:w-96',
    top: 'inset-x-0 top-0 h-96',
    bottom: 'inset-x-0 bottom-0 h-96'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={`fixed z-50 ${positionClasses[position]} bg-white dark:bg-gray-800 shadow-lg`}>
        <div className="h-full overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export const SheetHeader: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="flex items-center justify-between mb-4">
    {children}
  </div>
);

export const SheetTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{children}</h2>
);

export const SheetClose: React.FC<{onClick: () => void}> = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <span className="sr-only">Close</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
);

export const SheetContent: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="mt-6">
    {children}
  </div>
);