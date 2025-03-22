import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AnalyticsDatabase } from './database.js';
import { Analytics } from './analytics.js';
export declare class McpAnalytics {
    db: AnalyticsDatabase;
    analytics: Analytics;
    constructor(dbPath?: string);
    enhance(server: McpServer): McpServer;
    close(): void;
}
export { AnalyticsDatabase } from './database.js';
export { Analytics } from './analytics.js';
