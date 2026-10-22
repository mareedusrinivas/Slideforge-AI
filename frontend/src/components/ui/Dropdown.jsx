import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  width = 'w-48',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 ${width} ${alignments[align] || alignments.left} rounded-xl bg-[#15102d] text-purple-100 shadow-2xl border border-[#2a1f56] py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
