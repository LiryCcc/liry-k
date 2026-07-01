import type { Env } from '../src/index.js';

declare module 'cloudflare:test' {
	/** 将业务 Env 类型注入 cloudflare:test 的 ProvidedEnv，使 env 获得正确类型。 */
	interface ProvidedEnv extends Env {}
}
