import { IosConfig, IosDevice, Interface, IpRoute, BgpRouter } from "../../models";
import { parseIosConfig } from "./ios.config.actions";


const compareConfigItems = <T>(runConfigItems: Array<T>, startConfigItems: Array<T>) => {

  return runConfigItems.length == startConfigItems.length && runConfigItems.every((value, index) => JSON.stringify(value) === JSON.stringify(startConfigItems[index]));
}


const parseIosDevice = (response: string): IosDevice => {

  const findRunConfig: RegExp = /#show\srunning-config(?:\r)?\n(.*?(?:\r)?\n)+?end(?:\r)?\n/;
  const runConfig: string = response.match(findRunConfig)![0]!;
  const iosRunConfig: IosConfig = parseIosConfig(runConfig);

  const findStartConfig: RegExp = /#show\sstartup-config(?:\r)?\n(.*?(?:\r)?\n)+?end(?:\r)?\n/;
  const startConfig: string = response.match(findStartConfig)![0]!;
  const iosStartConfig: IosConfig = parseIosConfig(startConfig);

  let hasConfigMismatch: boolean = false;
  const configMismatchItems: Array<string> = Array<string>();

  if (!compareConfigItems<Interface>(<Array<Interface>>iosRunConfig.interfaces, <Array<Interface>>iosStartConfig.interfaces)) { hasConfigMismatch = true; configMismatchItems.push("interfaces") }
  if (!compareConfigItems<IpRoute>(<Array<IpRoute>>iosRunConfig.ipRoutes, <Array<IpRoute>>iosStartConfig.ipRoutes)) { hasConfigMismatch = true; configMismatchItems.push("ipRoutes") }
  if (!compareConfigItems<BgpRouter>(<Array<BgpRouter>>iosRunConfig.bgpRouters, <Array<BgpRouter>>iosStartConfig.bgpRouters)) { hasConfigMismatch = true; configMismatchItems.push("bgpRouters") }
  if (JSON.stringify(iosRunConfig.snmpLocation) !== JSON.stringify(iosStartConfig.snmpLocation)) { hasConfigMismatch = true; configMismatchItems.push("snmpLocation") }

  return {

    hostname: iosRunConfig.hostname,
    version: iosRunConfig.version,
    hasConfigMismatch: hasConfigMismatch,
    configMismatchItems: configMismatchItems,
    runConfig: iosRunConfig,
    startConfig: iosStartConfig
  }
}


export { parseIosDevice }
