import { Handle, Position, NodeProps } from '@xyflow/react';
import { Server, AlertCircle, CheckCircle2, Plug } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MCPServerNode({ data, selected }: NodeProps) {
  const server = (data as any).config;

  // Determine configuration status
  const getStatus = () => {
    if (!server.id || !server.name) return 'incomplete';
    if (!server.type) return 'incomplete';
    if (server.transport === 'stdio' && !server.command) return 'incomplete';
    if ((server.transport === 'http' || server.transport === 'ws') && !server.url) return 'incomplete';
    return 'complete';
  };

  const status = getStatus();

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      tooltip: 'Fully configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Missing required fields',
    },
  };

  const StatusIcon = statusConfig[status].icon;

  // Get server type icon color
  const getTypeColor = () => {
    switch (server.type) {
      case 'filesystem':
        return 'text-blue-500';
      case 'database':
        return 'text-green-500';
      case 'api':
        return 'text-purple-500';
      case 'git':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-card min-w-[220px] shadow-lg transition-all hover:shadow-xl',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Header with status */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('p-2 rounded-md', statusConfig[status].bg)}>
          <Server className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">MCP Server</div>
          <div className="font-semibold text-sm truncate">{server.name || 'Unnamed Server'}</div>
        </div>
        <div title={statusConfig[status].tooltip}>
          <StatusIcon className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
      </div>

      {/* Description */}
      {server.description && <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{server.description}</div>}

      {/* Configuration Preview */}
      <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
        {/* Server Type */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Type</span>
          <span className={cn('font-medium capitalize', getTypeColor())}>{server.type || 'Not set'}</span>
        </div>

        {/* Transport */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Transport</span>
          <span className="font-medium uppercase">{server.transport || 'stdio'}</span>
        </div>

        {/* Auto-start indicator */}
        {server.autoStart && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10">
            <Plug className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Auto-start enabled</span>
          </div>
        )}

        {/* Tools count */}
        {server.tools && server.tools.length > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tools</span>
            <span className="font-medium text-primary">{server.tools.length}</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
