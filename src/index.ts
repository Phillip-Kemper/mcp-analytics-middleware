import { AnalyticsDatabase } from './database.js';
import { enhanceServerWithAnalytics } from './middleware.js';
import { Analytics } from './analytics.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export class McpAnalytics {
  db: AnalyticsDatabase;
  analytics: Analytics;
  
  constructor(dbPath?: string) {
    this.db = new AnalyticsDatabase(dbPath);
    this.analytics = new Analytics(this.db);
  }
  
  enhance(server: McpServer): McpServer {
    return enhanceServerWithAnalytics(server, this.db);
  }
  
  close() {
    this.db.close();
  }
}

export { AnalyticsDatabase } from './database.js';
export { Analytics } from './analytics.js';
