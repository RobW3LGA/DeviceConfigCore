import { IpRoute } from "../../../src/models";

import { parseIosConfigIpRoute } from "../../../src/actions/ios.device.actions/ios.config.actions/parse.ios.config.ip.route.action";


describe("parse.ios.config.ip.route action tests", () => {

  test("parseIosConfigIpRoute(config: string) -> enter valid config string -> returns array of configured IP routes", () => {

    const config: string = `
interface GigabitEthernet8
 description INTERNET PRIMARY
 no ip route-cache
!
ip nat inside source static 10.144.195.1 10.201.193.48
ip route 10.10.10.10 255.255.255.254 172.16.1.1 name malarchy
ip route 10.10.10.24 255.255.255.254 192.56.6.6
ip route 10.48.58.0 255.255.255.0 GigabitEthernet8 name Phillip-Route
ip route vrf Mgmt-intf 0.0.0.0 0.0.0.0 172.26.212.129
ip ssh version 2
`

    const sut: Array<IpRoute> = parseIosConfigIpRoute(config);

    expect(sut).toHaveLength(3);
    expect(sut).toStrictEqual(expect.objectContaining(
      [
        { "ip": "10.10.10.10", "mask": "255.255.255.254", "interface": "172.16.1.1", "name": "malarchy" },
        { "ip": "10.10.10.24", "mask": "255.255.255.254", "interface": "192.56.6.6" },
        { "ip": "10.48.58.0", "mask": "255.255.255.0", "interface": "GigabitEthernet8", "name": "Phillip-Route" }
      ]
    ));
  });
});
