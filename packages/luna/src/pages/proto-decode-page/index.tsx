import type { TranslationKey } from '@/i18n/translation-tree.js';
import { useTranslation } from '@/i18n/use-translation.js';
import type { PayloadFormat } from '@/pages/proto-decode-page/payload-format.schema.js';
import { formatPayloadBytes, payloadFormatSchema } from '@/pages/proto-decode-page/payload-format.schema.js';
import {
  decodeProtoMessage,
  encodeProtoMessage,
  listMessageTypes,
  type ProtoCodecErrorCode
} from '@/pages/proto-decode-page/proto-codec.js';
import { Button } from '@liry-k/astra';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import styles from './index.module.css';

let protoFileInput: HTMLInputElement | undefined;
let payloadFileInput: HTMLInputElement | undefined;

type CodecMode = 'decode' | 'encode';

const defaultProtoExample = `syntax = "proto3";

package user;

message User {
  string id = 1;
  string username = 2;
  string email = 3;
  int32 age = 4;
  bool is_active = 5;
}
`;

const defaultJsonExample = `{
  "id": "1",
  "username": "alice",
  "email": "alice@example.com",
  "age": 30,
  "is_active": true
}`;

export const ProtoDecodePage = () => {
  const { t } = useTranslation();
  const [mode, setMode] = createSignal<CodecMode>('decode');
  const [protoText, setProtoText] = createSignal(defaultProtoExample);
  const [messageType, setMessageType] = createSignal('user.User');
  const [payloadText, setPayloadText] = createSignal('');
  const [jsonText, setJsonText] = createSignal(defaultJsonExample);
  const [payloadFormat, setPayloadFormat] = createSignal<PayloadFormat>('hex');
  const [payloadBytes, setPayloadBytes] = createSignal<Uint8Array | null>(null);
  const [payloadFileName, setPayloadFileName] = createSignal<string | null>(null);
  const [encodedBytes, setEncodedBytes] = createSignal<Uint8Array | null>(null);
  const [decodeResult, setDecodeResult] = createSignal<string | null>(null);
  const [encodeResult, setEncodeResult] = createSignal<string | null>(null);
  const [errorCode, setErrorCode] = createSignal<ProtoCodecErrorCode | null>(null);

  const messageTypes = createMemo(() => {
    const listed = listMessageTypes(protoText());
    return listed.ok ? listed.value : [];
  });

  createEffect(() => {
    const types = messageTypes();
    if (types.length > 0 && !types.includes(messageType())) {
      setMessageType(types[0] ?? '');
    }
  });

  const errorMessage = createMemo(() => {
    const code = errorCode();
    if (!code) {
      return null;
    }
    const key = `protoDecode.errors.${code}` as TranslationKey;
    return t(key);
  });

  const clearResults = () => {
    setErrorCode(null);
    setDecodeResult(null);
    setEncodeResult(null);
    setEncodedBytes(null);
  };

  const onProtoFileChange = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProtoText(reader.result);
        const listed = listMessageTypes(reader.result);
        if (listed.ok && listed.value.length > 0) {
          setMessageType(listed.value[0] ?? '');
        }
      }
    };
    reader.readAsText(file);
    input.value = '';
  };

  const onPayloadFileChange = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setPayloadBytes(new Uint8Array(reader.result));
        setPayloadFileName(file.name);
        setPayloadText('');
      }
    };
    reader.readAsArrayBuffer(file);
    input.value = '';
  };

  const clearPayloadFile = () => {
    setPayloadBytes(null);
    setPayloadFileName(null);
  };

  const onFormatChange = (event: Event) => {
    const select = event.currentTarget as HTMLSelectElement;
    const parsed = payloadFormatSchema.safeParse(select.value);
    if (!parsed.success) {
      return;
    }
    setPayloadFormat(parsed.data);
    const bytes = encodedBytes();
    if (bytes) {
      setEncodeResult(formatPayloadBytes(bytes, parsed.data));
    }
  };

  const onDecode = () => {
    clearResults();

    const result = decodeProtoMessage({
      messageType: messageType(),
      payloadBytes: payloadBytes(),
      payloadFormat: payloadFormat(),
      payloadText: payloadText(),
      protoText: protoText()
    });

    if (!result.ok) {
      setErrorCode(result.code);
      return;
    }

    setDecodeResult(JSON.stringify(result.value, null, 2));
  };

  const onEncode = () => {
    clearResults();

    const result = encodeProtoMessage({
      jsonText: jsonText(),
      messageType: messageType(),
      protoText: protoText()
    });

    if (!result.ok) {
      setErrorCode(result.code);
      return;
    }

    setEncodedBytes(result.value);
    setEncodeResult(formatPayloadBytes(result.value, payloadFormat()));
  };

  const switchMode = (nextMode: CodecMode) => {
    setMode(nextMode);
    clearResults();
  };

  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>{t('protoDecode.title')}</h2>
      <p class={styles['desc']}>{t('protoDecode.desc')}</p>

      <div class={styles['tabs']}>
        <Button
          type='button'
          class={mode() === 'decode' ? styles['tab-active'] : styles['tab']}
          onClick={() => {
            switchMode('decode');
          }}
        >
          {t('protoDecode.modeDecode')}
        </Button>
        <Button
          type='button'
          class={mode() === 'encode' ? styles['tab-active'] : styles['tab']}
          onClick={() => {
            switchMode('encode');
          }}
        >
          {t('protoDecode.modeEncode')}
        </Button>
      </div>

      <div class={styles['grid']}>
        <section class={styles['panel']}>
          <label class={styles['label']} for='proto-text'>
            {t('protoDecode.protoLabel')}
          </label>
          <textarea
            class={styles['textarea']}
            id='proto-text'
            value={protoText()}
            onInput={(event) => {
              setProtoText(event.currentTarget.value);
            }}
            placeholder={t('protoDecode.protoPlaceholder')}
          />
          <input
            ref={(element) => {
              protoFileInput = element;
            }}
            class={styles['file-input']}
            type='file'
            accept='.proto,text/plain'
            onChange={onProtoFileChange}
          />
          <div class={styles['row']}>
            <Button
              type='button'
              onClick={() => {
                protoFileInput?.click();
              }}
            >
              {t('protoDecode.protoFile')}
            </Button>
          </div>
        </section>

        <section class={styles['panel']}>
          <label class={styles['label']} for='message-type'>
            {t('protoDecode.messageTypeLabel')}
          </label>
          <select
            class={styles['select']}
            id='message-type'
            value={messageType()}
            onChange={(event) => {
              setMessageType(event.currentTarget.value);
            }}
          >
            <For each={messageTypes()}>{(typeName) => <option value={typeName}>{typeName}</option>}</For>
          </select>
          <p class={styles['hint']}>{t('protoDecode.messageTypeHint')}</p>

          <Show
            when={mode() === 'decode'}
            fallback={
              <>
                <label class={styles['label']} for='json-text'>
                  {t('protoDecode.jsonLabel')}
                </label>
                <textarea
                  class={styles['textarea']}
                  id='json-text'
                  value={jsonText()}
                  onInput={(event) => {
                    setJsonText(event.currentTarget.value);
                  }}
                  placeholder={t('protoDecode.jsonPlaceholder')}
                />
                <div class={styles['row']}>
                  <label class={styles['label']} for='output-format'>
                    {t('protoDecode.outputFormatLabel')}
                  </label>
                  <select class={styles['select']} id='output-format' value={payloadFormat()} onChange={onFormatChange}>
                    <option value='hex'>{t('protoDecode.payloadFormatHex')}</option>
                    <option value='base64'>{t('protoDecode.payloadFormatBase64')}</option>
                  </select>
                </div>
              </>
            }
          >
            <label class={styles['label']} for='payload-text'>
              {t('protoDecode.payloadLabel')}
            </label>
            <textarea
              class={styles['textarea']}
              id='payload-text'
              disabled={payloadBytes() !== null}
              value={payloadText()}
              onInput={(event) => {
                setPayloadText(event.currentTarget.value);
              }}
              placeholder={t('protoDecode.payloadPlaceholder')}
            />
            <div class={styles['row']}>
              <label class={styles['label']} for='payload-format'>
                {t('protoDecode.payloadFormatLabel')}
              </label>
              <select
                class={styles['select']}
                id='payload-format'
                disabled={payloadBytes() !== null}
                value={payloadFormat()}
                onChange={onFormatChange}
              >
                <option value='hex'>{t('protoDecode.payloadFormatHex')}</option>
                <option value='base64'>{t('protoDecode.payloadFormatBase64')}</option>
              </select>
            </div>
            <input
              ref={(element) => {
                payloadFileInput = element;
              }}
              class={styles['file-input']}
              type='file'
              accept='application/octet-stream,.bin'
              onChange={onPayloadFileChange}
            />
            <div class={styles['row']}>
              <Button
                type='button'
                onClick={() => {
                  payloadFileInput?.click();
                }}
              >
                {t('protoDecode.payloadFile')}
              </Button>
              <Show when={payloadFileName()}>
                <span class={styles['hint']}>{payloadFileName()}</span>
                <Button type='button' onClick={clearPayloadFile}>
                  {t('protoDecode.clearPayloadFile')}
                </Button>
              </Show>
            </div>
          </Show>
        </section>
      </div>

      <div class={styles['row']}>
        <Show
          when={mode() === 'decode'}
          fallback={
            <Button type='button' onClick={onEncode}>
              {t('protoDecode.encodeButton')}
            </Button>
          }
        >
          <Button type='button' onClick={onDecode}>
            {t('protoDecode.decodeButton')}
          </Button>
        </Show>
      </div>

      <Show when={errorMessage()}>
        <p class={styles['error']} role='alert'>
          {errorMessage()}
        </p>
      </Show>

      <Show when={decodeResult()}>
        <section class={styles['result']}>
          <h3 class={styles['label']}>{t('protoDecode.decodeResultLabel')}</h3>
          <pre class={styles['code']}>{decodeResult()}</pre>
        </section>
      </Show>

      <Show when={encodeResult()}>
        <section class={styles['result']}>
          <h3 class={styles['label']}>{t('protoDecode.encodeResultLabel')}</h3>
          <pre class={styles['code']}>{encodeResult()}</pre>
        </section>
      </Show>
    </div>
  );
};
