# Verification Checklist

Use screenshots of these tests as genuine Packet Tracer evidence.

## Layer 2

- [ ] `show vlan brief`
- [ ] `show interfaces trunk`
- [ ] `show spanning-tree vlan 10`
- [ ] `show spanning-tree vlan 20`
- [ ] `show etherchannel summary`
- [ ] Confirm HSRP/STP alignment: DIST1 active/root for VLANs 10/30/50/99; DIST2 active/root for 20/40.

## Layer 3 / OSPF

- [ ] `show ip ospf neighbor` on EDGE1, DIST1, DIST2, BR1
- [ ] `show ip route ospf`
- [ ] Branch receives default route
- [ ] HQ learns summarized Branch `10.20.0.0/16` where supported by the IOS image
- [ ] Cross-site user ping succeeds

## HSRP

- [ ] `show standby brief`
- [ ] Start continuous ping from HQ VLAN 10 to 198.51.100.10
- [ ] Power off DIST1
- [ ] Verify gateway service recovers through DIST2
- [ ] Restore DIST1 and verify preemption

## DHCP / DNS

- [ ] HQ user receives address from central DHCP
- [ ] Branch user receives address through DHCP relay
- [ ] DNS resolves the configured internal test record

## ACL / Segmentation

- [ ] HQ Guest cannot reach 10.10.10.0/24, 10.10.20.0/24, 10.10.30.0/24, 10.10.50.0/24 or 10.10.99.0/24
- [ ] Branch Guest cannot reach enterprise private networks
- [ ] Guest users can reach the public test server
- [ ] DMZ server cannot initiate sessions to protected internal VLANs
- [ ] `show access-lists` demonstrates hit counters

## NAT / Internet Edge

- [ ] HQ user reaches public server through PAT
- [ ] Branch user reaches public server through PAT
- [ ] `show ip nat translations`
- [ ] Internet-side PC reaches `203.0.113.3:80`, translated to `10.10.50.10:80`

## Secure Management

- [ ] SSH from HQ IT/Admin VLAN succeeds
- [ ] Telnet fails
- [ ] SSH attempt from Guest VLAN fails
- [ ] `show ip ssh`
- [ ] `show running-config | section line vty`

## Access Port Security

- [ ] `show port-security interface f0/1`
- [ ] Sticky MAC learned
- [ ] Test a different endpoint on the secured access port and document the configured violation behavior

## Evidence to save

1. Final Packet Tracer topology screenshot
2. Final `.pkt` file
3. HSRP evidence
4. OSPF evidence
5. STP/EtherChannel evidence
6. ACL/NAT evidence
7. Successful/failed traffic test screenshots
8. One failover test
9. One troubleshooting/root-cause write-up
