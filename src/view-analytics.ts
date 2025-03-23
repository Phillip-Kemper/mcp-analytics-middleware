import { McpAnalytics } from './index.js';

/**
 * Display analytics data from the database
 * @param analytics The McpAnalytics instance
 * @param title Optional title for the analytics report
 */
export async function displayAnalytics(analytics: McpAnalytics, title = 'MCP Analytics Viewer') {
  console.log(`\n${title}`);
  console.log('===================');
  
  console.log('\nTool Call Statistics:');
  const toolStats = analytics.db.getToolCallStats();
  console.log(`Total calls: ${toolStats?.totalCalls || 0}`);
  const toolErrorRate = (toolStats && toolStats.errorRate != null) ? 
    toolStats.errorRate.toFixed(2) : '0.00';
  console.log(`Error rate: ${toolErrorRate}%`);
  
  if (toolStats?.byTool?.length > 0) {
    console.log('\nTool Usage:');
    toolStats.byTool.forEach((tool: any) => {
      const avgDuration = (tool && tool.avg_duration != null) ? 
        tool.avg_duration.toFixed(2) : '0.00';
      console.log(`- ${tool.tool_name}: ${tool.count} calls, avg ${avgDuration}ms per call`);
    });
  } else {
    console.log('No tool calls recorded yet.');
  }
  
  console.log('\nResource Request Statistics:');
  const resourceStats = analytics.db.getResourceRequestStats();
  console.log(`Total requests: ${resourceStats?.totalRequests || 0}`);
  const resourceErrorRate = (resourceStats && resourceStats.errorRate != null) ? 
    resourceStats.errorRate.toFixed(2) : '0.00';
  console.log(`Error rate: ${resourceErrorRate}%`);
  
  if (resourceStats?.byResource?.length > 0) {
    console.log('\nResource Usage:');
    resourceStats.byResource.forEach((resource: any) => {
      const avgDuration = (resource && resource.avg_duration != null) ? 
        resource.avg_duration.toFixed(2) : '0.00';
      console.log(`- ${resource.resource_name}: ${resource.count} requests, avg ${avgDuration}ms per request`);
    });
  } else {
    console.log('No resource requests recorded yet.');
  }
  
  if (toolStats?.byTool?.length > 0) {
    console.log('\nTop Tools:');
    const topTools = analytics.analytics.getTopTools(5) || [];
    topTools.forEach((tool: any, index: number) => {
      console.log(`${index + 1}. ${tool.tool_name}: ${tool.count} calls`);
    });
  }
  
  if (toolStats?.byTool?.length > 0) {
    console.log('\nSlowest Tools:');
    const slowestTools = analytics.analytics.getSlowestTools(5) || [];
    slowestTools.forEach((tool: any, index: number) => {
      const avgDuration = (tool && tool.avg_duration != null) ? 
        tool.avg_duration.toFixed(2) : '0.00';
      console.log(`${index + 1}. ${tool.tool_name}: ${avgDuration}ms average`);
    });
  }
  
  const errorProneTools = analytics.analytics.getErrorProneTool(5) || [];
  if (errorProneTools?.length > 0) {
    console.log('\nError-Prone Tools:');
    errorProneTools.forEach((tool: any, index: number) => {
      const errorRate = (tool && tool.error_rate != null) ? 
        tool.error_rate.toFixed(2) : '0.00';
      console.log(`${index + 1}. ${tool.tool_name}: ${errorRate}% error rate (${tool.error_count || 0}/${tool.total_calls || 0})`);
    });
  }
}

/**
 * Simple script to view analytics data from the database
 * Usage: node dist/view-analytics.js --db-path=analytics.db
 */
async function main() {
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
  
  console.log(`Using database at: ${dbPath || 'default location'}`);
  
  try {
    const analytics = new McpAnalytics(dbPath);
    await displayAnalytics(analytics);
    analytics.close();
    
  } catch (error) {
    console.error('Error viewing analytics:', error);
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
