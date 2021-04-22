import { SshConfig } from "../models";


const buildIosShowSshRequest = (host: string, username: string, password: string, commands: Array<string> = Array<string>(), debug = false): SshConfig => {

  return {

    host: host,
    userName: username,
    password: password,
    commands: ["terminal length 0", "show running-config", "show startup-config"].concat(commands),
    debug: debug
  }
}


const buildIosWriteSshRequest = (host: string, username: string, password: string, commands: Array<string> = Array<string>(), debug = false): SshConfig => {

  return {

    host: host,
    userName: username,
    password: password,
    commands: ["terminal length 0", "configure terminal"].concat(commands).concat(["exit", "write memory", "show running-config", "show startup-config"]),
    debug: debug
  }
}


export { buildIosShowSshRequest, buildIosWriteSshRequest }
