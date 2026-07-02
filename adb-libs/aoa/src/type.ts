export const AOA_REQUEST_TYPE = {
  GetProtocol: 51,
  SendString: 52,
  Start: 53,
  RegisterHid: 54,
  UnregisterHid: 55,
  SetHidReportDescriptor: 56,
  SendHidEvent: 57,
  SetAudioMode: 58
};

export type AoaRequestType = (typeof AOA_REQUEST_TYPE)[keyof typeof AOA_REQUEST_TYPE];
