import type {Point} from '@nut-tree/nut-js';
import {mouse} from '@nut-tree/nut-js';

import {MOUSE_POSITION_INTERVAL} from './@constants';

export type MouseMoveCallback = () => void;

export function requestMouseMove(callback: MouseMoveCallback): void {
  let previous: Point | undefined;

  request();

  function request(): void {
    void mouse.getPosition().then(current => {
      setTimeout(request, MOUSE_POSITION_INTERVAL);

      if (!previous) {
        previous = current;
        return;
      }

      if (current.x === previous.x && current.y === previous.y) {
        return;
      }

      previous = current;

      callback();
    });
  }
}
