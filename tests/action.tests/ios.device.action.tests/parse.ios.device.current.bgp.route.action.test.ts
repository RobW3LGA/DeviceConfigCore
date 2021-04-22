import { CurrentBgpRoute } from "../../../src/models";

import { parseIosDeviceCurrentBgpRoutes } from "../../../src/actions/ios.device.actions/parse.ios.device.current.bgp.route.action";


describe("parse.ios.device.current.bgp.route", () => {

  test("parseIosDeviceCurrentBgpRoutes(config: string) -> enter valid config string -> returns array of current BGP routes", () => {

    const config: string = `
COSMO-P2135-R01-AUTOMATION#show ip bgp
BGP table version is 11414007, local router ID is 10.15.1.81
Status codes: s suppressed, d damped, h history, * valid, > best, i - internal,
              r RIB-failure, S Stale, m multipath, b backup-path, f RT-Filter,
              x best-external, a additional-path, c RIB-compressed,
              t secondary path,
Origin codes: i - IGP, e - EGP, ? - incomplete
RPKI validation codes: V valid, I invalid, N Not found

     Network          Next Hop            Metric LocPrf Weight Path
 * i  10.8.0.0/16      10.9.0.3                 0     50      0 i
 * i                   10.8.0.3                 0     50      0 i
 * i                   10.9.0.1                 0     50      0 i
 * i                   10.8.0.1                 0     50      0 i
 *>                    0.0.0.0                  0         32768 i
 * i  10.10.11.0/24    10.9.42.8              200    100      0 i
 * i                   10.9.42.8              200    100      0 i
 *>i                   10.9.42.8              200    100      0 i
 * i                   10.9.42.8              200    100      0 i
 * i                   10.9.42.8              200    100      0 i
 * i  216.116.86.108/32
                      10.8.11.7                0    120      0 i
 * i                   10.8.11.7                0    120      0 i
 * i                   10.8.11.7                0    120      0 i
 * i                   10.8.11.7                0    120      0 i
 *>i                   10.8.111.7               0    115      0 i
 * i                   10.8.11.7                0    120      0 i
 * i                   10.8.111.8               0    105      0 i
 * i                   10.8.11.8                0    110      0 i

COSMO-P2135-R01-AUTOMATION#
`

    const sut: Array<CurrentBgpRoute> = parseIosDeviceCurrentBgpRoutes(config);

    expect(sut).toHaveLength(3);
    expect(sut[0]!.network).toStrictEqual("10.8.0.0");
    expect(sut[0]!.mask).toStrictEqual("16");
    expect(sut[0]!.routePreferences).toHaveLength(5);

    expect(sut[0]!.routePreferences[0]!.nextHop).toStrictEqual("10.9.0.3");
    expect(sut[0]!.routePreferences[0]!.metric).toStrictEqual(0);
    expect(sut[0]!.routePreferences[0]!.localPreference).toStrictEqual(50);
    expect(sut[0]!.routePreferences[0]!.weight).toStrictEqual(0);
    expect(sut[0]!.routePreferences[0]!.isPreferredRoute).toStrictEqual(false);

    expect(sut[0]!.routePreferences[4]!.nextHop).toStrictEqual("0.0.0.0");
    expect(sut[0]!.routePreferences[4]!.metric).toStrictEqual(0);
    expect(sut[0]!.routePreferences[4]!.localPreference).toStrictEqual(-1);
    expect(sut[0]!.routePreferences[4]!.weight).toStrictEqual(32768);
    expect(sut[0]!.routePreferences[4]!.isPreferredRoute).toStrictEqual(true);


    expect(sut[1]!.network).toStrictEqual("10.10.11.0");
    expect(sut[1]!.mask).toStrictEqual("24");
    expect(sut[1]!.routePreferences).toHaveLength(5);
    
    expect(sut[1]!.routePreferences[0]!.nextHop).toStrictEqual("10.9.42.8");
    expect(sut[1]!.routePreferences[0]!.metric).toStrictEqual(200);
    expect(sut[1]!.routePreferences[0]!.localPreference).toStrictEqual(100);
    expect(sut[1]!.routePreferences[0]!.weight).toStrictEqual(0);
    expect(sut[1]!.routePreferences[0]!.isPreferredRoute).toStrictEqual(false);

    expect(sut[1]!.routePreferences[2]!.nextHop).toStrictEqual("10.9.42.8");
    expect(sut[1]!.routePreferences[2]!.isPreferredRoute).toStrictEqual(true);


    expect(sut[2]!.network).toStrictEqual("216.116.86.108");
    expect(sut[2]!.mask).toStrictEqual("32");
    expect(sut[2]!.routePreferences).toHaveLength(8);
    
    expect(sut[2]!.routePreferences[0]!.nextHop).toStrictEqual("10.8.11.7");
    expect(sut[2]!.routePreferences[0]!.metric).toStrictEqual(0);
    expect(sut[2]!.routePreferences[0]!.localPreference).toStrictEqual(120);
    expect(sut[2]!.routePreferences[0]!.weight).toStrictEqual(0);
    expect(sut[2]!.routePreferences[0]!.isPreferredRoute).toStrictEqual(false);

    expect(sut[2]!.routePreferences[4]!.nextHop).toStrictEqual("10.8.111.7");
    expect(sut[2]!.routePreferences[4]!.metric).toStrictEqual(0);
    expect(sut[2]!.routePreferences[4]!.localPreference).toStrictEqual(115);
    expect(sut[2]!.routePreferences[4]!.weight).toStrictEqual(0);
    expect(sut[2]!.routePreferences[4]!.isPreferredRoute).toStrictEqual(true);
  });
});
