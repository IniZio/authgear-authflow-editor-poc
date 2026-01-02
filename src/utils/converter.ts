import { Node, Edge, MarkerType } from 'reactflow';
import { AuthflowStep } from '../types/authflow';
import yaml from 'js-yaml';

export function convertAuthflowToYaml(steps: AuthflowStep[]): string {
  try {
    // Deep clone and remove internal _uuid
    const cleanSteps = JSON.parse(JSON.stringify(steps, (key, value) => {
      if (key === '_uuid') return undefined;
      return value;
    }));
    
    return yaml.dump(cleanSteps, {
      indent: 2,
      noRefs: true,
      lineWidth: -1,
    });
  } catch (e) {
    console.error('Failed to convert to YAML', e);
    return '# Error generating YAML';
  }
}

export function convertStepsToNodesAndEdges(
  steps: AuthflowStep[],
  parentId: string | null = null,
  startX = 0,
  startY = 0
): { nodes: Node[]; edges: Edge[] } {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  
  function processSteps(
    currentSteps: AuthflowStep[], 
    pId: string | null, 
    sX: number, 
    sY: number
  ): { nextY: number } {
    let currentY = sY;
    
    currentSteps.forEach((step, index) => {
      const nodeId = pId ? `${pId}-step-${index}` : `step-${index}`;
      const node: Node = {
        id: nodeId,
        type: 'stepNode',
        position: { x: sX, y: currentY },
        data: { step },
      };
      nodes.push(node);

      if (index > 0) {
        edges.push({
          id: `edge-${nodes[nodes.length - 2].id}-${nodeId}`,
          source: nodes[nodes.length - 2].id,
          target: nodeId,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      if (step.one_of) {
        let branchMaxY = currentY;
        step.one_of.forEach((branch, bIndex) => {
          const branchId = `${nodeId}-branch-${bIndex}`;
          const branchX = sX + 300 * (bIndex + 1);
          const branchY = currentY + 100;
          
          if (branch.steps) {
            const { nextY } = processSteps(branch.steps, branchId, branchX, branchY);
            branchMaxY = Math.max(branchMaxY, nextY);

            // Edge from step to first node of branch
            const firstBranchNodeId = `${branchId}-step-0`;
            const firstBranchNode = nodes.find(n => n.id === firstBranchNodeId);
            if (firstBranchNode) {
              edges.push({
                id: `edge-${nodeId}-${firstBranchNodeId}`,
                source: nodeId,
                target: firstBranchNodeId,
                label: branch.identification || branch.authentication || 'branch',
                markerEnd: { type: MarkerType.ArrowClosed },
              });
            }
          }
        });
        currentY = branchMaxY + 100;
      } else {
        currentY += 150;
      }
    });

    return { nextY: currentY };
  }

  processSteps(steps, parentId, startX, startY);

  // Second pass for target_step jumps
  nodes.forEach(node => {
    const step = node.data.step as AuthflowStep;
    
    // Check top-level target_step
    const targetId = step.target_step || (step.one_of?.find(b => b.target_step)?.target_step);
    
    if (targetId) {
      const targetNode = nodes.find(n => n.data.step.id === targetId || n.data.step.name === targetId);
      if (targetNode) {
        edges.push({
          id: `jump-${node.id}-${targetNode.id}`,
          source: node.id,
          target: targetNode.id,
          label: 'target_step',
          style: { stroke: '#ef4444', strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        });
      }
    }
  });

  return { nodes, edges };
}
