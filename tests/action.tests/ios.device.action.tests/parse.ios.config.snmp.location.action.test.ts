import { SnmpLocation } from "../../../src/models";

import { parseIosConfigSnmpLocation } from "../../../src/actions/ios.device.actions/ios.config.actions/parse.ios.config.snmp.location.action";


describe("parse.ios.config.snmp.location action tests", () => {


  test("parseIosConfigSnmpLocation(config: string) -> enter valid config string -> returns SNMP 'hub' configuration", () => {

    const config: string = `
!
snmp-server community yourmama RW 50
snmp-server ifindex persist
snmp-server trap-source Loopback0
snmp-server location Monett, MO |  jConnect VPN  | Technology Operations | UCE JHA Cloud Services
!snmp-server location Location  |     Comms      |    Business Unit      |       Service
snmp-server contact jd@yourmom.com
snmp-server enable traps snmp authentication linkdown linkup coldstart warmstart
snmp-server enable traps tty
snmp-server enable traps envmon
snmp-server enable traps config
snmp-server host 10.9.2.50 version 2c yourmama 
tftp-server flash:network-confg
tftp-server usbflash0:c1100-universalk9.16.12.01a.SPA.bin
tftp-server flash:autoinstall_dhcp
tftp-server usbflash0:test.txt
!
`

    const sut: SnmpLocation = parseIosConfigSnmpLocation(config);

    expect(sut).toStrictEqual(expect.objectContaining(
      {"businessUnit": "Technology Operations", "communicationMethod": "jConnect VPN", "isHubDevice": true, "location": "Monett, MO", "service": "UCE JHA Cloud Services"}
    ));
  });


  test("parseIosConfigSnmpLocation(config: string) -> enter valid config string -> returns SNMP 'spoke' configuration", () => {

    const config: string = `
!
snmp-server community yourmama RW 50
snmp-server ifindex persist
snmp-server trap-source Loopback0
snmp-server location Joplin, MO- Not A Real Bank (Company ID 1234)
snmp-server contact jd@yourmom.com
snmp-server enable traps snmp authentication linkdown linkup coldstart warmstart
snmp-server enable traps tty
snmp-server enable traps envmon
snmp-server enable traps config
snmp-server host 10.9.2.50 version 2c yourmama 
tftp-server flash:network-confg
tftp-server usbflash0:c1100-universalk9.16.12.01a.SPA.bin
tftp-server flash:autoinstall_dhcp
tftp-server usbflash0:test.txt
!
`

    const sut: SnmpLocation = parseIosConfigSnmpLocation(config);

    expect(sut).toStrictEqual(expect.objectContaining(
      {"isHubDevice": false, "location": "Joplin, MO- Not A Real Bank (Company ID 1234)"}
    ));
  });


  test("parseIosConfigSnmpLocation(config: string) -> enter valid config string -> returns SNMP minimal configuration", () => {

    const config: string = `
!
snmp-server community yourmama RW 50
snmp-server host 10.9.2.50 version 2c yourmama 
tftp-server flash:network-confg
tftp-server usbflash0:c1100-universalk9.16.12.01a.SPA.bin
tftp-server flash:autoinstall_dhcp
tftp-server usbflash0:test.txt
!
`

    const sut: SnmpLocation = parseIosConfigSnmpLocation(config);

    expect(sut).toStrictEqual(expect.objectContaining(
      {"isHubDevice": false}
    ));
  });
});
