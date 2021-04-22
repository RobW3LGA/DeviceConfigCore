import { IosConfig } from "../../../models";
import { parseIosConfigBgpRouter } from "./parse.ios.config.bgp.router.action";
import { parseIosConfigIpRoute } from "./parse.ios.config.ip.route.action";
import { parseIosConfigInterface } from "./parse.ios.config.interface.action";
import { parseIosConfigSnmpLocation } from "./parse.ios.config.snmp.location.action";


const parseIosConfig = (config: string): IosConfig => {

  const findHostname: RegExp = /(?:\r)?\nhostname\s(.+)(?:\r)?\n/;
  const findVersion: RegExp = /(?:\r)?\nversion\s(.+)(?:\r)?\n/;

  return {

    hostname: config.match(findHostname)![1]!,
    version: config.match(findVersion)![1]!,
    interfaces: parseIosConfigInterface(config),
    ipRoutes: parseIosConfigIpRoute(config),
    bgpRouters: parseIosConfigBgpRouter(config),
    snmpLocation: parseIosConfigSnmpLocation(config)
  }
}


export { parseIosConfig }
