import { describe, it, expect } from 'vitest';
import { MCPServerCodeGenerator } from '../MCPServerCodeGenerator';
import type { MCPServerConfig } from '../../../types';

describe('MCPServerCodeGenerator', () => {
  const createConfig = (overrides: Partial<MCPServerConfig> = {}): MCPServerConfig => ({
    id: 'filesystemServer',
    name: 'Filesystem Server',
    description: 'Filesystem operations',
    type: 'filesystem',
    transport: 'stdio',
    command: 'npx',
    args: ['@modelcontextprotocol/server-filesystem'],
    env: {},
    autoStart: true,
    ...overrides,
  });

  it('should avoid duplicating server suffix in variable names', () => {
    const generator = new MCPServerCodeGenerator();

    const code = generator.generate(createConfig({ id: 'filesystemServer' }));
    const init = generator.generateInit([createConfig({ id: 'filesystemServer' })]);

    expect(code).toContain('export const filesystemServer = {');
    expect(init).toContain('import { filesystemServer }');
    expect(init).toContain('filesystemServer,');
  });

  it('should generate stdio transport configuration', () => {
    const generator = new MCPServerCodeGenerator();
    const code = generator.generate(
      createConfig({
        transport: 'stdio',
        command: 'npx',
        args: ['@modelcontextprotocol/server-filesystem', '/tmp'],
        env: { TEST_KEY: 'test-value' },
      })
    );

    expect(code).toContain(`transport: 'stdio'`);
    expect(code).toContain(`command: 'npx'`);
    expect(code).toContain(`'@modelcontextprotocol/server-filesystem'`);
    expect(code).toContain(`'/tmp'`);
    expect(code).toContain(`'TEST_KEY': 'test-value'`);
  });

  it('should generate http and ws transport configuration', () => {
    const generator = new MCPServerCodeGenerator();
    const httpCode = generator.generate(
      createConfig({
        id: 'httpServer',
        transport: 'http',
        command: undefined,
        args: undefined,
        url: 'https://example.com/mcp',
      })
    );
    const wsCode = generator.generate(
      createConfig({
        id: 'wsServer',
        transport: 'ws',
        command: undefined,
        args: undefined,
        url: 'wss://example.com/mcp',
      })
    );

    expect(httpCode).toContain(`transport: 'http'`);
    expect(httpCode).toContain(`url: 'https://example.com/mcp'`);
    expect(httpCode).not.toContain(`command:`);
    expect(wsCode).toContain(`transport: 'ws'`);
    expect(wsCode).toContain(`url: 'wss://example.com/mcp'`);
    expect(wsCode).not.toContain(`command:`);
  });

  it('should escape user-provided strings', () => {
    const generator = new MCPServerCodeGenerator();
    const code = generator.generate(
      createConfig({
        id: "bad'id",
        name: "Name with ' quote",
        description: "Desc with ' quote",
        command: "node ./server'script.js",
        args: ["arg'one"],
        env: { "API'KEY": "value'1" },
      })
    );

    expect(code).toContain(`id: 'bad\\'id'`);
    expect(code).toContain(`name: 'Name with \\' quote'`);
    expect(code).toContain(`description: 'Desc with \\' quote'`);
    expect(code).toContain(`command: 'node ./server\\'script.js'`);
    expect(code).toContain(`'arg\\'one'`);
    expect(code).toContain(`'API\\'KEY': 'value\\'1'`);
  });
});
