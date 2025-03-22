import { McpServer, ReadResourceCallback, ReadResourceTemplateCallback, ResourceMetadata, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AnalyticsDatabase } from './database.js';

export function enhanceServerWithAnalytics(
  server: McpServer, 
  db: AnalyticsDatabase
): McpServer {
  // Store the original tool method
  const originalTool = server.tool.bind(server);
  
  // Override the tool method to track calls
  server.tool = function(...args: any[]) {
    // Handle different overloads based on number and types of arguments
    let name: string;
    let description: string | undefined;
    let params: any | undefined;
    let handler: any;

    if (args.length === 2) {
      // Overload 1: tool(name, cb)
      [name, handler] = args;
      
      // Create a wrapped handler that tracks calls
      const wrappedHandler = async (...handlerArgs: any[]) => {
        const startTime = performance.now();
        try {
          const result = await handler(...handlerArgs);
          const endTime = performance.now();
          
          // Record the successful call
          db.recordToolCall({
            toolName: name,
            params: handlerArgs[0] || {},
            result: result,
            durationMs: Math.round(endTime - startTime)
          });
          
          return result;
        } catch (error) {
          const endTime = performance.now();
          
          // Record the failed call
          db.recordToolCall({
            toolName: name,
            params: handlerArgs[0] || {},
            error: error instanceof Error ? error.message : String(error),
            durationMs: Math.round(endTime - startTime)
          });
          
          throw error;
        }
      };
      
      return originalTool(name, wrappedHandler);
    } else if (args.length === 3) {
      [name, ...args] = args;
      
      if (typeof args[0] === "string") {
        // Overload 2: tool(name, description, cb)
        description = args[0];
        handler = args[1];
        
        const wrappedHandler = async (...handlerArgs: any[]) => {
          const startTime = performance.now();
          try {
            const result = await handler(...handlerArgs);
            const endTime = performance.now();
            
            // Record the successful call
            db.recordToolCall({
              toolName: name,
              params: handlerArgs[0] || {},
              result: result,
              durationMs: Math.round(endTime - startTime)
            });
            
            return result;
          } catch (error) {
            const endTime = performance.now();
            
            // Record the failed call
            db.recordToolCall({
              toolName: name,
              params: handlerArgs[0] || {},
              error: error instanceof Error ? error.message : String(error),
              durationMs: Math.round(endTime - startTime)
            });
            
            throw error;
          }
        };
        
        return originalTool(name, description, wrappedHandler);
      } else {
        // Overload 3: tool(name, paramsSchema, cb)
        params = args[0];
        handler = args[1];
        
        const wrappedHandler = async (...handlerArgs: any[]) => {
          const startTime = performance.now();
          try {
            const result = await handler(...handlerArgs);
            const endTime = performance.now();
            
            // Record the successful call
            db.recordToolCall({
              toolName: name,
              params: handlerArgs[0] || {},
              result: result,
              durationMs: Math.round(endTime - startTime)
            });
            
            return result;
          } catch (error) {
            const endTime = performance.now();
            
            // Record the failed call
            db.recordToolCall({
              toolName: name,
              params: handlerArgs[0] || {},
              error: error instanceof Error ? error.message : String(error),
              durationMs: Math.round(endTime - startTime)
            });
            
            throw error;
          }
        };
        
        return originalTool(name, params, wrappedHandler);
      }
    } else if (args.length === 4) {
      // Overload 4: tool(name, description, paramsSchema, cb)
      [name, description, params, handler] = args;
      
      const wrappedHandler = async (...handlerArgs: any[]) => {
        const startTime = performance.now();
        try {
          const result = await handler(...handlerArgs);
          const endTime = performance.now();
          
          // Record the successful call
          db.recordToolCall({
            toolName: name,
            params: handlerArgs[0] || {},
            result: result,
            durationMs: Math.round(endTime - startTime)
          });
          
          return result;
        } catch (error) {
          const endTime = performance.now();
          
          // Record the failed call
          db.recordToolCall({
            toolName: name,
            params: handlerArgs[0] || {},
            error: error instanceof Error ? error.message : String(error),
            durationMs: Math.round(endTime - startTime)
          });
          
          throw error;
        }
      };
      
      return originalTool(name, description || '', params, wrappedHandler);
    } else {
      throw new Error("Invalid number of arguments for tool()");
    }
  };
  
  // Store the original resource method
  const originalResource = server.resource.bind(server);
  
  // Override the resource method to track requests
  server.resource = function(...args: any[]) {
    const name = args[0] as string;
    const pattern = args[1];
    const metadata = typeof args[2] !== 'function' ? args[2] as ResourceMetadata : undefined;
    const handler = typeof args[2] === 'function' ? args[2] : args[3];
    
    // Create a wrapped handler for different signature types
    const wrappedHandler = async (...handlerArgs: any[]) => {
      const startTime = performance.now();
      try {
        const result = await (handler as Function)(...handlerArgs);
        const endTime = performance.now();
        
        // Record the successful request
        db.recordResourceRequest({
          resourceName: name,
          uri: handlerArgs[0].toString(),
          extra: handlerArgs[handlerArgs.length - 1],
          result: result,
          durationMs: Math.round(endTime - startTime)
        });
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        
        // Record the failed request
        db.recordResourceRequest({
          resourceName: name,
          uri: handlerArgs[0].toString(),
          extra: handlerArgs[handlerArgs.length - 1],
          error: error instanceof Error ? error.message : String(error),
          durationMs: Math.round(endTime - startTime)
        });
        
        throw error;
      }
    };
    
    // Handle different resource method overloads
    if (metadata) {
      if (pattern instanceof ResourceTemplate) {
        return originalResource(name, pattern, metadata, wrappedHandler as ReadResourceTemplateCallback);
      } else {
        return originalResource(name, pattern as string, metadata, wrappedHandler as ReadResourceCallback);
      }
    } else {
      if (pattern instanceof ResourceTemplate) {
        return originalResource(name, pattern, wrappedHandler as ReadResourceTemplateCallback);
      } else {
        return originalResource(name, pattern as string, wrappedHandler as ReadResourceCallback);
      }
    }
  };
  
  return server;
}
