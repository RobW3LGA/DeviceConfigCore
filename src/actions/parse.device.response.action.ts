import { DeviceResponse, IosDevice, IosError } from "../models";
import { parseIosDevice, parseIosDeviceCurrentBgpRoutes } from "./ios.device.actions";


const parseIosDeviceReject = (rejectMsg: any): DeviceResponse<IosError> => {

  const deviceResponse: DeviceResponse<IosError> = Object.create({});
  const iosError: IosError = Object.create({});

  if (JSON.stringify(rejectMsg) === '{"level":"client-timeout"}') {

    deviceResponse.code = 408;
    iosError.description = "Host timeout (check IP address)";
  }
  else if (JSON.stringify(rejectMsg) === '{"level":"client-authentication"}') {

    deviceResponse.code = 401;
    iosError.description = "Authentication failure (check credentials)";
  }
  else if (String(rejectMsg).match("Command timed out after")) {

    deviceResponse.code = 404;
    iosError.description = "Command timeout (check SSH idle timeout setting)";
  }
  else {

    deviceResponse.code = 400;
    iosError.description = JSON.stringify(rejectMsg);
  }

  deviceResponse.device = iosError;
  return deviceResponse;
}


const parseIosDeviceResponse = (response: string, commands: Array<string>): DeviceResponse<IosDevice> => {

  const deviceResponse: DeviceResponse<IosDevice> = Object.create({});
  deviceResponse.code = 200;
  const iosDevice: IosDevice = parseIosDevice(response);

  commands.map((command: string) => {

    switch (command) {

      case "show ip bgp":

        iosDevice.currentBgpRoutes = parseIosDeviceCurrentBgpRoutes(response);
        break;
    }
  });

  deviceResponse.device = iosDevice;
  return deviceResponse;
}


export { parseIosDeviceResponse, parseIosDeviceReject }
