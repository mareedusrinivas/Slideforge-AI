import React, { useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { SlideThumbnail } from './SlideThumbnail';
import { Button } from '../ui/Button';

export const SlideSidebar = ({
  onOpenNewSlideModal,
  onConfirmDeleteSlide
}) => {
  const {
    presentation,
    activeSlideId,
    setActiveSlideId,
    addSlide,
    duplicateSlide,
    reorderSlides,
    isSidebarOpen
  } = usePresentationStore();

  const [draggedIndex, setDraggedIndex] = useState(null);

  if (!isSidebarOpen) return null;

  const slides = presentation?.slides || [];

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderSlides(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const handleMoveUp = (index, e) => {
    e.stopPropagation();
    if (index > 0) reorderSlides(index, index - 1);
  };

  const handleMoveDown = (index, e) => {
    e.stopPropagation();
    if (index < slides.length - 1) reorderSlides(index, index + 1);
  };

  return (
    <aside className="w-56 md:w-64 bg-[#0e0b1f] border-r border-[#2a1f56] flex flex-col shrink-0 select-none z-20 text-purple-100">
      {/* Top Action Bar */}
      <div className="p-3 border-b border-[#2a1f56] flex items-center justify-between gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => addSlide('title-content')}
          className="w-full text-xs font-semibold py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-glow"
        >
          New Slide
        </Button>
        <button
          onClick={onOpenNewSlideModal}
          className="p-2 text-purple-300 hover:text-white hover:bg-[#1a1438] rounded-lg transition-colors shrink-0"
          title="Choose Slide Layout"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId;
          const slideNumber = index + 1;

          return (
            <div
              key={slide.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => setActiveSlideId(slide.id)}
              className={`group relative flex items-start gap-2 p-1.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1a1438] border-purple-500 ring-2 ring-purple-500/30 shadow-glow'
                  : 'bg-[#15102d] border-[#2a1f56] hover:border-[#4c3891] hover:bg-[#1a1438] shadow-xs'
              } ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}`}
            >
              {/* Slide Number Badge */}
              <div className="flex flex-col items-center justify-center pt-1 w-5 shrink-0">
                <span className={`text-xs font-semibold ${isActive ? 'text-purple-400 font-bold' : 'text-[#6c6194]'}`}>
                  {slideNumber}
                </span>

                {/* Move Controls on Hover */}
                <div className="hidden group-hover:flex flex-col items-center mt-1 space-y-0.5">
                  <button
                    disabled={index === 0}
                    onClick={(e) => handleMoveUp(index, e)}
                    className="p-0.5 text-[#a79fc4] hover:text-white disabled:opacity-20"
                    title="Move slide up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === slides.length - 1}
                    onClick={(e) => handleMoveDown(index, e)}
                    className="p-0.5 text-[#a79fc4] hover:text-white disabled:opacity-20"
                    title="Move slide down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scaled Preview Thumbnail */}
              <div className="flex-1 overflow-hidden">
                <SlideThumbnail slide={slide} width={180} />
              </div>

              {/* Slide Context Actions Dropdown/Overlay */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#0e0b1f]/90 backdrop-blur-xs rounded-lg shadow-xs border border-[#2a1f56] p-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(slide.id);
                  }}
                  className="p-1 text-purple-300 hover:text-white rounded hover:bg-[#1a1438]"
                  title="Duplicate Slide"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirmDeleteSlide(slide.id);
                  }}
                  disabled={slides.length <= 1}
                  className="p-1 text-purple-300 hover:text-rose-400 rounded hover:bg-[#1a1438] disabled:opacity-30"
                  title="Delete Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-[#2a1f56] text-center text-[11px] text-[#6c6194] font-medium">
        {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'} • Drag to reorder
      </div>
    </aside>
  );
};
