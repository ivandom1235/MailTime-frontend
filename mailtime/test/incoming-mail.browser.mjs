// Run with: node test/incoming-mail.browser.mjs
// Uses an isolated headless Edge profile and API fixtures; sends no real email.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = path.resolve(root, '../../.tmp');
await mkdir(temporary, { recursive: true });
const profile = await mkdtemp(path.join(temporary, 'incoming-email-browser-'));
const vite = await createServer({ root, server: { host: '127.0.0.1', port: 0, hmr: false, watch: null } });
let browser, socket;
async function until(check) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const value = await check();
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Browser check timed out');
}
try {
  console.log('Starting fixture browser check');
  await vite.listen();
  console.log('Frontend server listening');
  const base = `http://127.0.0.1:${vite.httpServer.address().port}`;
  browser = spawn(process.env.MAILTIME_TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
    { windowsHide: true, stdio: 'ignore' });
  let launchError;
  browser.on('error', error => { launchError = error; });
  const port = await until(async () => {
    if (launchError) throw launchError;
    return readFile(path.join(profile, 'DevToolsActivePort'), 'utf8').then(value => value.split('\n')[0]).catch(() => null);
  });
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  console.log('Browser ready');
  socket = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Browser debugging connection timed out')), 10000);
    socket.addEventListener('open', () => { clearTimeout(timeout); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('Browser debugging connection failed')); }, { once: true });
  });
  let nextId = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(request.timeout);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timeout = setTimeout(() => reject(new Error(`Browser command timed out: ${method}`)), 10000);
      pending.set(id, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    sessionStorage.setItem('session_token', 'header.' + btoa(JSON.stringify({exp: Math.floor(Date.now()/1000)+3600})) + '.signature');
    sessionStorage.setItem('active_role', JSON.stringify({name: 'executive'}));
    sessionStorage.setItem('user', JSON.stringify({name: 'Test Executive'}));
    sessionStorage.setItem('tenant', JSON.stringify({slug: 'example'}));
    window.fixture = {}; window.requests = [];
    window.fetch = async (url, options = {}) => {
      window.requests.push(String(url));
      if (!String(url).endsWith('/api/executive/incoming-mails')) throw new Error('Unexpected API request');
      return new Response(JSON.stringify(window.fixture.body), {status: window.fixture.status, headers: {'Content-Type': 'application/json'}});
    };
  ` });
  await send('Page.navigate', { url: `${base}/executive/incoming-mail` });
  console.log('Opened incoming mail form');
  await until(() => evaluate("Boolean(document.querySelector('#recipient-name'))"));
  const mail = { trackingNumber: 'WMS00000042', recipientName: 'Recipient', recipientEmail: 'recipient@example.com',
    recipientPhone: '1234567890', itemType: 'document', status: 'Received at Mail Room' };
  const cases = [
    { name: 'authentication failure', body: { mail, emailSent: false, emailError: 'Email notification was not sent. Ask the operator administrator to use Connect notification email.' }, expected: /Connect notification email/ },
    { name: 'provider failure', body: { mail, emailSent: false, emailError: 'Notification could not be sent. Ask an administrator to check the mail connection.' }, expected: /could not be sent/ },
    { name: 'provider acceptance', body: { mail, emailSent: true, emailError: null }, expected: /submitted.*email provider/i },
    { name: 'no recipient email', body: { mail: { ...mail, recipientEmail: null }, emailSent: false, emailError: null }, expected: /no.*email.*provided/i },
    { name: 'missing notification metadata', body: { mail }, expected: /could not.*confirm/i },
    { name: 'record creation failure', status: 500, body: { message: 'Server error while creating incoming mail' }, expected: /Server error while creating incoming mail/ },
  ];
  for (const scenario of cases) {
    await evaluate(`window.fixture = ${JSON.stringify({ status: scenario.status || 201, body: scenario.body })};
      for (const [name, value] of Object.entries({recipientName: 'Recipient', recipientEmail: 'recipient@example.com', recipientPhone: '1234567890', receivedFromName: 'Sender'})) {
        const input = document.querySelector('[name="' + name + '"]');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
        input.dispatchEvent(new Event('input', {bubbles: true}));
      }`);
    const count = await evaluate('window.requests.length');
    await evaluate("document.querySelector('form').requestSubmit()");
    await until(() => evaluate(`window.requests.length > ${count} && !document.querySelector('button[type="submit"]').disabled`));
    const text = await evaluate('document.body.innerText');
    assert.match(text, scenario.expected, scenario.name);
    assert.doesNotMatch(text, /Mail Sent Successfully/i, scenario.name);
    if (!scenario.status) {
      assert.match(text, /Incoming mail saved/i, scenario.name);
      assert.match(text, /WMS00000042/, scenario.name);
      assert.equal(await evaluate("document.querySelector('#recipient-name').value"), '', scenario.name);
    } else {
      assert.doesNotMatch(text, /WMS00000042/, scenario.name);
      assert.equal(await evaluate("document.querySelector('#recipient-name').value"), 'Recipient', scenario.name);
    }
    console.log(`PASS: ${scenario.name}`);
  }
  assert.deepEqual(errors, []);
  await send('Browser.close');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  socket?.close();
  browser?.kill();
  vite.httpServer?.closeAllConnections();
  await vite.close();
}
