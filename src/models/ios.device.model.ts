type SnmpLocation = {

  isHubDevice: boolean;
  location?: string;
  communicationMethod?: string;
  businessUnit?: string;
  service?: string;
}

type BgpRoute = {

  network: string;
  mask: string;
  routeMap: string;
}

type BgpNeighbor = {

  ip: string;
  description: string;
}

type BgpRouter = {

  autonomousSystem: number;
  bgpRoutes: Array<BgpRoute>;
  bgpNeighbors: Array<BgpNeighbor>;
}

type IpRoute = {

  ip: string;
  mask: string;
  interface: string;
  name: string;
}

type Interface = {

  name: string;
  ip: string;
  mask: string;
  description: string;
  isShutdown: boolean
}

type IosConfig = {

  hostname: string;
  version: string;
  interfaces: Array<Interface>;
  ipRoutes: Array<IpRoute>;
  bgpRouters: Array<BgpRouter>;
  snmpLocation: SnmpLocation;
}

type CurrentBgpRouteNextHop = {

  nextHop: string;
  metric: number;
  localPreference: number;
  weight: number;
  isPreferredRoute: boolean;
}

type CurrentBgpRoute = {

  network: string;
  mask: string;
  routePreferences: Array<CurrentBgpRouteNextHop>;
}

type IosDevice = {

  hostname: string;
  version: string;
  hasConfigMismatch: boolean;
  configMismatchItems: Array<string>;
  runConfig: IosConfig;
  startConfig: IosConfig;
  currentBgpRoutes?: Array<CurrentBgpRoute>;
}

type IosError = {

  description: string;
}


export { IosDevice, IosConfig, IosError, Interface, IpRoute, BgpRouter, BgpRoute, BgpNeighbor, SnmpLocation, CurrentBgpRoute, CurrentBgpRouteNextHop }
