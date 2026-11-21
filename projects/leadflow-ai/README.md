# LeadFlow AI — Smart Business Lead Engine

An interactive, privacy-safe portfolio showcase of a Zapier lead automation workflow.

**Live demo:** https://jimcamus.vercel.app/projects/leadflow-ai/

## What it demonstrates

The original private Zapier account export was inspected to verify the architecture. It contains **19 nodes** and a form-triggered pipeline with filtering, AI-assisted qualification, record lookup/updates, and four conditional paths:

| Path | Exported condition | Follow-up action |
| --- | --- | --- |
| A | Hot | Slack direct message and Zapier Tables update |
| B | Warm | AI-assisted draft, Gmail draft and Zapier Tables update |
| C | Cold | Zapier Tables update |
| D | Needs human review | Zapier Tables update and Zapier Mail message |

The demonstration recreates these routing concepts with **fictional sample leads**. Visitors can submit a sample inquiry and watch it choose a path, view a sample action, and inspect a small local activity history.

## Scope and privacy

- **Simulation, not a production Zapier deployment.** No actual LLM request, Gmail draft, Slack notification, webhook, database write, or email is executed.
- Lead classification in the demo uses clear browser-side, illustrative rules; it does **not** expose or claim to reproduce private AI prompt instructions.
- **No original Zapier export is published.** That export can contain account IDs, internal app references, proprietary prompts, and other potentially sensitive configuration.
- No credentials, OAuth tokens, private webhook URLs, customer records, personal lead data, or private business identifiers are included.
- User input stays in browser memory and is not persisted or transmitted.

## Project files

- \`index.html\` — responsive, accessible interactive demo, with embedded CSS and JavaScript
- \`workflow-map.json\` — sanitized, high-level public workflow architecture
- \`README.md\` — technical description, boundaries, and review notes

## Running locally

Open \`index.html\` in any modern browser. No paid APIs, database, node packages, or build step required.

The portfolio's existing Vercel static deployment serves the demo from \`/projects/leadflow-ai/\`.

## Technical notes

- Client-side form validation, deterministic classification, routing visualization, outcome previews, and ephemeral activity list.
- Input is always inserted using \`textContent\` / DOM text nodes to avoid script injection.
- Responsive layout with keyboard-visible focus and reduced-motion support.
- A future real client deployment would require an approved Zapier plan or a rebuilt n8n workflow, client-authorized integrations, error handling, monitoring, and secure credential storage.

**Author:** Jim Rodmark H. Camus · https://jimcamus.vercel.app/