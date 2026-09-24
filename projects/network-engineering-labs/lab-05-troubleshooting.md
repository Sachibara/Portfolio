# Lab 05 — Enterprise Troubleshooting Challenge

## Objective

Demonstrate a structured troubleshooting method rather than simply building a working topology.

Start from a functioning small enterprise topology, inject the faults below, then diagnose them without immediately looking at the solution key.

## Base Topology

- HQ router using OSPF toward Branch router
- Branch router-on-a-stick with VLAN 10 Users and VLAN 20 Operations
- DHCP provided by a server at HQ
- access switch with trunk to branch router
- extended ACL controlling cross-VLAN access
- access-port port security

## Fault Set

### Incident 1 — VLAN 20 clients cannot reach their gateway
**Injected fault:** trunk allowed list omits VLAN 20.

Broken switch configuration:

```ios
interface g0/1
 switchport mode trunk
 switchport trunk allowed vlan 10
```

Useful commands:
```ios
show interfaces trunk
show vlan brief
show interfaces g0/1 switchport
```

Fix:
```ios
interface g0/1
 switchport trunk allowed vlan 10,20
```

---

### Incident 2 — Branch clients do not receive DHCP
**Injected fault:** wrong helper address.

Broken:
```ios
interface g0/0.10
 ip helper-address 10.10.30.99
```

Correct DHCP server:
```ios
interface g0/0.10
 ip helper-address 10.10.30.10
```

Evidence:
```ios
show running-config interface g0/0.10
show ip interface g0/0.10
```

---

### Incident 3 — HQ and branch routes disappear
**Injected fault:** OSPF area mismatch on the transit link.

HQ:
```ios
network 10.255.10.0 0.0.0.3 area 0
```

Broken branch:
```ios
network 10.255.10.0 0.0.0.3 area 10
```

Fix branch to area 0.

Diagnosis:
```ios
show ip ospf neighbor
show ip ospf interface
show ip protocols
```

---

### Incident 4 — Users can reach IP addresses but DNS fails
**Injected fault:** ACL blocks UDP/53 toward the DNS server.

Broken ACL:
```ios
ip access-list extended USER-IN
 deny udp 10.20.10.0 0.0.0.255 host 10.10.30.10 eq 53
 permit ip any any
```

Fix by permitting DNS before broader restrictions:
```ios
ip access-list extended USER-IN
 permit udp 10.20.10.0 0.0.0.255 host 10.10.30.10 eq 53
 permit tcp 10.20.10.0 0.0.0.255 host 10.10.30.10 eq 53
 permit ip any any
```

Verification:
```ios
show access-lists USER-IN
```

---

### Incident 5 — One PC suddenly loses access after moving switch ports
**Injected fault:** sticky port-security learned a different MAC.

Diagnosis:
```ios
show port-security
show port-security interface f0/5
show interfaces status
```

Recovery:
```ios
interface f0/5
 shutdown
 no switchport port-security mac-address sticky
 switchport port-security mac-address sticky
 no shutdown
```

---

### Incident 6 — Branch can reach HQ but not the Internet
**Injected fault:** HQ default route exists but OSPF is not originating it.

Diagnosis:
```ios
show ip route
show ip route 0.0.0.0
show ip protocols
```

Fix:
```ios
router ospf 10
 default-information originate
```

---

### Incident 7 — A user PC can reach its subnet but not other VLANs
**Injected fault:** incorrect PC default gateway.

Example:
- VLAN 10 subnet: `10.20.10.0/24`
- Correct gateway: `10.20.10.1`
- Broken PC gateway: `10.20.10.254`

Use:
- `ipconfig`
- local gateway ping
- ARP table
- router subinterface verification

## Troubleshooting Workflow to Present

Use this sequence in your portfolio write-up:

1. **Define the symptom** — who/what is affected?
2. **Establish scope** — one host, one VLAN, one site, or all sites?
3. **Start at Layer 1/2** — interface state, VLAN membership, trunking, STP, MAC learning.
4. **Validate Layer 3** — addressing, gateway, ARP, routing table.
5. **Validate control plane** — OSPF neighbors/database/routes.
6. **Validate policy/services** — ACL, DHCP, DNS, NAT.
7. **Apply one change at a time.**
8. **Verify service restoration.**
9. **Record root cause and prevention.**

## Incident Report Template

For every fault, document:

| Field | Entry |
|---|---|
| Incident ID | NET-LAB-00X |
| Symptom | |
| Scope | |
| Initial hypothesis | |
| Commands used | |
| Root cause | |
| Corrective action | |
| Verification | |
| Preventive action | |

## Recruiter Evidence

The strongest version of this lab includes screenshots of:
- the broken behavior
- CLI evidence used to isolate the fault
- corrected configuration
- successful verification
- a short root-cause analysis

This lab is intentionally more valuable than another clean build because real Network Engineer work is heavily troubleshooting-oriented.
