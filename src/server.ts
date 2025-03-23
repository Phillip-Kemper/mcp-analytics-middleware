import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { McpAnalytics } from './index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { displayAnalytics } from './view-analytics.js';

/**
 * Run the MCP server
 * @param options Server configuration options
 */
async function runServer(options: {
  enableAnalytics?: boolean;
  dbPath?: string;
} = {}) {
  const { enableAnalytics = false, dbPath } = options;
  let analytics: McpAnalytics | undefined;
  
  try {
    const server = new McpServer({ 
      name: 'Sample MCP Server with Analytics',
      version: '1.0.0'
    });
    
    let enhancedServer = server;
    if (enableAnalytics) {
      analytics = new McpAnalytics(dbPath);
      enhancedServer = analytics.enhance(server);
    } 
    
    enhancedServer.tool(
      'calculator',
      'Simple calculator that performs basic operations',
      {
        operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
        a: z.number(),
        b: z.number()
      },
      async (params, extra) => {
        let result;
        
        switch (params.operation) {
          case 'add':
            result = params.a + params.b;
            break;
          case 'subtract':
            result = params.a - params.b;
            break;
          case 'multiply':
            result = params.a * params.b;
            break;
          case 'divide':
            if (params.b === 0) {
              throw new Error('Division by zero');
            }
            result = params.a / params.b;
            break;
        }
        
        return {
          content: [{ 
            type: 'text', 
            text: `The result of ${params.a} ${params.operation} ${params.b} is ${result}`
          }]
        };
      }
    );
    
    enhancedServer.resource(
      'hello',
      'mcp://server/hello',
      async (uri, extra) => {
        return {
          contents: [{ 
            text: 'Hello, World!',
            uri: uri.toString(),
            mimeType: 'text/plain'
          }]
        };
      }
    );

    const transport = new StdioServerTransport();
    
    process.on('SIGINT', async () => {
      if (enableAnalytics && analytics) {
        await displayAnalytics(analytics, 'Server Analytics Summary');
        analytics.close();
      }
      
      process.exit(0);
    });
    
    await enhancedServer.connect(transport);
    
  } catch (error) {
    console.error('Error setting up the server:', error);
    
    if (enableAnalytics && analytics) {
      analytics.close();
    }
    
    process.exit(1);
  }
}

const enableAnalytics = process.argv.includes('--analytics');

let dbPath: string | undefined = undefined;
for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  
  if (arg.startsWith('--db-path=')) {
    dbPath = arg.substring('--db-path='.length);
    break;
  }
  
  if (arg === '--db-path' && i < process.argv.length - 1) {
    dbPath = process.argv[i + 1];
    break;
  }
}

runServer({ enableAnalytics, dbPath }); 
