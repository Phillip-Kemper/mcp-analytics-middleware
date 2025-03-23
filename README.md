# MCP Analytics Middleware

A middleware for the Model Context Protocol (MCP) servers that adds analytics tracking capabilities.

## Features

- Automatically tracks tool calls with timing information
- Automatically tracks resource requests with timing information
- Provides analytics on tool usage, performance, and error rates
- Uses SQLite to store analytics data for easy querying

## Installation

```bash
# Using npm
npm install @modelcontextprotocol/sdk mcp-analytics-middleware

# Using yarn
yarn add @modelcontextprotocol/sdk mcp-analytics-middleware
```

## Usage

### Basic Setup

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAnalytics } from 'mcp-analytics-middleware';

// Create an MCP server
const server = new McpServer({ 
  name: 'My MCP Server', 
  version: '1.0.0' 
});

// Initialize analytics with default SQLite storage
const analytics = new McpAnalytics();

// Enhance the server with analytics middleware
const enhancedServer = analytics.enhance(server);

// Register tools and resources as usual
enhancedServer.tool('myTool', async () => {
  // Your tool implementation
  return { content: [{ type: 'text', text: 'Hello!' }] };
});

// When done, close the analytics connection
analytics.close();
```

### Custom Database Path

```typescript
// Use a custom path for the SQLite database
const analytics = new McpAnalytics('./data/my-analytics.db');
```

### Accessing Analytics Data

```typescript
// Get overall statistics
const toolStats = analytics.analytics.getToolCallStats();
const resourceStats = analytics.analytics.getResourceRequestStats();

// Get the most frequently used tools
const topTools = analytics.analytics.getTopTools(5);

// Get the slowest tools
const slowestTools = analytics.analytics.getSlowestTools(5);

// Get tools with highest error rates
const errorProneTools = analytics.analytics.getErrorProneTool(5);
```

## Example

See the `src/server.ts` file for a complete example of how to set up an MCP server with analytics tracking.

## License

MIT
