import React, { useRef, useState, useEffect } from 'react';
import { usePresentationStore } from '../../store/presentationStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../utils/canvasMath';
import { CanvasElement } from './CanvasElement';
import { AlignmentGuides } from './AlignmentGuides';
import { ContextualToolbar } from '../toolbar/ContextualToolbar';
import { Layers, Monitor, Keyboard } from 'lucide-react';

export const PresentationCanvas = ({
  isNotesOpen,
  onOpenImageModal,
  onOpenIconModal
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(0.6);

  const {
    presentation,
    activeSlideId,
    selectedElementIds,
    clearSelection,
    deleteElements,
    duplicateElements,
    updateElement,
    updateSlideNotes,
    undo,
    redo,
    zoom,
    activeGuides,
    snapToGrid
  } = usePresentationStore();

  const slides = presentation?.slides || [];
  const activeSlideIndex = slides.findIndex(s => s.id === activeSlideId);
  const activeSlide = slides[activeSlideIndex] || slides[0];

  // Compute uniform scaling to maintain 16:9 aspect ratio and fit perfectly
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;

      const padding = 48;
      const availWidth = Math.max(300, clientWidth - padding);
      const availHeight = Math.max(200, clientHeight - padding);

      if (typeof zoom === 'number') {
        setScale(zoom);
      } else {
        const scaleX = availWidth / CANVAS_WIDTH;
        const scaleY = availHeight / CANVAS_HEIGHT;
        const fitScale = Math.min(scaleX, scaleY);
        setScale(Math.max(0.15, fitScale));
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [zoom]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (isInput) return;

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Cmd+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        redo();
        return;
      }

      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          duplicateElements(activeSlideId, selectedElementIds);
        }
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          deleteElements(activeSlideId, selectedElementIds);
        }
        return;
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        clearSelection();
        return;
      }

      // Arrow Key Nudging
      if (selectedElementIds.length === 1 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 2;
        const el = activeSlide?.elements?.find(item => item.id === selectedElementIds[0]);
        if (el) {
          let newX = el.x;
          let newY = el.y;
          if (e.key === 'ArrowUp') newY -= delta;
          if (e.key === 'ArrowDown') newY += delta;
          if (e.key === 'ArrowLeft') newX -= delta;
          if (e.key === 'ArrowRight') newX += delta;
          updateElement(activeSlideId, el.id, { x: newX, y: newY }, true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, activeSlideId, activeSlide, undo, redo, duplicateElements, deleteElements, clearSelection, updateElement]);

  const bg = activeSlide?.background || { type: 'color', value: '#ffffff' };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#080612]">
      {/* Floating Contextual Toolbar at Top Center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <ContextualToolbar
          onOpenImageModal={onOpenImageModal}
          onOpenIconModal={onOpenIconModal}
        />
      </div>

      {/* Main Canvas Scroll / Center Area */}
      <div
        ref={containerRef}
        onClick={(e) => {
          if (e.target === containerRef.current || e.target === canvasRef.current) {
            clearSelection();
          }
        }}
        className="flex-1 overflow-auto flex items-center justify-center p-6 relative canvas-grid select-none bg-[#080612]"
      >
        {activeSlide ? (
          <div
            ref={canvasRef}
            id="slide-canvas"
            className="relative shadow-canvas rounded-lg overflow-hidden shrink-0 border border-[#2a1f56]/80 transition-transform duration-75"
            style={{
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              backgroundColor: bg.type === 'color' ? bg.value : '#0d0a1b',
              backgroundImage: bg.type === 'image' ? `url(${bg.value})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Alignment Guides */}
            <AlignmentGuides guides={activeGuides} />

            {/* Elements Layer */}
            {(activeSlide.elements || []).map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElementIds.includes(element.id)}
                scale={scale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-[#a79fc4]">
            <p className="text-sm font-medium">No slide selected</p>
          </div>
        )}
      </div>

      {/* Collapsible Speaker Notes Panel */}
      {isNotesOpen && activeSlide && (
        <div className="h-32 bg-[#0e0b1f] border-t border-[#2a1f56] p-3 shrink-0 flex flex-col z-10 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Speaker Notes (Visible only to presenter)
            </span>
          </div>
          <textarea
            value={activeSlide.notes || ''}
            onChange={(e) => updateSlideNotes(activeSlide.id, e.target.value)}
            placeholder="Type speaker notes here to guide your talk during presentation mode..."
            className="flex-1 w-full text-xs text-purple-100 bg-[#15102d] border border-[#2a1f56] rounded-lg p-2 resize-none focus:outline-none focus:bg-[#1a1438] focus:ring-1 focus:ring-purple-500 placeholder:text-[#6c6194]"
          />
        </div>
      )}

      {/* Bottom Status & Info Bar */}
      <div className="h-7 bg-[#0e0b1f]/90 border-t border-[#2a1f56] px-4 flex items-center justify-between shrink-0 text-[11px] text-[#a79fc4] select-none z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-purple-300">
            <Layers className="w-3 h-3 text-purple-400" />
            Slide {activeSlideIndex + 1} of {slides.length}
          </span>
          <span className="hidden sm:inline text-purple-400/40">•</span>
          <span className="hidden sm:flex items-center gap-1">
            <Monitor className="w-3 h-3 text-purple-400" />
            1920 × 1080 (16:9)
          </span>
          {selectedElementIds.length > 0 && (
            <>
              <span className="text-purple-400/40">•</span>
              <span className="text-purple-300 font-semibold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                {selectedElementIds.length} element{selectedElementIds.length > 1 ? 's' : ''} selected
              </span>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {snapToGrid && (
            <span className="text-[10px] text-purple-400/80 bg-[#1a1438] px-1.5 py-0.5 rounded border border-[#2a1f56]">
              Grid Snap Active
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-[#6c6194]">
            <Keyboard className="w-3 h-3" />
            Del: Delete • Ctrl+D: Duplicate • Shift: Multi-select
          </span>
        </div>
      </div>
    </div>
  );
};
