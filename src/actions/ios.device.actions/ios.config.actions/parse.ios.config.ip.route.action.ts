import { IpRoute } from "../../../models";


const parseIosConfigIpRoute = (config: string): Array<IpRoute> => {

  const ipRoutes: Array<IpRoute> = Array<IpRoute>();

  const findRoute: RegExp = /ip\sroute\s([\d\.]+){1}\s([\d\.]+)\s([\d\w\.\-]+)(?:\sname\s([\w\d\-\_]+))?/g;
  for (const match of config.matchAll(findRoute)) {

    const ipRoute: IpRoute = {

      ip: match[1]!,
      mask: match[2]!,
      interface: match[3]!,
      name: match[4]!
    };

    ipRoutes.push(ipRoute);
  }

  return ipRoutes;
}

export { parseIosConfigIpRoute }
