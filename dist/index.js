import { AnalyticsDatabase } from './database.js';
import { enhanceServerWithAnalytics } from './middleware.js';
import { Analytics } from './analytics.js';
export class McpAnalytics {
    constructor(dbPath) {
        this.db = new AnalyticsDatabase(dbPath);
        this.analytics = new Analytics(this.db);
    }
    enhance(server) {
        return enhanceServerWithAnalytics(server, this.db);
    }
    close() {
        this.db.close();
    }
}
export { AnalyticsDatabase } from './database.js';
export { Analytics } from './analytics.js';
//# sourceMappingURL=index.js.map