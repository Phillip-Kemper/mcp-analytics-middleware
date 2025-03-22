export class Analytics {
    constructor(db) {
        this.db = db;
    }
    getToolCallStats() {
        return this.db.getToolCallStats();
    }
    getResourceRequestStats() {
        return this.db.getResourceRequestStats();
    }
    getTopTools(limit = 10) {
        const stats = this.db.getToolCallStats();
        return stats.byTool
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    getSlowestTools(limit = 10) {
        const stats = this.db.getToolCallStats();
        return stats.byTool
            .sort((a, b) => b.avg_duration - a.avg_duration)
            .slice(0, limit);
    }
    getErrorProneTool(limit = 10) {
        return this.db.db.prepare(`
      SELECT tool_name, 
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
//# sourceMappingURL=analytics.js.map