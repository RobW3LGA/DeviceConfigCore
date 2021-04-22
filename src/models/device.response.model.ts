type DeviceResponse<T> = {

  code?: number;
  device: T;
  responseMs?: number;
  timeStamp?: number;
  debugOutput?: string;
}

export { DeviceResponse }
