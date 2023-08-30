import {MOUSE_POSITION_INTERVAL} from './@constants';
import type {Point} from './@libnut';
import {libnut} from './@libnut';

export type MouseMoveCallback = () => void;

export function requestMouseMove(callback: MouseMoveCallback): void {
  let previous: Point | undefined;

  request();

  function request(): void {
    setTimeout(request, MOUSE_POSITION_INTERVAL);

    const current = libnut.getMousePos();

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
