# Active Mouse

## Usage

### Server

**.config.mjs**

```js
import {spawn} from 'child_process';

// Try out the configs with ControlMyMonitor.exe first.

const MONITOR_ID = ''; // Could be serial number

const MONITOR_INPUT_DICT = {
  'vane-station': '15', // DisplayPort in my case
  'vane-mba': '27', // Type-C in my case
};

export default {
  type: 'server',
  name: 'vane-station',
  action(name) {
    spawn('C:\\Utilities\\controlmymonitor\\ControlMyMonitor.exe', [
      '/SetValue',
      MONITOR_ID,
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
