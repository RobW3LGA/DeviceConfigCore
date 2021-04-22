import { SSH2ShellMock } from "../mocks";
import { SshConfig, SshHost } from "../../src/models";

import { sshReader } from "../../src/utilities";


describe("ssh.reader utility tests", () => {

  test("sshReader(SSH2Shell: any, sshConfig: SshConfig)() -> enter sshConfig with device commands -> returns device content (the sshHost object in this test case)", async () => {

    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: ["terminal length 0", "show running-config"],
      debug: false
    }
    const sutFunction: Function = sshReader(SSH2ShellMock, sshConfig);

    const sut: SshHost = await sutFunction();

    expect(sut.commands).toStrictEqual(["terminal length 0", "show running-config"]);
    expect(sut.debug).toStrictEqual(false);
    expect(sut.idleTimeOut).toStrictEqual(30000);
    expect(sut.ignoreSsh2SocketError).toStrictEqual(true);
    expect(sut.server).toStrictEqual({"host": "127.0.0.1", "password": "P@ssw0rd", "port": "22", "readyTimeout": 3000, "userName": "testUser"});
    expect(sut.verbose).toStrictEqual(false);
  });


  test("sshReader(SSH2Shell: any, sshConfig: SshConfig)() -> enter sshConfig and inject response intercept function (for mock purposes, etc.) -> returns intercept content", async () => {

    const intercept = () => "Intercept Test Function";
    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: ["terminal length 0", "show running-config"],
      debug: false
    }
    const sutFunction: Function = sshReader(SSH2ShellMock, sshConfig, intercept);

    const sut: string = await sutFunction();

    expect(sut).toStrictEqual("Intercept Test Function");
  });


  test("sshReader(SSH2Shell: any, sshConfig: SshConfig)() -> enter sshConfig with debug=true to throw error -> returns mock error content", async () => {

    const sshConfig: SshConfig = {

      host: "127.0.0.1",
      userName: "testUser",
      password: "P@ssw0rd",
      commands: ["terminal length 0", "show running-config"],
      debug: true
    }
    const sutFunction: Function = sshReader(SSH2ShellMock, sshConfig);

    try { await sutFunction() }

    catch (testError) { expect(testError).toStrictEqual("Thrown Promise Rejection Test") }
  });
});