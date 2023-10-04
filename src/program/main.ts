#!/usr/bin/env node

import main, {BACKGROUND} from 'main-function';
import {StartupRun} from 'startup-run';

import {setupClient} from './@client';
import {getConfig} from './@config';
import {setupServer} from './@server';

main(async ([configFileName, ...args]) => {
  const config = await getConfig(configFileName);

  switch (config.type) {
    case 'server':
      setupServer(config);
      break;
    case 'client':
      setupClient(config);
      break;
  }

  const run = StartupRun.create('active-mouse');

  if (args.includes('--disable-auto-start')) {
    await run.disable();
  } else if (args.includes('--auto-start')) {
    await run.enable();
  }

  await BACKGROUND;
});
