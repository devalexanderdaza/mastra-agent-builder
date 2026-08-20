import type { CanvasNode, AgentNodeData, StepNodeData, ToolNodeData, MCPServerNodeData } from '../../types';

export interface ValidationError {
  nodeId: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Validate an Agent node
 */
export function validateAgentNode(node: CanvasNode): ValidationError[] {
  const errors: ValidationError[] = [];

  if (node.type !== 'agent') return errors;

  const data = node.data as AgentNodeData;
  const config = data.config;

  // Check required fields
  if (!config.id || config.id.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'id',
      message: 'Agent ID is required',
      severity: 'error',
    });
  }

  if (!config.name || config.name.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'name',
      message: 'Agent name is required',
      severity: 'error',
    });
  }

  if (!config.instructions || config.instructions.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'instructions',
      message: 'Agent instructions are required',
      severity: 'warning',
    });
  }

  // Check model configuration
  if (!config.model || !config.model.provider || !config.model.name) {
    errors.push({
      nodeId: node.id,
      field: 'model',
      message: 'Model configuration is incomplete',
      severity: 'warning',
    });
  }

  return errors;
}

/**
 * Validate a Step node
 */
export function validateStepNode(node: CanvasNode): ValidationError[] {
  const errors: ValidationError[] = [];

  if (node.type !== 'step') return errors;

  const data = node.data as StepNodeData;
  const config = data.config;

  // Check required fields
  if (!config.id || config.id.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'id',
      message: 'Step ID is required',
      severity: 'error',
    });
  }

  if (!config.description || config.description.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'description',
      message: 'Step description is recommended',
      severity: 'info',
    });
  }

  if (!config.executeCode || config.executeCode.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'executeCode',
      message: 'Execute function is required',
      severity: 'error',
    });
  } else {
    // Basic syntax check
    try {
      // Check if it's a valid function syntax
      if (!config.executeCode.includes('=>') && !config.executeCode.includes('function')) {
        errors.push({
          nodeId: node.id,
          field: 'executeCode',
          message: 'Execute code should be a valid function',
          severity: 'warning',
        });
      }
    } catch (err) {
      errors.push({
        nodeId: node.id,
        field: 'executeCode',
        message: 'Execute code may have syntax errors',
        severity: 'warning',
      });
    }
  }

  return errors;
}

/**
 * Validate a Tool node
 */
export function validateToolNode(node: CanvasNode): ValidationError[] {
  const errors: ValidationError[] = [];

  if (node.type !== 'tool') return errors;

  const data = node.data as ToolNodeData;
  const config = data.config;

  // Check required fields
  if (!config.id || config.id.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'id',
      message: 'Tool ID is required',
      severity: 'error',
    });
  }

  if (!config.description || config.description.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'description',
      message: 'Tool description is required',
      severity: 'warning',
    });
  }

  if (!config.executeCode || config.executeCode.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'executeCode',
      message: 'Execute function is required',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Validate an MCP Server node
 */
export function validateMCPServerNode(node: CanvasNode): ValidationError[] {
  const errors: ValidationError[] = [];

  if (node.type !== 'mcpserver') return errors;

  const data = node.data as MCPServerNodeData;
  const config = data.config;

  // Check required fields
  if (!config.id || config.id.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'id',
      message: 'MCP Server ID is required',
      severity: 'error',
    });
  }

  if (!config.name || config.name.trim() === '') {
    errors.push({
      nodeId: node.id,
      field: 'name',
      message: 'MCP Server name is required',
      severity: 'error',
    });
  }

  if (!config.type) {
    errors.push({
      nodeId: node.id,
      field: 'type',
      message: 'Server type is required',
      severity: 'error',
    });
  }

  if (!config.transport) {
    errors.push({
      nodeId: node.id,
      field: 'transport',
      message: 'Transport is required',
      severity: 'error',
    });
  }

  // Validate transport-specific configuration
  if (config.transport === 'stdio') {
    if (!config.command || config.command.trim() === '') {
      errors.push({
        nodeId: node.id,
        field: 'command',
        message: 'Command is required for stdio transport',
        severity: 'error',
      });
    }
  } else if (config.transport === 'http' || config.transport === 'ws') {
    if (!config.url || config.url.trim() === '') {
      errors.push({
        nodeId: node.id,
        field: 'url',
        message: `URL is required for ${config.transport} transport`,
        severity: 'error',
      });
    } else {
      // Basic URL validation
      try {
        new URL(config.url);
      } catch {
        errors.push({
          nodeId: node.id,
          field: 'url',
          message: 'Invalid URL format',
          severity: 'error',
        });
      }
    }
  }

  return errors;
}

/**
 * Validate all nodes in the canvas
 */
export function validateAllNodes(nodes: CanvasNode[]): ValidationError[] {
  const allErrors: ValidationError[] = [];

  for (const node of nodes) {
    let nodeErrors: ValidationError[] = [];

    switch (node.type) {
      case 'agent':
        nodeErrors = validateAgentNode(node);
        break;
      case 'step':
        nodeErrors = validateStepNode(node);
        break;
      case 'tool':
        nodeErrors = validateToolNode(node);
        break;
      case 'mcpserver':
        nodeErrors = validateMCPServerNode(node);
        break;
      // Add more node type validators as needed
      default:
        // No validation for other node types yet
        break;
    }

    allErrors.push(...nodeErrors);
  }

  return allErrors;
}

/**
 * Check if a node has any errors
 */
export function hasErrors(nodeId: string, errors: ValidationError[]): boolean {
  return errors.some(err => err.nodeId === nodeId && err.severity === 'error');
}

/**
 * Check if a node has any warnings
 */
export function hasWarnings(nodeId: string, errors: ValidationError[]): boolean {
  return errors.some(err => err.nodeId === nodeId && err.severity === 'warning');
}

/**
 * Get all errors for a specific node
 */
export function getNodeErrors(nodeId: string, errors: ValidationError[]): ValidationError[] {
  return errors.filter(err => err.nodeId === nodeId);
}
