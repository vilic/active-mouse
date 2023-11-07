#!/usr/bin/env node

import {BACKGROUND, main} from 'main-function';
import {StartupRun} from 'startup-run';

import {setupClient} from './@client.js';
import {getConfig} from './@config.js';
import {setupServer} from './@server.js';

main(async ([configFileName, ...args]) => {
  const run = StartupRun.create('active-mouse');

  await run.setup({
    enable: args.includes('--startup'),
    disable: args.includes('--disable-startup'),
  });

  const config = await getConfig(configFileName);

  switch (config.type) {
    case 'server':
      setupServer(config);
      break;
    case 'client':
      setupClient(config);
      break;
  }

  await BACKGROUND;
});
