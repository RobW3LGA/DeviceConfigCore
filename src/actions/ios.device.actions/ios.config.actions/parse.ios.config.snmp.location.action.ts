import { SnmpLocation } from "../../../models";


const parseIosConfigSnmpLocation = (config: string): SnmpLocation => {

  const findSnmpLocation: RegExp = /(?:\r)?\nsnmp-server\slocation\s([^\r\n]+)/;
  const foundSnmpLocation: RegExpMatchArray = config.match(findSnmpLocation)!;

  if (!foundSnmpLocation) {

    return {

      isHubDevice: false
    }
  }
  else if (!foundSnmpLocation[1]!.includes("|")) {

    return {

      isHubDevice: false,
      location: foundSnmpLocation[1]!
    }
  }
  else {

    const locationItems: Array<string> = foundSnmpLocation[1]!.split("|").map((item: string) => item.trimStart().trimEnd())

    return {

      isHubDevice: true,
      location: locationItems[0]!,
      communicationMethod: locationItems[1]!,
      businessUnit: locationItems[2]!,
      service: locationItems[3]!
    }
  }
}

export { parseIosConfigSnmpLocation }
