# Active Mouse

## Usage

### Server

**.config.mjs**

```js
import {spawn} from 'child_process';

const MONITOR_ID = '\\\\.\\DISPLAY10\\Monitor0';

const MONITOR_INPUT_DICT = {
  'vane-station': '15',
  'vane-mba': '27',
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
