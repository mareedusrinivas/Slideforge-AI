import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  List,
  Type,
  Smile
} from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { FONT_OPTIONS } from '../../utils/themePresets';
import { ColorPicker } from '../ui/ColorPicker';
import { Dropdown } from '../ui/Dropdown';

export const ContextualToolbar = ({ onOpenImageModal, onOpenIconModal }) => {
  const {
    presentation,
    activeSlideId,
    selectedElementIds,
    updateElement,
    deleteElements,
    duplicateElements,
    bringForward,
    sendBackward
  } = usePresentationStore();

  if (!selectedElementIds || selectedElementIds.length === 0) return null;

  const activeSlide = presentation?.slides?.find(s => s.id === activeSlideId);
  const selectedElement = activeSlide?.elements?.find(e => e.id === selectedElementIds[0]);

  if (!selectedElement) return null;

  const isTextType = selectedElement.type === 'text' || selectedElement.type === 'heading';
  const isShapeType = selectedElement.type === 'shape';
  const isImageType = selectedElement.type === 'image';
  const isIconType = selectedElement.type === 'icon';
  const style = selectedElement.style || {};

  const handleStyleChange = (key, value) => {
    updateElement(activeSlideId, selectedElement.id, {
      style: { [key]: value }
    });
  };

  const handleFontSizeDelta = (delta) => {
    const currentSize = style.fontSize || (selectedElement.type === 'heading' ? 48 : 28);
    const newSize = Math.max(12, Math.min(160, currentSize + delta));
    handleStyleChange('fontSize', newSize);
  };

  const handleToggleBullets = () => {
    const content = selectedElement.content || '';
    const lines = content.split('\n');
    const allHaveBullets = lines.every(line => line.trim().startsWith('•') || line.trim() === '');

    const newLines = lines.map(line => {
      if (!line.trim()) return line;
      if (allHaveBullets) {
        return line.replace(/^•\s*/, '');
      } else {
        return line.trim().startsWith('•') ? line : `• ${line}`;
      }
    });

    updateElement(activeSlideId, selectedElement.id, {
      content: newLines.join('\n')
    }, true);
  };

  const handleResetRotation = () => {
    updateElement(activeSlideId, selectedElement.id, { rotation: 0 }, true);
  };

  return (
    <div className="bg-[#15102d]/95 backdrop-blur-md border border-[#3b2a6f] shadow-modal rounded-xl px-3 py-1.5 flex items-center gap-2 select-none z-20 text-xs animate-in fade-in slide-in-from-top-2 duration-150 text-purple-100 max-w-[94vw] overflow-x-auto">
      {/* TEXT FORMATTING CONTROLS */}
      {isTextType && (
        <>
          {/* Font Family Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#2a1f56] hover:bg-[#1a1438] text-purple-200 font-medium">
                <span className="max-w-[100px] truncate">{style.fontFamily || 'Outfit'}</span>
              </button>
            }
            width="w-44"
          >
            <div className="py-1 bg-[#15102d] text-purple-100 max-h-60 overflow-y-auto">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.name}
                  onClick={() => handleStyleChange('fontFamily', f.name)}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#241b4d] ${
                    (style.fontFamily || 'Outfit') === f.name ? 'font-bold text-purple-400 bg-[#1a1438]' : 'text-purple-200'
                  }`}
                  style={{ fontFamily: f.name }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Font Size (+ / -) */}
          <div className="flex items-center rounded-md border border-[#2a1f56] bg-[#1a1438] overflow-hidden">
            <button
              onClick={() => handleFontSizeDelta(-2)}
              className="px-2 py-1 hover:bg-[#241b4d] text-purple-200 font-bold"
              title="Decrease Font Size"
            >
              -
            </button>
            <span className="px-2 py-1 text-center font-semibold text-white min-w-[32px]">
              {style.fontSize || (selectedElement.type === 'heading' ? 48 : 28)}
            </span>
            <button
              onClick={() => handleFontSizeDelta(2)}
              className="px-2 py-1 hover:bg-[#241b4d] text-purple-200 font-bold"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          {/* Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center rounded-md border border-[#2a1f56] overflow-hidden bg-[#1a1438]">
            <button
              onClick={() => handleStyleChange('fontWeight', style.fontWeight === 700 || style.fontWeight === 'bold' ? 400 : 700)}
              className={`p-1.5 hover:bg-[#241b4d] ${style.fontWeight === 700 || style.fontWeight === 'bold' ? 'bg-[#241b4d] text-purple-300 font-bold' : 'text-purple-200'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStyleChange('fontStyle', style.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`p-1.5 hover:bg-[#241b4d] ${style.fontStyle === 'italic' ? 'bg-[#241b4d] text-purple-300' : 'text-purple-200'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStyleChange('textDecoration', style.textDecoration === 'underline' ? 'none' : 'underline')}
              className={`p-1.5 hover:bg-[#241b4d] ${style.textDecoration === 'underline' ? 'bg-[#241b4d] text-purple-300' : 'text-purple-200'}`}
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStyleChange('textDecoration', style.textDecoration === 'line-through' ? 'none' : 'line-through')}
              className={`p-1.5 hover:bg-[#241b4d] ${style.textDecoration === 'line-through' ? 'bg-[#241b4d] text-purple-300' : 'text-purple-200'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Uppercase Transform */}
          <button
            onClick={() => handleStyleChange('textTransform', style.textTransform === 'uppercase' ? 'none' : 'uppercase')}
            className={`px-2 py-1 rounded-md border border-[#2a1f56] font-bold text-xs ${
              style.textTransform === 'uppercase' ? 'bg-[#241b4d] text-purple-400 border-purple-500' : 'bg-[#1a1438] text-purple-200'
            }`}
            title="Toggle Uppercase"
          >
            AA
          </button>

          {/* Alignment */}
          <div className="flex items-center rounded-md border border-[#2a1f56] overflow-hidden bg-[#1a1438]">
            <button
              onClick={() => handleStyleChange('textAlign', 'left')}
              className={`p-1.5 hover:bg-[#241b4d] ${style.textAlign === 'left' || !style.textAlign ? 'bg-[#241b4d] text-purple-300' : 'text-purple-200'}`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'center')}
              className={`p-1.5 hover:bg-[#241b4d] ${style.textAlign === 'center' ? 'bg-[#241b4d] text-purple-300' : 'text-purple-200'}`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'right')}
              className={`p-1.5 hover:bg-[#241b4d] ${style.textAlign === 'right' ? 'bg-[#241b4d] text-purple-300' : 'text-purple-200'}`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bullet List Toggle */}
          <button
            onClick={handleToggleBullets}
            className="p-1.5 rounded-md border border-[#2a1f56] bg-[#1a1438] text-purple-200 hover:text-white hover:bg-[#241b4d]"
            title="Toggle Bullet Points"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {/* Font Color */}
          <ColorPicker
            color={style.color || '#f8fafc'}
            onChange={(c) => handleStyleChange('color', c)}
            label="Text Color"
          />

          {/* Glow / Shadow Toggle */}
          <button
            onClick={() => handleStyleChange('hasGlow', !style.hasGlow)}
            className={`p-1.5 rounded-md border transition-colors ${
              style.hasGlow ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-glow' : 'border-[#2a1f56] bg-[#1a1438] text-purple-300 hover:bg-[#241b4d]'
            }`}
            title="Toggle Text Glow Effect"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#2a1f56]" />
        </>
      )}

      {/* SHAPE CONTROLS */}
      {isShapeType && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-[#a79fc4] font-medium">Fill:</span>
            <ColorPicker
              color={style.backgroundColor || '#a855f7'}
              onChange={(c) => handleStyleChange('backgroundColor', c)}
              label="Shape Fill"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#a79fc4] font-medium">Border:</span>
            <ColorPicker
              color={style.borderColor || '#3b2a6f'}
              onChange={(c) => handleStyleChange('borderColor', c)}
              label="Border Color"
            />
          </div>

          {/* Border Width */}
          <div className="flex items-center gap-1">
            <span className="text-[#a79fc4]">Width:</span>
            <select
              value={style.borderWidth ?? 0}
              onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value, 10))}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="0">0px</option>
              <option value="1">1px</option>
              <option value="2">2px</option>
              <option value="4">4px</option>
              <option value="8">8px</option>
            </select>
          </div>

          {/* Border Style */}
          <div className="flex items-center gap-1">
            <span className="text-[#a79fc4]">Style:</span>
            <select
              value={style.borderStyle || 'solid'}
              onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          {/* Corner Radius */}
          <div className="flex items-center gap-1">
            <span className="text-[#a79fc4]">Radius:</span>
            <select
              value={style.borderRadius ?? 0}
              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value, 10))}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="0">0px</option>
              <option value="8">8px</option>
              <option value="16">16px</option>
              <option value="24">24px</option>
              <option value="36">36px</option>
            </select>
          </div>

          {/* Shape Glow Toggle */}
          <button
            onClick={() => handleStyleChange('hasGlow', !style.hasGlow)}
            className={`p-1.5 rounded-md border transition-colors ${
              style.hasGlow ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-glow' : 'border-[#2a1f56] bg-[#1a1438] text-purple-300 hover:bg-[#241b4d]'
            }`}
            title="Toggle Shape Glow Effect"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#2a1f56]" />
        </>
      )}

      {/* ICON CONTROLS */}
      {isIconType && (
        <>
          <button
            onClick={onOpenIconModal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1438] hover:bg-[#241b4d] text-purple-200 rounded-md font-medium border border-[#2a1f56]"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Icon</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[#a79fc4] font-medium">Color:</span>
            <ColorPicker
              color={style.color || '#a855f7'}
              onChange={(c) => handleStyleChange('color', c)}
              label="Icon Color"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#a79fc4] font-medium">Badge BG:</span>
            <ColorPicker
              color={style.backgroundColor || 'transparent'}
              onChange={(c) => handleStyleChange('backgroundColor', c)}
              label="Icon Background"
            />
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            <span className="text-[#a79fc4]">Stroke:</span>
            <select
              value={style.strokeWidth || 2}
              onChange={(e) => handleStyleChange('strokeWidth', parseInt(e.target.value, 10))}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="1">Thin</option>
              <option value="2">Normal</option>
              <option value="3">Thick</option>
            </select>
          </div>

          {/* Corner Radius */}
          <div className="flex items-center gap-1">
            <span className="text-[#a79fc4]">Radius:</span>
            <select
              value={style.borderRadius ?? 0}
              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value, 10))}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="0">Square</option>
              <option value="16">Rounded</option>
              <option value="9999">Circular</option>
            </select>
          </div>

          {/* Glow Toggle */}
          <button
            onClick={() => handleStyleChange('hasGlow', !style.hasGlow)}
            className={`p-1.5 rounded-md border transition-colors ${
              style.hasGlow ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-glow' : 'border-[#2a1f56] bg-[#1a1438] text-purple-300 hover:bg-[#241b4d]'
            }`}
            title="Toggle Icon Glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#2a1f56]" />
        </>
      )}

      {/* IMAGE CONTROLS */}
      {isImageType && (
        <>
          <button
            onClick={onOpenImageModal}
            className="px-2.5 py-1 bg-[#1a1438] hover:bg-[#241b4d] text-purple-200 rounded-md font-medium border border-[#2a1f56]"
          >
            Replace Image
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[#a79fc4]">Fit:</span>
            <select
              value={style.objectFit || 'cover'}
              onChange={(e) => handleStyleChange('objectFit', e.target.value)}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#a79fc4]">Radius:</span>
            <select
              value={style.borderRadius ?? 0}
              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value, 10))}
              className="px-1.5 py-1 rounded border border-[#2a1f56] bg-[#1a1438] text-white text-xs outline-none"
            >
              <option value="0">0px</option>
              <option value="8">8px</option>
              <option value="16">16px</option>
              <option value="24">24px</option>
              <option value="36">36px</option>
            </select>
          </div>

          {/* Glow Toggle */}
          <button
            onClick={() => handleStyleChange('hasGlow', !style.hasGlow)}
            className={`p-1.5 rounded-md border transition-colors ${
              style.hasGlow ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-glow' : 'border-[#2a1f56] bg-[#1a1438] text-purple-300 hover:bg-[#241b4d]'
            }`}
            title="Toggle Image Glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#2a1f56]" />
        </>
      )}

      {/* ROTATION RESET INDICATOR */}
      {selectedElement.rotation ? (
        <button
          onClick={handleResetRotation}
          className="flex items-center gap-1 px-2 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/50 rounded-md text-purple-300 font-mono text-[11px]"
          title="Reset rotation to 0°"
        >
          <RotateCcw className="w-3 h-3 text-purple-400" />
          <span>{selectedElement.rotation}°</span>
        </button>
      ) : null}

      {/* COMMON CONTROLS: Layer Ordering, Duplicate, Delete */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => bringForward(activeSlideId, selectedElement.id)}
          className="p-1.5 text-purple-300 hover:text-white hover:bg-[#1a1438] rounded-md"
          title="Bring Forward"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => sendBackward(activeSlideId, selectedElement.id)}
          className="p-1.5 text-purple-300 hover:text-white hover:bg-[#1a1438] rounded-md"
          title="Send Backward"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => duplicateElements(activeSlideId, [selectedElement.id])}
          className="p-1.5 text-purple-300 hover:text-purple-400 hover:bg-[#1a1438] rounded-md"
          title="Duplicate Element (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => deleteElements(activeSlideId, [selectedElement.id])}
          className="p-1.5 text-purple-300 hover:text-rose-400 hover:bg-[#1a1438] rounded-md"
          title="Delete Element (Delete / Backspace)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
