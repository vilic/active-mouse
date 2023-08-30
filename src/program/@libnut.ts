export const libnut = require(
  `@nut-tree/libnut-${process.platform}/build/Release/libnut.node`,
) as {
  getMousePos(): Point;
};

export interface Point {
  x: number;
  y: number;
}
