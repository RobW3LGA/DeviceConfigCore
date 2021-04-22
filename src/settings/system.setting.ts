const system = {

  sshConfig: {

    port: "22",
    readyTimeout: 3000,
    idleTimeOut: 30000,
    ignoreSsh2SocketError: true,
    verbose: false,
    debug: false
  },
  authorizedShowCommands: ["show ip route", "show bgp route"],
  authorizedWriteCommands: ["ip route"]
}


export { system }
