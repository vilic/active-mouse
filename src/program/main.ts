#!/usr/bin/env node

import main, {BACKGROUND} from 'main-function';
import {StartupRun} from 'startup-run';

import {setupClient} from './@client';
import {getConfig} from './@config';
import {setupServer} from './@server';

main(async ([configFileName, ...args]) => {
  if (!StartupRun.daemonSpawned) {
    const run = await StartupRun.create('active-mouse');

    if (args.includes('--startup')) {
      await run.enable();

      run.start();

      return;
    } else if (args.includes('--disable-startup')) {
      await run.disable();

      return;
    }
  }

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
