import { McpAnalytics } from './index.js';

/**
 * Simple script to view analytics data from the database
 * Usage: node dist/view-analytics.js [dbPath]
 */
async function main() {
  // Get optional database path from command line args
  const dbPath = process.argv[2];
  
  console.log('MCP Analytics Viewer');
  console.log('===================');
  
  try {
    // Create analytics instance with optional custom path
    const analytics = new McpAnalytics(dbPath);
    
    // Print tool call statistics
    console.log('\nTool Call Statistics:');
    const toolStats = analytics.analytics.getToolCallStats();
    console.log(`Total calls: ${toolStats?.totalCalls || 0}`);
    // More thorough null checking
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
    
    // Print resource request statistics  
    console.log('\nResource Request Statistics:');
    const resourceStats = analytics.analytics.getResourceRequestStats();
    console.log(`Total requests: ${resourceStats?.totalRequests || 0}`);
    // More thorough null checking
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
    
    // Print top tools by usage
    if (toolStats?.byTool?.length > 0) {
      console.log('\nTop Tools:');
      const topTools = analytics.analytics.getTopTools(5) || [];
      topTools.forEach((tool: any, index: number) => {
        console.log(`${index + 1}. ${tool.tool_name}: ${tool.count} calls`);
      });
    }
    
    // Print slowest tools
    if (toolStats?.byTool?.length > 0) {
      console.log('\nSlowest Tools:');
      const slowestTools = analytics.analytics.getSlowestTools(5) || [];
      slowestTools.forEach((tool: any, index: number) => {
        const avgDuration = (tool && tool.avg_duration != null) ? 
          tool.avg_duration.toFixed(2) : '0.00';
        console.log(`${index + 1}. ${tool.tool_name}: ${avgDuration}ms average`);
      });
    }
    
    // Print error-prone tools
    const errorProneTools = analytics.analytics.getErrorProneTool(5) || [];
    if (errorProneTools?.length > 0) {
      console.log('\nError-Prone Tools:');
      errorProneTools.forEach((tool: any, index: number) => {
        const errorRate = (tool && tool.error_rate != null) ? 
          tool.error_rate.toFixed(2) : '0.00';
        console.log(`${index + 1}. ${tool.tool_name}: ${errorRate}% error rate (${tool.error_count || 0}/${tool.total_calls || 0})`);
      });
    }
    
    // Close the connection
    analytics.close();
    
  } catch (error) {
    console.error('Error viewing analytics:', error);
  }
}

main(); 
