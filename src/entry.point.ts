// import { DeviceResponse, IosDevice, IosError } from "./models";
// import { fileReader, textReader } from "./utilities";
// import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject } from "./actions";


// const entryPointTextReader = async (filePath: string = "./dist/tests/mocks/test.asymmetric.config.mock"): Promise<void> => {

//   const commands: Array<string> = [];
//   // const commands: Array<string> = ["show ip bgp"];
//   const debug: boolean = false;

//   const deviceResponse: DeviceResponse<IosDevice | IosError> = await invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse, parseIosDeviceReject, commands, debug);
//   console.log(JSON.stringify(deviceResponse));
// }
// entryPointTextReader(process.argv[2]);


// import { DeviceResponse, IosDevice, IosError, SshConfig } from "./models";
// import { SSH2Shell, sshReader } from "./utilities";
// import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject, buildIosShowSshRequest, buildIosWriteSshRequest } from "./actions";

// const entryPointIos = async (): Promise<void> => {

//   const host: string = "172.26.212.140";
//   const username = "admin";
//   const password = "#*Halo32";
//   // const commands: Array<string> = [];
//   // const commands: Array<string> = ["show ip bgp"];
//   const commands: Array<string> = ["ip route 192.168.253.0 255.255.255.0 192.168.254.1 name EL_1234567"];
//   const debug: boolean = false;
//   // const sshConfig: SshConfig = buildIosWriteSshRequest(host, username, password, commands, debug);
//   const sshConfig: SshConfig = buildIosShowSshRequest(host, username, password, commands, debug);

//   const deviceResponse: DeviceResponse<IosDevice | IosError> = await invokeDeviceRequest(sshReader(SSH2Shell, sshConfig), parseIosDeviceResponse, parseIosDeviceReject, sshConfig.commands, sshConfig.debug);
//   console.log(JSON.stringify(deviceResponse));
// }
// entryPointIos();


import { DeviceResponse, IosDevice, IosError, SshConfig } from "./models";
import { SSH2Shell, sshReader } from "./utilities";
import { invokeDeviceRequest } from "./actions";

const parseLinuxReject = (rejectMsg: any): DeviceResponse<IosError> => {

  const deviceResponse: DeviceResponse<IosError> = Object.create({});
  const iosError: IosError = Object.create({});

  deviceResponse.code = 400;
  iosError.description = JSON.stringify(rejectMsg);

  deviceResponse.device = iosError;
  return deviceResponse;
}

const parseLinuxResponse = (response: string, commands: Array<string>): DeviceResponse<IosDevice> => {

  const deviceResponse: DeviceResponse<IosDevice> = Object.create({});
  const iosDevice: IosDevice = Object.create({});

  deviceResponse.code = 200;

  deviceResponse.device = iosDevice;
  deviceResponse.debugOutput = `${commands} :: ${JSON.stringify(response)}`
  return deviceResponse;
}

const buildLinuxSshConfig = (host: string, username: string, password: string, commands: Array<string> = Array<string>(), debug = false): SshConfig => {

  return {

    host: host,
    userName: username,
    password: password,
    commands: ["ls -la", "exit"].concat(commands),
    debug: debug
  }
}

const entryPointLinux = async (): Promise<void> => {
  const host: string = "bmocnsaasdev.jkhy.com";
  const username = "root";
  const password = "P@ssw0rd";
  const sshConfig: SshConfig = buildLinuxSshConfig(host, username, password, [], true);

  const deviceResponse: DeviceResponse<any> = await invokeDeviceRequest(sshReader(SSH2Shell, sshConfig), parseLinuxResponse, parseLinuxReject, sshConfig.commands, sshConfig.debug);
  console.log(JSON.stringify(deviceResponse));
}
entryPointLinux();


console.log("Start...");
//node --experimental-specifier-resolution=node ./dist/src/entry.point.js
