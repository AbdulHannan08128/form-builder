'use client'
import { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, selected, onChange, isMulti }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleOptionClick = (value) => {
    if (isMulti) {
      onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Create a label for the selected options
  const selectedLabels = isMulti
    ? options.filter(opt => selected.includes(opt.value)).map(opt => opt.label).join(', ') || 'Select forms'
    : options.find(opt => opt.value === selected[0])?.label || 'Select a form';

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      <div
        className="bg-white border border-gray-300 rounded-lg shadow-sm p-2 cursor-pointer flex flex-wrap items-center justify-between"
        onClick={toggleDropdown}
      >
        <span>{selectedLabels}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${selected.includes(option.value) ? 'bg-gray-200' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
