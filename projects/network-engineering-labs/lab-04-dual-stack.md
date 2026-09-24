# Lab 04 — Dual-Stack IPv4/IPv6 Campus

## Scenario

Build a two-site network where IPv4 and IPv6 operate simultaneously. IPv4 uses OSPFv2 while IPv6 uses OSPFv3. LAN clients receive IPv6 addressing with SLAAC; optional stateless DHCPv6 provides DNS information.

## Skills Demonstrated

IPv6 planning · dual-stack operation · OSPFv2 · OSPFv3 · SLAAC · DHCPv6 concepts · router-on-a-stick · IPv4/IPv6 troubleshooting

## Addressing

### Site A
- VLAN 10 IPv4: `10.60.10.0/24`
- VLAN 10 IPv6: `2001:db8:60:10::/64`
- VLAN 20 IPv4: `10.60.20.0/24`
- VLAN 20 IPv6: `2001:db8:60:20::/64`

### Site B
- VLAN 30 IPv4: `10.70.30.0/24`
- VLAN 30 IPv6: `2001:db8:70:30::/64`
- VLAN 40 IPv4: `10.70.40.0/24`
- VLAN 40 IPv6: `2001:db8:70:40::/64`

### Transit
- IPv4: `10.255.60.0/30`
- IPv6: `2001:db8:ffff:60::/64`

## R1

```ios
hostname R1
ipv6 unicast-routing

interface g0/0
 no shutdown

interface g0/0.10
 encapsulation dot1Q 10
 ip address 10.60.10.1 255.255.255.0
 ipv6 address 2001:DB8:60:10::1/64
 ipv6 ospf 10 area 0

interface g0/0.20
 encapsulation dot1Q 20
 ip address 10.60.20.1 255.255.255.0
 ipv6 address 2001:DB8:60:20::1/64
 ipv6 ospf 10 area 0

interface g0/1
 ip address 10.255.60.1 255.255.255.252
 ipv6 address 2001:DB8:FFFF:60::1/64
 ipv6 ospf 10 area 0
 no shutdown

router ospf 10
 router-id 1.1.1.1
 network 10.60.10.0 0.0.0.255 area 0
 network 10.60.20.0 0.0.0.255 area 0
 network 10.255.60.0 0.0.0.3 area 0

ipv6 router ospf 10
 router-id 1.1.1.1
```

## R2

```ios
hostname R2
ipv6 unicast-routing

interface g0/0
 no shutdown

interface g0/0.30
 encapsulation dot1Q 30
 ip address 10.70.30.1 255.255.255.0
 ipv6 address 2001:DB8:70:30::1/64
 ipv6 ospf 10 area 0

interface g0/0.40
 encapsulation dot1Q 40
 ip address 10.70.40.1 255.255.255.0
 ipv6 address 2001:DB8:70:40::1/64
 ipv6 ospf 10 area 0

interface g0/1
 ip address 10.255.60.2 255.255.255.252
 ipv6 address 2001:DB8:FFFF:60::2/64
 ipv6 ospf 10 area 0
 no shutdown

router ospf 10
 router-id 2.2.2.2
 network 10.70.30.0 0.0.0.255 area 0
 network 10.70.40.0 0.0.0.255 area 0
 network 10.255.60.0 0.0.0.3 area 0

ipv6 router ospf 10
 router-id 2.2.2.2
```

## Optional Stateless DHCPv6 on R1

If your Packet Tracer IOS image supports the commands:

```ios
ipv6 dhcp pool V6-INFO
 dns-server 2001:4860:4860::8888
 domain-name corp.example

interface g0/0.10
 ipv6 nd other-config-flag
 ipv6 dhcp server V6-INFO
```

SLAAC still supplies the host address/default gateway; DHCPv6 supplies additional information.

## Access Switch

```ios
vlan 10
vlan 20

interface g0/1
 switchport mode trunk

interface range f0/1-12
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast

interface range f0/13-20
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
```

Use VLANs 30/40 at Site B.

## Verification

```ios
show ip ospf neighbor
show ip route ospf
show ipv6 ospf neighbor
show ipv6 route ospf
show ipv6 interface brief
ping 10.70.30.10
ping 2001:DB8:70:30::10
traceroute 10.70.30.10
traceroute 2001:DB8:70:30::10
```

## Portfolio Evidence

Show the same endpoint successfully communicating across sites over both IPv4 and IPv6. Include both routing tables and OSPF neighbor outputs.
