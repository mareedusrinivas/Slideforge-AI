import React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../utils/canvasMath';

export const AlignmentGuides = ({ guides }) => {
  if (!guides) return null;
  const { x, y } = guides;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Vertical Snap Line (Center X) */}
      {x !== null && (
        <div
          className="absolute top-0 bottom-0 border-l border-dashed border-indigo-500 z-30"
          style={{ left: `${x}px` }}
        >
          <div className="absolute top-2 -left-3 bg-indigo-500 text-white text-[10px] font-mono px-1 rounded shadow-xs">
            {x}
          </div>
        </div>
      )}

      {/* Horizontal Snap Line (Center Y) */}
      {y !== null && (
        <div
          className="absolute left-0 right-0 border-t border-dashed border-indigo-500 z-30"
          style={{ top: `${y}px` }}
        >
          <div className="absolute left-2 -top-3 bg-indigo-500 text-white text-[10px] font-mono px-1 rounded shadow-xs">
            {y}
          </div>
        </div>
      )}
    </div>
  );
};
