import { AnalyticsDatabase } from './database.js';
export declare class Analytics {
    private db;
    constructor(db: AnalyticsDatabase);
    getToolCallStats(): {
        totalCalls: number;
        byTool: unknown[];
        errorRate: number;
    };
    getResourceRequestStats(): {
        totalRequests: number;
        byResource: unknown[];
        errorRate: number;
    };
    getTopTools(limit?: number): unknown[];
    getSlowestTools(limit?: number): unknown[];
    getErrorProneTool(limit?: number): unknown[];
}
