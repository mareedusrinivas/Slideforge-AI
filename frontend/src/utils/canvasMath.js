export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const GRID_SIZE = 20;
export const SNAP_THRESHOLD = 15;

/**
 * Snaps a coordinate value to nearest grid
 */
export const snapToGrid = (value, gridSize = GRID_SIZE) => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Calculates alignment snap lines and snapped coordinates
 */
export const calculateAlignmentSnapping = (x, y, width, height, enableGrid = false) => {
  let snappedX = x;
  let snappedY = y;
  let snapGuideX = null;
  let snapGuideY = null;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const canvasCenterX = CANVAS_WIDTH / 2;
  const canvasCenterY = CANVAS_HEIGHT / 2;

  // Horizontal center snap
  if (Math.abs(centerX - canvasCenterX) <= SNAP_THRESHOLD) {
    snappedX = canvasCenterX - width / 2;
    snapGuideX = canvasCenterX;
  }

  // Vertical center snap
  if (Math.abs(centerY - canvasCenterY) <= SNAP_THRESHOLD) {
    snappedY = canvasCenterY - height / 2;
    snapGuideY = canvasCenterY;
  }

  // Left slide edge snap
  if (Math.abs(x - 120) <= SNAP_THRESHOLD) {
    snappedX = 120;
  }

  // If grid is enabled and not snapped to center guide, snap to grid
  if (enableGrid) {
    if (snapGuideX === null) snappedX = snapToGrid(snappedX);
    if (snapGuideY === null) snappedY = snapToGrid(snappedY);
  }

  return {
    x: Math.round(snappedX),
    y: Math.round(snappedY),
    snapGuideX,
    snapGuideY
  };
};

/**
 * Clamps dimensions and positions so elements remain usable
 */
export const clampElementBounds = (x, y, width, height) => {
  const minWidth = 40;
  const minHeight = 20;

  const boundedWidth = Math.max(minWidth, width);
  const boundedHeight = Math.max(minHeight, height);

  // Allow elements to move close to canvas edges
  const boundedX = Math.max(-boundedWidth + 50, Math.min(x, CANVAS_WIDTH - 50));
  const boundedY = Math.max(-boundedHeight + 50, Math.min(y, CANVAS_HEIGHT - 50));

  return {
    x: Math.round(boundedX),
    y: Math.round(boundedY),
    width: Math.round(boundedWidth),
    height: Math.round(boundedHeight)
  };
};
