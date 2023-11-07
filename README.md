[![NPM version](https://img.shields.io/npm/v/active-mouse?color=%23cb3837&style=flat-square)](https://www.npmjs.com/package/active-mouse)
[![Repository package.json version](https://img.shields.io/github/package-json/v/vilic/active-mouse?color=%230969da&label=repo&style=flat-square)](./package.json)
[![MIT License](https://img.shields.io/badge/license-MIT-999999?style=flat-square)](./LICENSE)
[![Discord](https://img.shields.io/badge/chat-discord-5662f6?style=flat-square)](https://discord.gg/vanVrDwSkS)

# Active Mouse

## Usage

```sh
active-mouse [config]
active-mouse [config] --startup
active-mouse [config] --disable-startup
```

### Server

**.config.mjs**

```js
import {spawn} from 'child_process';

const CONTROL_MY_MONITOR_PATH =
  'C:\\Utilities\\controlmymonitor\\ControlMyMonitor.exe';

// Try out the configs with ControlMyMonitor.exe first.

const MONITOR = ''; // Could be serial number

const MONITOR_INPUT_DICT = {
  'vane-station': '15', // DisplayPort in my case
  'vane-mba': '27', // Type-C in my case
};

export default {
  type: 'server',
  name: 'vane-station',
  action(name) {
    spawn(CONTROL_MY_MONITOR_PATH, [
      '/SetValue',
      MONITOR,
      '60',
      MONITOR_INPUT_DICT[name],
    ]);
  },
};
```

### Client

**.config.mjs**

```js
export default {
  type: 'client',
  name: 'vane-mba',
  host: '192.168.1.10',
};
```

## License

MIT License.
