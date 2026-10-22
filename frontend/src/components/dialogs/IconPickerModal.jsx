import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ICON_MAP, ICON_CATEGORIES } from '../../utils/iconDefinitions';
import { usePresentationStore } from '../../store/presentationStore';

export const IconPickerModal = ({ isOpen, onClose }) => {
  const { activeSlideId, addElement, presentation } = usePresentationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const theme = presentation?.theme;
  const accentColor = theme?.primary || '#a855f7';

  const handleSelectIcon = (iconName) => {
    addElement(activeSlideId, {
      type: 'icon',
      x: 880,
      y: 440,
      width: 160,
      height: 160,
      content: iconName,
      style: {
        color: accentColor,
        strokeWidth: 2,
        backgroundColor: 'transparent',
        borderRadius: 16
      }
    });
    onClose();
  };

  const allIconEntries = Object.keys(ICON_MAP);

  const filteredIcons = allIconEntries.filter(name => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;

    const cat = ICON_CATEGORIES.find(c => c.name === selectedCategory);
    return cat ? cat.icons.includes(name) : true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Vector Icon"
      subtitle="Select a scalable, high-resolution vector icon for your slide"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search icons (e.g. rocket, star, target, trend)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#15102d] border border-[#2a1f56] text-purple-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 placeholder:text-purple-400/50"
            autoFocus
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-purple-600 text-white shadow-glow'
                : 'bg-[#15102d] text-purple-300 hover:bg-[#1a1438] border border-[#2a1f56]'
            }`}
          >
            All Icons ({allIconEntries.length})
          </button>
          {ICON_CATEGORIES.map(category => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.name
                  ? 'bg-purple-600 text-white shadow-glow'
                  : 'bg-[#15102d] text-purple-300 hover:bg-[#1a1438] border border-[#2a1f56]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-[380px] overflow-y-auto p-1">
          {filteredIcons.map(name => {
            const IconComp = ICON_MAP[name];
            return (
              <button
                key={name}
                onClick={() => handleSelectIcon(name)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#15102d] hover:bg-[#241b4d] border border-[#2a1f56] hover:border-purple-500/80 group transition-all duration-150 hover:scale-105"
                title={`Insert ${name}`}
              >
                <IconComp className="w-6 h-6 text-purple-300 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all" />
                <span className="text-[10px] text-purple-300/70 group-hover:text-purple-200 mt-1.5 truncate max-w-full">
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        {filteredIcons.length === 0 && (
          <div className="py-12 text-center text-purple-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No icons found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
