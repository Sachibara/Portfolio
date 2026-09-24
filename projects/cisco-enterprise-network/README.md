# Cisco Packet Tracer — Resilient Enterprise Campus & Branch Network

A recruiter-facing enterprise network engineering case study for the Jim Rodmark Camus portfolio.

## Project Goal

Design and document a secure, resilient enterprise network that demonstrates CCNA-level and early-career Network Engineer skills in one coherent Cisco Packet Tracer topology.

### Major technologies

- VLANs and 802.1Q
- Layer-3 switching
- HSRP gateway redundancy
- Rapid-PVST
- LACP EtherChannel
- OSPFv2, including a branch area and summarization
- Centralized DHCP/DNS with DHCP relay
- NAT/PAT
- Static NAT for a DMZ web service
- Extended ACLs
- Guest network isolation
- SSH-only network management
- Switch port security
- Structured failure testing and troubleshooting

## Important authenticity note

This repository contains the **complete design package, addressing, IOS configurations, service definitions, and verification plan**.

Cisco Packet Tracer's `.pkt` format is proprietary and must be created/saved from the Cisco Packet Tracer desktop application itself. Do not claim simulator execution until the `.pkt` file and screenshots have actually been produced in Packet Tracer.

## Topology Summary

- HQ: EDGE1, DIST1, DIST2, ASW1, ASW2
- Branch: BR1 and BR-SW1
- Central DHCP/DNS server in HQ VLAN 30
- DMZ web server in HQ VLAN 50
- Simulated ISP and public test server
- Dual HQ distribution with HSRP and Rapid-PVST
- OSPF area 0 across HQ/WAN; Branch LANs in area 10
- PAT for enterprise users; static NAT for DMZ web publishing

## Artifacts

- [Addressing Plan](./addressing-plan.csv)
- [Services / DHCP-DNS Plan](./services.md)
- [Verification Checklist](./verification-checklist.md)
- [Project Report](./project-report.md)
- [Device Configurations](./configs/)

## CV-ready wording — use after the Packet Tracer build is completed

> Designed, configured, and validated a Cisco Packet Tracer enterprise campus and branch network using HSRP, Rapid-PVST, LACP EtherChannel, multi-area OSPF, VLAN segmentation, DHCP relay, ACLs, NAT/PAT, DMZ publishing, SSH hardening, and structured failover testing.

Never claim the validation portion until you have actually completed the simulator tests.
