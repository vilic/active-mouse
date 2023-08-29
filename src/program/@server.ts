import type {WebSocket} from 'ws';
import {WebSocketServer} from 'ws';

import type {ServerConfig} from './@config';
import {LISTEN_HOST_DEFAULT, PORT_DEFAULT} from './@constants';
import type {ClientMessage, ServerMessage} from './@data';
import {requestMouseMove} from './@mouse';

export function setupServer({
  name,
  host = LISTEN_HOST_DEFAULT,
  port = PORT_DEFAULT,
  action,
}: ServerConfig): void {
  let active: string | undefined;

  const server = new WebSocketServer({host, port}).on(
    'connection',
    (socket, request) => {
      console.info('client connected:', request.socket.remoteAddress);

      socket.on('message', buffer => handle(JSON.parse(buffer.toString())));

      if (active !== undefined) {
        send(socket, {
          type: 'activate',
          name: active,
        });
      }
    },
  );

  if (name !== undefined) {
    requestMouseMove(() => {
      if (name === active) {
        return;
      }

      handle({
        type: 'activate',
        name,
      });
    });
  }

  function handle(message: ClientMessage): void {
    switch (message.type) {
      case 'activate':
        broadcast({
          type: 'activate',
          name: message.name,
        });

        if (message.name === active) {
          break;
        }

        active = message.name;

        console.info('activated:', active);

        void Promise.resolve(action(active)).catch(console.error);

        break;
    }
  }

  function broadcast(message: ServerMessage): void {
    for (const client of server.clients) {
      send(client, message);
    }
  }

  function send(socket: WebSocket, message: ServerMessage): void {
    socket.send(JSON.stringify(message));
  }
}
