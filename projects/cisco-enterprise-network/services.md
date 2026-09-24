# Services Plan

## Central DHCP/DNS Server

Server:
- IP: `10.10.30.10/24`
- Default gateway: `10.10.30.1`
- DNS service: enabled
- Suggested internal record: `intranet.corp.lab → 10.10.30.20`

## DHCP Pools

| Pool | Network | Default Gateway | Suggested Range |
|---|---|---|---|
| HQ-USERS | 10.10.10.0/24 | 10.10.10.1 | 10.10.10.50–200 |
| HQ-IT | 10.10.20.0/24 | 10.10.20.1 | 10.10.20.50–150 |
| HQ-GUEST | 10.10.40.0/24 | 10.10.40.1 | 10.10.40.50–220 |
| BR-USERS | 10.20.10.0/24 | 10.20.10.1 | 10.20.10.50–200 |
| BR-GUEST | 10.20.20.0/24 | 10.20.20.1 | 10.20.20.50–220 |

DNS server for all pools: `10.10.30.10`

## DMZ Web Server

- Private IP: `10.10.50.10/24`
- Gateway: `10.10.50.1`
- Public static NAT: `203.0.113.3`
- Publish TCP/80 and TCP/443

## Public Test Server

- IP: `198.51.100.10/24`
- Gateway: `198.51.100.1`
- Used to verify PAT and outside-to-DMZ access.

## Guest Wireless

Connect a Packet Tracer access point to:
- HQ ASW1 guest access port, VLAN 40
- Branch BR-SW1 guest access port, VLAN 120

Suggested SSIDs:
- `CORP-GUEST-HQ`
- `CORP-GUEST-BR`

Use a lab-only WPA2 pre-shared key. Do not reuse a real password.
