import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

// Pass REMOTION_BROWSER_EXECUTABLE to reuse a local browser without a download.
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
const serveUrl = await bundle({entryPoint: resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable});
try {
  const composition = await selectComposition({serveUrl, id: 'VideoGamingAgents', puppeteerInstance: browser});
  await mkdir('out/previews', {recursive: true});
  const frames = [150, 650, 1320, 1790, 2130, 2780, 3060, 3490];
  for (let i=0;i<frames.length;i++) {
    const output = resolve(`out/previews/level-${i+1}.png`);
    await renderStill({serveUrl, composition, puppeteerInstance: browser, output, frame: frames[i], imageFormat: 'png'});
    console.log(`Level ${i+1}: ${output}`);
  }
  console.log(`${composition.durationInFrames} frames / ${composition.fps} fps / ${composition.durationInFrames/composition.fps} seconds`);
} finally {
  await browser.close({silent: true});
}
