import { DeviceResponse, IosDevice, IosError } from "./models";
import { fileReader, textReader } from "./utilities";
import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject } from "./actions";


const entryPointTextReader = async (filePath: string = "./dist/tests/mocks/test.asymmetric.config.mock"): Promise<void> => {

  const commands: Array<string> = [];
  // const commands: Array<string> = ["show ip bgp"];
  const debug: boolean = false;

  const deviceResponse: DeviceResponse<IosDevice | IosError> = await invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse, parseIosDeviceReject, commands, debug);
  console.log(JSON.stringify(deviceResponse));
}
entryPointTextReader(process.argv[2]);


console.log("Start...");
