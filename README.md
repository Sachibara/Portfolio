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

### 2. OpsFusion — IT Operations & Employee Support

**Repository:** [Sachibara/HelpDesk-Pro](https://github.com/Sachibara/HelpDesk-Pro)  
**IT Workspace:** [Open workspace](https://opsfusion-it.vercel.app/) · **Employee Support Portal:** [Get support](https://opsfusion-it.vercel.app/employee)

OpsFusion connects a shared IT operations workspace with an employee support portal. Workspace owners manage individual staff accounts; authorized members handle tickets, inventory, Knowledge Base articles, AI-assisted work notes and scheduled alerts. Employees submit and track their own requests through a separate portal.

**Highlights**
- Independent workspace registration with email confirmation; authorized accounts can switch between their workspaces
- Owner-only member provisioning, existing-account grants and membership removal; members use their own credentials and can change their passwords
- Portal registration alone grants no IT workspace access; an owner can explicitly add a portal account as a member while retaining its portal enrollment
- Guided employee requests, search, status filters, recovery and public conversations with IT; portal-only users cannot see internal notes or other employees' requests
- Service desk, endpoint inventory, assets, identities and maintenance with database-enforced duplicate prevention and version-checked saves
- Named audit entries with account IDs and server-derived name/email snapshots retained after membership removal
- Gemini ticket analysis grounded in active Knowledge Base articles through keyword retrieval with validated citation IDs
- Approval-based `add_work_note` proposals reviewed by the requesting owner or authorized editor, with expiry, stale-state checks, replay protection and audit records
- Hourly SLA, warranty and maintenance scans; authorized editors can configure rules, acknowledge alerts and run checks
- **191 automated tests passed** on 18 October 2026, plus rollback-only database permission tests; signed-in multi-account browser acceptance and live provider/email checks remain outstanding

**Integration scope:** Endpoint telemetry, remote device control and Active Directory provisioning require separate integrations. Automated employee invitations, attachments, request-update emails, employee-facing Knowledge Base/AI and vector retrieval are not implemented. Owner-provisioned member accounts use an initial password shared privately; provisioning does not create an email inbox or send credentials.

**Current application stack:** HTML5 · CSS3 · JavaScript · Supabase Auth · PostgreSQL · Edge Functions (TypeScript/Deno) · Google Gemini API · Vercel

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

## Layout preview (`/next`)

A redesigned homepage lives at `/next` so it can be reviewed before it replaces the current one. It keeps the same content and lime identity, with a larger headline hero, numbered project cards with counted filter tabs, metric blocks, skills that link to the builds they were used in, and a footer wordmark. It is marked `noindex`, and the Ctrl+K search is not part of it.

**Portfolio assistant.** The preview has an "Ask about my work" panel.

- By default it shows pre-written answers matched by keyword, entirely in the browser. No account, key or cost.
- Optional AI mode: add a `GEMINI_API_KEY` environment variable to the Vercel project (and redeploy). `api/ask.js` then answers through Google's Gemini API, restricted to the portfolio facts written in that file. The key stays on the server; the endpoint only accepts requests from this site and limits each address to 8 questions a minute. `GEMINI_MODEL` overrides the model name.
- Voice input and read-aloud use the browser's built-in speech features where available.

Checks: `node scripts/check-next.mjs` and `node scripts/check-assistant.mjs` (the latter uses a fake Gemini, so it runs offline).

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
