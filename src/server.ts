import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { McpAnalytics } from './index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Sample MCP server with analytics
async function main() {
  try {
    // Create a basic MCP server
    const server = new McpServer({ 
      name: 'Sample MCP Server with Analytics',
      version: '1.0.0'
    });
    
    // Create analytics instance
    const analytics = new McpAnalytics();
    
    // Enhance the server with analytics middleware
    const enhancedServer = analytics.enhance(server);
    
    // Register a simple calculator tool
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
    
    // Register a simple resource
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
    await server.connect(transport);
  } catch (error) {
    console.error('Error setting up the server:', error);
    process.exit(1);
  }
}

main(); 
