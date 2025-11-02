import type { Template } from './templateTypes';

export const filesystemMCPServerTemplate: Template = {
  id: 'filesystem-mcp-server',
  name: 'Filesystem MCP Server',
  description: 'Access and manipulate files on the local filesystem through MCP protocol.',
  icon: '📁',
  category: 'mcpserver',
  tags: ['filesystem', 'files', 'mcp', 'local'],
  project: {
    id: 'filesystem-mcp-server-project',
    name: 'Filesystem MCP Server',
    settings: {
      projectName: 'Filesystem MCP Server',
      description: 'MCP server for filesystem operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {},
    },
    nodes: [
      {
        id: 'mcp-server-1',
        type: 'mcpserver',
        position: { x: 400, y: 300 },
        data: {
          type: 'mcpserver',
          config: {
            id: 'filesystemServer',
            name: 'Filesystem Server',
            description: 'Provides access to local filesystem operations',
            type: 'filesystem',
            transport: 'stdio',
            command: 'npx',
            args: ['@modelcontextprotocol/server-filesystem', '/path/to/allowed/directory'],
            env: {},
            autoStart: true,
            tools: [
              { name: 'read_file', description: 'Read contents of a file' },
              { name: 'write_file', description: 'Write contents to a file' },
              { name: 'list_directory', description: 'List contents of a directory' },
              { name: 'create_directory', description: 'Create a new directory' },
              { name: 'delete_file', description: 'Delete a file' },
            ],
          },
        },
      },
    ],
    edges: [],
  },
};

export const githubMCPServerTemplate: Template = {
  id: 'github-mcp-server',
  name: 'GitHub MCP Server',
  description: 'Interact with GitHub repositories, issues, and pull requests through MCP.',
  icon: '🐙',
  category: 'mcpserver',
  tags: ['github', 'git', 'repository', 'mcp'],
  project: {
    id: 'github-mcp-server-project',
    name: 'GitHub MCP Server',
    settings: {
      projectName: 'GitHub MCP Server',
      description: 'MCP server for GitHub operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        GITHUB_TOKEN: 'your-github-token',
      },
    },
    nodes: [
      {
        id: 'mcp-server-1',
        type: 'mcpserver',
        position: { x: 400, y: 300 },
        data: {
          type: 'mcpserver',
          config: {
            id: 'githubServer',
            name: 'GitHub Server',
            description: 'Provides access to GitHub API operations',
            type: 'github',
            transport: 'stdio',
            command: 'npx',
            args: ['@modelcontextprotocol/server-github'],
            env: {
              GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
            },
            autoStart: true,
            tools: [
              { name: 'create_issue', description: 'Create a new issue' },
              { name: 'list_issues', description: 'List repository issues' },
              { name: 'create_pull_request', description: 'Create a pull request' },
              { name: 'get_file_contents', description: 'Get file contents from repository' },
              { name: 'search_repositories', description: 'Search for repositories' },
            ],
          },
        },
      },
    ],
    edges: [],
  },
};

export const slackMCPServerTemplate: Template = {
  id: 'slack-mcp-server',
  name: 'Slack MCP Server',
  description: 'Send messages and interact with Slack workspaces through MCP.',
  icon: '💬',
  category: 'mcpserver',
  tags: ['slack', 'messaging', 'communication', 'mcp'],
  project: {
    id: 'slack-mcp-server-project',
    name: 'Slack MCP Server',
    settings: {
      projectName: 'Slack MCP Server',
      description: 'MCP server for Slack operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        SLACK_BOT_TOKEN: 'xoxb-your-token',
      },
    },
    nodes: [
      {
        id: 'mcp-server-1',
        type: 'mcpserver',
        position: { x: 400, y: 300 },
        data: {
          type: 'mcpserver',
          config: {
            id: 'slackServer',
            name: 'Slack Server',
            description: 'Provides access to Slack workspace operations',
            type: 'slack',
            transport: 'stdio',
            command: 'npx',
            args: ['@modelcontextprotocol/server-slack'],
            env: {
              SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || '',
            },
            autoStart: true,
            tools: [
              { name: 'send_message', description: 'Send a message to a channel' },
              { name: 'list_channels', description: 'List available channels' },
              { name: 'get_channel_history', description: 'Get message history from a channel' },
              { name: 'create_channel', description: 'Create a new channel' },
              { name: 'invite_user', description: 'Invite user to a channel' },
            ],
          },
        },
      },
    ],
    edges: [],
  },
};

export const databaseMCPServerTemplate: Template = {
  id: 'database-mcp-server',
  name: 'Database MCP Server',
  description: 'Execute database queries and manage data through MCP protocol.',
  icon: '🗄️',
  category: 'mcpserver',
  tags: ['database', 'sql', 'data', 'mcp'],
  project: {
    id: 'database-mcp-server-project',
    name: 'Database MCP Server',
    settings: {
      projectName: 'Database MCP Server',
      description: 'MCP server for database operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        DATABASE_URL: 'postgresql://user:password@localhost:5432/dbname',
      },
    },
    nodes: [
      {
        id: 'mcp-server-1',
        type: 'mcpserver',
        position: { x: 400, y: 300 },
        data: {
          type: 'mcpserver',
          config: {
            id: 'databaseServer',
            name: 'Database Server',
            description: 'Provides access to database operations',
            type: 'database',
            transport: 'stdio',
            command: 'npx',
            args: ['@modelcontextprotocol/server-postgres'],
            env: {
              DATABASE_URL: process.env.DATABASE_URL || '',
            },
            autoStart: true,
            tools: [
              { name: 'execute_query', description: 'Execute a SQL query' },
              { name: 'list_tables', description: 'List all tables' },
              { name: 'describe_table', description: 'Get table schema' },
              { name: 'insert_record', description: 'Insert a new record' },
              { name: 'update_record', description: 'Update an existing record' },
            ],
          },
        },
      },
    ],
    edges: [],
  },
};

export const googleDriveMCPServerTemplate: Template = {
  id: 'google-drive-mcp-server',
  name: 'Google Drive MCP Server',
  description: 'Access and manage Google Drive files and folders through MCP.',
  icon: '📊',
  category: 'mcpserver',
  tags: ['google-drive', 'cloud', 'storage', 'mcp'],
  project: {
    id: 'google-drive-mcp-server-project',
    name: 'Google Drive MCP Server',
    settings: {
      projectName: 'Google Drive MCP Server',
      description: 'MCP server for Google Drive operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        GOOGLE_API_KEY: 'your-api-key',
      },
    },
    nodes: [
      {
        id: 'mcp-server-1',
        type: 'mcpserver',
        position: { x: 400, y: 300 },
        data: {
          type: 'mcpserver',
          config: {
            id: 'googleDriveServer',
            name: 'Google Drive Server',
            description: 'Provides access to Google Drive operations',
            type: 'google-drive',
            transport: 'http',
            url: 'https://www.googleapis.com/drive/v3',
            autoStart: true,
            tools: [
              { name: 'list_files', description: 'List files in Drive' },
              { name: 'get_file', description: 'Get file contents' },
              { name: 'upload_file', description: 'Upload a file' },
              { name: 'create_folder', description: 'Create a new folder' },
              { name: 'delete_file', description: 'Delete a file' },
            ],
          },
        },
      },
    ],
    edges: [],
  },
};

export const mcpServerTemplates = [
  filesystemMCPServerTemplate,
  githubMCPServerTemplate,
  slackMCPServerTemplate,
  databaseMCPServerTemplate,
  googleDriveMCPServerTemplate,
];
