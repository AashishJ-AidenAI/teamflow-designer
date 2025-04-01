
import { Node, Edge } from "@xyflow/react";
import { Condition } from "@/components/builder/nodes/IfNode";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Check if graph has cycles
const hasCycle = (
  nodes: Node[], 
  edges: Edge[], 
  startNodeId: string,
  visited = new Set<string>(),
  recursionStack = new Set<string>()
): boolean => {
  if (recursionStack.has(startNodeId)) {
    return true; // Cycle detected
  }
  
  if (visited.has(startNodeId)) {
    return false; // Already visited, no cycle through this path
  }
  
  visited.add(startNodeId);
  recursionStack.add(startNodeId);
  
  const outgoingEdges = edges.filter(edge => edge.source === startNodeId);
  
  for (const edge of outgoingEdges) {
    if (hasCycle(nodes, edges, edge.target, visited, recursionStack)) {
      return true;
    }
  }
  
  recursionStack.delete(startNodeId);
  return false;
};

// Check for unlinked nodes - each node (except input) should have incoming connection
const hasUnlinkedNodes = (nodes: Node[], edges: Edge[]): string[] => {
  const unlinkedNodes: string[] = [];
  
  for (const node of nodes) {
    // Input nodes don't need incoming connections
    if (node.type === "input") continue;
    
    // Check if node has any incoming edges
    const hasIncoming = edges.some(edge => edge.target === node.id);
    if (!hasIncoming) {
      unlinkedNodes.push(node.id);
    }
  }
  
  return unlinkedNodes;
};

// Check if flow is sequential (does not branch unless through an if-node)
const isSequential = (nodes: Node[], edges: Edge[]): boolean => {
  for (const node of nodes) {
    // Skip if-nodes which are allowed to have multiple outgoing edges
    if (node.type === "if") continue;
    
    // Count outgoing edges for this node
    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    if (outgoingEdges.length > 1) {
      return false;
    }
  }
  
  return true;
};

// Check if workflow has exactly one input and at least one output
const validateEndpoints = (nodes: Node[]): string[] => {
  const errors: string[] = [];
  const inputNodes = nodes.filter(node => node.type === "input");
  const outputNodes = nodes.filter(node => node.type === "output");
  
  if (inputNodes.length === 0) {
    errors.push("Workflow must have an Input node");
  } else if (inputNodes.length > 1) {
    errors.push("Workflow must have exactly one Input node");
  }
  
  if (outputNodes.length === 0) {
    errors.push("Workflow must have at least one Output node");
  }
  
  return errors;
};

// Validate condition format
const validateCondition = (condition: Condition | string): string[] => {
  const errors: string[] = [];
  
  if (typeof condition === 'string') {
    // Simple validation for string conditions
    if (condition.trim() === '') {
      errors.push("Condition cannot be empty");
    }
  } else if (condition) {
    // Object condition validation
    if ('operator' in condition) {
      // Simple condition
      if (!condition.left || condition.left.trim() === '') {
        errors.push("Condition left operand cannot be empty");
      }
      // Right can be various types including boolean false, number 0, etc.
      if (condition.right === undefined || condition.right === null) {
        errors.push("Condition right operand cannot be empty");
      }
    } else if ('type' in condition && 'conditions' in condition) {
      // Complex condition
      if (!condition.type) {
        errors.push("Condition type (AND/OR) must be specified");
      }
      
      if (!condition.conditions || !Array.isArray(condition.conditions) || condition.conditions.length === 0) {
        errors.push("Condition must have at least one sub-condition");
      } else {
        // Recursively validate sub-conditions
        for (const subCondition of condition.conditions) {
          const subErrors = validateCondition(subCondition);
          errors.push(...subErrors);
        }
      }
    } else {
      errors.push("Invalid condition format");
    }
  } else {
    errors.push("Condition is required");
  }
  
  return errors;
};

// Validate that all paths from input eventually reach an output
const validateAllPathsEndAtOutput = (nodes: Node[], edges: Edge[]): boolean => {
  const inputNode = nodes.find(node => node.type === "input");
  if (!inputNode) return false;
  
  const outputNodeIds = new Set(
    nodes.filter(node => node.type === "output").map(node => node.id)
  );
  
  // BFS to check if all paths from input lead to an output
  const queue: string[] = [inputNode.id];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    
    // If output node, we're good for this path
    if (outputNodeIds.has(nodeId)) continue;
    
    // Get all outgoing edges for this node
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    // If node has no outgoing edges and isn't an output, it's a dead end
    if (outgoingEdges.length === 0) return false;
    
    // Add destination nodes to queue
    for (const edge of outgoingEdges) {
      queue.push(edge.target);
    }
  }
  
  return true;
};

// Validate nodes and their data
const validateNodeData = (nodes: Node[]): string[] => {
  const errors: string[] = [];
  
  for (const node of nodes) {
    if (!node.data) {
      errors.push(`Node ${node.id} is missing data`);
      continue;
    }
    
    // Validate common fields
    if (!node.data.label) {
      errors.push(`Node ${node.id} is missing a label`);
    }
    
    // Type-specific validation
    if (node.type === 'if') {
      if (!node.data.condition) {
        errors.push(`If node ${node.id} is missing a condition`);
      } else {
        // Validate condition format
        const conditionErrors = validateCondition(node.data.condition);
        if (conditionErrors.length > 0) {
          errors.push(`If node ${node.id} has invalid condition: ${conditionErrors.join(', ')}`);
        }
      }
    } else if (node.type === 'agent') {
      if (!node.data.llm) {
        errors.push(`Agent node ${node.id} is missing LLM model`);
      }
      if (!node.data.tools || !Array.isArray(node.data.tools) || node.data.tools.length === 0) {
        errors.push(`Agent node ${node.id} has no tools specified`);
      }
    } else if (node.type === 'input' || node.type === 'output') {
      if (!node.data.format) {
        errors.push(`${node.type} node ${node.id} is missing format specification`);
      }
      if (!node.data.description) {
        errors.push(`${node.type} node ${node.id} is missing description`);
      }
    }
  }
  
  return errors;
};

// Validate edge connections for if nodes
const validateIfNodeConnections = (nodes: Node[], edges: Edge[]): string[] => {
  const errors: string[] = [];
  
  // Get all if nodes
  const ifNodes = nodes.filter(node => node.type === 'if');
  
  for (const ifNode of ifNodes) {
    // Get outgoing edges for this if node
    const outgoingEdges = edges.filter(edge => edge.source === ifNode.id);
    
    // Check if both true and false branches exist
    const hasTrueBranch = outgoingEdges.some(edge => edge.sourceHandle === 'true');
    const hasFalseBranch = outgoingEdges.some(edge => edge.sourceHandle === 'false');
    
    if (!hasTrueBranch && !hasFalseBranch) {
      errors.push(`If node ${ifNode.id} has no outgoing connections`);
    } else if (!hasTrueBranch) {
      errors.push(`If node ${ifNode.id} is missing the 'true' branch connection`);
    } else if (!hasFalseBranch) {
      errors.push(`If node ${ifNode.id} is missing the 'false' branch connection`);
    }
  }
  
  return errors;
};

export const validateWorkflow = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const errors: string[] = [];
  
  // Check for required endpoints
  const endpointErrors = validateEndpoints(nodes);
  errors.push(...endpointErrors);
  
  // If we don't have proper endpoints, no need for further checks
  if (endpointErrors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Check for unlinked nodes
  const unlinkedNodeIds = hasUnlinkedNodes(nodes, edges);
  if (unlinkedNodeIds.length > 0) {
    const nodeLabels = unlinkedNodeIds.map(id => {
      const node = nodes.find(n => n.id === id);
      return node?.data?.label || id;
    });
    errors.push(`Unlinked nodes detected: ${nodeLabels.join(", ")}`);
  }
  
  // Check for sequentiality (except if-nodes)
  if (!isSequential(nodes, edges)) {
    errors.push("Non-sequential workflow detected. Only If Statement nodes can have multiple paths.");
  }
  
  // Check for cycles
  const inputNode = nodes.find(node => node.type === "input");
  if (inputNode && hasCycle(nodes, edges, inputNode.id)) {
    errors.push("Workflow contains cycles, which are not allowed");
  }
  
  // Check all paths lead to output
  if (inputNode && !validateAllPathsEndAtOutput(nodes, edges)) {
    errors.push("All paths in the workflow must lead to an Output node");
  }
  
  // Validate node data
  const nodeDataErrors = validateNodeData(nodes);
  errors.push(...nodeDataErrors);
  
  // Validate if node connections
  const ifNodeConnectionErrors = validateIfNodeConnections(nodes, edges);
  errors.push(...ifNodeConnectionErrors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Transform workflow for storage/export
export const formatWorkflowForExport = (nodes: Node[], edges: Edge[]) => {
  const formattedNodes = nodes.map(node => {
    const { id, type, position, data } = node;
    
    // Remove onUpdate function from data
    const nodeData = { ...data };
    delete nodeData.onUpdate;
    
    return {
      id,
      type,
      position,
      data: nodeData
    };
  });
  
  const formattedEdges = edges.map(edge => {
    const { id, source, target, sourceHandle, targetHandle } = edge;
    
    // For if node connections, transform sourceHandle to conditionHandle
    const formattedEdge: any = {
      id,
      source,
      target
    };
    
    if (sourceHandle === 'true' || sourceHandle === 'false') {
      formattedEdge.conditionHandle = sourceHandle;
    }
    
    return formattedEdge;
  });
  
  return {
    nodes: formattedNodes,
    edges: formattedEdges
  };
};
