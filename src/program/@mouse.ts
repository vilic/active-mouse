import type {Point} from '@nut-tree/libnut';
import {getMousePos} from '@nut-tree/libnut';

import {MOUSE_POSITION_INTERVAL} from './@constants';

export type MouseMoveCallback = () => void;

export function requestMouseMove(callback: MouseMoveCallback): void {
  let previous: Point | undefined;

  request();

  function request(): void {
    setTimeout(request, MOUSE_POSITION_INTERVAL);

    const current = getMousePos();

    if (!previous) {
      previous = current;
      return;
    }

    if (current.x === previous.x && current.y === previous.y) {
      return;
    }

    previous = current;

    callback();
  }
}
