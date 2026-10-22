import React from 'react';
import {
  Heading1,
  LayoutList,
  Columns2,
  Image as ImageIcon,
  Maximize2,
  Bookmark,
  Square
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { SLIDE_LAYOUT_OPTIONS } from '../../utils/themePresets';
import { usePresentationStore } from '../../store/presentationStore';

export const NewSlideModal = ({ isOpen, onClose }) => {
  const { addSlide } = usePresentationStore();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Heading1': return <Heading1 className="w-5 h-5" />;
      case 'LayoutList': return <LayoutList className="w-5 h-5" />;
      case 'Columns2': return <Columns2 className="w-5 h-5" />;
      case 'Image': return <ImageIcon className="w-5 h-5" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5" />;
      case 'Bookmark': return <Bookmark className="w-5 h-5" />;
      case 'Square': return <Square className="w-5 h-5" />;
      default: return <LayoutList className="w-5 h-5" />;
    }
  };

  const handleSelectLayout = (layoutId) => {
    addSlide(layoutId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Slide"
      subtitle="Select a pre-designed layout structure for your next slide"
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {SLIDE_LAYOUT_OPTIONS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => handleSelectLayout(layout.id)}
            className="group flex flex-col items-start p-4 rounded-xl border border-[#2a1f56] hover:border-purple-500 bg-[#15102d] hover:bg-[#1a1438] text-left transition-all duration-150 cursor-pointer shadow-xs hover:shadow-glow"
          >
            <div className="p-2.5 rounded-lg bg-[#1a1438] border border-[#2a1f56] group-hover:bg-purple-600 group-hover:text-white text-purple-400 transition-colors mb-3">
              {getIcon(layout.icon)}
            </div>
            <div className="font-semibold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors">
              {layout.label}
            </div>
            <div className="text-xs text-[#a79fc4] line-clamp-2 leading-relaxed">
              {layout.description}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
