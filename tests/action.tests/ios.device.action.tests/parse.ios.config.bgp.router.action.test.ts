import { BgpRouter } from "../../../src/models";

import { parseIosConfigBgpRouter } from "../../../src/actions/ios.device.actions/ios.config.actions/parse.ios.config.bgp.router.action";


describe("parse.ios.config.bgp.router action tests", () => {

  test("parseIosConfigBgpRouter(config: string) -> enter valid config string -> returns array of configured BGP routers", () => {

    const config: string = `
!
router bgp 1234
 bgp log-neighbor-changes
 network 10.14.58.2 mask 255.255.255.255 route-map active-1
 network 10.14.59.2 mask 255.255.255.255 route-map standby-1
 neighbor 10.8.0.1 remote-as 1234
 neighbor 10.8.0.1 update-source Tunnel8
 neighbor 10.8.0.1 next-hop-self
 neighbor 10.8.0.3 remote-as 1234
 neighbor 10.8.0.3 update-source Tunnel8
 neighbor 10.8.0.3 next-hop-self
 neighbor 10.8.0.5 remote-as 1234
 neighbor 10.8.0.5 update-source Tunnel8
 neighbor 10.8.0.5 next-hop-self
 distribute-list inbound_filter in
!
`

    const sut: Array<BgpRouter> = parseIosConfigBgpRouter(config);

    expect(sut).toHaveLength(1);
    expect(sut[0]!.autonomousSystem).toStrictEqual(1234);
    expect(sut[0]!.bgpNeighbors).toHaveLength(9);
    expect(sut[0]!.bgpNeighbors[0]).toStrictEqual(expect.objectContaining(
      {
        "description": "remote-as 1234",
        "ip": "10.8.0.1"
      }
    ));
    expect(sut[0]!.bgpNeighbors[4]).toStrictEqual(expect.objectContaining(
      {
        "description": "update-source Tunnel8",
        "ip": "10.8.0.3"
      }
    ));
    expect(sut[0]!.bgpNeighbors[8]).toStrictEqual(expect.objectContaining(
      {
        "description": "next-hop-self",
        "ip": "10.8.0.5"
      }
    ));
    expect(sut[0]!.bgpRoutes).toHaveLength(2);
    expect(sut[0]!.bgpRoutes).toStrictEqual(expect.objectContaining(
      [
        {
          "mask": "255.255.255.255",
          "network": "10.14.58.2",
          "routeMap": "active-1"
        },
        {
          "mask": "255.255.255.255",
          "network": "10.14.59.2",
          "routeMap": "standby-1"
        }
      ]
    ));
  });
});
