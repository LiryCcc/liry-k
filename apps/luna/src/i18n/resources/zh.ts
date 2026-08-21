import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 中文文案表，结构受 TranslationTree 约束。 */
export const zhResources: TranslationTree = {
  about: {
    desc: '这里是 luna 的关于页面。',
    title: '关于'
  },
  app: { title: 'Luna' },
  home: {
    desc: '欢迎来到 luna 首页。',
    title: '首页'
  },
  nav: {
    about: '关于',
    home: '首页',
    pathParam: '路径参数',
    protoDecode: 'Proto 解码',
    queryJson: 'Query JSON'
  },
  protoDecode: {
    clearPayloadFile: '改用文本输入',
    decodeButton: '解码',
    decodeResultLabel: '解码结果（JSON）',
    desc: '粘贴或上传 .proto 定义，可在浏览器中解码 Protobuf（二进制 → JSON）或将 JSON 编码为 Protobuf（十六进制 / Base64）。',
    encodeButton: '编码',
    encodeResultLabel: '编码结果',
    errors: {
      decode_failed: '解码失败，请检查消息类型与二进制数据是否匹配。',
      empty_json: '请输入要编码的 JSON。',
      empty_message_type: '请选择消息类型。',
      empty_payload: '请输入编码载荷或上传二进制文件。',
      empty_proto: '请输入或上传 .proto 定义。',
      encode_failed: '编码失败，请检查 JSON 字段名与类型是否与 .proto 一致。',
      invalid_json: 'JSON 无效，请提供与消息字段匹配的对象。',
      invalid_payload: '十六进制或 Base64 载荷格式无效。',
      invalid_proto: '.proto 语法无效。',
      unknown_message_type: '在 .proto 中未找到该消息类型。'
    },
    jsonLabel: 'JSON 输入',
    jsonPlaceholder: '{ "field": "value" }',
    messageTypeHint: '消息类型会根据上方 .proto 自动识别。',
    messageTypeLabel: '消息类型',
    modeDecode: '解码',
    modeEncode: '编码',
    outputFormatLabel: '输出格式',
    payloadFile: '上传二进制',
    payloadFormatBase64: 'Base64',
    payloadFormatHex: '十六进制',
    payloadFormatLabel: '载荷格式',
    payloadLabel: '编码载荷',
    payloadPlaceholder: '十六进制或 Base64 字符串',
    protoFile: '上传 .proto',
    protoLabel: 'Proto 定义',
    protoPlaceholder: 'syntax = "proto3"; …',
    title: 'Proto 编解码'
  },
  notFound: {
    backHome: '返回首页',
    desc: '页面不存在。',
    title: '404'
  },
  pathParam: {
    desc: '当前路由参数 postId（自动强类型）:',
    title: '路径参数示例'
  },
  queryJson: {
    desc: '当前 URL 的 query 参数会转换为 JSON 字符串。',
    title: 'Query JSON'
  },
  ui: {
    switchToEn: 'English',
    switchToZh: '中文'
  }
};
