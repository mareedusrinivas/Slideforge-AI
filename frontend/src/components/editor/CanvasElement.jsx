import React, { useState, useRef, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { calculateAlignmentSnapping, clampElementBounds, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../utils/canvasMath';
import { ShapeRenderer } from './ShapeRenderer';
import { IconRenderer } from './IconRenderer';

const RESIZE_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export const CanvasElement = ({
  element,
  isSelected,
  scale = 1
}) => {
  const {
    activeSlideId,
    selectElement,
    updateElement,
    snapToGrid,
    setActiveGuides
  } = usePresentationStore();

  const elementRef = useRef(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [textContent, setTextContent] = useState(element.content || '');
  const [isRotating, setIsRotating] = useState(false);
  const textInputRef = useRef(null);

  // Sync content if element updates externally (e.g. from AI)
  useEffect(() => {
    setTextContent(element.content || '');
  }, [element.content]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditingText]);

  // Handle Dragging
  const handleDragStart = (e) => {
    if (isEditingText || isRotating) return;
    if (e.button !== 0) return; // Left click only
    e.stopPropagation();

    selectElement(element.id, e.shiftKey);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialElX = element.x;
    const initialElY = element.y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      const rawX = initialElX + deltaX;
      const rawY = initialElY + deltaY;

      const snapped = calculateAlignmentSnapping(rawX, rawY, element.width, element.height, snapToGrid);
      const clamped = clampElementBounds(snapped.x, snapped.y, element.width, element.height);

      setActiveGuides({ x: snapped.snapGuideX, y: snapped.snapGuideY });

      updateElement(activeSlideId, element.id, {
        x: clamped.x,
        y: clamped.y
      }, false);
    };

    const handleMouseUp = () => {
      setActiveGuides({ x: null, y: null });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateElement(activeSlideId, element.id, {}, true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Resizing via 8 Handles
  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;
    const initialW = element.width;
    const initialH = element.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      let newX = initialX;
      let newY = initialY;
      let newW = initialW;
      let newH = initialH;

      if (handle.includes('e')) {
        newW = initialW + deltaX;
      }
      if (handle.includes('w')) {
        newW = initialW - deltaX;
        newX = initialX + deltaX;
      }
      if (handle.includes('s')) {
        newH = initialH + deltaY;
      }
      if (handle.includes('n')) {
        newH = initialH - deltaY;
        newY = initialY + deltaY;
      }

      const clamped = clampElementBounds(newX, newY, newW, newH);

      updateElement(activeSlideId, element.id, {
        x: clamped.x,
        y: clamped.y,
        width: clamped.width,
        height: clamped.height
      }, false);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateElement(activeSlideId, element.id, {}, true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Rotation via top handle
  const handleRotateStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const el = elementRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - centerX;
      const deltaY = moveEvent.clientY - centerY;
      let degrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;

      // Snap to 0, 45, 90, 135, 180, 225, 270, 315, 360 if within 5 degrees
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const snap of snapAngles) {
        if (Math.abs(degrees - snap) <= 5) {
          degrees = snap === 360 ? 0 : snap;
          break;
        }
      }

      updateElement(activeSlideId, element.id, {
        rotation: Math.round(degrees)
      }, false);
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateElement(activeSlideId, element.id, {}, true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (element.type === 'text' || element.type === 'heading') {
      setIsEditingText(true);
    }
  };

  const handleTextBlur = () => {
    setIsEditingText(false);
    updateElement(activeSlideId, element.id, { content: textContent }, true);
  };

  // Element Rendering based on Type
  const renderElementContent = () => {
    const style = element.style || {};

    if (element.type === 'heading' || element.type === 'text') {
      const textStyles = {
        fontFamily: style.fontFamily || 'Inter',
        fontSize: `${style.fontSize || (element.type === 'heading' ? 48 : 24)}px`,
        fontWeight: style.fontWeight || (element.type === 'heading' ? 700 : 400),
        fontStyle: style.fontStyle || 'normal',
        textDecoration: style.textDecoration || 'none',
        textTransform: style.textTransform || 'none',
        color: style.color || '#f5f3ff',
        textAlign: style.textAlign || 'left',
        lineHeight: style.lineHeight || 1.4,
        letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
        textShadow: style.textShadow || (style.hasGlow ? `0 0 15px ${style.color || '#a855f7'}` : undefined)
      };

      if (isEditingText) {
        return (
          <textarea
            ref={textInputRef}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            onBlur={handleTextBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleTextBlur();
              }
            }}
            className="w-full h-full bg-transparent resize-none border-none outline-none p-0 focus:ring-0 leading-normal"
            style={textStyles}
          />
        );
      }

      return (
        <div
          className="w-full h-full select-none whitespace-pre-wrap break-words pointer-events-none"
          style={textStyles}
        >
          {element.content}
        </div>
      );
    }

    if (element.type === 'image') {
      return (
        <img
          src={element.content}
          alt=""
          className="w-full h-full select-none pointer-events-none transition-all"
          style={{
            objectFit: style.objectFit || 'cover',
            borderRadius: `${style.borderRadius || 0}px`,
            boxShadow: style.boxShadow || (style.hasGlow ? '0 0 25px rgba(168,85,247,0.5)' : undefined)
          }}
        />
      );
    }

    if (element.type === 'shape') {
      return (
        <ShapeRenderer
          shapeType={element.content}
          style={style}
        />
      );
    }

    if (element.type === 'icon') {
      return (
        <IconRenderer
          iconName={element.content}
          style={style}
        />
      );
    }

    return null;
  };

  const getHandlePositionClass = (handle) => {
    switch (handle) {
      case 'nw': return 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize';
      case 'n': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize';
      case 'ne': return 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize';
      case 'e': return 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize';
      case 'se': return 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize';
      case 's': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize';
      case 'sw': return 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize';
      case 'w': return 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize';
      default: return '';
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleDragStart}
      onDoubleClick={handleDoubleClick}
      className={`absolute cursor-move ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: element.opacity ?? 1
      }}
    >
      {/* Content wrapper */}
      <div className="w-full h-full relative">
        {renderElementContent()}
      </div>

      {/* Selection Border, Resize Handles, & Rotation Control */}
      {isSelected && (
        <>
          {/* Active Glowing Violet Outline */}
          <div className="absolute inset-0 border-2 border-purple-500 pointer-events-none rounded-xs shadow-[0_0_12px_rgba(168,85,247,0.4)]" />

          {/* Top Rotation Handle Stem */}
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing z-30 group"
            onMouseDown={handleRotateStart}
            title={`Rotate (Current: ${element.rotation || 0}°)`}
          >
            <div className="w-5 h-5 rounded-full bg-white border-2 border-purple-600 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <RotateCw className="w-2.5 h-2.5 text-purple-700" />
            </div>
            <div className="w-0.5 h-2 bg-purple-500 shadow-xs" />
          </div>

          {/* 8 Resize Handles */}
          {RESIZE_HANDLES.map((handle) => (
            <div
              key={handle}
              onMouseDown={(e) => handleResizeStart(e, handle)}
              className={`absolute w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-sm shadow-md hover:scale-125 transition-transform z-30 ${getHandlePositionClass(handle)}`}
            />
          ))}
        </>
      )}
    </div>
  );
};
