import { CurrentBgpRoute, CurrentBgpRouteNextHop } from "../../models";


const parseIosDeviceCurrentBgpRoutes = (response: string): Array<CurrentBgpRoute> => {

  const currentBgpRoutes: Array<CurrentBgpRoute> = Array<CurrentBgpRoute>();

  const findShowIpBgp: RegExp = /#show\sip\sbgp(?:\r)?\n(?:.*(?:\r)?\n)+/;
  const showIpBgp: string = response.match(findShowIpBgp)![0]!;

  const findCurrentBgpRoutes: RegExp = /\s\*[\s|>]{1}[i|\s]{1}\s{2}([\d\.]+)\/(\d{1,2})(?:(?:\r)?\n)?(?:(?:\s\*[\s|>]{1}[i|\s]{1})?\s+[\d\.]+\s+\d+\s+[\d|\s]+\s+\d+\s.(?:\r)?\n)*/g;
  for (const foundBgpRoutes of showIpBgp.matchAll(findCurrentBgpRoutes)) {

    const routePreferences: Array<CurrentBgpRouteNextHop> = Array<CurrentBgpRouteNextHop>();

    const findRoutePreference: RegExp = /\s\*([\s|>]{1})[i|\s]{1}\s{2}(?:[\d\.]+\/\d{1,2}(?:(?:\r)?\n)?)?\s+([\d\.]+)\s+(\d+)\s+([\d|\s]+)\s+(\d+)\s./g;
    for (const routePreferenceItems of foundBgpRoutes[0]!.matchAll(findRoutePreference)) {

      const routePreference: CurrentBgpRouteNextHop = {

        nextHop: routePreferenceItems[2]!,
        metric: parseInt(routePreferenceItems[3]!),
        localPreference: parseInt(routePreferenceItems[4]!) || -1,
        weight: parseInt(routePreferenceItems[5]!),
        isPreferredRoute: routePreferenceItems[1] === ">" ? true : false
      }
      routePreferences.push(routePreference);
    }

    const currentBgpRoute: CurrentBgpRoute = {

      network: foundBgpRoutes[1]!,
      mask: foundBgpRoutes[2]!,
      routePreferences: routePreferences
    }
    currentBgpRoutes.push(currentBgpRoute);
  }

  return currentBgpRoutes;
}


export { parseIosDeviceCurrentBgpRoutes }
