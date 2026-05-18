import { parseJsonPayload } from '@/pages/proto-decode-page/json-payload.schema.js';
import type { PayloadFormat } from '@/pages/proto-decode-page/payload-format.schema.js';
import { parsePayloadText } from '@/pages/proto-decode-page/payload-format.schema.js';
import { Namespace, parse, Type } from 'protobufjs';

export type ProtoCodecErrorCode =
  | 'empty_proto'
  | 'invalid_proto'
  | 'empty_message_type'
  | 'unknown_message_type'
  | 'empty_payload'
  | 'invalid_payload'
  | 'decode_failed'
  | 'empty_json'
  | 'invalid_json'
  | 'encode_failed';

export type ProtoCodecResult<T> = { ok: true; value: T } | { ok: false; code: ProtoCodecErrorCode };

const collectMessageTypes = (namespace: Namespace): string[] => {
  const names: string[] = [];
  for (const nested of namespace.nestedArray) {
    if (nested instanceof Type) {
      names.push(nested.fullName.replace(/^\./, ''));
    } else if (nested instanceof Namespace) {
      names.push(...collectMessageTypes(nested));
    }
  }
  return names;
};

const resolveMessageType = (
  protoText: string,
  messageType: string
): { ok: true; type: Type } | { ok: false; code: ProtoCodecErrorCode } => {
  const protoTrimmed = protoText.trim();
  if (protoTrimmed.length === 0) {
    return { ok: false, code: 'empty_proto' };
  }

  const typeName = messageType.trim();
  if (typeName.length === 0) {
    return { ok: false, code: 'empty_message_type' };
  }

  try {
    const parsed = parse(protoTrimmed, { keepCase: true });
    if (!parsed.root) {
      return { ok: false, code: 'invalid_proto' };
    }
    const type = parsed.root.lookupType(typeName);
    return { ok: true, type };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('no such type')) {
      return { ok: false, code: 'unknown_message_type' };
    }
    return { ok: false, code: 'invalid_proto' };
  }
};

/** 从 .proto 文本解析出所有 message 类型全名（如 user.User）。 */
export function listMessageTypes(
  protoText: string
): { ok: true; value: string[] } | { ok: false; code: 'empty_proto' | 'invalid_proto' } {
  const trimmed = protoText.trim();
  if (trimmed.length === 0) {
    return { ok: false, code: 'empty_proto' };
  }

  try {
    const parsed = parse(trimmed, { keepCase: true });
    if (!parsed.root) {
      return { ok: false, code: 'invalid_proto' };
    }
    return { ok: true, value: collectMessageTypes(parsed.root) };
  } catch {
    return { ok: false, code: 'invalid_proto' };
  }
}

type DecodeProtoInput = {
  protoText: string;
  messageType: string;
  payloadText: string;
  payloadFormat: PayloadFormat;
  payloadBytes: Uint8Array | null;
};

/** 根据 .proto 定义与二进制载荷解码为 JSON 可序列化对象。 */
export function decodeProtoMessage(input: DecodeProtoInput): ProtoCodecResult<unknown> {
  let bytes = input.payloadBytes;
  if (!bytes) {
    const payloadTrimmed = input.payloadText.trim();
    if (payloadTrimmed.length === 0) {
      return { ok: false, code: 'empty_payload' };
    }
    const parsedPayload = parsePayloadText(payloadTrimmed, input.payloadFormat);
    if (!parsedPayload.success) {
      return { ok: false, code: 'invalid_payload' };
    }
    bytes = parsedPayload.data;
  }

  if (bytes.length === 0) {
    return { ok: false, code: 'empty_payload' };
  }

  const resolved = resolveMessageType(input.protoText, input.messageType);
  if (!resolved.ok) {
    return resolved;
  }

  try {
    const decoded = resolved.type.decode(bytes);
    const value = resolved.type.toObject(decoded, {
      bytes: String,
      defaults: true,
      enums: String,
      longs: String
    });
    return { ok: true, value };
  } catch {
    return { ok: false, code: 'decode_failed' };
  }
}

type EncodeProtoInput = {
  protoText: string;
  messageType: string;
  jsonText: string;
};

/** 根据 .proto 定义将 JSON 对象编码为 Protobuf 二进制。 */
export function encodeProtoMessage(input: EncodeProtoInput): ProtoCodecResult<Uint8Array> {
  const parsedJson = parseJsonPayload(input.jsonText);
  if (!parsedJson.success) {
    const issue = parsedJson.error.issues[0];
    if (issue?.message === 'empty') {
      return { ok: false, code: 'empty_json' };
    }
    return { ok: false, code: 'invalid_json' };
  }

  const resolved = resolveMessageType(input.protoText, input.messageType);
  if (!resolved.ok) {
    return resolved;
  }

  try {
    const message = resolved.type.fromObject(parsedJson.data);
    const verifyError = resolved.type.verify(message);
    if (verifyError) {
      return { ok: false, code: 'encode_failed' };
    }
    const buffer = resolved.type.encode(message).finish();
    return { ok: true, value: buffer };
  } catch {
    return { ok: false, code: 'encode_failed' };
  }
}
