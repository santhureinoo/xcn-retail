import React from 'react';

interface CommandInputProps {
  id: string;
  value: string;
  index: number;
  totalInputs: number;
  onChange: (id: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const CommandInput: React.FC<CommandInputProps> = ({
  id,
  value,
  index,
  totalInputs,
  onChange,
  onAdd,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="e.g. 1391379101 15749 wkp+86"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        required
      />
      
      {/* Add/Remove Buttons */}
      <div className="flex gap-1">
        {index === totalInputs - 1 && (
          <button
            type="button"
            onClick={onAdd}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            aria-label="Add command"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {totalInputs > 1 && (
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            aria-label="Remove command"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommandInput;