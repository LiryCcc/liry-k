import { createExecutionContext, env, SELF, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index.js';

/** 使用带 CF 属性的 Request 类型，以兼容 Worker fetch 签名。 */
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker?.fetch?.(request, env, ctx);
		await waitOnExecutionContext(ctx);
		if (response) {
			expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});
});
