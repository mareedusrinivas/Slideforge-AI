import React from 'react';
import { ShapeRenderer } from '../editor/ShapeRenderer';
import { IconRenderer } from '../editor/IconRenderer';

export const SlideThumbnail = ({ slide, width = 160 }) => {
  // 16:9 ratio
  const height = Math.round((width * 9) / 16);
  const scale = width / 1920;

  const bg = slide.background || { type: 'color', value: '#0d0a1b' };
  const elements = slide.elements || [];

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-[#2a1f56] shadow-md pointer-events-none select-none bg-[#0d0a1b]"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: bg.type === 'color' ? bg.value : '#0d0a1b',
        backgroundImage: bg.type === 'image' ? `url(${bg.value})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Scaled Element Layer */}
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`
        }}
      >
        {elements.map((el) => {
          if (el.type === 'heading' || el.type === 'text') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  color: el.style?.color || '#f5f3ff',
                  fontFamily: el.style?.fontFamily || 'Inter',
                  fontSize: `${el.style?.fontSize || 24}px`,
                  fontWeight: el.style?.fontWeight || (el.type === 'heading' ? 700 : 400),
                  fontStyle: el.style?.fontStyle || 'normal',
                  textAlign: el.style?.textAlign || 'left',
                  textTransform: el.style?.textTransform || 'none',
                  lineHeight: el.style?.lineHeight || 1.3,
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              >
                {el.content}
              </div>
            );
          }

          if (el.type === 'image') {
            return (
              <img
                key={el.id}
                src={el.content}
                alt=""
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  borderRadius: `${el.style?.borderRadius || 0}px`,
                  objectFit: el.style?.objectFit || 'cover',
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              />
            );
          }

          if (el.type === 'shape') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              >
                <ShapeRenderer shapeType={el.content} style={el.style || {}} />
              </div>
            );
          }

          if (el.type === 'icon') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              >
                <IconRenderer iconName={el.content} style={el.style || {}} />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
