import { DeviceResponse } from "../models";

const textReader = (fileReader: Function, filePath: string): Function => async (): Promise<DeviceResponse<string>> => {

  return (await fileReader(filePath)).toString();
}

export { textReader }
