import { AOA_REQUEST_TYPE } from './type.js';

export const aoaHidRegister = async (device: USBDevice, accessoryId: number, reportDescriptorSize: number) => {
  await device.controlTransferOut(
    {
      recipient: 'device',
      requestType: 'vendor',
      request: AOA_REQUEST_TYPE.RegisterHid,
      value: accessoryId,
      index: reportDescriptorSize
    },
    new ArrayBuffer(0)
  );
};

export const aoaHidSetReportDescriptor = async (
  device: USBDevice,
  accessoryId: number,
  reportDescriptor: BufferSource
) => {
  await device.controlTransferOut(
    {
      recipient: 'device',
      requestType: 'vendor',
      request: AOA_REQUEST_TYPE.SetHidReportDescriptor,
      value: accessoryId,
      index: 0
    },
    reportDescriptor
  );
};

export const aoaHidUnregister = async (device: USBDevice, accessoryId: number) => {
  await device.controlTransferOut(
    {
      recipient: 'device',
      requestType: 'vendor',
      request: AOA_REQUEST_TYPE.UnregisterHid,
      value: accessoryId,
      index: 0
    },
    new ArrayBuffer(0)
  );
};

export const aoaHidSendInputReport = async (device: USBDevice, accessoryId: number, event: BufferSource) => {
  await device.controlTransferOut(
    {
      recipient: 'device',
      requestType: 'vendor',
      request: AOA_REQUEST_TYPE.SendHidEvent,
      value: accessoryId,
      index: 0
    },
    event
  );
};

/**
 * Emulate a HID device over AOA protocol.
 *
 * It can only send input reports, but not send feature reports nor receive output reports.
 */
export class AoaHidDevice {
  /**
   * Register a HID device.
   * @param device The Android device.
   * @param accessoryId An arbitrary number to uniquely identify the HID device.
   * @param reportDescriptor The HID report descriptor.
   * @returns An instance of AoaHidDevice to send events.
   */
  static register = async (device: USBDevice, accessoryId: number, reportDescriptor: BufferSource) => {
    await aoaHidRegister(device, accessoryId, reportDescriptor.byteLength);
    await aoaHidSetReportDescriptor(device, accessoryId, reportDescriptor);
    return new AoaHidDevice(device, accessoryId);
  };

  #device: USBDevice;
  #accessoryId: number;

  constructor(device: USBDevice, accessoryId: number) {
    this.#device = device;
    this.#accessoryId = accessoryId;
  }

  sendInputReport = async (event: BufferSource) => {
    await aoaHidSendInputReport(this.#device, this.#accessoryId, event);
  };

  unregister = async () => {
    await aoaHidUnregister(this.#device, this.#accessoryId);
  };
}
