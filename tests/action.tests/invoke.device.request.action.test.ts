import { readFileSync } from "fs";
import { resolve } from "path"

import { SSH2ShellMock } from "../mocks";
import { DeviceResponse, IosDevice, IosError, SshConfig } from "../../src/models";
import { sshReader } from "../../src/utilities";

import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject, buildIosShowSshRequest, buildIosWriteSshRequest } from "../../src/actions";


describe("invoke.device.request -> invokeDeviceRequest() action tests", () => {

  test("invokeDeviceRequest async (sshReader: Function, parseIosDeviceResponse: Function, parseIosDeviceReject: Function, commands: Array<string>, debug: boolean) -> enter 'show running-config' and 'show startup-config' commands -> returns valid device with symmetric config objects", async () => {

    const commands: Array<string> = ["show running-config"];
    const debug: boolean = false;
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: commands,
      debug: debug
    }
    const intercept = () => readFileSync(resolve(__dirname, "../mocks/test.symmetric.config.mock")).toString();
    const reader: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: DeviceResponse<IosDevice> = await invokeDeviceRequest(reader, parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.code).toStrictEqual(200);
    expect(sut.device.hostname).toStrictEqual("COSMO-P2135-RUN-AUTOMATION");
    expect(sut.device.version).toStrictEqual("17.3");
    expect(sut.device.hasConfigMismatch).toStrictEqual(false);
    expect(sut.device.configMismatchItems).toStrictEqual([]);
    expect(sut.responseMs).toBeCloseTo(1000, -2);
    expect(JSON.stringify(sut.device.runConfig)).toStrictEqual(expect.stringMatching(
      /{\"hostname\":\"COSMO-P2135-RUN-AUTOMATION\",\"version\":\"17.3\"/
    ));
    expect(JSON.stringify(sut.device.runConfig)).toStrictEqual(expect.stringMatching(
      /\"interfaces\":\[{\"name\":\"GigabitEthernet0\/0\/0\",\"ip\":\"192.168.254.254\",\"mask\":\"255.255.255.0\",\"description\":\"\",\"isShutdown\":false},{\"name\":\"GigabitEthernet0\/0\/1\",\"ip\":\"\",\"mask\":\"\",\"description\":\"\",\"isShutdown\":true},{\"name\":\"GigabitEthernet0\/0\/2\",\"ip\":\"\",\"mask\":\"\",\"description\":\"\",\"isShutdown\":true},{\"name\":\"GigabitEthernet0\",\"ip\":\"172.26.212.140\",\"mask\":\"255.255.255.128\",\"description\":\"\",\"isShutdown\":false}\]/
    ));
    expect(JSON.stringify(sut.device.runConfig)).toStrictEqual(expect.stringMatching(
      /\"ipRoutes\":\[{\"ip\":\"192.168.252.0\",\"mask\":\"255.255.255.0\",\"interface\":\"192.168.254.1\",\"name\":\"EL_1234567\"}\]/
    ));
    expect(JSON.stringify(sut.device.runConfig)).toStrictEqual(expect.stringMatching(
      /\"bgpRouters\":\[\],\"snmpLocation\":{\"isHubDevice\":false,\"location\":\"Joplin, MO- Not A Real Bank \(Company ID 1234\)\"}}/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /{\"hostname\":\"COSMO-P2135-RUN-AUTOMATION\",\"version\":\"17.3\"/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"interfaces\":\[{\"name\":\"GigabitEthernet0\/0\/0\",\"ip\":\"192.168.254.254\",\"mask\":\"255.255.255.0\",\"description\":\"\",\"isShutdown\":false},{\"name\":\"GigabitEthernet0\/0\/1\",\"ip\":\"\",\"mask\":\"\",\"description\":\"\",\"isShutdown\":true},{\"name\":\"GigabitEthernet0\/0\/2\",\"ip\":\"\",\"mask\":\"\",\"description\":\"\",\"isShutdown\":true},{\"name\":\"GigabitEthernet0\",\"ip\":\"172.26.212.140\",\"mask\":\"255.255.255.128\",\"description\":\"\",\"isShutdown\":false}\]/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"ipRoutes\":\[{\"ip\":\"192.168.252.0\",\"mask\":\"255.255.255.0\",\"interface\":\"192.168.254.1\",\"name\":\"EL_1234567\"}\]/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"bgpRouters\":\[\]/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"snmpLocation\":{\"isHubDevice\":false,\"location\":\"Joplin, MO- Not A Real Bank \(Company ID 1234\)\"}}/
    ));
  });


  test("invokeDeviceRequest async (sshReader: Function, parseIosDeviceResponse: Function, parseIosDeviceReject: Function, commands: Array<string>, debug: boolean) -> enter 'show running-config' and 'show startup-config' commands -> returns valid device with symmetric config objects", async () => {

    const commands: Array<string> = ["show ip bgp"];
    const debug: boolean = false;
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: commands,
      debug: debug
    }
    const intercept = () => readFileSync(resolve(__dirname, "../mocks/test.asymmetric.config.mock")).toString();
    const reader: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: DeviceResponse<IosDevice> = await invokeDeviceRequest(reader, parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.code).toStrictEqual(200);
    expect(sut.device.hostname).toStrictEqual("COSMO-P2135-RUN-AUTOMATION");
    expect(sut.device.version).toStrictEqual("17.3");
    expect(sut.device.hasConfigMismatch).toStrictEqual(true);
    expect(sut.device.configMismatchItems).toStrictEqual(["interfaces", "ipRoutes", "bgpRouters", "snmpLocation"]);
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /{\"hostname\":\"COSMO-P2135-START-AUTOMATION\",\"version\":\"17.4\"/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"interfaces\":\[{\"name\":\"GigabitEthernet0\/0\/0\",\"ip\":\"192.168.254.254\",\"mask\":\"255.255.255.0\",\"description\":\"\",\"isShutdown\":false},{\"name\":\"GigabitEthernet0\/0\/1\",\"ip\":\"dhcp\",\"description\":\"JCONNECT\",\"isShutdown\":true},{\"name\":\"GigabitEthernet0\/0\/2\",\"ip\":\"\",\"mask\":\"\",\"description\":\"\",\"isShutdown\":true},{\"name\":\"GigabitEthernet0\",\"ip\":\"172.26.212.140\",\"mask\":\"255.255.255.128\",\"description\":\"\",\"isShutdown\":false}\]/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"ipRoutes\":\[{\"ip\":\"192.168.252.0\",\"mask\":\"255.255.255.0\",\"interface\":\"192.168.254.1\",\"name\":\"EL_1234568\"}\]/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"bgpRouters\":\[{\"autonomousSystem\":1234,\"bgpRoutes\":\[{\"network\":\"10.14.58.2\",\"mask\":\"255.255.255.255\",\"routeMap\":\"active-1\"},{\"network\":\"10.14.59.2\",\"mask\":\"255.255.255.255\",\"routeMap\":\"standby-1\"}\],\"bgpNeighbors\":\[{\"ip\":\"10.8.0.1\",\"description\":\"remote-as 1234\"},{\"ip\":\"10.8.0.1\",\"description\":\"update-source Tunnel8\"},{\"ip\":\"10.8.0.1\",\"description\":\"next-hop-self\"},{\"ip\":\"10.8.0.3\",\"description\":\"remote-as 1234\"},{\"ip\":\"10.8.0.3\",\"description\":\"update-source Tunnel8\"},{\"ip\":\"10.8.0.3\",\"description\":\"next-hop-self\"},{\"ip\":\"10.8.0.5\",\"description\":\"remote-as 1234\"},{\"ip\":\"10.8.0.5\",\"description\":\"update-source Tunnel8\"},{\"ip\":\"10.8.0.5\",\"description\":\"next-hop-self\"}\]}\]/
    ));
    expect(JSON.stringify(sut.device.startConfig)).toStrictEqual(expect.stringMatching(
      /\"snmpLocation\":{\"isHubDevice\":true,\"location\":\"Monett, MO\",\"communicationMethod\":\"jConnect VPN\",\"businessUnit\":\"Technology Operations\",\"service\":\"UCE JHA Cloud Services\"}}/
    ));
  });


  test("invokeDeviceRequest async (sshReader: Function, parseIosDeviceResponse: Function, parseIosDeviceReject: Function, commands: Array<string>, debug: boolean) -> enter invalid host IP -> returns 'Host timeout (check IP address)'", async () => {

    const commands: Array<string> = ["terminal length 0", "show running-config"];
    const debug: boolean = true;
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: commands,
      debug: debug
    }
    // const intercept = (): string => "Rejected:\nError: Timed out while waiting for handshake";
    const intercept = (): {} => ({"level":"client-timeout"});
    const reader: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: DeviceResponse<IosError> = await invokeDeviceRequest(reader, parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.code).toStrictEqual(408);
    expect(sut.device.description).toStrictEqual("Host timeout (check IP address)");
  });


  test("invokeDeviceRequest async (sshReader: Function, parseIosDeviceResponse: Function, parseIosDeviceReject: Function, commands: Array<string>, debug: boolean) -> enter invalid credentials -> returns 'Authentication failure (check credentials)'", async () => {

    const commands: Array<string> = ["terminal length 0", "show running-config"];
    const debug: boolean = true;
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: commands,
      debug: debug
    }
    const intercept = (): {} => ({"level":"client-authentication"});
    const reader: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: DeviceResponse<IosError> = await invokeDeviceRequest(reader, parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.code).toStrictEqual(401);
    expect(sut.device.description).toStrictEqual("Authentication failure (check credentials)");
  });


  test("invokeDeviceRequest async (sshReader: Function, parseIosDeviceResponse: Function, parseIosDeviceReject: Function, commands: Array<string>, debug: boolean) -> enter onerous command -> returns 'Command timeout (check SSH idle timeout setting)'", async () => {

    const commands: Array<string> = ["terminal length 0", "show running-config"];
    const debug: boolean = true;
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: commands,
      debug: debug
    }
    const intercept = (): string => "Rejected:\nSome.IP.Address Command timed out after many, many seconds";
    const reader: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: DeviceResponse<IosError> = await invokeDeviceRequest(reader, parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.code).toStrictEqual(404);
    expect(sut.device.description).toStrictEqual("Command timeout (check SSH idle timeout setting)");
  });


  test("invokeDeviceRequest async (sshReader: Function, parseIosDeviceResponse: Function, parseIosDeviceReject: Function, commands: Array<string>, debug: boolean) -> enter unknown problem -> returns the error as-is'", async () => {

    const commands: Array<string> = ["terminal length 0", "show running-config"];
    const debug: boolean = true;
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: commands,
      debug: debug
    }
    const intercept = (): string => "This is a generic-handled, catch-all error. Make it better with an error code and a test case";
    const reader: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: DeviceResponse<IosError> = await invokeDeviceRequest(reader, parseIosDeviceResponse, parseIosDeviceReject, commands, debug);

    expect(sut.code).toStrictEqual(400);
    expect(sut.device.description).toStrictEqual('"This is a generic-handled, catch-all error. Make it better with an error code and a test case"');
  });
});


describe("invoke.device.request -> buildIosShowSshRequest() action tests", () => {

  test("buildIosShowSshRequest(host: string, userName: string, password: string, commands: Array<string>, debug = true) -> enter valid params -> returns valid object with 'test show-command' command set and debug data", async () => {

    const host: string = "127.0.0.1";
    const userName: string = "testUser";
    const password: string = "P@ssw0rd";
    const commands: Array<string> = ["test show-command"];
    const debug: boolean = true;

    const sut: SshConfig = buildIosShowSshRequest(host, userName, password, commands, debug);

    expect(sut.commands).toStrictEqual(["terminal length 0", "show running-config", "show startup-config", "test show-command"]);
    expect(sut.debug).toStrictEqual(true);
  });

  
  test("buildIosShowSshRequest(host: string, userName: string, password: string) -> enter valid params -> returns valid object with default 'show' command set and no debug data", async () => {

    const host: string = "127.0.0.1";
    const userName: string = "testUser";
    const password: string = "P@ssw0rd";

    const sut: SshConfig = buildIosShowSshRequest(host, userName, password);

    expect(sut.commands).toStrictEqual(["terminal length 0", "show running-config", "show startup-config"]);
    expect(sut.debug).toStrictEqual(false);
  });
});


describe("invoke.device.request -> buildIosWriteSshRequest() action tests", () => {

  test("buildIosWriteSshRequest(host: string, userName: string, password: string, commands: Array<string>, debug = true) -> enter valid params -> returns valid object with 'test config-command' command set and debug data", async () => {

    const host: string = "127.0.0.1";
    const userName: string = "testUser";
    const password: string = "P@ssw0rd";
    const commands: Array<string> = ["test config-command"];
    const debug: boolean = true;

    const sut = buildIosWriteSshRequest(host, userName, password, commands, debug);

    expect(sut.commands).toStrictEqual(["terminal length 0", "configure terminal", "test config-command", "exit", "write memory", "show running-config", "show startup-config"]);
    expect(sut.debug).toStrictEqual(true);
  });

  
  test("buildIosWriteSshRequest(host: string, userName: string, password: string) -> enter valid params -> returns valid object with default 'config' command set and no debug data", async () => {

    const host: string = "127.0.0.1";
    const userName: string = "testUser";
    const password: string = "P@ssw0rd";

    const sut = buildIosWriteSshRequest(host, userName, password);

    expect(sut.commands).toStrictEqual(["terminal length 0", "configure terminal", "exit", "write memory", "show running-config", "show startup-config"]);
    expect(sut.debug).toStrictEqual(false);
  });
});
