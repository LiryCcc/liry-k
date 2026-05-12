/**
 * square status
 * 1. none; has no stone
 * 2. white; has white stone
 * 3. black; has black stone
 */

export const SQUARE_STATUS = {
  NONE: 'NONE',
  WHITE: 'WHITE',
  BLACK: 'BLACK'
} as const;

export type SquareStatus = (typeof SQUARE_STATUS)[keyof typeof SQUARE_STATUS];

/**
 * gomoku coordinate system description
 * 15 columns & 15 rows
 * 0~14 from topleft to bottomright
 */

export const GRID_LENGTH = 15;
