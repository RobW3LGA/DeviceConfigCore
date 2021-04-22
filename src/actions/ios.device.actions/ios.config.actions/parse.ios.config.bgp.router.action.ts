import { BgpRouter, BgpRoute, BgpNeighbor } from "../../../models";


const parseIosConfigBgpRouter = (config: string): Array<BgpRouter> => {

  const bgpRouters: Array<BgpRouter> = Array<BgpRouter>();

  const findBgpRouter: RegExp = /(?:\r)?\nrouter bgp\s(.+)(?:\r)?\n(.*?(?:\r)?\n)+?!/g;
  for (const match of config.matchAll(findBgpRouter)) {

    const foundBgpRouter: string = match[0]!;
    const autonomousSystem: number = parseInt(match[1]!);

    const bgpRoutes: Array<BgpRoute> = Array<BgpRoute>();
    const findBgpRoute: RegExp = /\snetwork\s([\d\.]+)\smask\s([\d\.]+)\sroute-map\s([\w\-]+)/g;
    for (const match of foundBgpRouter.matchAll(findBgpRoute)) {

      const bgpRoute: BgpRoute = {

        network: match[1]!,
        mask: match[2]!,
        routeMap: match[3]!
      }
      bgpRoutes.push(bgpRoute);
    }

    const bgpNeighbors: Array<BgpNeighbor> = Array<BgpNeighbor>();
    const findBgpNeighbor: RegExp = /\sneighbor\s([\d\.]+)\s(.+)/g;
    for (const match of foundBgpRouter.matchAll(findBgpNeighbor)) {

      const bgpNeighbor: BgpNeighbor = {

        ip: match[1]!,
        description: match[2]!
      }
      bgpNeighbors.push(bgpNeighbor);
    }

    const bgpRouter: BgpRouter = {

      autonomousSystem: autonomousSystem,
      bgpRoutes: bgpRoutes,
      bgpNeighbors: bgpNeighbors
    }

    bgpRouters.push(bgpRouter);
  }

  return bgpRouters;
}

export { parseIosConfigBgpRouter }
