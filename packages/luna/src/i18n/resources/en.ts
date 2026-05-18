import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 英文文案表，结构受 TranslationTree 约束。 */
export const enResources: TranslationTree = {
  about: {
    desc: 'This is the about page for luna.',
    title: 'About'
  },
  app: { title: 'Luna' },
  home: {
    desc: 'Welcome to the luna home page.',
    title: 'Home'
  },
  nav: {
    about: 'About',
    home: 'Home',
    pathParam: 'Path param',
    protoDecode: 'Proto decode',
    queryJson: 'Query JSON'
  },
  protoDecode: {
    clearPayloadFile: 'Use text input',
    decodeButton: 'Decode',
    decodeResultLabel: 'Decoded JSON',
    desc: 'Paste or upload a .proto definition to decode protobuf (binary → JSON) or encode JSON to protobuf (hex / base64) in the browser.',
    encodeButton: 'Encode',
    encodeResultLabel: 'Encoded payload',
    errors: {
      decode_failed: 'Failed to decode payload. Check message type and binary data.',
      empty_json: 'Enter JSON to encode.',
      empty_message_type: 'Select a message type.',
      empty_payload: 'Enter encoded payload or upload a binary file.',
      empty_proto: 'Enter or upload a .proto definition.',
      encode_failed: 'Failed to encode JSON. Check field names and types against the .proto.',
      invalid_json: 'Invalid JSON. Use a JSON object matching the message fields.',
      invalid_payload: 'Invalid hex or base64 payload.',
      invalid_proto: 'Invalid .proto syntax.',
      unknown_message_type: 'Message type not found in the .proto definition.'
    },
    jsonLabel: 'JSON input',
    jsonPlaceholder: '{ "field": "value" }',
    messageTypeHint: 'Message types are detected from the .proto above.',
    messageTypeLabel: 'Message type',
    modeDecode: 'Decode',
    modeEncode: 'Encode',
    outputFormatLabel: 'Output format',
    payloadFile: 'Upload binary',
    payloadFormatBase64: 'Base64',
    payloadFormatHex: 'Hex',
    payloadFormatLabel: 'Payload format',
    payloadLabel: 'Encoded payload',
    payloadPlaceholder: 'Hex or base64 string',
    protoFile: 'Upload .proto',
    protoLabel: 'Proto definition',
    protoPlaceholder: 'syntax = "proto3"; …',
    title: 'Proto codec'
  },
  notFound: {
    backHome: 'Back to home',
    desc: 'This page does not exist.',
    title: '404'
  },
  pathParam: {
    desc: 'Current route param postId (typed):',
    title: 'Path param demo'
  },
  queryJson: {
    desc: 'Current URL search params as validated JSON.',
    title: 'Query JSON'
  },
  ui: {
    switchToEn: 'English',
    switchToZh: '中文'
  }
};
