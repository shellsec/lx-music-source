const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'sources.json'), 'utf8'));
const prefix = 'https://gh-proxy.com/raw.githubusercontent.com/shellsec/lx-music-source/master/';

test('manifest IDs are unique and URLs are HTTPS scripts', () => {
  assert.ok(Array.isArray(manifest.sources) && manifest.sources.length > 0);
  const ids = new Set();
  for (const source of manifest.sources) {
    assert.match(source.id, /^[a-z0-9_-]+$/);
    assert.ok(!ids.has(source.id), `Duplicate ID: ${source.id}`);
    ids.add(source.id);
    assert.ok(typeof source.name === 'string' && source.name.trim());
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(url.pathname.endsWith('.js'));
  }
});

test('all entries point to local scripts named after @name', () => {
  const entries = manifest.sources.filter(source => source.url.startsWith(prefix));
  assert.ok(entries.length > 0);
  assert.equal(entries.length, manifest.sources.length);
  for (const source of entries) {
    const name = source.name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[. ]+$/, '');
    const relative = `sources/${source.id}/${name}.js`;
    assert.equal(decodeURIComponent(source.url.slice(prefix.length)), relative);
    assert.ok(fs.statSync(path.join(root, relative)).isFile());
    const text = fs.readFileSync(path.join(root, relative), 'utf8');
    assert.equal(/@name\s+([^\r\n]+)/.exec(text)?.[1].trim(), source.name);
  }
});

function scripts(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? scripts(file) : entry.name.endsWith('.js') ? [file] : [];
  });
}

for (const file of scripts(path.join(root, 'sources'))) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  test(`${relative} has valid syntax and a manifest entry`, () => {
    new vm.Script(fs.readFileSync(file, 'utf8'), { filename: relative });
    assert.ok(manifest.sources.some(source => decodeURIComponent(source.url) === prefix + relative));
  });
}

test('published scripts match a passing snapshot or explicit user confirmation', () => {
  const report = JSON.parse(fs.readFileSync(path.join(root, 'tests/latest-probe.json'), 'utf8'));
  const { confirmations } = JSON.parse(fs.readFileSync(path.join(root, 'tests/user-confirmed.json'), 'utf8'));
  for (const file of scripts(path.join(root, 'sources'))) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const confirmation = confirmations.find(item => item.file === relative && item.confirmedBy === 'user');
    const result = confirmation || report.results.find(item => item.file.replaceAll('\\', '/') === relative);
    assert.ok(result, `Missing live result: ${relative}`);
    assert.equal(result.sha256, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
    assert.ok(confirmation || (result.initialized && result.attempts.some(attempt => attempt.audio === true)), `No passing sample or user confirmation: ${relative}`);
  }
});
