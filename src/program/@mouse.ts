import RobotJS from 'robotjs';

import {MOUSE_POSITION_INTERVAL} from './@constants.js';

export type MouseMoveCallback = () => void;

export function requestMouseMove(callback: MouseMoveCallback): void {
  let previous: {x: number; y: number} | undefined;

  request();

  function request(): void {
    setTimeout(request, MOUSE_POSITION_INTERVAL);

    const current = RobotJS.getMousePos();

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
