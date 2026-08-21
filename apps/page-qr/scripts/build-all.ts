import { build, zip } from 'wxt';

import targetBrowsers from '../target-browsers.ts';

const mode = process.argv.includes('--zip') ? 'zip' : 'build';

for (const browser of targetBrowsers) {
  if (mode === 'zip') {
    await zip({ browser });
  } else {
    await build({ browser });
  }
}
