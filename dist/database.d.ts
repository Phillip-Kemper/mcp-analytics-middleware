import BetterSqlite3 from 'better-sqlite3';
export declare class AnalyticsDatabase {
    db: BetterSqlite3.Database;
    constructor(dbPath?: string);
    private initializeDatabase;
    recordToolCall(data: {
        toolName: string;
        params: any;
        result?: any;
        error?: string;
        durationMs: number;
    }): void;
    recordResourceRequest(data: {
        resourceName: string;
        uri: string;
        extra?: any;
        result?: any;
        error?: string;
        durationMs: number;
    }): void;
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
    close(): void;
}
