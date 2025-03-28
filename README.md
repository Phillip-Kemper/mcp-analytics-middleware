# MCP Analytics Middleware

[![npm version](https://img.shields.io/npm/v/mcp-analytics-middleware.svg)](https://www.npmjs.com/package/mcp-analytics-middleware)
[![npm downloads](https://img.shields.io/npm/dm/mcp-analytics-middleware.svg)](https://www.npmjs.com/package/mcp-analytics-middleware)

![MCP Analytics Ad](https://github.com/user-attachments/assets/b9296515-a8e6-4957-a212-705d50004703)

A simple way to track and visualize how your MCP server is being used. See which tools are most popular, catch errors early, and understand your server's performance.

## Features

- 🔍 Track all tool calls and resource requests
- 📊 See performance metrics and error rates
- 🌐 Beautiful web dashboard for live analytics
- 💾 SQLite database for persistent storage

## Quick Start

1. Install the package:
```bash
yarn add mcp-analytics-middleware
```

2. Add it to your MCP server:
```typescript
import { McpAnalytics } from 'mcp-analytics-middleware';

let server = new McpServer({ 
name: 'Sample MCP Server with Analytics',
version: '1.0.0'
});

const analytics = new McpAnalytics('analytics.db');

server = analytics.enhance(server); // override tool and resource function implementation to record usage in sqlite
```

## Live Analytics

Want to see a dashboard for a Tyescript SDK MCP Server making use of this middleware? You can directly provide a live dashboard using

```bash
npx -p mcp-analytics-middleware web-viewer --db-path analytics.db

```
The web dashboard will open at http://localhost:8080 and show you live analytics!

You'll see:
- Total tool calls and resource requests
- Error rates and performance metrics
- Most used tools and slowest operations
- Daily usage patterns
- And it all updates automatically every 5 seconds!

## Example Implementations
Example implementatinos of the analytics middleware can be found.
1. Dummy Caluclator Server Example [src/server.ts](https://github.com/Phillip-Kemper/mcp-analytics-middleware/blob/main/src/server.ts)
2. Ethereum RPC MCP Server with Analytics [server/index.ts](https://github.com/Phillip-Kemper/ethereum-rpc-mpc/blob/main/server/index.ts)_
3. Forked Verision of the Google Maps MCP Server with additional Analytics Middleware  [src/google-maps/index.ts](https://github.com/Phillip-Kemper/servers-google-maps-analytics/blob/main/src/google-maps/index.ts)

## Running with Inspector

If you're using the MCP Inspector, just add the analytics flag:

```bash
yarn inspector
```

## License

MIT
