# MCP Analytics Middleware

[![npm version](https://img.shields.io/npm/v/ethereum-rpc-mpc.svg)](https://www.npmjs.com/package/mcp-analytics-middleware)
[![npm downloads](https://img.shields.io/npm/dm/ethereum-rpc-mpc.svg)](https://www.npmjs.com/package/mcp-analytics-middleware)

A simple way to track and visualize how your MCP server is being used. See which tools are most popular, catch errors early, and understand your server's performance.

## Features

- 🔍 Track all tool calls and resource requests
- 📊 See performance metrics and error rates
- 🌐 Beautiful web dashboard for live analytics
- 💾 SQLite database for persistent storage
- ⚡ Real-time updates every 5 seconds

## Quick Start

1. Install the package:
```bash
yarn add mcp-analytics-middleware
```

2. Add it to your MCP server:
```typescript
import { McpAnalytics } from 'mcp-analytics-middleware';

const analytics = new McpAnalytics('analytics.db');
server.use(analytics.middleware);
```

3. View your analytics:
```bash
# Console view
yarn mcp-analytics-view --db-path=analytics.db

# Or check out the fancy web dashboard
yarn web-viewer --db-path=analytics.db
```

The web dashboard will open at http://localhost:5000 and show you live analytics!

## Live Analytics

Want to see what's happening on your server right now? Just start the web viewer with your database path:

```bash
yarn web-viewer --db-path=analytics.db
```

You'll see:
- Total tool calls and resource requests
- Error rates and performance metrics
- Most used tools and slowest operations
- Daily usage patterns
- And it all updates automatically every 5 seconds!

## Running with Inspector

If you're using the MCP Inspector, just add the analytics flag:

```bash
yarn inspector --db-path=analytics.db
```

## API Reference

### McpAnalytics
The main class that handles everything.

```typescript
class McpAnalytics {
  constructor(dbPath: string);
  middleware: Middleware;
  db: AnalyticsDB;
  analytics: Analytics;
}
```

### AnalyticsDB
Handles all the database stuff.

```typescript
class AnalyticsDB {
  getToolCallStats(): ToolStats;
  getResourceRequestStats(): ResourceStats;
}
```

### Analytics
Gives you all the cool analytics calculations.

```typescript
class Analytics {
  getTopTools(limit: number): ToolStats[];
  getSlowestTools(limit: number): ToolStats[];
  getErrorProneTool(limit: number): ToolStats[];
}
```

## Development

```bash
# Install everything
yarn install

# Build the project
yarn build

# Start the development server
yarn dev
```

## License

MIT
