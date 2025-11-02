/**
 * MCP (Model Context Protocol) Server configuration types
 * MCP servers provide standardized access to external tools and resources
 */

export interface MCPServerConfig {
  id: string;
  name: string;
  description?: string;
  type: MCPServerType;
  command?: string; // Command to start the server
  args?: string[]; // Command arguments
  env?: Record<string, string>; // Environment variables
  url?: string; // For HTTP/WebSocket servers
  transport: MCPTransportType;
  autoStart?: boolean;
  tools?: MCPToolReference[]; // Tools provided by this server
  config?: Record<string, any>; // Additional configuration
}

export type MCPServerType = 
  | 'filesystem'
  | 'database'
  | 'api'
  | 'git'
  | 'slack'
  | 'github'
  | 'google-drive'
  | 'custom';

export type MCPTransportType = 
  | 'stdio' // Standard input/output
  | 'http'  // HTTP transport
  | 'ws';   // WebSocket transport

export interface MCPToolReference {
  name: string;
  description?: string;
  inputSchema?: Record<string, any>;
}

/**
 * MCP Server validation result
 */
export interface MCPServerValidationResult {
  valid: boolean;
  errors: MCPServerValidationError[];
  warnings: MCPServerValidationError[];
}

export interface MCPServerValidationError {
  type: 'error' | 'warning';
  field: string;
  message: string;
}

/**
 * MCP Server templates
 */
export interface MCPServerTemplate {
  id: string;
  name: string;
  description: string;
  type: MCPServerType;
  config: Partial<MCPServerConfig>;
  tags: string[];
}
