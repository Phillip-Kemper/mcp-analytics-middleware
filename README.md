# MCP Analytics Middleware

Analytics middleware for Model Context Protocol servers.

## Features

- Track tool calls and resource requests
- Monitor performance metrics
- View analytics through console or web interface
- SQLite database for persistent storage
- Real-time analytics updates

## Installation

```bash
yarn add mcp-analytics-middleware
```

## Usage

### Basic Setup

```typescript
import { McpAnalytics } from 'mcp-analytics-middleware';

const analytics = new McpAnalytics('analytics.db');

// Use with your MCP server
server.use(analytics.middleware);
```

### Viewing Analytics

You can view analytics in two ways:

1. Console View:
```bash
yarn mcp-analytics-view --db-path=analytics.db
```

2. Web Dashboard:
```bash
yarn web-viewer --db-path=analytics.db
```

The web dashboard will be available at http://localhost:5000 and provides:
- Real-time statistics
- Interactive tables
- Performance metrics
- Error rates
- Daily usage patterns

### Running with Inspector

```bash
yarn inspector --db-path=analytics.db
```

## API

### McpAnalytics

The main class for analytics functionality.

```typescript
class McpAnalytics {
  constructor(dbPath: string);
  middleware: Middleware;
  db: AnalyticsDB;
  analytics: Analytics;
}
```

### AnalyticsDB

Handles database operations.

```typescript
class AnalyticsDB {
  getToolCallStats(): ToolStats;
  getResourceRequestStats(): ResourceStats;
}
```

### Analytics

Provides analytics calculations.

```typescript
class Analytics {
  getTopTools(limit: number): ToolStats[];
  getSlowestTools(limit: number): ToolStats[];
  getErrorProneTool(limit: number): ToolStats[];
}
```

## Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Run tests
yarn test

# Start development server
yarn dev
```

## License

MIT
