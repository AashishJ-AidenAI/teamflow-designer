
import { Node, Edge } from '@xyflow/react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Define types for condition operators
export type ConditionOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';

// Define the basic Condition type
export interface SimpleCondition {
  operator: ConditionOperator;
  left: string;
  right: any;
}

// Define types for composite conditions
export interface CompositeCondition {
  type: 'AND' | 'OR';
  conditions: Array<Condition>;
}

// Union type for all possible conditions
export type Condition = SimpleCondition | CompositeCondition;

// Function to check if a node is reachable from the entry point
function isNodeReachable(nodeId: string, edges: Edge[], visitedNodes: Set<string>): boolean {
  // If we've already visited this node, return true
  if (visitedNodes.has(nodeId)) {
    return true;
  }
  
  // Add this node to visited nodes
  visitedNodes.add(nodeId);
  
  // Find all edges that target this node
  const incomingEdges = edges.filter(edge => edge.target === nodeId);
  
  // If there are no incoming edges, this node is not reachable
  if (incomingEdges.length === 0) {
    return false;
  }
  
  // Check if any of the source nodes of incoming edges are reachable
  return incomingEdges.some(edge => isNodeReachable(edge.source, edges, visitedNodes));
}

// Validate a workflow by checking for common errors
export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];
  
  // Check if there are any nodes
  if (nodes.length === 0) {
    errors.push("Workflow must have at least one node");
    return { isValid: false, errors };
  }
  
  // Find input and output nodes
  const inputNodes = nodes.filter(node => node.type === 'input');
  const outputNodes = nodes.filter(node => node.type === 'output');
  
  // Check if there is at least one input node
  if (inputNodes.length === 0) {
    errors.push("Workflow must have at least one input node");
  }
  
  // Check if there is at least one output node
  if (outputNodes.length === 0) {
    errors.push("Workflow must have at least one output node");
  }
  
  // Check for nodes with no connections
  nodes.forEach(node => {
    const nodeHasIncomingConnection = edges.some(edge => edge.target === node.id);
    const nodeHasOutgoingConnection = edges.some(edge => edge.source === node.id);
    
    // Input nodes should have no incoming connections
    if (node.type === 'input' && nodeHasIncomingConnection) {
      errors.push(`Input node "${node.data?.label || node.id}" should not have incoming connections`);
    }
    
    // Output nodes should have no outgoing connections
    if (node.type === 'output' && nodeHasOutgoingConnection) {
      errors.push(`Output node "${node.data?.label || node.id}" should not have outgoing connections`);
    }
    
    // Non-input nodes should have incoming connections
    if (node.type !== 'input' && !nodeHasIncomingConnection) {
      errors.push(`Node "${node.data?.label || node.id}" has no incoming connections`);
    }
    
    // Non-output nodes should have outgoing connections
    if (node.type !== 'output' && !nodeHasOutgoingConnection) {
      errors.push(`Node "${node.data?.label || node.id}" has no outgoing connections`);
    }
  });
  
  // Check if all output nodes are reachable from input nodes
  outputNodes.forEach(outputNode => {
    let isReachable = false;
    
    inputNodes.forEach(inputNode => {
      const visitedNodes = new Set<string>();
      if (isNodeReachableFromSource(inputNode.id, outputNode.id, edges, visitedNodes)) {
        isReachable = true;
      }
    });
    
    if (!isReachable) {
      errors.push(`Output node "${outputNode.data?.label || outputNode.id}" is not reachable from any input node`);
    }
  });
  
  // Validate conditions in 'if' nodes
  nodes.filter(node => node.type === 'if').forEach(ifNode => {
    try {
      if (!ifNode.data?.condition) {
        errors.push(`If node "${ifNode.data?.label || ifNode.id}" must have a condition defined`);
      } else {
        validateCondition(ifNode.data.condition);
      }
    } catch (error) {
      if (error instanceof Error) {
        errors.push(`Invalid condition in if node "${ifNode.data?.label || ifNode.id}": ${error.message}`);
      } else {
        errors.push(`Invalid condition in if node "${ifNode.data?.label || ifNode.id}"`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Check if a node is reachable from a source node
function isNodeReachableFromSource(
  sourceId: string, 
  targetId: string, 
  edges: Edge[], 
  visitedNodes: Set<string>
): boolean {
  // If we've reached the target, return true
  if (sourceId === targetId) {
    return true;
  }
  
  // If we've already visited this node, return false to avoid cycles
  if (visitedNodes.has(sourceId)) {
    return false;
  }
  
  // Add this node to visited nodes
  visitedNodes.add(sourceId);
  
  // Find all edges that start from this node
  const outgoingEdges = edges.filter(edge => edge.source === sourceId);
  
  // Check if the target is reachable from any of the destinations of outgoing edges
  return outgoingEdges.some(edge => 
    isNodeReachableFromSource(edge.target, targetId, edges, visitedNodes)
  );
}

// Validate a condition recursively
function validateCondition(condition: Condition | string): void {
  // If condition is a string, it's an error
  if (typeof condition === 'string') {
    throw new Error(`Invalid condition format: "${condition}"`);
  }
  
  // Check if it's a composite condition (AND/OR)
  if ('type' in condition) {
    if (!condition.conditions || !Array.isArray(condition.conditions)) {
      throw new Error(`Composite condition must have an array of conditions`);
    }
    
    // Validate each sub-condition
    condition.conditions.forEach(subCondition => {
      validateCondition(subCondition);
    });
  } 
  // It's a simple condition
  else if ('operator' in condition) {
    if (!condition.operator) {
      throw new Error('Condition must have an operator');
    }
    
    if (condition.left === undefined || condition.left === null) {
      throw new Error('Condition must have a left operand');
    }
    
    if (condition.right === undefined || condition.right === null) {
      throw new Error('Condition must have a right operand');
    }
  } else {
    throw new Error('Invalid condition format');
  }
}

// Format the workflow for export, removing any internal implementation details
export function formatWorkflowForExport(nodes: Node[], edges: Edge[]) {
  // Clean up nodes by removing internal implementation details
  const formattedNodes = nodes.map(node => {
    const { data, ...rest } = node;
    
    // Create a copy of the data without the onUpdate function
    const { onUpdate, ...cleanData } = data;
    
    return {
      ...rest,
      data: cleanData
    };
  });
  
  // Clean up edges if needed
  const formattedEdges = edges.map(edge => {
    // Remove any internal properties not needed for export
    const { id, source, target, sourceHandle, targetHandle, conditionHandle, animated, style, markerEnd } = edge;
    
    // Only include essential properties
    const formattedEdge: any = {
      id,
      source,
      target
    };
    
    // Only include these properties if they exist
    if (sourceHandle) formattedEdge.sourceHandle = sourceHandle;
    if (targetHandle) formattedEdge.targetHandle = targetHandle;
    if (conditionHandle) formattedEdge.conditionHandle = conditionHandle;
    
    return formattedEdge;
  });
  
  return {
    nodes: formattedNodes,
    edges: formattedEdges
  };
}
