import type { MCPServerConfig } from '../../types';
import { escapeString, toCamelCase } from './codeGenUtils';

/**
 * Generates Mastra MCP server configuration code
 */
export class MCPServerCodeGenerator {
  /**
   * Generate MCP server configuration from visual config
   */
  generate(config: MCPServerConfig): string {
    const lines: string[] = [];

    // Import statement
    lines.push(`import { MCPServer } from '@mastra/core';`);
    lines.push(``);

    // Generate server configuration
    lines.push(`export const ${this.getServerVarName(config.id)} = {`);
    lines.push(`  id: '${config.id}',`);
    lines.push(`  name: '${escapeString(config.name)}',`);

    if (config.description) {
      lines.push(`  description: '${escapeString(config.description)}',`);
    }

    lines.push(`  type: '${config.type}',`);
    lines.push(`  transport: '${config.transport}',`);

    // Add transport-specific configuration
    if (config.transport === 'stdio') {
      if (config.command) {
        lines.push(`  command: '${escapeString(config.command)}',`);
      }

      if (config.args && config.args.length > 0) {
        lines.push(`  args: [`);
        config.args.forEach(arg => {
          lines.push(`    '${escapeString(arg)}',`);
        });
        lines.push(`  ],`);
      }

      if (config.env && Object.keys(config.env).length > 0) {
        lines.push(`  env: {`);
        Object.entries(config.env).forEach(([key, value]) => {
          lines.push(`    '${escapeString(key)}': '${escapeString(value)}',`);
        });
        lines.push(`  },`);
      }
    } else if (config.transport === 'http' || config.transport === 'ws') {
      if (config.url) {
        lines.push(`  url: '${escapeString(config.url)}',`);
      }
    }

    if (config.autoStart !== undefined) {
      lines.push(`  autoStart: ${config.autoStart},`);
    }

    if (config.config && Object.keys(config.config).length > 0) {
      lines.push(`  config: ${JSON.stringify(config.config, null, 2).split('\n').join('\n  ')},`);
    }

    lines.push(`};`);
    lines.push(``);

    return lines.join('\n');
  }

  /**
   * Generate MCP server initialization code for Mastra instance
   */
  generateInit(configs: MCPServerConfig[]): string {
    if (configs.length === 0) {
      return '';
    }

    const lines: string[] = [];

    // Import MCP servers
    lines.push(`// Import MCP servers`);
    configs.forEach(config => {
      lines.push(`import { ${this.getServerVarName(config.id)} } from './mcp/${config.id}';`);
    });
    lines.push(``);

    // Server initialization code
    lines.push(`// Initialize MCP servers`);
    lines.push(`const mcpServers = [`);
    configs.forEach(config => {
      lines.push(`  ${this.getServerVarName(config.id)},`);
    });
    lines.push(`];`);
    lines.push(``);

    return lines.join('\n');
  }

  /**
   * Generate usage example for MCP server in agent configuration
   */
  generateAgentUsage(serverId: string): string {
    const lines: string[] = [];

    lines.push(`// Add MCP server to agent`);
    lines.push(`const agent = new Agent({`);
    lines.push(`  // ... other config`);
    lines.push(`  mcpServers: [${this.getServerVarName(serverId)}],`);
    lines.push(`});`);

    return lines.join('\n');
  }

  /**
   * Get variable name for MCP server
   */
  private getServerVarName(id: string): string {
    return `${toCamelCase(id)}Server`;
  }

  /**
   * Generate import statements for MCP servers
   */
  generateImports(configs: MCPServerConfig[]): string {
    if (configs.length === 0) {
      return '';
    }

    const lines: string[] = [];
    configs.forEach(config => {
      lines.push(`export { ${this.getServerVarName(config.id)} } from './${config.id}';`);
    });

    return lines.join('\n');
  }
}
