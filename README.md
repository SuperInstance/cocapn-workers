# Cocapn Workers

Cloudflare Workers for the cocapn fleet.

## workers/crab-image-generator

Generates images of purple pincher hermit crabs with steampunk lighthouse radar vibes.

### Usage

```
GET /?prompt=your%20prompt%20here
GET /?p=hermit%20crab%20steampunk
```

Returns JSON with `image` field (base64 encoded PNG).

### Deploy

```bash
cd workers/crab-image-generator
npx wrangler deploy
```

Requires `CF_API_TOKEN` and `ACCOUNT_ID` environment variables.
