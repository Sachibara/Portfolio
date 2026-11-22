import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const handler = require('../api/ask.js');

function call(method, { body, headers = {}, key, fetchImpl, now } = {}) {
  if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key;
  const res = { headers: {}, statusCode: 0, body: '', setHeader(k, v) { this.headers[k] = v; }, end(text) { this.body = text; } };
  const req = { method, body, headers: { host: 'jimcamus.vercel.app', ...headers } };
  return handler(req, res, { fetch: fetchImpl, now }).then(() => ({ status: res.statusCode, json: JSON.parse(res.body) }));
}
const gemini = (text, seen) => async (url, init) => {
  if (seen) seen.push({ url, init });
  return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] }) };
};

// Off by default: reports disabled and refuses to answer without a key.
assert.deepEqual(await call('GET'), { status: 200, json: { enabled: false } });
assert.equal((await call('POST', { body: { question: 'hello' } })).status, 503);

// On: reports enabled, answers, and keeps the key out of the response.
assert.deepEqual(await call('GET', { key: 'k' }), { status: 200, json: { enabled: true } });
const seen = [];
const ok = await call('POST', { key: 'secret-key', body: { question: '  What   is OpsFusion? ' }, headers: { 'x-forwarded-for': '1.1.1.1' }, fetchImpl: gemini('OpsFusion is a service desk.', seen) });
assert.deepEqual(ok, { status: 200, json: { answer: 'OpsFusion is a service desk.' } });
assert.equal(seen.length, 1);
assert.match(seen[0].url, /^https:\/\/generativelanguage\.googleapis\.com\//);
assert.equal(seen[0].init.headers['x-goog-api-key'], 'secret-key');
const sent = JSON.parse(seen[0].init.body);
assert.equal(sent.contents[0].parts[0].text, 'What is OpsFusion?');
assert.match(sent.system_instruction.parts[0].text, /Answer only from the PROFILE/);
assert(!JSON.stringify(ok).includes('secret-key'));

// Input handling.
assert.equal((await call('POST', { key: 'k', body: { question: ' ' }, headers: { 'x-forwarded-for': '2.2.2.2' } })).status, 400);
assert.equal((await call('POST', { key: 'k', body: 'not json', headers: { 'x-forwarded-for': '2.2.2.3' } })).status, 400);
assert.equal(handler.cleanQuestion({ question: 'x'.repeat(900) }).length, 300);
assert.equal((await call('DELETE', { key: 'k' })).status, 405);

// Other websites cannot use the endpoint from a browser.
assert.equal((await call('POST', { key: 'k', body: { question: 'hi there' }, headers: { origin: 'https://evil.example', 'x-forwarded-for': '3.3.3.3' } })).status, 403);
assert.equal(handler.allowedOrigin('https://jimcamus.vercel.app', 'jimcamus.vercel.app'), true);
assert.equal(handler.allowedOrigin('http://localhost:3000', 'jimcamus.vercel.app'), true);

// Rate limit: the ninth question inside a minute from one address is refused.
let last;
for (let i = 0; i < 9; i++) last = await call('POST', { key: 'k', body: { question: 'question ' + i }, headers: { 'x-forwarded-for': '9.9.9.9' }, fetchImpl: gemini('ok'), now: 1000 });
assert.equal(last.status, 429);

// Upstream failures become a clean error, never a crash.
assert.equal((await call('POST', { key: 'k', body: { question: 'anything' }, headers: { 'x-forwarded-for': '4.4.4.4' }, fetchImpl: async () => ({ ok: false }) })).status, 502);
assert.equal((await call('POST', { key: 'k', body: { question: 'anything' }, headers: { 'x-forwarded-for': '4.4.4.5' }, fetchImpl: async () => { throw new Error('network'); } })).status, 502);
delete process.env.GEMINI_API_KEY;
process.env.AI_GATEWAY_API_KEY = 'gateway-test';
const gateway = await call('POST', {
  body: {question: 'Which of those has IPAM?', history: [
    {role: 'user', content: 'Compare OpsFusion and NetOps.'},
    {role: 'assistant', content: 'One handles support, the other network operations.'}
  ]},
  fetchImpl: async (url, init) => {
    assert.equal(url, 'https://ai-gateway.vercel.sh/v1/chat/completions');
    assert.equal(init.headers.Authorization, 'Bearer gateway-test');
    const { messages } = JSON.parse(init.body);
    assert.deepEqual(messages.map(m => m.role), ['system', 'user', 'assistant', 'user']);
    assert.equal(messages.at(-1).content, 'Which of those has IPAM?');
    return {ok: true, json: async () => ({choices: [{message: {content: 'NetOps Enterprise.'}}]})};
  }
});
assert.deepEqual(gateway, {status: 200, json: {answer: 'NetOps Enterprise.'}});
delete process.env.AI_GATEWAY_API_KEY;
console.log('Assistant checks passed for Gemini, gateway conversation history, and error handling.');
