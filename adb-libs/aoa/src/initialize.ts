import { AOA_REQUEST_TYPE } from './type.js';

export const aoaGetProtocol = async (device: USBDevice) => {
  const result = await device.controlTransferIn(
    {
      recipient: 'device',
      requestType: 'vendor',
      request: AOA_REQUEST_TYPE.GetProtocol,
      value: 0,
      index: 0
    },
    2
  );
  const version = result.data!.getUint16(0, true);
  return version;
};

/**
 * The device will reset (disconnect) after this call.
 * @param device The Android device.
 */
export const aoaStartAccessory = async (device: USBDevice) => {
  await device.controlTransferOut(
    {
      recipient: 'device',
      requestType: 'vendor',
      request: AOA_REQUEST_TYPE.Start,
      value: 0,
      index: 0
    },
    new ArrayBuffer(0)
  );
};
