import { useEffect, useState } from 'react';
import { useBuilderState } from '../../hooks';
import type { MCPServerConfig, MCPServerType, MCPTransportType } from '../../types';
import { Info } from 'lucide-react';

interface MCPServerConfigPanelProps {
  nodeId: string;
}

export function MCPServerConfigPanel({ nodeId }: MCPServerConfigPanelProps) {
  const { project, updateNode } = useBuilderState();

  const node = project?.nodes.find(n => n.id === nodeId);
  const config = (node?.data as any)?.config as MCPServerConfig | undefined;

  const [formData, setFormData] = useState<MCPServerConfig>({
    id: config?.id || '',
    name: config?.name || '',
    description: config?.description || '',
    type: config?.type || 'filesystem',
    transport: config?.transport || 'stdio',
    command: config?.command || '',
    args: config?.args || [],
    env: config?.env || {},
    url: config?.url || '',
    autoStart: config?.autoStart !== undefined ? config.autoStart : true,
    tools: config?.tools || [],
    config: config?.config || {},
  });

  const [argInput, setArgInput] = useState('');
  const [envKey, setEnvKey] = useState('');
  const [envValue, setEnvValue] = useState('');

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (field: keyof MCPServerConfig, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    updateNode(nodeId, {
      data: {
        type: 'mcpserver',
        config: updated,
      } as any,
    });
  };

  const addArg = () => {
    if (argInput.trim()) {
      const newArgs = [...(formData.args || []), argInput.trim()];
      handleChange('args', newArgs);
      setArgInput('');
    }
  };

  const removeArg = (index: number) => {
    const newArgs = (formData.args || []).filter((_, i) => i !== index);
    handleChange('args', newArgs);
  };

  const addEnvVar = () => {
    if (envKey.trim() && envValue.trim()) {
      const newEnv = { ...(formData.env || {}), [envKey.trim()]: envValue.trim() };
      handleChange('env', newEnv);
      setEnvKey('');
      setEnvValue('');
    }
  };

  const removeEnvVar = (key: string) => {
    const newEnv = { ...(formData.env || {}) };
    delete newEnv[key];
    handleChange('env', newEnv);
  };

  const serverTypes: MCPServerType[] = [
    'filesystem',
    'database',
    'api',
    'git',
    'slack',
    'github',
    'google-drive',
    'custom',
  ];

  const transportTypes: MCPTransportType[] = ['stdio', 'http', 'ws'];

  return (
    <div className="p-4 space-y-6">
      {/* Info Banner */}
      <div className="flex gap-2 p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-600">
          <p className="font-medium mb-1">MCP (Model Context Protocol) Server</p>
          <p>Connect external tools and resources to your agents through standardized MCP servers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Server ID</label>
          <input
            type="text"
            value={formData.id}
            onChange={e => handleChange('id', e.target.value)}
            placeholder="e.g., filesystem-server"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Server Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="e.g., File System Server"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="What does this server provide?"
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Server Type */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Server Type</label>
          <select
            value={formData.type}
            onChange={e => handleChange('type', e.target.value as MCPServerType)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            {serverTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Transport Type */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Transport</label>
          <select
            value={formData.transport}
            onChange={e => handleChange('transport', e.target.value as MCPTransportType)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            {transportTypes.map(transport => (
              <option key={transport} value={transport}>
                {transport.toUpperCase()}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.transport === 'stdio' && 'Use standard input/output (local process)'}
            {formData.transport === 'http' && 'Use HTTP protocol (remote server)'}
            {formData.transport === 'ws' && 'Use WebSocket protocol (real-time)'}
          </p>
        </div>

        {/* STDIO Configuration */}
        {formData.transport === 'stdio' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">Command</label>
              <input
                type="text"
                value={formData.command}
                onChange={e => handleChange('command', e.target.value)}
                placeholder="e.g., npx @modelcontextprotocol/server-filesystem"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Command to start the MCP server</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Arguments</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={argInput}
                    onChange={e => setArgInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addArg()}
                    placeholder="Add argument..."
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={addArg}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                {formData.args && formData.args.length > 0 && (
                  <div className="space-y-1">
                    {formData.args.map((arg, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <code className="flex-1 text-xs font-mono">{arg}</code>
                        <button
                          onClick={() => removeArg(index)}
                          className="text-destructive hover:text-destructive/80 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Environment Variables</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={envKey}
                    onChange={e => setEnvKey(e.target.value)}
                    placeholder="KEY"
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={envValue}
                    onChange={e => setEnvValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addEnvVar()}
                    placeholder="VALUE"
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={addEnvVar}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                {formData.env && Object.keys(formData.env).length > 0 && (
                  <div className="space-y-1">
                    {Object.entries(formData.env).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <code className="text-xs font-mono">
                          {key}={value}
                        </code>
                        <button
                          onClick={() => removeEnvVar(key)}
                          className="ml-auto text-destructive hover:text-destructive/80 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* HTTP/WS Configuration */}
        {(formData.transport === 'http' || formData.transport === 'ws') && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Server URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={e => handleChange('url', e.target.value)}
              placeholder={formData.transport === 'http' ? 'https://api.example.com' : 'ws://localhost:8080'}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
            />
          </div>
        )}

        {/* Auto-start Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoStart"
            checked={formData.autoStart}
            onChange={e => handleChange('autoStart', e.target.checked)}
            className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="autoStart" className="text-sm font-medium cursor-pointer">
            Auto-start server when agent initializes
          </label>
        </div>
      </div>

      {/* Usage Example */}
      <div className="p-3 bg-muted rounded-md border border-border">
        <p className="text-xs font-medium mb-2 text-muted-foreground">Example Configuration:</p>
        <pre className="text-xs font-mono text-foreground overflow-x-auto">
          {`{
  id: "${formData.id || 'my-mcp-server'}",
  name: "${formData.name || 'My MCP Server'}",
  transport: "${formData.transport}",
  ${formData.transport === 'stdio' ? `command: "${formData.command || 'npx mcp-server'}"` : `url: "${formData.url || 'http://localhost:3000'}"`}
}`}
        </pre>
      </div>
    </div>
  );
}
