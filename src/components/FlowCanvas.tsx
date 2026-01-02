import { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import StepNode from './StepNode';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: any) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
}

const nodeTypes: NodeTypes = {
  stepNode: StepNode,
};

export const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect,
  onNodeClick
}) => {
  const defaultEdgeOptions = useMemo(() => ({
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 3 },
  }), []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-white border-none shadow-xl rounded-lg overflow-hidden" />
      </ReactFlow>
    </div>
  );
};
