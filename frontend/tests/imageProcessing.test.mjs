import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';
import cvModule from '@techstark/opencv-js';

// The processing core only needs ImageData's pixel storage; browser integration
// separately exercises the real decoder, worker, canvas encoder and downloads.
globalThis.ImageData = class ImageData {
  constructor(data, width, height) { Object.assign(this, { data, width, height }); }
};
async function importTS(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { processPixels } = await importTS('../src/lib/imageProcessing.ts');
const { processingTasks } = await importTS('../src/data/tasks.ts');
const { cv } = await new Promise(resolve => {
  if (cvModule.Mat) resolve({ cv: cvModule });
  else cvModule.onRuntimeInitialized = () => resolve({ cv: cvModule });
});
function fixture(width = 32, height = 24, color) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    pixels.set(color ?? [(i * 17) % 256, (i * 31) % 256, (i * 7) % 256, 255], i * 4);
  }
  return new ImageData(pixels, width, height);
}
function run(task, params = {}, images = [fixture()]) {
  return processPixels(cv, { endpoint: `/api/task/${task}`, params, images });
}
for (const task of processingTasks) {
  test(`catalog: ${task.id} processes with its displayed defaults`, () => {
    const result = processPixels(cv, { endpoint: task.endpoint, images: [fixture()], params: Object.fromEntries((task.parameters ?? []).map(p => [p.id, p.defaultValue])) });
    assert.equal(result.images.length, task.returnsZip ? 3 : 1);
    for (const { image } of result.images) {
      assert.ok(image.width > 0 && image.height > 0);
      assert.equal(image.data.length, image.width * image.height * 4);
      for (let i = 3; i < image.data.length; i += 4) assert.equal(image.data[i], 255);
    }
  });
}
test('negative and RGB channels preserve RGB order and opaque output', () => {
  const src = fixture(2, 2, [20, 80, 180, 255]);
  assert.deepEqual([...run('negative', {}, [src]).images[0].image.data.slice(0, 4)], [235, 175, 75, 255]);
  const channels = run('rgb-channels', {}, [src]);
  assert.equal(channels.zip, true);
  assert.deepEqual(channels.images.map(r => r.name), ['red.png', 'green.png', 'blue.png']);
  assert.deepEqual(channels.images.map(r => [...r.image.data.slice(0, 4)]), [[20, 0, 0, 255], [0, 80, 0, 255], [0, 0, 180, 255]]);
});
test('grayscale, binary, logarithms and gamma have known pixel values', () => {
  const src = fixture(2, 2, [128, 128, 128, 255]);
  const pixel = (task, params) => run(task, params, [src]).images[0].image.data[0];
  assert.equal(pixel('grayscale'), 128);
  assert.equal(pixel('binary'), 255);
  assert.equal(pixel('log-transformation'), Math.floor(255 * Math.log1p(128) / Math.log(256)));
  assert.equal(pixel('inverse-log-transformation'), Math.floor(255 * Math.expm1(128 / 255) / Math.expm1(1)));
  assert.equal(pixel('power-law', { gamma: 2 }), 64);
  assert.equal(pixel('power-law-transformation'), Math.floor(255 * Math.sqrt(128 / 255)));
});
test('bitwise operations resize both inputs to common dimensions', () => {
  const images = [fixture(7, 3, [240, 170, 128, 255]), fixture(4, 6, [15, 85, 128, 255])];
  for (const [task, expected] of [['bitwise-and', [0, 0, 128, 255]], ['bitwise-or', [255, 255, 128, 255]], ['bitwise-xor', [255, 255, 0, 255]]]) {
    const result = run(task, {}, images).images[0].image;
    assert.deepEqual([result.width, result.height], [4, 3]);
    assert.deepEqual([...result.data.slice(0, 4)], expected);
  }
});
test('transforms keep original dimensions or expand as specified', () => {
  for (const [task, params, expected] of [
    ['resize', {}, [256, 256]], ['scale', { fx: 2, fy: 0.5 }, [64, 12]],
    ['rotate', { angle: 90 }, [32, 24]], ['translate', { tx: 3 }, [32, 24]],
    ['shear-image-horizontal', {}, [32, 56]], ['shear-image-vertical', {}, [56, 24]],
  ]) {
    const image = run(task, params).images[0].image;
    assert.deepEqual([image.width, image.height], expected);
  }
});
test('kernel aliases, parameter changes and directional filters are honored', () => {
  const pixels = (task, params) => run(task, params).images[0].image.data;
  assert.deepEqual(pixels('lowpass', { ksize: 7 }), pixels('lowpass', { kernel_size: 7 }));
  assert.notDeepEqual(pixels('lowpass', { ksize: 3 }), pixels('lowpass', { ksize: 7 }));
  assert.notDeepEqual(pixels('laplacian-filter', { ksize: 1 }), pixels('laplacian-filter', { ksize: 3 }));
  assert.notDeepEqual(pixels('prewitt', { axis: 'x' }), pixels('prewitt', { axis: 'y' }));
  assert.ok(pixels('prewitt', { axis: 'both' }).length);
  assert.deepEqual(pixels('harris', { 'block size': 5 }), pixels('harris', { block_size: 5 }));
});
test('segmentation handles tiny and constant images', () => {
  for (const dimensions of [[1, 1], [2, 2], [32, 24]]) {
    const src = fixture(...dimensions, [20, 80, 180, 255]);
    assert.deepEqual(run('segment', {}, [src]).images[0].image.data, src.data);
  }
});
test('invalid parameters fail clearly, and subsequent processing still works', () => {
  for (const [task, params, pattern] of [
    ['gaussian', { ksize: 4 }, /odd/], ['sobel', { dx: 0, dy: 0 }, /derivative/],
    ['scale', { fx: 0 }, /Invalid fx/], ['rotate', { angle: NaN }, /Invalid angle/],
    ['prewitt', { axis: 'z' }, /direction/], ['hough-circles', { min_radius: 20, max_radius: 10 }, /radius/],
    ['missing', {}, /Unsupported/], ['bitwise-and', {}, /2 images/],
  ]) assert.throws(() => run(task, params), pattern);
  assert.ok(run('negative').images.length);
});
