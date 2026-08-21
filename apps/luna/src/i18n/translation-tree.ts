/**
 * 全站文案结构的单一来源：各语言 resources 对象用该类型约束，不通过 .d.ts 改写 i18next 全局类型。
 */
export type LocaleCode = 'en' | 'zh';

export type TranslationTree = {
  about: { desc: string; title: string };
  app: { title: string };
  home: { desc: string; title: string };
  nav: {
    about: string;
    home: string;
    pathParam: string;
    protoDecode: string;
    queryJson: string;
  };
  protoDecode: {
    clearPayloadFile: string;
    decodeButton: string;
    decodeResultLabel: string;
    desc: string;
    encodeButton: string;
    encodeResultLabel: string;
    errors: {
      decode_failed: string;
      empty_json: string;
      empty_message_type: string;
      empty_payload: string;
      empty_proto: string;
      encode_failed: string;
      invalid_json: string;
      invalid_payload: string;
      invalid_proto: string;
      unknown_message_type: string;
    };
    jsonLabel: string;
    jsonPlaceholder: string;
    messageTypeHint: string;
    messageTypeLabel: string;
    modeDecode: string;
    modeEncode: string;
    outputFormatLabel: string;
    payloadFile: string;
    payloadFormatBase64: string;
    payloadFormatHex: string;
    payloadFormatLabel: string;
    payloadLabel: string;
    payloadPlaceholder: string;
    protoFile: string;
    protoLabel: string;
    protoPlaceholder: string;
    title: string;
  };
  notFound: { backHome: string; desc: string; title: string };
  pathParam: { desc: string; title: string };
  queryJson: { desc: string; title: string };
  ui: { switchToEn: string; switchToZh: string };
};

/**
 * 从文案树推导所有合法点号路径（如 app.title、nav.home），供 t() 首参强类型使用。
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string ? `${K}` : T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationTree>;
