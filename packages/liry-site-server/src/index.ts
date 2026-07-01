/** 在此声明 KV、D1、R2、Secrets 等绑定，暂无则保持为 Record<string, unknown>。 */
export type Env = Record<string, unknown>;

const worker: ExportedHandler<Env> = {
  async fetch(_request: Request): Promise<Response> {
    return new Response('Hello World!');
  }
};

export default worker;
