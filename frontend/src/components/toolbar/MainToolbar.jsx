import React from 'react';
import {
  Heading,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon,
  Minus,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Award,
  Grid,
  StickyNote,
  Smile,
  Sparkles
} from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { SHAPE_DEFINITIONS } from '../../utils/shapeDefinitions';
import { Dropdown } from '../ui/Dropdown';
import { ColorPicker } from '../ui/ColorPicker';

export const MainToolbar = ({
  onOpenImageModal,
  onOpenIconModal,
  onToggleNotes,
  isNotesOpen
}) => {
  const {
    presentation,
    activeSlideId,
    addElement,
    updateSlideBackground,
    snapToGrid,
    toggleSnapToGrid
  } = usePresentationStore();

  const activeSlide = presentation?.slides?.find(s => s.id === activeSlideId);
  const theme = presentation?.theme;

  const handleAddHeading = () => {
    addElement(activeSlideId, {
      type: 'heading',
      x: 200,
      y: 200,
      width: 1520,
      height: 100,
      content: 'Heading Text',
      style: {
        fontFamily: theme?.fontHeading || 'Outfit',
        fontSize: 54,
        fontWeight: 800,
        color: theme?.primary || '#a855f7',
        textAlign: 'left'
      }
    });
  };

  const handleAddText = () => {
    addElement(activeSlideId, {
      type: 'text',
      x: 200,
      y: 350,
      width: 1200,
      height: 250,
      content: 'Click here or double-click to edit your text. You can format font size, weight, alignment, and color.',
      style: {
        fontFamily: theme?.fontBody || 'Inter',
        fontSize: 28,
        fontWeight: 400,
        color: theme?.text || '#f8fafc',
        textAlign: 'left',
        lineHeight: 1.6
      }
    });
  };

  const handleAddShape = (shapeType) => {
    const shapeDef = SHAPE_DEFINITIONS[shapeType] || SHAPE_DEFINITIONS.rectangle;
    addElement(activeSlideId, {
      type: 'shape',
      x: 300,
      y: 300,
      width: shapeDef.defaultWidth || 400,
      height: shapeDef.defaultHeight || 300,
      content: shapeType,
      style: {
        backgroundColor: theme?.primary || '#a855f7',
        borderRadius: shapeDef.defaultRadius || 0,
        borderColor: '#3b2a6f',
        borderWidth: 0,
        opacity: 1
      }
    });
  };

  return (
    <div className="h-11 bg-[#0e0b1f] border-b border-[#2a1f56] px-4 flex items-center justify-between shrink-0 select-none overflow-x-auto text-xs z-10 text-purple-100">
      {/* Element Creation Buttons */}
      <div className="flex items-center gap-1">
        {/* Add Heading */}
        <button
          onClick={handleAddHeading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-purple-200 hover:text-white hover:bg-[#1a1438] rounded-lg font-medium transition-colors"
          title="Add Title / Heading Element"
        >
          <Heading className="w-4 h-4 text-purple-400" />
          <span>Heading</span>
        </button>

        {/* Add Body Text */}
        <button
          onClick={handleAddText}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-purple-200 hover:text-white hover:bg-[#1a1438] rounded-lg font-medium transition-colors"
          title="Add Text Block"
        >
          <Type className="w-4 h-4 text-purple-300" />
          <span>Text</span>
        </button>

        {/* Add Image */}
        <button
          onClick={onOpenImageModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-purple-200 hover:text-white hover:bg-[#1a1438] rounded-lg font-medium transition-colors"
          title="Upload or Insert Image"
        >
          <ImageIcon className="w-4 h-4 text-fuchsia-400" />
          <span>Image</span>
        </button>

        {/* Add Shape Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-purple-200 hover:text-white hover:bg-[#1a1438] rounded-lg font-medium transition-colors cursor-pointer">
              <Square className="w-4 h-4 text-violet-400" />
              <span>Shape</span>
            </div>
          }
          width="w-56"
          align="left"
        >
          <div className="p-1 space-y-0.5 bg-[#15102d] text-purple-100 max-h-[360px] overflow-y-auto">
            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-purple-400 uppercase">
              Basic Shapes
            </div>
            <button
              onClick={() => handleAddShape('rectangle')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Square className="w-4 h-4 text-purple-400" /> Rectangle
            </button>
            <button
              onClick={() => handleAddShape('rounded')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Square className="w-4 h-4 rounded-md text-purple-400" /> Rounded Box
            </button>
            <button
              onClick={() => handleAddShape('circle')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Circle className="w-4 h-4 text-purple-400" /> Circle
            </button>
            <button
              onClick={() => handleAddShape('triangle')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Triangle className="w-4 h-4 text-purple-400" /> Triangle
            </button>

            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-purple-400 uppercase pt-1 border-t border-[#2a1f56]">
              Geometric & Badges
            </div>
            <button
              onClick={() => handleAddShape('star')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Star className="w-4 h-4 text-amber-400" /> 5-Point Star
            </button>
            <button
              onClick={() => handleAddShape('hexagon')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Hexagon className="w-4 h-4 text-purple-400" /> Hexagon
            </button>
            <button
              onClick={() => handleAddShape('diamond')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Square className="w-4 h-4 rotate-45 text-purple-400" /> Diamond
            </button>
            <button
              onClick={() => handleAddShape('badge')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Award className="w-4 h-4 text-purple-400" /> Award Badge
            </button>

            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-purple-400 uppercase pt-1 border-t border-[#2a1f56]">
              Flow & Callouts
            </div>
            <button
              onClick={() => handleAddShape('arrow-right')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <ArrowRight className="w-4 h-4 text-purple-400" /> Right Arrow
            </button>
            <button
              onClick={() => handleAddShape('arrow-left')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" /> Left Arrow
            </button>
            <button
              onClick={() => handleAddShape('callout')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" /> Speech Callout
            </button>
            <button
              onClick={() => handleAddShape('line')}
              className="w-full text-left px-2.5 py-1.5 hover:bg-[#241b4d] rounded-md flex items-center gap-2 text-purple-200"
            >
              <Minus className="w-4 h-4 text-purple-400" /> Horizontal Line
            </button>
          </div>
        </Dropdown>

        {/* Add Vector Icon */}
        <button
          onClick={onOpenIconModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-purple-200 hover:text-white hover:bg-[#1a1438] rounded-lg font-medium transition-colors"
          title="Insert Vector Icon"
        >
          <Smile className="w-4 h-4 text-amber-400" />
          <span>Icon</span>
        </button>
      </div>

      {/* Right Canvas Helpers */}
      <div className="flex items-center gap-2">
        {/* Slide Background Color Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#a79fc4] font-medium hidden sm:inline">Background:</span>
          <ColorPicker
            color={activeSlide?.background?.value || '#0d0a1b'}
            onChange={(c) => updateSlideBackground(activeSlideId, { value: c, type: 'color' })}
            label="Slide Background"
          />
        </div>

        <div className="h-4 w-px bg-[#2a1f56]" />

        {/* Snap to Grid Toggle */}
        <button
          onClick={toggleSnapToGrid}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
            snapToGrid
              ? 'bg-[#241b4d] border-purple-500 text-purple-300 font-semibold shadow-glow'
              : 'border-[#2a1f56] text-purple-300 hover:bg-[#1a1438]'
          }`}
          title="Toggle Grid Snapping"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Grid Snap</span>
        </button>

        {/* Presenter Notes Toggle */}
        <button
          onClick={onToggleNotes}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
            isNotesOpen
              ? 'bg-[#241b4d] border-purple-500 text-purple-300 font-semibold shadow-glow'
              : 'border-[#2a1f56] text-purple-300 hover:bg-[#1a1438]'
          }`}
          title="Toggle Speaker Notes"
        >
          <StickyNote className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Notes</span>
        </button>
      </div>
    </div>
  );
};
