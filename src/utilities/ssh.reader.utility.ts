import { SshHost, SshConfig } from "../models";
import { system } from "../settings";


const buildSshHost = (sshConfig: SshConfig, onError: Function): SshHost => {

  return {

    server: {

      host: sshConfig.host,
      port: system.sshConfig.port,
      userName: sshConfig.userName,
      password: sshConfig.password,
      readyTimeout: system.sshConfig.readyTimeout
    },
    idleTimeOut: system.sshConfig.idleTimeOut,
    commands: sshConfig.commands,
    ignoreSsh2SocketError: system.sshConfig.ignoreSsh2SocketError,
    onError: onError,
    verbose: system.sshConfig.verbose,
    debug: sshConfig.debug || false
  }
}


const sshReader = (SSH2Shell: any, sshConfig: SshConfig, intercept = (value: any) => value): Function => (): Promise<string> => {

  return new Promise((resolve, reject) => {

    const onError = (error: any) => reject(intercept(error));

    const sshHost: SshHost = buildSshHost(sshConfig, onError);

    return (new SSH2Shell(sshHost)).connect(resolve);
  }).then(intercept);
}


export { sshReader }
