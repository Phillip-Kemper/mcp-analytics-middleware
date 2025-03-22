import { AnalyticsDatabase } from './database.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare function enhanceServerWithAnalytics(server: McpServer, db: AnalyticsDatabase): McpServer;
