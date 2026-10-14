# Jim Rodmark Camus — IT & Network Technology Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live%20Portfolio-jimcamus.vercel.app-0A66C2?style=for-the-badge)](https://jimcamus.vercel.app/)

A focused portfolio of production-style systems covering **network security, network operations, IT operations, systems administration, full-stack development, and collaborative applications**.

Rather than presenting many overlapping utilities, related projects have been consolidated into larger flagship platforms with shared workflows, stronger architecture, and clearer hiring value.

## Flagship Projects

### 1. PyreWall — Python-Based Next Generation Firewall

**Original desktop application:** [Sachibara/Pyrewall](https://github.com/Sachibara/Pyrewall)  
**Browser remake:** [Open Site](https://jimcamus.vercel.app/projects/pyrewall-web/)

Windows-focused NGFW and network-control application built with Python and PyQt6.

**Highlights**
- WinDivert packet filtering and Windows Firewall integration
- Website blocking using domain, DNS, TLS SNI, HTTP Host, and resolved-IP policy
- Connected-device discovery with IP/MAC visibility and block/unblock controls
- Administrator-managed application signatures
- Custom IP/port/protocol firewall rules
- Threat monitoring, logs, history, settings, backups, and user administration
- Browser remake that reproduces the original desktop workflow for portfolio viewing

**Core stack:** Python · PyQt6 · SQLite · WinDivert · Windows Firewall · Flask · JavaScript

---

### 2. OpsFusion — Unified IT Operations Platform

**Repository:** [Sachibara/HelpDesk-Pro](https://github.com/Sachibara/HelpDesk-Pro)  
**Live site:** [Open Site](https://opsfusion-it.vercel.app/)

A cloud-based IT operations platform integrating service desk, asset lifecycle management, workspace user records, and audit logging, with scheduled SLA, warranty, and maintenance alerts and Gemini-powered ticket analysis.

**Highlights**
- Service Desk tickets, priorities, linked assets, work notes, and activity history
- Editable endpoint inventory, asset linking and lifecycle management, maintenance tasks, and workspace identity records
- Duplicate prevention for identity names/usernames and asset names/tags/serials/endpoint links, with database enforcement
- Knowledge article creation, editing, full-text search, archiving, and restoration
- Hourly server-side SLA, warranty, and maintenance checks with alert deduplication and clearing
- Gemini ticket summaries and troubleshooting suggestions
- Approval-based `add_work_note` tool calling: owner review before execution, with expiry, stale-state checks, replay protection, and audit records
- Supabase authentication, PostgreSQL persistence, workspace isolation, and audit logging
- Version-checked cloud saves and 153 automated regression tests (verified 14 October 2026)

**Integration scope:** Endpoint telemetry, remote device control, and real Active Directory provisioning require additional integrations. Shared-company invitations and an employee self-service portal are not yet implemented. Portfolio Demo simulations are separate from the Cloud Workspace.

**Current application stack:** HTML5 · CSS3 · JavaScript · Supabase · PostgreSQL · Supabase Edge Functions (TypeScript/Deno) · Google Gemini API · Vercel

---

### 3. NetOps Enterprise — Unified Network Operations Platform

**Repository:** [Sachibara/NetOps-Command-Center](https://github.com/Sachibara/NetOps-Command-Center)  
**Live site:** [Open NetOps Enterprise](https://netops-enterprise.vercel.app/)

A unified network-operations platform created by consolidating the strongest functionality from multiple infrastructure and networking projects.

**Unified capabilities**
- NOC command center
- Logical network topology
- Shared device inventory
- Infrastructure health monitoring
- IPAM, VLAN, and subnet management
- Configuration backup, versioning, and change detection
- Guided network troubleshooting
- Network documentation and port mappings
- Alerts, incidents, and unified audit history
- Supabase-backed cloud workspace with Auth and RLS

**Consolidated modules**
- NetOps Command Center
- Infrastructure Health Monitor
- IPAM + Subnet Manager
- Network Config Backup Manager
- Network Troubleshooting Toolkit
- Network Documentation Generator

**Core stack:** JavaScript · Python · FastAPI · SQLite · Supabase · ICMP/DNS/TCP/ARP diagnostics

---

### 4. StudySync — LMS & Student Collaboration System

**Live site:** [Open StudySync](https://studysync-remod-demo.vercel.app//)

Academic collaboration and productivity platform for students and professors.

**Highlights**
- Student and professor authentication
- Group creation and membership workflows
- Task and calendar management
- File sharing and collaboration
- Group chat and notifications
- Assignment and progress workflows
- Supabase-backed application data

**Core stack:** Python · PyQt6 · Supabase · JavaScript · Web deployment

---

### 5. OmniShare — File Sharing Platform

**Live site:** [Open OmniShare](https://finalomnishare.vercel.app/)  
**Repository:** [Sachibara/final_omnishare](https://github.com/Sachibara/final_omnishare)

A browser-based file-sharing product focused on streamlined upload, sharing, and file-state workflows.

**Core stack:** HTML5 · CSS3 · JavaScript · Vercel

---

## Portfolio Strategy

The portfolio is intentionally limited to **five flagship systems**.

Smaller networking and IT-operations projects are preserved in GitHub for source history, but their public product experiences have been consolidated into **NetOps Enterprise** and **OpsFusion**. This demonstrates integrated system design instead of presenting many overlapping standalone demos.

## Security & Engineering Focus

Across the portfolio, the projects emphasize:

- role-based access control
- Supabase Row Level Security where cloud workspaces are used
- publishable-key-only browser integrations
- separation between public demo interfaces and privileged local agents
- explicit local/authorized network boundaries
- audit logging and traceability
- modular system architecture
- protected operational workflows
- deployment validation and CI checks

## Target Roles

This portfolio is designed to demonstrate skills relevant to:

- IT Support
- Network Support / Network Operations
- NOC Engineer
- Junior Systems Administrator
- Infrastructure Support
- Technical Support
- Junior Full-Stack / Internal Tools Developer

## About Me

**Jim Rodmark Camus**  
BSIT — Network Technology

My work focuses on practical IT operations, networking, cybersecurity, systems administration, and software tools that solve real operational problems.

### Main Portfolio

**https://jimcamus.vercel.app/**

### GitHub

**https://github.com/Sachibara**
