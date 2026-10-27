import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Exercise the real homepage carousel without a browser or backend writes.
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.split('/* ── Photo carousel ── */')[1].split('/* ── AI Chatbot ── */')[0];

test('the project source preserves the Sass homepage when make copies it', () => {
  const projectHtml = readFileSync(new URL('../_projects/dad/pages/html/index.html', import.meta.url), 'utf8');
  assert.equal(projectHtml, html);
  assert.match(projectHtml, /assets\/css\/dad-home\.css/);
  assert.doesNotMatch(projectHtml, /<style[\s>]/i);
});

async function setup({ reducedMotion = false, items = [{}, {}] } = {}) {
  const elements = new Map();
  function element() {
    const listeners = {};
    const classes = new Set();
    return {
      children: [], listeners, hidden: false, checked: false, disabled: true,
      classList: { add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c) },
      addEventListener: (event, handler) => { listeners[event] = handler; },
      setAttribute() {}, appendChild(child) { this.children.push(child); },
    };
  }
  const document = {
    hidden: false, listeners: {},
    getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
    createElement: element,
    querySelectorAll: () => document.getElementById('cs-dots').children,
    addEventListener(event, handler) { this.listeners[event] = handler; },
  };
  const motion = { matches: reducedMotion, addEventListener(event, handler) { this.change = handler; } };
  let nextTimer = 0;
  const timers = new Map();
  vm.runInNewContext(source, {
    document, window: { matchMedia: () => motion }, pythonURI: '', fetchOptions: {},
    fetch: async () => ({ ok: true, json: async () => items }),
    setInterval(fn) { timers.set(++nextTimer, fn); return nextTimer; },
    clearInterval(id) { timers.delete(id); },
  });
  await new Promise(resolve => setImmediate(resolve));
  return { document, motion, timers, get: id => document.getElementById(id) };
}

test('autoplay advances slides; pausing and manual navigation do not restart it', async () => {
  const app = await setup();
  assert.equal(app.get('carousel-autoplay').disabled, false);
  assert.equal(app.timers.size, 1);
  [...app.timers.values()][0]();
  assert.equal(app.get('cs-viewport').children[1].classList.contains('active'), true);
  app.get('carousel-autoplay').checked = false;
  app.get('carousel-autoplay').listeners.change();
  assert.equal(app.timers.size, 0);
  app.get('cs-next').listeners.click();
  assert.equal(app.timers.size, 0);
  assert.equal(app.get('carousel-status').textContent, 'Slideshow paused');
});

test('reduced motion starts paused; switching motion preference stops playback', async () => {
  const app = await setup({ reducedMotion: true });
  assert.equal(app.get('carousel-autoplay').checked, false);
  assert.equal(app.timers.size, 0);
  app.get('carousel-autoplay').checked = true;
  app.get('carousel-autoplay').listeners.change();
  assert.equal(app.timers.size, 1);
  app.motion.change({ matches: true });
  assert.equal(app.timers.size, 0);
  assert.equal(app.get('carousel-autoplay').checked, false);
});

test('background tabs pause playback and resume only when enabled', async () => {
  const app = await setup();
  app.document.hidden = true;
  app.document.listeners.visibilitychange();
  assert.equal(app.timers.size, 0);
  app.document.hidden = false;
  app.document.listeners.visibilitychange();
  assert.equal(app.timers.size, 1);
});

test('empty and single-photo carousels cannot start autoplay', async () => {
  for (const items of [[], [{}]]) {
    const app = await setup({ items });
    assert.equal(app.get('carousel-autoplay').disabled, true);
    assert.equal(app.timers.size, 0);
  }
});
