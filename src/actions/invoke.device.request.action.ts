import { DeviceResponse } from "../models";


const invokeDeviceRequest = async <T>(deviceReader: Function, parseDeviceResponse: Function, parseDeviceReject: Function, commands: Array<string>, debug: boolean): Promise<DeviceResponse<T>> => {

  const deviceCommands: Array<string> = Array<string>().concat(commands);

  let debugOutput;
  let timeStamp: number = 0;
  const tapDebugOutput = (output: any) => { timeStamp = Date.now(); debugOutput = output; return output }

  const startTime: number = Date.now();
  const deviceResponse: DeviceResponse<T> = await deviceReader()
    .then(tapDebugOutput)
    .then((response: string) => parseDeviceResponse(response, deviceCommands))
    .catch(parseDeviceReject);

  deviceResponse.timeStamp = timeStamp;
  deviceResponse.responseMs = (timeStamp - startTime);
  deviceResponse.debugOutput = debug ? debugOutput : "";
  return deviceResponse;
}


export { invokeDeviceRequest }
