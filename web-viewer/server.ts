import express from 'express';
import cors from 'cors';
import { McpAnalytics } from '../src/index.js';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'web-viewer/dist')));

// Get database path from command line args
let dbPath: string | undefined = undefined;
for (const arg of process.argv) {
  if (arg.startsWith('--db-path=')) {
    dbPath = arg.substring('--db-path='.length);
    break;
  }
}

if (!dbPath) {
  const dbPathIndex = process.argv.indexOf('--db-path');
  if (dbPathIndex >= 0 && dbPathIndex < process.argv.length - 1) {
    dbPath = process.argv[dbPathIndex + 1];
  }
}

if (!dbPath) {
  console.error('Please provide --db-path argument');
  process.exit(1);
}

const analytics = new McpAnalytics(dbPath);

// API endpoints
app.get('/api/stats', (req, res) => {
  const toolStats = analytics.db.getToolCallStats();
  const resourceStats = analytics.db.getResourceRequestStats();
  res.json({ toolStats, resourceStats });
});

app.get('/api/tools/top', (req, res) => {
  const topTools = analytics.analytics.getTopTools(10);
  res.json(topTools);
});

app.get('/api/tools/slowest', (req, res) => {
  const slowestTools = analytics.analytics.getSlowestTools(10);
  res.json(slowestTools);
});

app.get('/api/tools/error-prone', (req, res) => {
  const errorProneTools = analytics.analytics.getErrorProneTool(10);
  res.json(errorProneTools);
});

app.get('/api/tools/daily', (req, res) => {
  const db = analytics.db.db;
  const dailyStats = db.prepare(`
    SELECT 
      date(timestamp/1000, 'unixepoch') as day,
      tool_name,
      COUNT(*) as calls,
      AVG(duration_ms) as avg_duration,
      COUNT(CASE WHEN error IS NOT NULL THEN 1 END) as error_count
    FROM tool_calls 
    GROUP BY day, tool_name 
    ORDER BY day DESC, calls DESC
  `).all();
  res.json(dailyStats);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Analytics web viewer running at http://localhost:${port}`);
  console.log(`Using database at: ${dbPath}`);
}); 
