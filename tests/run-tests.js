const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const modules = [
  'js/maps/layouts.js',
  'js/creatures/catalog.js',
  'js/moves/catalog.js',
  'js/items/catalog.js',
  'js/game/core.js',
  'js/game/world.js',
  'js/game/menus.js',
  'js/game/gameplay.js',
  'js/game/render.js',
  'js/game/audio.js',
  'js/game/features.js',
  'js/game/ui.js',
];

function makeBrowserContext() {
  const events = new Map();
  const storage = new Map();
  const buttons = ['up', 'left', 'right', 'down', 'x', 'y', 'b', 'a'].map((k) => ({
    dataset: { k },
    listeners: new Map(),
    addEventListener(type, handler) {
      this.listeners.set(type, handler);
    },
  }));

  const canvasContext = new Proxy({
    measureText: (value) => ({ width: String(value).length * 6 }),
  }, {
    get(target, key) {
      if (key in target) return target[key];
      if (key === 'canvas') return canvas;
      return () => {};
    },
    set(target, key, value) {
      target[key] = value;
      return true;
    },
  });
  const canvas = {
    getContext: () => canvasContext,
    addEventListener() {},
  };
  const musicButton = {
    textContent: '',
    addEventListener() {},
  };
  const ab = { classList: { add() {} } };
  const document = {
    hidden: false,
    head: { appendChild() {} },
    getElementById(id) {
      if (id === 'c') return canvas;
      if (id === 'mu') return musicButton;
      return null;
    },
    querySelectorAll(selector) {
      return selector === '#pad button' ? buttons : [];
    },
    querySelector(selector) {
      return selector === '.ab' ? ab : null;
    },
    createElement() {
      return { textContent: '', appendChild() {}, classList: { add() {} } };
    },
    addEventListener(type, handler) {
      if (!events.has(`document:${type}`)) events.set(`document:${type}`, []);
      events.get(`document:${type}`).push(handler);
    },
  };
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); },
    clear() { storage.clear(); },
  };

  const context = {
    console,
    document,
    localStorage,
    navigator: {},
    performance: { now: () => 0 },
    requestAnimationFrame: () => 0,
    setTimeout,
    setInterval: () => 1,
    clearInterval: () => {},
    Math,
    Date,
    JSON,
    Promise,
    URL,
    addEventListener(type, handler) {
      if (!events.has(type)) events.set(type, []);
      events.get(type).push(handler);
    },
    __events: events,
    __buttons: buttons,
  };
  context.window = context;
  context.globalThis = context;
  return vm.createContext(context);
}

function loadGame() {
  const context = makeBrowserContext();
  for (const relative of modules) {
    const filename = path.join(ROOT, relative);
    vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  }
  return context;
}

function evaluate(context, expression) {
  return vm.runInContext(expression, context);
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (error) {
    console.error(`FAIL  ${name}`);
    throw error;
  }
}

const context = loadGame();

test('all eight runtime modules load in the browser harness', () => {
  assert.equal(evaluate(context, 'typeof draw'), 'function');
  assert.equal(evaluate(context, 'typeof press'), 'function');
  assert.equal(evaluate(context, 'typeof battle'), 'function');
  assert.equal(evaluate(context, 'typeof save'), 'function');
  assert.equal(evaluate(context, 'typeof MU'), 'object');
});

test('core world and content data have expected shape', () => {
  assert.equal(evaluate(context, 'MAPS.town.length'), 16);
  assert.equal(evaluate(context, 'MAPS.route.length'), 12);
  assert.equal(evaluate(context, 'GYMS.length'), 7);
  assert.ok(evaluate(context, 'Object.keys(MAPS).length') >= 25);
  assert.ok(evaluate(context, 'ENEMIES.length') >= 100);
  assert.ok(evaluate(context, 'MOVES.length') >= 20);
  assert.ok(evaluate(context, 'Object.keys(QUESTS).length') >= 4);
});

test('type effectiveness remains symmetric and meaningful', () => {
  assert.equal(evaluate(context, "mult('火', '草')"), 2);
  assert.equal(evaluate(context, "mult('草', '火')"), 0.5);
  assert.equal(evaluate(context, "mult('水', '火')"), 2);
  assert.equal(evaluate(context, "mult('火', '水')"), 0.5);
  assert.equal(evaluate(context, "mult('普', '普')"), 1);
});

test('input mapping keeps keyboard and gamepad semantics', () => {
  assert.equal(evaluate(context, "KEYS.Enter"), 'a');
  assert.equal(evaluate(context, "KEYS[' ']"), 'a');
  assert.equal(evaluate(context, "KEYS.ArrowUp"), 'up');
  assert.equal(evaluate(context, "KEYS.X"), 'x');
  assert.equal(evaluate(context, "KEYS.Escape"), 'b');
});

test('generated maps have valid rectangular rows and valid warp destinations', () => {
  const result = evaluate(context, `(() => {
    for (const [name, rows] of Object.entries(MAPS)) {
      if (!Array.isArray(rows) || !rows.length) return 'empty:' + name;
      const width = rows[0].length;
      if (!rows.every((row) => typeof row === 'string' && row.length === width)) return 'ragged:' + name;
    }
    for (const [key, destination] of Object.entries(WARP)) {
      const [map, x, y] = key.split(',');
      const [target, tx, ty] = destination;
      if (!MAPS[map] || !MAPS[target]) return 'unknown-map:' + key;
      if (!MAPS[map][Number(y)]?.[Number(x)]) return 'bad-source:' + key;
      if (!MAPS[target][Number(ty)]?.[Number(tx)]) return 'bad-target:' + key;
    }
    return 'ok';
  })()`);
  assert.equal(result, 'ok');
});

test('save and load restore player position and inventory', () => {
  const result = evaluate(context, `(() => {
    const oldCoins = BAG.coins;
    const oldX = Pl.x;
    const oldY = Pl.y;
    BAG.coins = 9876;
    Pl.x = 8;
    Pl.y = 5;
    save();
    BAG.coins = 1;
    Pl.x = 1;
    Pl.y = 1;
    const loaded = load();
    const restored = [loaded, BAG.coins, Pl.x, Pl.y];
    BAG.coins = oldCoins;
    Pl.x = oldX;
    Pl.y = oldY;
    return restored;
  })()`);
  assert.deepEqual(Array.from(result), [1, 9876, 8, 5]);
});

test('service worker caches every local app shell file', () => {
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.match(sw, /const CACHE_NAME = "pigmonpro-v3"/);
  const paths = [...sw.matchAll(/"(\.\/[^\"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length >= 20);
  for (const relative of paths) {
    assert.ok(fs.existsSync(path.join(ROOT, relative.slice(2))), `missing cache file: ${relative}`);
  }
});

test('index loads modules in dependency order', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const loaded = [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map((match) => match[1]);
  assert.deepEqual(loaded.slice(-8), [
    'js/game/core.js',
    'js/game/world.js',
    'js/game/menus.js',
    'js/game/gameplay.js',
    'js/game/render.js',
    'js/game/audio.js',
    'js/game/features.js',
    'js/game/ui.js',
  ]);
});

console.log(`\n${8} tests passed.`);
