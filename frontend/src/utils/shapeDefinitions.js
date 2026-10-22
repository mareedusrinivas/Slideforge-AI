/**
 * SlideForge AI - Shape Definitions and Clip Paths
 * Comprehensive geometric shapes for the canvas presentation editor.
 */

export const SHAPE_DEFINITIONS = {
  rectangle: {
    id: 'rectangle',
    label: 'Rectangle',
    clipPath: undefined,
    defaultWidth: 400,
    defaultHeight: 300,
  },
  rounded: {
    id: 'rounded',
    label: 'Rounded Rectangle',
    clipPath: undefined,
    defaultRadius: 24,
    defaultWidth: 400,
    defaultHeight: 300,
  },
  circle: {
    id: 'circle',
    label: 'Circle / Oval',
    clipPath: undefined,
    isCircle: true,
    defaultWidth: 350,
    defaultHeight: 350,
  },
  triangle: {
    id: 'triangle',
    label: 'Triangle',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    defaultWidth: 350,
    defaultHeight: 350,
  },
  star: {
    id: 'star',
    label: '5-Point Star',
    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    defaultWidth: 350,
    defaultHeight: 350,
  },
  hexagon: {
    id: 'hexagon',
    label: 'Hexagon',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    defaultWidth: 380,
    defaultHeight: 340,
  },
  diamond: {
    id: 'diamond',
    label: 'Diamond (Rhombus)',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    defaultWidth: 350,
    defaultHeight: 350,
  },
  'arrow-right': {
    id: 'arrow-right',
    label: 'Right Arrow',
    clipPath: 'polygon(0% 25%, 65% 25%, 65% 0%, 100% 50%, 65% 100%, 65% 75%, 0% 75%)',
    defaultWidth: 450,
    defaultHeight: 220,
  },
  'arrow-left': {
    id: 'arrow-left',
    label: 'Left Arrow',
    clipPath: 'polygon(35% 0%, 35% 25%, 100% 25%, 100% 75%, 35% 75%, 35% 100%, 0% 50%)',
    defaultWidth: 450,
    defaultHeight: 220,
  },
  callout: {
    id: 'callout',
    label: 'Speech Callout',
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 45% 75%, 25% 100%, 30% 75%, 0% 75%)',
    defaultWidth: 450,
    defaultHeight: 300,
  },
  badge: {
    id: 'badge',
    label: 'Award Badge',
    clipPath: 'polygon(50% 0%, 65% 15%, 85% 15%, 85% 35%, 100% 50%, 85% 65%, 85% 85%, 65% 85%, 50% 100%, 35% 85%, 15% 85%, 15% 65%, 0% 50%, 15% 35%, 15% 15%, 35% 15%)',
    defaultWidth: 350,
    defaultHeight: 350,
  },
  line: {
    id: 'line',
    label: 'Horizontal Line',
    isLine: true,
    defaultWidth: 800,
    defaultHeight: 6,
  }
};
