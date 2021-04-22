import { readFileSync } from "fs";
import { resolve } from "path"

import { fileReaderMockArrange } from "../mocks";
import { DeviceResponse, IosDevice, IosError } from "../../src/models";
import { textReader } from "../../src/utilities";

import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject } from "../../src/actions";


describe("parse.device.response action tests", () => {

  test("invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse -> enter valid file path -> returns valid file content", async () => {

    const config: string = readFileSync(resolve(__dirname, "../mocks/test.asymmetric.config.mock")).toString();
    const fileReader: Function = fileReaderMockArrange(config, 1000);
    const filePath: string = "./test.file.txt";
    const debug: boolean = false;

    const sut: DeviceResponse<IosDevice> = await invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse, parseIosDeviceReject, [], debug);

    expect(sut.responseMs).toBeCloseTo(1000, -2);
    expect(sut.code).toStrictEqual(200);
    expect(sut.device.hostname).toStrictEqual("COSMO-P2135-RUN-AUTOMATION");
    expect(sut.device.version).toStrictEqual("17.3");
    expect(sut.device.hasConfigMismatch).toStrictEqual(true);
    expect(sut.device.configMismatchItems).toStrictEqual(["interfaces", "ipRoutes", "bgpRouters", "snmpLocation"]);
  });


  test("invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse -> simulate promise reject() -> returns IosError object", async () => {

    const config: string = readFileSync(resolve(__dirname, "../mocks/test.asymmetric.config.mock")).toString();
    const reject: boolean = true;
    const fileReader: Function = fileReaderMockArrange(config, 0, reject);
    const filePath: string = "./test.file.txt";
    const debug: boolean = true;

    const sut: DeviceResponse<IosError> = await invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse, parseIosDeviceReject, [], debug);

    expect(sut.timeStamp).toStrictEqual(0);
    expect(sut.code).toStrictEqual(400);
    // expect(sut.device.code).toStrictEqual(400);
    expect(sut.device.description).toStrictEqual(expect.stringMatching(/Thrown by test: COSMO-P2135-R01-AUTOMATION/));
  });


  test("invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse -> enter 'show ip bgp' command -> returns valid device object with currentBgpRoutes[]", async () => {

    const commands: Array<string> = ["show ip bgp"];
    const config: string = readFileSync(resolve(__dirname, "../mocks/test.asymmetric.config.mock")).toString();
    const fileReader: Function = fileReaderMockArrange(config, 1000);
    const filePath: string = "./test.file.txt";
    const debug: boolean = false;

    const sut: DeviceResponse<IosDevice> = await invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.device.currentBgpRoutes!.length).toStrictEqual(3);
    expect(JSON.stringify(sut.device.currentBgpRoutes)).toStrictEqual(expect.stringMatching(
      /{\"network\":\"10.8.0.0\",\"mask\":\"16\",\"routePreferences\":\[{\"nextHop\":\"10.9.0.3\",\"metric\":0,\"localPreference\":50,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.0.3\",\"metric\":0,\"localPreference\":50,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.9.0.1\",\"metric\":0,\"localPreference\":50,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.0.1\",\"metric\":0,\"localPreference\":50,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"0.0.0.0\",\"metric\":0,\"localPreference\":-1,\"weight\":32768,\"isPreferredRoute\":true}\]}/
    ));
    expect(JSON.stringify(sut.device.currentBgpRoutes)).toStrictEqual(expect.stringMatching(
      /{\"network\":\"10.10.11.0\",\"mask\":\"24\",\"routePreferences\":\[{\"nextHop\":\"10.9.42.8\",\"metric\":200,\"localPreference\":100,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.9.42.8\",\"metric\":200,\"localPreference\":100,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.9.42.8\",\"metric\":200,\"localPreference\":100,\"weight\":0,\"isPreferredRoute\":true},{\"nextHop\":\"10.9.42.8\",\"metric\":200,\"localPreference\":100,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.9.42.8\",\"metric\":200,\"localPreference\":100,\"weight\":0,\"isPreferredRoute\":false}\]}/
    ));
    expect(JSON.stringify(sut.device.currentBgpRoutes)).toStrictEqual(expect.stringMatching(
      /{\"network\":\"216.116.86.108\",\"mask\":\"32\",\"routePreferences\":\[{\"nextHop\":\"10.8.11.7\",\"metric\":0,\"localPreference\":120,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.11.7\",\"metric\":0,\"localPreference\":120,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.11.7\",\"metric\":0,\"localPreference\":120,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.11.7\",\"metric\":0,\"localPreference\":120,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.111.7\",\"metric\":0,\"localPreference\":115,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.11.7\",\"metric\":0,\"localPreference\":120,\"weight\":0,\"isPreferredRoute\":true},{\"nextHop\":\"10.8.111.8\",\"metric\":0,\"localPreference\":105,\"weight\":0,\"isPreferredRoute\":false},{\"nextHop\":\"10.8.11.8\",\"metric\":0,\"localPreference\":110,\"weight\":0,\"isPreferredRoute\":false}\]}/
    ));
  });
});
