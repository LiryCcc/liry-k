/** 在此声明 KV、D1、R2、Secrets 等绑定，暂无则保持为 Record<string, unknown>。 */
export type Env = Record<string, unknown>;
import p from '@@/package.json' with { type: 'json' };

const worker: ExportedHandler<Env> = {
  async fetch(request: Request): Promise<Response> {
    return new Response(`${JSON.stringify(request)}${p.name}`);
  }
};

export default worker;
