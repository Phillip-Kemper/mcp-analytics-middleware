# MCP Analytics Middleware

A middleware for the Model Context Protocol (MCP) servers that adds analytics tracking capabilities. It automatically captures performance metrics and usage patterns for MCP tools and resources.

## Features

- **Tool Analytics**: Automatically tracks all tool calls with timing, parameters, and result information
- **Resource Analytics**: Records all resource requests with timing and response details
- **Performance Metrics**: Shows average response times, error rates, and usage frequency
- **SQLite Storage**: Uses a lightweight SQLite database for persistent storage with no external dependencies
- **Easy Integration**: Simple one-line integration with any MCP server
- **Command Line Viewer**: Built-in analytics viewer for quick insights

## Installation

```bash
# Install the package
yarn add mcp-analytics-middleware

# If you don't have the MCP SDK yet
yarn add @modelcontextprotocol/sdk
```

## Usage

### Quick Start

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAnalytics } from 'mcp-analytics-middleware';

// Create your MCP server
const server = new McpServer({ 
  name: 'My MCP Server', 
  version: '1.0.0' 
});

// Initialize analytics
const analytics = new McpAnalytics();

// Enhance the server with analytics tracking - just one line!
const enhancedServer = analytics.enhance(server);

// Continue using your server as normal
enhancedServer.tool('calculator', async (params) => {
  // Your implementation
  return { content: [{ type: 'text', text: 'Result: 42' }] };
});

// When shutting down, close the analytics connection
process.on('SIGINT', () => {
  analytics.close();
  process.exit(0);
});
```

### Database Path Configuration

By default, the analytics database is stored as `mcp-analytics.db` in the current working directory. You can specify a custom path:

```typescript
// Custom database location
const analytics = new McpAnalytics('./data/my-analytics.db');
```

When using the middleware with the MCP Inspector or other CLI tools, provide the path with the `--db-path` flag:

```bash
yarn run build && npx @modelcontextprotocol/inspector node dist/server.js --analytics --db-path=./data/analytics.db
```

### Accessing Analytics Data

#### Console Display

```typescript
import { displayAnalytics } from 'mcp-analytics-middleware/dist/view-analytics.js';

// Display formatted analytics in the terminal
await displayAnalytics(analytics, 'My Server Analytics');
```

#### Programmatic Access

```typescript
// Get base statistics
const toolStats = analytics.db.getToolCallStats();
console.log(`Total tool calls: ${toolStats.totalCalls}`);
console.log(`Tool error rate: ${toolStats.errorRate}%`);

// Get resource request statistics
const resourceStats = analytics.db.getResourceRequestStats();
console.log(`Total resource requests: ${resourceStats.totalRequests}`);

// Access detailed analytics
const topTools = analytics.analytics.getTopTools(5);
const slowestTools = analytics.analytics.getSlowestTools(5);
const errorProneTools = analytics.analytics.getErrorProneTool(5);

// Example: Generate a performance report
const performanceReport = topTools.map(tool => ({
  name: tool.tool_name,
  calls: tool.count,
  avgDuration: `${tool.avg_duration.toFixed(2)}ms`,
  errorRate: `${(tool.error_count / tool.total_calls * 100).toFixed(2)}%`
}));
console.table(performanceReport);
```

### Command Line Tool

View analytics directly from the command line:

```bash
# Using yarn script (add to package.json)
yarn view-analytics --db-path=./analytics.db

# Using npx
npx mcp-analytics-view --db-path=./analytics.db

# Using global installation
yarn global add mcp-analytics-middleware
mcp-analytics-view --db-path=./analytics.db
```

### Integration with MCP Inspector

Run your server with analytics enabled through the MCP Inspector:

```bash
yarn run build
yarn run inspector
# or with custom path:
npx @modelcontextprotocol/inspector node dist/server.js --analytics --db-path=./data/analytics.db
```

## Analytics Data Structure

The middleware captures:

- **Tool Calls**:
  - Tool name and parameters
  - Response data or error
  - Execution duration
  - Timestamp

- **Resource Requests**:
  - Resource name and URI
  - Response data or error
  - Request duration
  - Timestamp

## Advanced Usage

### SIGINT Handler for Clean Shutdown

```typescript
process.on('SIGINT', async () => {
  console.log('\nGenerating analytics report before shutdown...');
  
  // Display analytics summary
  await displayAnalytics(analytics, 'Server Shutdown Analytics');
  
  // You can also save analytics to a file
  const fs = require('fs');
  const toolStats = analytics.db.getToolCallStats();
  fs.writeFileSync(
    'analytics-report.json', 
    JSON.stringify(toolStats, null, 2)
  );
  
  // Always close the connection
  analytics.close();
  process.exit(0);
});
```

### Custom Analytics Dashboard

You can build a custom dashboard by querying the SQLite database directly:

```typescript
// Get raw database access for custom queries
const db = analytics.db.db;  // Get the better-sqlite3 instance

// Custom query example
const topToolsByDay = db.prepare(`
  SELECT 
    date(timestamp/1000, 'unixepoch') as day,
    tool_name,
    COUNT(*) as calls 
  FROM tool_calls 
  GROUP BY day, tool_name 
  ORDER BY day DESC, calls DESC
`).all();

// Use the data for a dashboard or export
console.table(topToolsByDay);
```

## Publishing

If you're modifying this package for your own use, you can publish it using yarn:

```bash
# Login (first time only)
yarn login

# Update version
yarn version

# Build and publish
yarn publish
```

The package includes a `prepublishOnly` script that automatically runs the build before publishing.

## Troubleshooting

### Database Not Being Updated

If analytics aren't being recorded:

1. Verify that you're using `analytics.enhance(server)` before registering tools
2. Check database permissions in the target directory
3. Ensure you're passing `--analytics` flag when running the server
4. Check your chosen `--db-path` is valid and writable

### Viewing Wrong Database File

If analytics viewer shows no data despite server activity:

1. Ensure you're using the correct `--db-path` that matches your server configuration
2. Verify the analytics database exists at the specified path
3. Check that both commands use the exact same path format

## License

MIT
