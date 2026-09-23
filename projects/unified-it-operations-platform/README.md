# OpsFusion — Unified IT Operations Platform

This branch contains the first **real unification build** of OpsFusion.

It replaces the earlier standalone visual prototype with a shared-data browser application that integrates the functionality of:

1. Network Troubleshooting Toolkit
2. LAN Deployment & Remote Support Console
3. Network Documentation Generator
4. Patch & Endpoint Compliance Dashboard
5. OpsFusion unified overview, incidents, audit, search, and settings

The four standalone portfolio systems remain unchanged on `main`. This branch is the integration workbench for Project #15.

## What is actually unified

OpsFusion no longer treats the modules as unrelated screens.

A single shared endpoint record is used by:

- endpoint inventory
- troubleshooting and diagnostics
- remote support
- network/device documentation
- endpoint compliance
- incident/remediation workflows
- global search
- audit history

Examples of cross-module behavior:

- a failed diagnostic can create an incident tied to the affected endpoint
- a compliance failure can create a remediation ticket
- remote support actions are written to the same audit log as documentation and compliance changes
- network documentation automatically uses the shared endpoint inventory
- an endpoint opened from the inventory can be sent directly to troubleshooting or remote support
- workspace export/import preserves the entire unified state

## Current modules

### Overview

- unified health score
- endpoint count
- agent availability
- compliance rate
- open incidents
- recorded diagnostics
- attention queue
- incident summary
- unified operational timeline

### Endpoint Inventory

- shared endpoint source of truth
- hostname, IP, site, owner, OS/platform, type, model
- agent online/offline state
- compliance posture
- filtering and search
- endpoint detail view
- add endpoint workflow

### Network Troubleshooting

- guided endpoint diagnostics
- reachability
- gateway checks
- DNS checks
- internet reachability
- TCP port checks
- route/trace interpretation
- full guided diagnostic
- interpreted findings
- incident creation from diagnostic results
- IPv4/CIDR calculator

Real probes are deliberately not performed by the public browser build. A future authorized local agent can replace the seeded/simulated diagnostic adapter without changing the shared application model.

### Remote Support

- managed endpoint selection
- system information
- software inventory
- disk health
- network diagnostics
- log collection
- approved service-restart workflow
- ticket/change reference requirement for state-changing actions
- endpoint online/offline gating
- unified remote-action history

No arbitrary command shell is exposed.

### Network Documentation

- device inventory generated from shared endpoint state
- logical topology grouped by site
- VLAN/IP plan
- switch-port mappings
- documentation change notes
- printable network documentation
- documentation audit events

### Patch & Endpoint Compliance

- configurable missing-update threshold
- reboot-age policy
- antivirus/EDR requirement
- firewall requirement
- BitLocker/disk-encryption requirement
- per-endpoint compliance evaluation
- fleet compliance score
- remediation ticket creation
- optional automatic remediation incident creation

### Incidents

- unified incident queue
- endpoint association
- priority
- status workflow
- source attribution
- tickets created from troubleshooting/compliance or manually
- incident status changes added to the audit trail

### Audit & Search

- one audit history across all modules
- module filtering
- audit search
- global search across endpoints, incidents, and VLAN records
- full workspace JSON export/import

## Persistence

The current integration build uses browser `localStorage` under:

`opsfusion_unified_v1`

This keeps the portfolio build fully interactive without pretending a public demo has access to enterprise infrastructure.

The data model is intentionally structured so a later API/database layer can replace browser persistence while preserving the module contracts.

## Safety and production boundary

The portfolio version:

- does not scan arbitrary networks
- does not execute arbitrary shell commands
- does not remotely control unmanaged machines
- does not store real enterprise credentials
- requires a ticket/change reference for simulated state-changing support actions
- labels real agent/backend integration as a later deployment layer

A production version would use an authenticated local/enterprise agent, role-based authorization, server-side audit storage, secrets management, and a database/API backend.

## Branch strategy

- `main` — public portfolio; Project #15 remains unlaunched
- `opsfusion-unification` — active unification development
- Projects #1–#4 remain independently testable on the public portfolio

## Next integration phases

After this unified browser model is validated:

1. add a formal backend adapter/API boundary
2. add persistent server-side database storage
3. integrate HelpDesk Pro ticket semantics more deeply
4. integrate IT Asset Manager lifecycle data
5. integrate AD User Provisioning identity workflows
6. add authenticated roles and permissions
7. add real authorized endpoint/monitoring agent support
8. add automated testing and production deployment only after the unified build is approved
