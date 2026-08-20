# MCP Server Integration Guide

## What are MCP Servers?

MCP (Model Context Protocol) servers provide a standardized way to connect external tools, data sources, and services to AI agents. They enable agents to access file systems, databases, APIs, and other resources through a unified protocol.

## Why Use MCP Servers?

- **Standardized Integration**: One protocol for all external tools and services
- **Secure Access**: Controlled access to external resources
- **Reusability**: Define once, use across multiple agents
- **Flexibility**: Support for various transport types (stdio, HTTP, WebSocket)
- **Ecosystem**: Growing library of community-built MCP servers

## Available MCP Server Types

### 1. Filesystem Server
Access and manipulate files on the local filesystem.

**Use Cases:**
- Read/write configuration files
- Process data files
- Generate reports
- Manage project files

**Configuration:**
```typescript
{
  id: 'filesystemServer',
  name: 'Filesystem Server',
  type: 'filesystem',
  transport: 'stdio',
  command: 'npx',
  args: ['@modelcontextprotocol/server-filesystem', '/path/to/allowed/directory'],
  autoStart: true
}
```

### 2. GitHub Server
Interact with GitHub repositories, issues, and pull requests.

**Use Cases:**
- Create and manage issues
- Review pull requests
- Search repositories
- Read file contents

**Configuration:**
```typescript
{
  id: 'githubServer',
  name: 'GitHub Server',
  type: 'github',
  transport: 'stdio',
  command: 'npx',
  args: ['@modelcontextprotocol/server-github'],
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  autoStart: true
}
```

### 3. Database Server
Execute database queries and manage data.

**Use Cases:**
- Query data for analysis
- Update records
- Generate reports
- Database migrations

**Configuration:**
```typescript
{
  id: 'databaseServer',
  name: 'Database Server',
  type: 'database',
  transport: 'stdio',
  command: 'npx',
  args: ['@modelcontextprotocol/server-postgres'],
  env: {
    DATABASE_URL: process.env.DATABASE_URL
  },
  autoStart: true
}
```

### 4. Slack Server
Send messages and interact with Slack workspaces.

**Use Cases:**
- Send notifications
- Monitor channels
- Create channels
- Invite users

**Configuration:**
```typescript
{
  id: 'slackServer',
  name: 'Slack Server',
  type: 'slack',
  transport: 'stdio',
  command: 'npx',
  args: ['@modelcontextprotocol/server-slack'],
  env: {
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN
  },
  autoStart: true
}
```

### 5. Google Drive Server
Access and manage Google Drive files and folders.

**Use Cases:**
- Upload/download files
- List files
- Create folders
- Share files

**Configuration:**
```typescript
{
  id: 'googleDriveServer',
  name: 'Google Drive Server',
  type: 'google-drive',
  transport: 'http',
  url: 'https://www.googleapis.com/drive/v3',
  autoStart: true
}
```

## Transport Types

### STDIO (Standard Input/Output)
Best for local processes that communicate via stdin/stdout.

**Pros:**
- Simple to implement
- No network configuration
- Good for local tools

**Cons:**
- Limited to local processes
- No remote access

**Example:**
```typescript
{
  transport: 'stdio',
  command: 'npx',
  args: ['mcp-server-package'],
  env: { /* environment variables */ }
}
```

### HTTP
Best for remote services with REST APIs.

**Pros:**
- Works over network
- Standard protocol
- Easy to debug

**Cons:**
- Requires server setup
- No real-time updates

**Example:**
```typescript
{
  transport: 'http',
  url: 'https://api.example.com'
}
```

### WebSocket (WS)
Best for real-time bidirectional communication.

**Pros:**
- Real-time updates
- Bidirectional communication
- Efficient for streaming

**Cons:**
- More complex setup
- Requires WebSocket support

**Example:**
```typescript
{
  transport: 'ws',
  url: 'ws://localhost:8080'
}
```

## Creating an MCP Server in Visual Builder

### Step 1: Add MCP Server Node
1. Open the **Node Palette** (left sidebar)
2. Navigate to the **Tools** section
3. Drag the **MCP Server** node onto the canvas

### Step 2: Configure Basic Settings
1. Click on the MCP Server node
2. In the configuration panel (right sidebar), set:
   - **Server ID**: Unique identifier (e.g., `filesystemServer`)
   - **Server Name**: Human-readable name
   - **Description**: What this server provides
   - **Server Type**: Choose from filesystem, database, api, etc.

### Step 3: Configure Transport
Choose the appropriate transport type:

**For STDIO:**
- Set **Transport**: `stdio`
- Enter **Command**: e.g., `npx`
- Add **Arguments**: e.g., `@modelcontextprotocol/server-filesystem`
- Set **Environment Variables** if needed

**For HTTP/WebSocket:**
- Set **Transport**: `http` or `ws`
- Enter **Server URL**: e.g., `https://api.example.com`

### Step 4: Configure Auto-Start
- Toggle **Auto-start** to automatically initialize the server when the agent starts

## Using MCP Servers with Agents

Once you've configured an MCP server, you can connect it to agents:

### In Visual Builder
1. Create or select an Agent node
2. In the agent configuration panel:
   - Scroll to **MCP Servers** section
   - Select the MCP servers to connect
   - The agent will automatically have access to all tools provided by these servers

### In Generated Code
The Visual Builder will generate code like this:

```typescript
import { Agent } from '@mastra/core';
import { filesystemServer } from './mcp/filesystemServer';

const agent = new Agent({
  name: 'File Manager Agent',
  instructions: 'Help users manage their files',
  model: { provider: 'openai', name: 'gpt-4' },
  mcpServers: [filesystemServer],
});
```

## Templates

The Visual Builder includes pre-built templates for common MCP servers:

1. **Filesystem MCP Server** - Local file operations
2. **GitHub MCP Server** - GitHub integration
3. **Slack MCP Server** - Slack messaging
4. **Database MCP Server** - Database operations
5. **Google Drive MCP Server** - Google Drive access

To use a template:
1. Click **Templates** in the toolbar
2. Search for "MCP" or browse by category
3. Select a template
4. Click **Apply Template**
5. Customize the configuration as needed

## Security Best Practices

### Environment Variables
Never hardcode sensitive credentials:
```typescript
// ❌ Bad
env: {
  API_KEY: 'sk-abc123...'
}

// ✅ Good
env: {
  API_KEY: process.env.API_KEY
}
```

### File Access Restrictions
Limit filesystem access to specific directories:
```typescript
// Restrict to specific directory
args: ['@modelcontextprotocol/server-filesystem', '/path/to/allowed/directory']
```

### API Authentication
Use proper authentication mechanisms:
- OAuth tokens for services like GitHub, Google
- Bot tokens for Slack
- API keys with proper scoping

### Network Security
- Use HTTPS for HTTP transport
- Use WSS (WebSocket Secure) for WS transport
- Validate SSL certificates

## Troubleshooting

### Server Won't Start
**Problem**: MCP server fails to initialize

**Solutions:**
1. Check command and arguments are correct
2. Verify environment variables are set
3. Ensure npm package is installed: `npm install @modelcontextprotocol/server-<name>`
4. Check server logs for specific errors

### Connection Timeout
**Problem**: Server connection times out

**Solutions:**
1. Verify URL is correct (for HTTP/WS)
2. Check network connectivity
3. Ensure server is running
4. Check firewall settings

### Authentication Errors
**Problem**: Server authentication fails

**Solutions:**
1. Verify credentials are correct
2. Check environment variables are set properly
3. Ensure tokens have proper permissions
4. Verify token hasn't expired

### Tools Not Available
**Problem**: Agent can't access MCP server tools

**Solutions:**
1. Verify server is connected to agent
2. Check server initialized successfully
3. Ensure auto-start is enabled
4. Review server configuration

## Advanced Topics

### Custom MCP Servers
You can create custom MCP servers for your specific needs:

1. Create a new package following MCP protocol
2. Implement required interfaces
3. Publish to npm or use locally
4. Configure in Visual Builder with custom command

### Multiple Servers
Connect multiple MCP servers to a single agent:

```typescript
const agent = new Agent({
  name: 'Multi-Tool Agent',
  mcpServers: [
    filesystemServer,
    githubServer,
    slackServer,
  ],
});
```

### Server Configuration
Pass custom configuration to servers:

```typescript
{
  id: 'customServer',
  config: {
    maxConnections: 10,
    timeout: 30000,
    retryAttempts: 3
  }
}
```

## Examples

### Example 1: File Processing Agent
```typescript
const fileAgent = new Agent({
  name: 'File Processor',
  instructions: 'Process and analyze files in the workspace',
  model: { provider: 'openai', name: 'gpt-4' },
  mcpServers: [filesystemServer],
});
```

### Example 2: GitHub Issue Manager
```typescript
const githubAgent = new Agent({
  name: 'Issue Manager',
  instructions: 'Help manage GitHub issues and pull requests',
  model: { provider: 'anthropic', name: 'claude-3-opus' },
  mcpServers: [githubServer],
});
```

### Example 3: Multi-Channel Notifier
```typescript
const notifierAgent = new Agent({
  name: 'Notification Agent',
  instructions: 'Send notifications across multiple channels',
  model: { provider: 'openai', name: 'gpt-4' },
  mcpServers: [slackServer, emailServer, discordServer],
});
```

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Mastra Documentation](https://docs.mastra.ai)
- [Community MCP Servers](https://github.com/topics/mcp-server)

## FAQ

### Q: Can I use multiple MCP servers with one agent?
**A**: Yes! Agents can connect to multiple MCP servers simultaneously.

### Q: Do MCP servers work with all AI models?
**A**: Yes, MCP servers work with any model supported by Mastra (OpenAI, Anthropic, Google, etc.).

### Q: Can I create my own MCP server?
**A**: Yes! Follow the MCP protocol specification to create custom servers.

### Q: Are MCP servers secure?
**A**: MCP servers are as secure as you configure them. Follow security best practices, especially for credentials and file access.

### Q: Do MCP servers cost money?
**A**: MCP servers themselves are free. However, the services they connect to (GitHub API, Slack API, etc.) may have their own pricing.

### Q: Can MCP servers be used in production?
**A**: Yes! MCP servers are production-ready. Ensure proper error handling, authentication, and monitoring.

---

**Need Help?**
- Create an issue on GitHub
- Join the Mastra Discord
- Check the documentation at docs.mastra.ai
