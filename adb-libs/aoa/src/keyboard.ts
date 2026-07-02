// cspell:ignore Oper

// Most names follow Web API `KeyboardEvent.code`,
export const HID_KEY_CODE = {
  KeyA: 4,
  KeyB: 5,
  KeyC: 6,
  KeyD: 7,
  KeyE: 8,
  KeyF: 9,
  KeyG: 10,
  KeyH: 11,
  KeyI: 12,
  KeyJ: 13,
  KeyK: 14,
  KeyL: 15,
  KeyM: 16,
  KeyN: 17,
  KeyO: 18,
  KeyP: 19,
  KeyQ: 20,
  KeyR: 21,
  KeyS: 22,
  KeyT: 23,
  KeyU: 24,
  KeyV: 25,
  KeyW: 26,
  KeyX: 27,
  KeyY: 28,
  KeyZ: 29,
  Digit1: 30,
  Digit2: 31,
  Digit3: 32,
  Digit4: 33,
  Digit5: 34,
  Digit6: 35,
  Digit7: 36,
  Digit8: 37,
  Digit9: 38,
  Digit0: 39,
  Enter: 40,
  Escape: 41,
  Backspace: 42,
  Tab: 43,
  Space: 44,
  Minus: 45,
  Equal: 46,
  BracketLeft: 47,
  BracketRight: 48,
  Backslash: 49,
  NonUsHash: 50,
  Semicolon: 51,
  Quote: 52,
  BackQuote: 53,
  Comma: 54,
  Period: 55,
  Slash: 56,
  CapsLock: 57,
  F1: 58,
  F2: 59,
  F3: 60,
  F4: 61,
  F5: 62,
  F6: 63,
  F7: 64,
  F8: 65,
  F9: 66,
  F10: 67,
  F11: 68,
  F12: 69,
  PrintScreen: 70,
  ScrollLock: 71,
  Pause: 72,
  Insert: 73,
  Home: 74,
  PageUp: 75,
  Delete: 76,
  End: 77,
  PageDown: 78,
  ArrowRight: 79,
  ArrowLeft: 80,
  ArrowDown: 81,
  ArrowUp: 82,
  NumLock: 83,
  NumpadDivide: 84,
  NumpadMultiply: 85,
  NumpadSubtract: 86,
  NumpadAdd: 87,
  NumpadEnter: 88,
  Numpad1: 89,
  Numpad2: 90,
  Numpad3: 91,
  Numpad4: 92,
  Numpad5: 93,
  Numpad6: 94,
  Numpad7: 95,
  Numpad8: 96,
  Numpad9: 97,
  Numpad0: 98,
  NumpadDecimal: 99,
  NonUsBackslash: 100,
  ContextMenu: 101,
  Power: 102,
  NumpadEqual: 103,
  F13: 104,
  F14: 105,
  F15: 106,
  F16: 107,
  F17: 108,
  F18: 109,
  F19: 110,
  F20: 111,
  F21: 112,
  F22: 113,
  F23: 114,
  F24: 115,
  Execute: 116,
  Help: 117,
  Menu: 118,
  Select: 119,
  Stop: 120,
  Again: 121,
  Undo: 122,
  Cut: 123,
  Copy: 124,
  Paste: 125,
  Find: 126,
  Mute: 127,
  VolumeUp: 128,
  VolumeDown: 129,
  LockingCapsLock: 130,
  LockingNumLock: 131,
  LockingScrollLock: 132,
  NumpadComma: 133,
  KeypadEqualSign: 134,
  International1: 135,
  International2: 136,
  International3: 137,
  International4: 138,
  International5: 139,
  International6: 140,
  International7: 141,
  International8: 142,
  International9: 143,
  Lang1: 144,
  Lang2: 145,
  Lang3: 146,
  Lang4: 147,
  Lang5: 148,
  Lang6: 149,
  Lang7: 150,
  Lang8: 151,
  Lang9: 152,
  AlternateErase: 153,
  SysReq: 154,
  Cancel: 155,
  Clear: 156,
  Prior: 157,
  Return2: 158,
  Separator: 159,
  Out: 160,
  Oper: 161,
  ClearAgain: 162,
  CrSel: 163,
  ExSel: 164,

  Keypad00: 0xb0,
  Keypad000: 177,
  ThousandsSeparator: 178,
  DecimalSeparator: 179,
  CurrencyUnit: 180,
  CurrencySubUnit: 181,
  KeypadLeftParen: 182,
  KeypadRightParen: 183,
  KeypadLeftBrace: 184,
  KeypadRightBrace: 185,
  KeypadTab: 186,
  KeypadBackspace: 187,
  KeypadA: 188,
  KeypadB: 189,
  KeypadC: 190,
  KeypadD: 191,
  KeypadE: 192,
  KeypadF: 193,
  KeypadXor: 194,
  KeypadPower: 195,
  KeypadPercent: 196,
  KeypadLess: 197,
  KeypadGreater: 198,
  KeypadAmpersand: 199,
  KeypadDblAmpersand: 200,
  KeypadVerticalBar: 201,
  KeypadDblVerticalBar: 202,
  KeypadColon: 203,
  KeypadHash: 204,
  KeypadSpace: 205,
  KeypadAt: 206,
  KeypadExclamation: 207,
  KeypadMemStore: 208,
  KeypadMemRecall: 209,
  KeypadMemClear: 210,
  KeypadMemAdd: 211,
  KeypadMemSubtract: 212,
  KeypadMemMultiply: 213,
  KeypadMemDivide: 214,
  KeypadPlusMinus: 215,
  KeypadClear: 216,
  KeypadClearEntry: 217,
  KeypadBinary: 218,
  KeypadOctal: 219,
  KeypadDecimal: 220,
  KeypadHexadecimal: 221,

  ControlLeft: 0xe0,
  ShiftLeft: 225,
  AltLeft: 226,
  MetaLeft: 227,
  ControlRight: 228,
  ShiftRight: 229,
  AltRight: 230,
  MetaRight: 231
};

export type HidKeyCode = (typeof HID_KEY_CODE)[keyof typeof HID_KEY_CODE];

export class HidKeyboard {
  /**
   * A HID Keyboard Report Descriptor.
   *
   * It's compatible with the legacy boot protocol. (1 byte modifier, 1 byte reserved, 6 bytes key codes).
   * Technically it doesn't need to be compatible with the legacy boot protocol, but it's the most common implementation.
   */
  static readonly DESCRIPTOR = new Uint8Array(
    // prettier-ignore
    [
            0x05, 0x01, // Usage Page (Generic Desktop)
            0x09, 0x06, // Usage (Keyboard)
            0xa1, 0x01, // Collection (Application)
            0x05, 0x07, //   Usage Page (Keyboard)
            0x19, 0xe0, //   Usage Minimum (Keyboard Left Control)
            0x29, 0xe7, //   Usage Maximum (Keyboard Right GUI)
            0x15, 0x00, //   Logical Minimum (0)
            0x25, 0x01, //   Logical Maximum (1)
            0x75, 0x01, //   Report Size (1)
            0x95, 0x08, //   Report Count (8)
            0x81, 0x02, //   Input (Data, Variable, Absolute)

            0x75, 0x08, //   Report Size (8)
            0x95, 0x01, //   Report Count (1)
            0x81, 0x01, //   Input (Constant)

            0x05, 0x08, //   Usage Page (LEDs)
            0x19, 0x01, //   Usage Minimum (Num Lock)
            0x29, 0x05, //   Usage Maximum (Kana)
            0x75, 0x01, //   Report Size (1)
            0x95, 0x05, //   Report Count (5)
            0x91, 0x02, //   Output (Data, Variable, Absolute)

            0x75, 0x03, //   Report Size (3)
            0x95, 0x01, //   Report Count (1)
            0x91, 0x01, //   Output (Constant)

            0x05, 0x07, //   Usage Page (Keyboard)
            0x19, 0x00, //   Usage Minimum (Reserved (no event indicated))
            0x29, 0xdd, //   Usage Maximum (Keyboard Application)
            0x15, 0x00, //   Logical Minimum (0)
            0x25, 0xdd, //   Logical Maximum (221)
            0x75, 0x08, //   Report Size (8)
            0x95, 0x06, //   Report Count (6)
            0x81, 0x00, //   Input (Data, Array)
            0xc0,       // End Collection
        ]
  );

  static readonly REPORT_SIZE = 8;

  #modifiers = 0;
  #keys = new Set<HidKeyCode>();

  down(key: HidKeyCode) {
    if (key >= HID_KEY_CODE.ControlLeft && key <= HID_KEY_CODE.MetaRight) {
      this.#modifiers |= 1 << (key - HID_KEY_CODE.ControlLeft);
    } else {
      this.#keys.add(key);
    }
  }

  up(key: HidKeyCode) {
    if (key >= HID_KEY_CODE.ControlLeft && key <= HID_KEY_CODE.MetaRight) {
      this.#modifiers &= ~(1 << (key - HID_KEY_CODE.ControlLeft));
    } else {
      this.#keys.delete(key);
    }
  }

  reset() {
    this.#modifiers = 0;
    this.#keys.clear();
  }

  updateReport(report: Uint8Array) {
    report[0] = this.#modifiers;
    let i = 2;
    for (const key of this.#keys) {
      if (i >= report.length) {
        break;
      }
      report[i] = key;
      i += 1;
    }
    for (; i < report.length; i += 1) {
      report[i] = 0;
    }
  }
}
