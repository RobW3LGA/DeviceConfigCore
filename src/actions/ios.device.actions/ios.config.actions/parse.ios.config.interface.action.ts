import { Interface } from "../../../models";


const parseIosConfigInterface = (config: string): Array<Interface> => {

  const interfaces: Array<Interface> = Array<Interface>();

  const findInterface: RegExp = /(?:\r)?\ninterface\s(.+)(?:\r)?\n(.*?(?:\r)?\n)+?!/g;
  for (const match of config.matchAll(findInterface)) {

    const foundInterface: string = match[0]!;
    const name: string = match[1]!;
    const findIpMask: RegExp = /(?:\r)?\n\sip\saddress\s([\w\d\.]+)\s([\d\.]+)?(?:\r)?\n/;
    let ip: string = "";
    let mask: string = "";
    if (foundInterface.match(findIpMask) != null) { ip = foundInterface.match(findIpMask)![1]!; mask = foundInterface.match(findIpMask)![2]! }

    const findDescription: RegExp = /(?:\r)?\n\sdescription\s(.+)(?:\r)?\n/;
    let description: string = "";
    if (foundInterface.match(findDescription) != null) { description = foundInterface.match(findDescription)![1]! }

    const findShutdown: RegExp = /(?:\r)?\n\sshutdown(?:\r)?\n/;
    let isShutdown: boolean = false;
    if (foundInterface.match(findShutdown) != null) { isShutdown = true }

    const iosInterface: Interface = {

      name: name,
      ip: ip,
      mask: mask,
      description: description,
      isShutdown: isShutdown
    };

    interfaces.push(iosInterface);
  }

  return interfaces;
}


export { parseIosConfigInterface }
