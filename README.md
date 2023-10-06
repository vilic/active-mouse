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
