#!/usr/bin/env node

import main, {BACKGROUND} from 'main-function';

import {setupClient} from './@client';
import {getConfig} from './@config';
import {setupServer} from './@server';

main(async ([configFileName]) => {
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
