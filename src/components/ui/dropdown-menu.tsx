import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  trigger:  any
  align?:  any
  children: any
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  trigger, 
  children, 
  align = 'right' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 mt-2 ${align === 'right' ? 'right-0' : 'left-0'} w-56 rounded-md shadow-lg bg-surface border border-gray-700 overflow-hidden`}>
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem: React.FC<{
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  destructive?: boolean;
}> = ({ onClick, icon, children, destructive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 text-sm ${destructive ? 'text-red-400 hover:bg-red-900/20' : 'text-gray-200 hover:bg-gray-700'}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export const DropdownMenuSeparator: React.FC = () => (
  <div className="h-px my-1 bg-gray-700" />
);