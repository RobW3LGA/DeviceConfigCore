import { Interface } from "../../../src/models";

import { parseIosConfigInterface } from "../../../src/actions/ios.device.actions/ios.config.actions/parse.ios.config.interface.action";


describe("parse.ios.config.interface action tests", () => {

  test("parseIosConfigInterface(config: string) -> enter valid config string -> returns array of configured interfaces", () => {

    const config: string = `
!
interface GigabitEthernet0/0/0
 ip address 192.168.254.254 255.255.255.0
 negotiation auto
!
interface GigabitEthernet0/0/1
 ip address dhcp
 description JCONNECT
 shutdown
 media-type rj45
 negotiation auto
!
interface GigabitEthernet0/0/2
 no ip address
 shutdown
 media-type sfp
 negotiation auto
!
interface GigabitEthernet0
 vrf forwarding Mgmt-intf
 ip address 172.26.212.140 255.255.255.128
 negotiation auto
!
`

    const sut: Array<Interface> = parseIosConfigInterface(config);

    expect(sut).toHaveLength(4);
    expect(sut).toStrictEqual(expect.objectContaining(
      [
        {
           "description":"",
           "ip":"192.168.254.254",
           "isShutdown":false,
           "mask":"255.255.255.0",
           "name":"GigabitEthernet0/0/0"
        },
        {
           "description":"JCONNECT",
           "ip":"",
           "isShutdown":true,
           "mask":"",
           "name":"GigabitEthernet0/0/1"
        },
        {
           "description":"",
           "ip":"",
           "isShutdown":true,
           "mask":"",
           "name":"GigabitEthernet0/0/2"
        },
        {
           "description":"",
           "ip":"172.26.212.140",
           "isShutdown":false,
           "mask":"255.255.255.128",
           "name":"GigabitEthernet0"
        }
     ]
    ));
  });
});
