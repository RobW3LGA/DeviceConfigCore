type SshHostServer = {

  host: string;
  port: string;
  userName: string;
  password: string;
  readyTimeout: number;
}

type SshHost = {

  server: SshHostServer;
  commands: Array<string>;
  idleTimeOut: number;
  ignoreSsh2SocketError: boolean;
  onError: Function;
  verbose: boolean;
  debug: boolean;
}

type SshConfig = {

  host: string;
  userName: string;
  password: string;
  commands: Array<string>;
  debug: boolean;
}

export { SshHost, SshConfig }
