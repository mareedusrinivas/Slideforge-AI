import React, { useState } from 'react';
import { Dropdown } from './Dropdown';

const PRESET_COLORS = [
  '#000000', '#0d0a1b', '#17122e', '#2a1f56', '#4c3891', '#ffffff',
  '#a855f7', '#9333ea', '#7e22ce', '#c084fc', '#e9d5ff', '#38bdf8',
  '#06b6d4', '#10b981', '#059669', '#f59e0b', '#ea580c', '#f43f5e',
  '#ec4899', '#db2777', '#6366f1', '#4f46e5', '#334155', '#1e293b',
  '#1e1b4b', '#312e81', '#2e1065', '#581c87'
];

export const ColorPicker = ({
  color = '#a855f7',
  onChange,
  label = 'Color',
  showLabel = false,
  className = ''
}) => {
  const [customHex, setCustomHex] = useState(color || '#a855f7');

  const handleSelect = (c) => {
    setCustomHex(c);
    if (onChange) onChange(c);
  };

  const handleHexInput = (e) => {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
      if (onChange) onChange(val);
    }
  };

  return (
    <Dropdown
      trigger={
        <div className={`flex items-center gap-2 p-1.5 rounded-lg border border-[#2a1f56] hover:border-[#4c3891] bg-[#15102d] hover:bg-[#1a1438] transition-colors ${className}`}>
          <div 
            className="w-5 h-5 rounded-md border border-white/20 shadow-xs shrink-0" 
            style={{ backgroundColor: color || '#a855f7' }}
          />
          {showLabel && <span className="text-xs font-medium text-purple-200">{label}</span>}
        </div>
      }
      width="w-64"
    >
      <div className="p-3 bg-[#15102d] text-purple-100 rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-xs font-semibold text-[#a79fc4] uppercase tracking-wider mb-2">
          {label}
        </div>
        
        {/* Preset Swatches */}
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => handleSelect(c)}
              className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${
                color === c ? 'ring-2 ring-purple-500 ring-offset-1 ring-offset-[#15102d] border-transparent' : 'border-[#2a1f56]'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Custom Hex Input */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#2a1f56]">
          <span className="text-xs text-[#a79fc4] font-medium">Hex:</span>
          <input
            type="text"
            value={customHex}
            onChange={handleHexInput}
            className="w-full text-xs font-mono uppercase px-2 py-1 bg-[#1a1438] border border-[#2a1f56] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="#A855F7"
            maxLength={7}
          />
        </div>
      </div>
    </Dropdown>
  );
};
