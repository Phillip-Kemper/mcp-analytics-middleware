import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
export class AnalyticsDatabase {
    constructor(dbPath) {
        const finalPath = dbPath || path.join(process.cwd(), 'mcp-analytics.db');
        // Ensure directory exists
        const dir = path.dirname(finalPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.db = new BetterSqlite3(finalPath);
        this.initializeDatabase();
    }
    initializeDatabase() {
        // Create tool calls table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS tool_calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        tool_name TEXT NOT NULL,
        params TEXT NOT NULL,
        result TEXT,
        error TEXT,
        duration_ms INTEGER NOT NULL
      )
    `);
        // Create resource requests table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS resource_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        resource_name TEXT NOT NULL,
        uri TEXT NOT NULL,
        extra TEXT,
        result TEXT,
        error TEXT,
        duration_ms INTEGER NOT NULL
      )
    `);
    }
    recordToolCall(data) {
        const stmt = this.db.prepare(`
      INSERT INTO tool_calls (timestamp, tool_name, params, result, error, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        stmt.run(Date.now(), data.toolName, JSON.stringify(data.params), data.result ? JSON.stringify(data.result) : null, data.error || null, data.durationMs);
    }
    recordResourceRequest(data) {
        const stmt = this.db.prepare(`
      INSERT INTO resource_requests (timestamp, resource_name, uri, extra, result, error, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(Date.now(), data.resourceName, data.uri, data.extra ? JSON.stringify(data.extra) : null, data.result ? JSON.stringify(data.result) : null, data.error || null, data.durationMs);
    }
    getToolCallStats() {
        return {
            totalCalls: this.db.prepare('SELECT COUNT(*) as count FROM tool_calls').get().count,
            byTool: this.db.prepare(`
        SELECT tool_name, COUNT(*) as count, AVG(duration_ms) as avg_duration
        FROM tool_calls
        GROUP BY tool_name
      `).all(),
            errorRate: this.db.prepare(`
        SELECT 
          COUNT(CASE WHEN error IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as error_rate
        FROM tool_calls
      `).get().error_rate
        };
    }
    getResourceRequestStats() {
        return {
            totalRequests: this.db.prepare('SELECT COUNT(*) as count FROM resource_requests').get().count,
            byResource: this.db.prepare(`
        SELECT resource_name, COUNT(*) as count, AVG(duration_ms) as avg_duration
        FROM resource_requests
        GROUP BY resource_name
      `).all(),
            errorRate: this.db.prepare(`
        SELECT 
          COUNT(CASE WHEN error IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as error_rate
        FROM resource_requests
      `).get().error_rate
        };
    }
    close() {
        this.db.close();
    }
}
//# sourceMappingURL=database.js.map