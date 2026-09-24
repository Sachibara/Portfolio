# Project Report — Resilient Enterprise Campus & Branch Network

## Business Requirement

A medium enterprise needs a headquarters campus and remote branch with resilient gateway service, secure Internet access, centralized services, guest wireless isolation, a publicly reachable DMZ web server, and secure remote administration.

## Design Decisions

### Dual Distribution at HQ
Two multilayer switches provide default-gateway redundancy through HSRP. VLAN active roles are intentionally split to use both switches during normal operation.

### Rapid-PVST Alignment
Spanning-tree root placement follows HSRP active roles to avoid inefficient Layer-2 forwarding paths.

### LACP Distribution Interconnect
The distribution switches use a two-link LACP EtherChannel to increase inter-switch capacity and tolerate a member-link failure.

### OSPF
HQ routed links and the WAN participate in area 0. Branch LANs use area 10, making BR1 an ABR. The design demonstrates area separation and branch summarization.

### Central DHCP / DNS
A server in HQ VLAN 30 provides DHCP and DNS. Remote VLANs use `ip helper-address`, demonstrating centralized service delivery across routed boundaries.

### Internet Edge
EDGE1 owns the Internet default route, performs PAT for private enterprise networks, publishes the DMZ web server through static NAT, and originates the OSPF default route.

### Security
Guest traffic is restricted from enterprise RFC1918 networks. DMZ-to-inside initiation is blocked. Network devices use SSH-only VTY access restricted to the IT administration subnet. Access ports use port security.

## Failure Scenarios

- HSRP gateway failover
- Distribution routed-uplink failure
- EtherChannel member failure
- Guest policy deny
- DMZ static NAT test
- SSH/Telnet management-policy test

## Scope Boundaries

This is a Packet Tracer enterprise routing/switching project. It intentionally does not pretend to emulate production NGFW, SD-WAN, cloud, 802.1X, or advanced BGP policy features beyond what is appropriate for this simulator and project scope.

## Recruiter Discussion Points

Be prepared to explain:
- why HSRP and STP roles should align
- why OSPF area 0 carries the WAN
- how a branch summary reduces route detail
- difference between PAT and static NAT
- why a DMZ should not initiate traffic into protected VLANs
- what happens during HSRP or OSPF reconvergence
- how you would troubleshoot a client that receives DHCP but cannot access the Internet
- how this design would change with a real firewall pair, redundant ISP links, 802.1X, and enterprise wireless controllers
