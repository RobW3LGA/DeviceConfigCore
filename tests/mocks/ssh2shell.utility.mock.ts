import { SshHost } from "../../src/models";


class SSH2ShellMock {

  sshHost;
  testResponseMs;

  constructor(sshHost: SshHost) {

    this.sshHost = sshHost;
    this.testResponseMs = 1000
  }

  connect(resolve: any) {

    ((ms) => {

      let timeCheck = null;
      const now = Date.now();
      do { timeCheck = Date.now() }
      while(timeCheck - now < ms);
    })(this.testResponseMs);

    if (this.sshHost.debug) { throw this.sshHost.onError("Thrown Promise Rejection Test") }
    else { return resolve(this.sshHost) }
  }
}

export { SSH2ShellMock }
