# Cocapn Workers

Cloudflare Workers for the Cocapn Fleet — crab-trap demos and image generation.

## Structure

```
├── workers/
│   └── crab-image-generator/   # Cloudflare Worker for AI image generation
├── crab-trap-demo/             # Crab Trap pattern demo pages
│   ├── cocapn.ai/
│   ├── deckboss.ai/
│   ├── fishinglog.ai/
│   └── purplepincher.org/
```

## Crab Image Generator

Generates purple pincher hermit crab images with steampunk lighthouse radar vibes.

**Endpoint:** Your deployed worker URL

**Parameters:**
- `prompt` (string) — Image description
- `steps` (int, 1-30) — Generation steps
- `width`/`height` (int, max 1024) — Image dimensions

**Example:**
```
https://your-worker.workers.dev/?prompt=purple+pincher+hermit+crab+steampunk+lighthouse
```

**Model:** `@cf/stabilityai/stable-diffusion-xl-base-1-0`

## Crab Trap Demo

The Crab Trap pattern demonstrates how external AIs (Grok, DeepSeek, Kimi) can use our MCP tools to fetch and display content on our domains.

**Flow:** External AI → Cocapn MCP (crab-trap:4042) → Our Domain

Each domain folder contains a demo page that shows:
- Working MCP tool integration
- External chatbot connections
- Steampunk lighthouse radar UI

## Deploy Image Generator

```bash
cd workers/crab-image-generator
wrangler deploy
```

Requires `CF_API_TOKEN` and `ACCOUNT_ID` in wrangler secrets.

## Deploy Crab Trap Demos

Host the contents of each domain folder at `/crab-trap` or `/demo` on:
- cocapn.ai
- deckboss.ai
- fishinglog.ai
- purplepincher.org
