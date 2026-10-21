const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const os = require('node:os');
const { execFile, spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []); }
const delay = ms => new Promise(r => setTimeout(r, ms));
if (process.argv[2] !== '--worker') {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  let output;
  if (outputIndex >= 0) {
    if (!args[outputIndex + 1]) throw Error('--output requires a path');
    output = path.resolve(args[outputIndex + 1]);
    args.splice(outputIndex, 2);
  }
  const files = args.length ? args.map(file => path.resolve(file)) : walk(path.join(root, 'sources'));
  const results = [];
  async function runner() {
    while (files.length) {
      const file = files.shift();
      const result = await new Promise(resolve => {
        const p = spawn(process.execPath, [__filename, '--worker', file], { windowsHide: true });
        let out = '', err = '';
        const timer = setTimeout(() => p.kill(), 155000);
        p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
        p.on('close', () => { clearTimeout(timer); try { resolve(JSON.parse(out)); } catch { resolve({ file: path.relative(root, file), error: 'Worker timeout or crash', detail: err.slice(0, 100) }); } });
      });
      results.push(result);
      console.log(JSON.stringify(result));
      if (output) fs.writeFileSync(output, JSON.stringify({ testedAt: new Date().toISOString(), results }, null, 2) + '\n');
    }
  }
  Promise.all([runner(), runner(), runner()]).then(() => {
    if (results.some(r => !r.initialized || !r.attempts?.some(a => a.audio))) process.exitCode = 1;
  });
} else {
  (async () => {
    const file = process.argv[3], code = fs.readFileSync(file, 'utf8');
    const result = { file: path.relative(root, file), name: /@name\s+([^\r\n]+)/.exec(code)?.[1], sha256: crypto.createHash('sha256').update(code).digest('hex'), initialized: false, attempts: [], errors: [] };
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lx-probe-'));
    const children = new Set(), timers = new Set();
    let sequence = 0, init, handler;
    process.on('unhandledRejection', e => result.errors.push(String(e?.message || e).replace(/https?:\/\/\S+/g, '[URL]').slice(0, 160)));
    async function transport(url, options = {}) {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol) || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/i.test(parsed.hostname)) throw Error('Blocked non-public URL');
      const headerFile = path.join(temp, String(sequence++));
      const args = ['--silent', '--show-error', '--location', '--max-redirs', '4', '--connect-timeout', '5', '--max-time', '10', '--max-filesize', '262144', '--dump-header', headerFile, '--request', options.method || 'GET'];
      for (const [k,v] of Object.entries(options.headers || {})) args.push('--header', k + ': ' + v);
      if (options.body != null) args.push('--data-raw', typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      if (options.form) args.push('--data', new URLSearchParams(options.form).toString());
      args.push('--url', String(url));
      const raw = await new Promise((resolve, reject) => {
        const child = execFile(process.platform === 'win32' ? 'curl.exe' : 'curl', args, { encoding: 'buffer', maxBuffer: 300000, windowsHide: true }, (error, stdout) => { children.delete(child); error ? reject(Error('Transport ' + (error.code || 'failed'))) : resolve(stdout); });
        children.add(child);
      });
      const blocks = fs.readFileSync(headerFile, 'utf8').trim().split(/\r?\n\r?\n/), last = blocks.at(-1);
      const headers = {};
      for (const line of last.split(/\r?\n/).slice(1)) { const i = line.indexOf(':'); if (i > 0) headers[line.slice(0,i).toLowerCase()] = line.slice(i+1).trim(); }
      const statusCode = Number(/^HTTP\/\S+\s+(\d+)/.exec(last)?.[1]);
      let body = options.binary ? raw : raw.toString('utf8');
      if (!options.binary && (/json/i.test(headers['content-type'] || '') || /^[\s]*[\[{]/.test(body))) { try { body = JSON.parse(body); } catch {} }
      return { statusCode, status: statusCode, headers, body, raw };
    }
    const request = (url, options, callback) => {
      if (typeof options === 'function') { callback = options; options = {}; }
      let cancelled = false;
      transport(url, options).then(r => { if (!cancelled) callback(null, r, r.body); }, e => { if (!cancelled) callback(e); });
      return () => { cancelled = true; };
    };
    const sandbox = {
      console: { log() {}, warn() {}, error() {}, info() {}, debug() {}, group() {}, groupEnd() {}, groupCollapsed() {}, trace() {}, table() {} },
      setTimeout(fn, ms, ...args) { const t = setTimeout(fn, ms, ...args); timers.add(t); return t; },
      clearTimeout, setInterval(fn, ms, ...args) { const t = setInterval(fn, ms, ...args); timers.add(t); return t; }, clearInterval,
      URL, URLSearchParams, TextEncoder, TextDecoder, Buffer, Uint8Array, ArrayBuffer,
      atob: s => Buffer.from(s, 'base64').toString('binary'), btoa: s => Buffer.from(s, 'binary').toString('base64'),
      lx: { env: 'desktop', version: '2.12.0', currentScriptInfo: { rawScript: code, name: result.name, version: /@version\s+([^\s]+)/.exec(code)?.[1] },
        EVENT_NAMES: { request: 'request', inited: 'inited', updateAlert: 'updateAlert' }, request,
        on(event, fn) { if (event === 'request') handler = fn; },
        send(event, data) { if (event === 'inited') init = data; },
        utils: { buffer: { from: (v,e) => Buffer.from(v,e), bufToString: (v,e) => Buffer.from(v).toString(e) },
          crypto: { md5: s => crypto.createHash('md5').update(s).digest('hex'), randomBytes: n => crypto.randomBytes(n),
            aesEncrypt(data, mode, key, iv) { const cipher = crypto.createCipheriv(mode.toLowerCase(), key, iv); return Buffer.concat([cipher.update(data), cipher.final()]); },
            rsaEncrypt(data, key) { return crypto.publicEncrypt({ key, padding: crypto.constants.RSA_PKCS1_PADDING }, data); } } } },
    };
    const context = vm.createContext(sandbox);
    try {
      new vm.Script(code, { filename: path.basename(file) }).runInContext(context, { timeout: 2500 });
      for (let i=0; i<120 && !init; i++) await delay(100);
      result.initialized = !!init && init.status !== false && !!handler;
      result.platforms = Object.keys(init?.sources || {});
      if (result.initialized) {
        const samples = JSON.parse(fs.readFileSync(path.join(root, 'tests/music-samples.json'), 'utf8'));
        for (const sample of samples) {
          if (!init.sources?.[sample.source]) continue;
          const attempt = { source: sample.source, id: sample.info.id, quality: '128k' };
          try {
            context.__input = { action: 'musicUrl', source: sample.source, info: { type: '128k', musicInfo: sample.info } };
            context.__handler = handler;
            let timer;
            const value = await Promise.race([new vm.Script('__handler(__input)').runInContext(context, { timeout: 2500 }), new Promise((_, reject) => { timer = setTimeout(() => reject(Error('Resolve timeout')), 16000); })]).finally(() => clearTimeout(timer));
            const url = typeof value === 'string' ? value : value?.url;
            attempt.resolved = typeof url === 'string' && /^https?:\/\//.test(url);
            if (!attempt.resolved) throw Error('No playback URL');
            const response = await transport(url, { binary: true, headers: { Range: 'bytes=0-8191' } });
            const b = response.raw;
            attempt.status = response.statusCode;
            attempt.bytes = b.length;
            attempt.audio = response.statusCode >= 200 && response.statusCode < 300 && (b.subarray(0,3).toString() === 'ID3' || b.subarray(0,4).toString() === 'fLaC' || (b[0] === 255 && (b[1] & 224) === 224) || b.subarray(4,8).toString() === 'ftyp' || b.subarray(0,4).toString() === 'OggS');
            attempt.contentType = response.headers['content-type'];
          } catch(e) { attempt.error = String(e?.message || e).replace(/https?:\/\/\S+/g, '[URL]').slice(0, 240); }
          result.attempts.push(attempt);
        }
      }
    } catch(e) { result.error = String(e?.message || e).slice(0, 160); }
    for (const t of timers) { clearTimeout(t); clearInterval(t); }
    for (const p of children) p.kill();
    fs.rmSync(temp, { recursive: true, force: true });
    process.stdout.write(JSON.stringify(result));
    process.exit(0);
  })();
}
