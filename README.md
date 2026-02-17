# Marketing Agent

A specialized marketing AI agent built with [Poncho](https://github.com/cesr/poncho-ai), equipped with 25+ marketing skills for SaaS and software companies.

> **Try it live** at [marketing-agent-lyart.vercel.app](https://marketing-agent-lyart.vercel.app/). Note that conversations are public. If you'd like a private instance, deploy your own:
>
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcesr%2Fmarketing-agent&env=ANTHROPIC_API_KEY&envDescription=API%20key%20needed%20to%20power%20the%20marketing%20agent&envLink=https%3A%2F%2Fconsole.anthropic.com%2Fsettings%2Fkeys)

![Marketing Agent](./assets/marketing-agent.png)

## What I Can Do

This agent is designed to help with a wide range of marketing tasks:

### Conversion & Optimization
- **Page CRO** — Optimize landing pages, homepages, pricing pages for conversions
- **Signup Flow CRO** — Reduce friction in registration and trial signup flows
- **Onboarding CRO** — Improve post-signup activation and time-to-value
- **Form CRO** — Optimize lead capture, contact, and demo request forms
- **Popup CRO** — Create and optimize modals, overlays, and exit-intent popups
- **Paywall/Upgrade CRO** — Design in-app upgrade screens and feature gates
- **A/B Test Setup** — Plan and design experiments with proper hypotheses

### Content & Copy
- **Copywriting** — Write marketing copy for any page type
- **Copy Editing** — Edit and improve existing marketing copy
- **Content Strategy** — Plan what content to create and topics to cover
- **Social Content** — Create platform-specific content for LinkedIn, Twitter/X, etc.
- **Email Sequences** — Build drip campaigns, nurture sequences, and lifecycle emails

### SEO & Growth
- **SEO Audit** — Diagnose technical SEO issues and on-page problems
- **Programmatic SEO** — Create template-based pages at scale
- **Schema Markup** — Add structured data for rich snippets
- **Competitor/Alternative Pages** — Create comparison and alternative pages

### Strategy & Planning
- **Pricing Strategy** — Help with pricing, packaging, and monetization decisions
- **Launch Strategy** — Plan product launches and feature announcements
- **Free Tool Strategy** — Design engineering-as-marketing tools for lead gen
- **Referral Programs** — Create and optimize referral/affiliate programs
- **Marketing Ideas** — 139 proven marketing approaches organized by category
- **Marketing Psychology** — 70+ mental models for persuasion and behavior

### Tracking & Analysis
- **Analytics Tracking** — Set up GA4, GTM, conversion tracking, and UTM parameters
- **Product Marketing Context** — Create foundational positioning documents

## Marketing Skills Source

All marketing skills are sourced from [marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines.

## Prerequisites

- Node.js 20+
- npm (or pnpm/yarn)
- Anthropic or OpenAI API key

## Quick Start

```bash
npm install
# If you didn't enter an API key during init:
cp .env.example .env
# Then edit .env and add your API key
poncho dev
```

Open `http://localhost:3000` for the web UI.

On your first interactive session, the agent introduces its configurable capabilities.
While a response is streaming, you can stop it:
- Web UI: click the send button again (it switches to a stop icon)
- Interactive CLI: press `Ctrl+C`

Stopping is best-effort and keeps partial assistant output/tool activity already produced.

## Common Commands

```bash
# Local web UI + API server
poncho dev

# Local interactive CLI
poncho run --interactive

# One-off run
poncho run "Your task here"

# Run tests
poncho test

# List available tools
poncho tools
```

## Add Skills

Install skills from a local path or remote repository, then verify discovery:

```bash
# Install all skills from a source package/repo
poncho skills add <repo-or-path>

# Install one specific skill path from a source
poncho skills add <repo-or-path> <relative-skill-path>

# Remove all installed skills from a source
poncho skills remove <repo-or-path>

# Remove one installed skill path from a source
poncho skills remove <repo-or-path> <relative-skill-path>

# List installed skills
poncho skills list

# Verify loaded tools
poncho tools
```

`poncho skills add` copies discovered skill directories (folders that contain `SKILL.md`) into `skills/<source>/...`.
If a destination folder already exists, the command fails instead of overwriting files.
`poncho add` and `poncho remove` remain available as aliases.

After adding skills, run `poncho dev` or `poncho run --interactive` and ask the agent to use them.

## Configure MCP Servers (Remote)

Connect remote MCP servers and expose their tools to the agent:

```bash
# Add remote MCP server
poncho mcp add --url https://mcp.example.com/github --name github --auth-bearer-env GITHUB_TOKEN

# List configured servers
poncho mcp list

# Discover MCP tools and print frontmatter intent snippets
poncho mcp tools list github
poncho mcp tools select github

# Remove a server
poncho mcp remove github
```

Set required secrets in `.env` (for example, `GITHUB_TOKEN=...`).

## Tool Intent and Approvals in Frontmatter

Declare tool intent directly in `AGENT.md` and `SKILL.md` frontmatter:

```yaml
allowed-tools:
  - mcp:github/list_issues
  - mcp:github/*
approval-required:
  - mcp:github/create_issue
  - ./scripts/deploy.ts
```

How it works:

- `AGENT.md` provides fallback MCP intent when no skill is active.
- `SKILL.md` intent applies when you activate that skill (`activate_skill`).
- Scripts in a sibling `scripts/` directory are available by convention.
- For non-standard script folders (for example `tools/`), add explicit relative entries in `allowed-tools`.
- Use `approval-required` to require human approval for specific MCP calls or script files.
- Deactivating a skill (`deactivate_skill`) removes its MCP tools from runtime registration.

Pattern format is strict slash-only:

- MCP: `server/tool`, `server/*`
- Scripts: relative paths such as `./scripts/file.ts`, `./scripts/*`, `./tools/deploy.ts`

Skill authoring guardrails:

- Every `SKILL.md` must include YAML frontmatter between `---` markers.
- Include at least `name` (required for discovery) and `description`.
- Put tool intent in frontmatter using `allowed-tools` and `approval-required`.
- `approval-required` is stricter than allowed access:
  - MCP entries in `approval-required` must also appear in `allowed-tools`.
  - Script entries outside `./scripts/` must also appear in `allowed-tools`.
- Keep MCP server connection details in `poncho.config.js`, not in `SKILL.md`.

## Configuration

Core files:

- `AGENT.md`: behavior, model selection, runtime guidance
- `poncho.config.js`: runtime config (storage, auth, telemetry, MCP, tools)
- `.env`: secrets and environment variables

Example `poncho.config.js`:

```javascript
export default {
  storage: {
    provider: "local", // local | memory | redis | upstash | dynamodb
    memory: {
      enabled: true,
      maxRecallConversations: 20,
    },
  },
  auth: {
    required: false,
  },
  telemetry: {
    enabled: true,
  },
  mcp: [
    {
      name: "github",
      url: "https://mcp.example.com/github",
      auth: { type: "bearer", tokenEnv: "GITHUB_TOKEN" },
    },
  ],
  tools: {
    defaults: {
      list_directory: true,
      read_file: true,
      write_file: true, // still gated by environment/policy
    },
    byEnvironment: {
      production: {
        read_file: false, // example override
      },
    },
  },
};
```

## Project Structure

```
marketing-agent/
├── AGENT.md           # Agent definition and system prompt
├── poncho.config.js   # Configuration (MCP servers, auth, etc.)
├── package.json       # Dependencies
├── .env.example       # Environment variables template
├── tests/
│   └── basic.yaml     # Test suite
└── skills/
    ├── starter/
    │   ├── SKILL.md
    │   └── scripts/
    │       └── starter-echo.ts
    └── fetch-page/
        ├── SKILL.md
        └── scripts/
            └── fetch-page.ts
```

## Deployment

```bash
# Build for Vercel
poncho build vercel
cd .poncho-build/vercel && vercel deploy --prod

# Build for Docker
poncho build docker
docker build -t marketing-agent .
```

For full reference:
https://github.com/cesr/poncho-ai
