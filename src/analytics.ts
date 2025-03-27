import { AnalyticsDatabase } from './database.js';

export class Analytics {
  private db: AnalyticsDatabase;
  
  constructor(db: AnalyticsDatabase) {
    this.db = db;
  }
  
  getToolCallStats() {
    return this.db.getToolCallStats();
  }
  
  getResourceRequestStats() {
    return this.db.getResourceRequestStats();
  }
  
  getTopTools(limit = 10) {
    return this.db.db.prepare(`
      SELECT 
        tool_name, 
        COUNT(*) as count, 
        AVG(duration_ms) as avg_duration,
        COUNT(CASE WHEN error IS NOT NULL THEN 1 END) as error_count,
        COUNT(*) as total_calls,
        COUNT(CASE WHEN error IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as error_rate
      FROM tool_calls
      GROUP BY tool_name
      ORDER BY count DESC
      LIMIT ?
    `).all(limit);
  }
  
  getSlowestTools(limit = 10) {
    return this.db.db.prepare(`
      SELECT 
        tool_name, 
        COUNT(*) as count, 
        AVG(duration_ms) as avg_duration,
        COUNT(CASE WHEN error IS NOT NULL THEN 1 END) as error_count,
        COUNT(*) as total_calls,
        COUNT(CASE WHEN error IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as error_rate
      FROM tool_calls
      GROUP BY tool_name
      ORDER BY avg_duration DESC
      LIMIT ?
    `).all(limit);
  }
  
  getErrorProneTool(limit = 10) {
    return this.db.db.prepare(`
      SELECT 
        tool_name, 
        COUNT(*) as total_calls,
        COUNT(CASE WHEN error IS NOT NULL THEN 1 END) as error_count,
        COUNT(CASE WHEN error IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as error_rate
      FROM tool_calls
      GROUP BY tool_name
      ORDER BY error_rate DESC
      LIMIT ?
    `).all(limit);
  }
}
