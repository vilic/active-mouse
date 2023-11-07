import {createRequire} from 'module';

const require = createRequire(import.meta.url);

export const libnut = require(
  `@nut-tree/libnut-${process.platform}/build/Release/libnut.node`,
) as {
  getMousePos(): Point;
};

export type Point = {
  x: number;
  y: number;
};
