import React from 'react';
import { ICON_MAP } from '../../utils/iconDefinitions';
import { Sparkles } from 'lucide-react';

export const IconRenderer = ({
  iconName = 'Sparkles',
  style = {},
  className = ''
}) => {
  const IconComponent = ICON_MAP[iconName] || Sparkles;
  const color = style.color || '#a855f7';
  const strokeWidth = style.strokeWidth || 2;
  const backgroundColor = style.backgroundColor || 'transparent';
  const borderRadius = style.borderRadius ?? 0;
  const boxShadow = style.boxShadow || (style.hasGlow ? `0 0 20px ${color}` : undefined);
  const padding = style.padding || (backgroundColor !== 'transparent' ? '12%' : '0');

  return (
    <div
      className={`w-full h-full flex items-center justify-center relative transition-all ${className}`}
      style={{
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        boxShadow,
        padding
      }}
    >
      <IconComponent
        className="w-full h-full object-contain pointer-events-none"
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};
