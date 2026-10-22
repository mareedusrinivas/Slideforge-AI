import React from 'react';
import { SHAPE_DEFINITIONS } from '../../utils/shapeDefinitions';

export const ShapeRenderer = ({
  shapeType = 'rectangle',
  style = {},
  className = ''
}) => {
  const shapeDef = SHAPE_DEFINITIONS[shapeType] || SHAPE_DEFINITIONS.rectangle;
  const isCircle = shapeDef.isCircle || shapeType === 'circle';
  const isLine = shapeDef.isLine || shapeType === 'line';

  const backgroundColor = style.backgroundColor || '#a855f7';
  const borderColor = style.borderColor || 'transparent';
  const borderWidth = style.borderWidth ?? 0;
  const borderStyle = style.borderStyle || 'solid';
  const borderRadius = isCircle
    ? '9999px'
    : isLine
    ? '9999px'
    : shapeDef.clipPath
    ? 0
    : `${style.borderRadius ?? (shapeDef.defaultRadius || 0)}px`;

  const boxShadow = style.boxShadow || (style.hasGlow ? `0 0 25px ${backgroundColor}` : undefined);

  if (isLine) {
    return (
      <div
        className={`w-full h-full ${className}`}
        style={{
          backgroundColor,
          borderRadius,
          boxShadow
        }}
      />
    );
  }

  return (
    <div
      className={`w-full h-full relative transition-all ${className}`}
      style={{
        backgroundColor,
        borderColor: borderWidth > 0 ? borderColor : 'transparent',
        borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
        borderStyle: borderWidth > 0 ? borderStyle : undefined,
        borderRadius,
        clipPath: shapeDef.clipPath,
        boxShadow
      }}
    />
  );
};
