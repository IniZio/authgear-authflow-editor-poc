import { useState, useCallback, useEffect } from 'react'
import { 
  useNodesState, 
  useEdgesState, 
  Node, 
  Connection,
} from 'reactflow'
import { FlowCanvas } from './components/FlowCanvas'
import { YamlPreview } from './components/YamlPreview'
import { StepForm } from './components/StepForm'
import { convertStepsToNodesAndEdges, convertAuthflowToYaml } from './utils/converter'
import { AuthflowStep, AuthflowConfig } from './types/authflow'
import { RECIPES } from './data/recipes'
import { FRIENDLY_STEP_NAMES } from './data/terminology'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, RotateCcw, Box, Library, Sparkles } from "lucide-react"

const INITIAL_CONFIG: AuthflowConfig = {
  signup_flows: [
    {
      name: 'default_signup_flow',
      steps: [
        {
          _uuid: 's1',
          type: 'identify',
          name: 'setup_identity',
          one_of: [
            {
              identification: 'email',
              steps: [
                { _uuid: 's2', type: 'authenticate', authentication: 'primary_oob_otp_email', target_step: 'setup_identity' },
                { _uuid: 's3', type: 'verify', target_step: 'setup_identity' }
              ]
            }
          ]
        }
      ]
    }
  ],
  login_flows: [
    {
      name: 'default_login_flow',
      steps: [
        { _uuid: 'l1', type: 'identify', one_of: [{ identification: 'email' }] },
        { _uuid: 'l2', type: 'authenticate', one_of: [{ authentication: 'primary_password' }] }
      ]
    }
  ]
};

function App() {
  const [config, setConfig] = useState<AuthflowConfig>(INITIAL_CONFIG);
  const [currentFlowType, setCurrentFlowType] = useState<keyof AuthflowConfig>('signup_flows');
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  
  const currentFlow = config[currentFlowType]?.[currentFlowIndex];
  const steps = currentFlow?.steps || [];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Sync steps to nodes/edges
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = convertStepsToNodesAndEdges(steps);
    setNodes(newNodes);
    setEdges(newEdges);
    
    if (selectedNode) {
      const updated = newNodes.find(n => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    }
  }, [steps]);

  const updateConfig = useCallback((updater: (prev: AuthflowConfig) => AuthflowConfig) => {
    setConfig(prev => {
      const next = updater(prev);
      return JSON.parse(JSON.stringify(next));
    });
  }, []);

  const updateStep = useCallback((updatedStep: AuthflowStep) => {
    updateConfig(prev => {
      const list = prev[currentFlowType];
      if (!list || !list[currentFlowIndex]) return prev;
      
      const replace = (steps: AuthflowStep[]) => {
        for (let i = 0; i < steps.length; i++) {
          if (steps[i]._uuid === updatedStep._uuid) {
            steps[i] = updatedStep;
            return true;
          }
          if (steps[i].one_of) {
            for (const branch of steps[i].one_of!) {
              if (branch.steps && replace(branch.steps)) return true;
            }
          }
        }
        return false;
      };
      
      replace(list[currentFlowIndex].steps);
      return prev;
    });
  }, [currentFlowType, currentFlowIndex, updateConfig]);

  const deleteStep = useCallback((uuid: string) => {
    updateConfig(prev => {
      const list = prev[currentFlowType];
      if (!list || !list[currentFlowIndex]) return prev;
      
      const remove = (steps: AuthflowStep[]) => {
        for (let i = 0; i < steps.length; i++) {
          if (steps[i]._uuid === uuid) {
            steps.splice(i, 1);
            return true;
          }
          if (steps[i].one_of) {
            for (const branch of steps[i].one_of!) {
              if (branch.steps && remove(branch.steps)) return true;
            }
          }
        }
        return false;
      };
      
      remove(list[currentFlowIndex].steps);
      return prev;
    });
    setSelectedNode(null);
  }, [currentFlowType, currentFlowIndex, updateConfig]);

  useEffect(() => {
    (window as any).deleteStep = deleteStep;
  }, [deleteStep]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (sourceNode && targetNode) {
      const sourceStep = sourceNode.data.step;
      const targetId = targetNode.data.step.id || targetNode.data.step.name;
      
      if (targetId) {
        updateStep({
          ...sourceStep,
          target_step: targetId
        });
      }
    }
  }, [nodes, updateStep]);

  const yamlOutput = convertAuthflowToYaml(steps);

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-card shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Authflow <span className="text-muted-foreground font-normal">Visualizer</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Select 
            value={currentFlowType}
            onValueChange={(value) => {
              setCurrentFlowType(value as keyof AuthflowConfig);
              setCurrentFlowIndex(0);
              setSelectedNode(null);
            }}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select flow type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="signup_flows">signup_flows</SelectItem>
                <SelectItem value="login_flows">login_flows</SelectItem>
                <SelectItem value="signup_login_flows">signup_login_flows</SelectItem>
                <SelectItem value="reauth_flows">reauth_flows</SelectItem>
                <SelectItem value="account_recovery_flows">account_recovery_flows</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button 
            variant="default"
            size="sm"
            onClick={() => {
              const name = prompt('Flow name?', 'new_flow');
              if (name) {
                const newFlow = { name, steps: [] };
                setConfig(prev => {
                  const existing = prev[currentFlowType] || [];
                  const nextIndex = existing.length;
                  setCurrentFlowIndex(nextIndex);
                  return {
                    ...prev,
                    [currentFlowType]: [...existing, newFlow]
                  };
                });
                setSelectedNode(null);
              }
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> New Flow
          </Button>
          <Separator orientation="vertical" className="h-8 mx-1" />
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Reset everything to initial state?')) {
                setConfig(INITIAL_CONFIG);
                setCurrentFlowType('signup_flows');
                setCurrentFlowIndex(0);
                setSelectedNode(null);
              }
            }}
            className="gap-2 text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r flex flex-col bg-card shadow-sm shrink-0">
          <Tabs defaultValue="editor" className="flex flex-col h-full">
            <div className="px-4 pt-4 shrink-0">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="editor" className="gap-2">
                  <Box className="w-4 h-4" /> Editor
                </TabsTrigger>
                <TabsTrigger value="recipes" className="gap-2">
                  <Library className="w-4 h-4" /> Recipes
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="editor" className="p-6 mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      {selectedNode ? `Editing: ${FRIENDLY_STEP_NAMES[selectedNode.data.step.type] || selectedNode.data.step.type}` : 'Property Editor'}
                    </h2>
                    {!selectedNode ? (
                      <Card className="bg-muted/50 border-dashed">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            Click a node on the canvas to configure its properties.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <StepForm 
                        step={selectedNode.data.step} 
                        onChange={updateStep} 
                      />
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quick Add Steps</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {['identify', 'authenticate', 'verify', 'user_profile'].map(type => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          className="justify-between h-9 px-3 group transition-all hover:border-primary/50 hover:bg-primary/5"
                          onClick={() => {
                            const newStep: AuthflowStep = {
                              _uuid: Math.random().toString(36).substr(2, 9),
                              type: type,
                              name: `new_${type}_step`
                            };
                            
                            setConfig(prev => {
                              const next = JSON.parse(JSON.stringify(prev));
                              if (!next[currentFlowType]) next[currentFlowType] = [];
                              
                              let list = next[currentFlowType];
                              if (!list[currentFlowIndex]) {
                                list[currentFlowIndex] = { name: 'default_flow', steps: [] };
                              }
                              
                              list[currentFlowIndex].steps.push(newStep);
                              return next;
                            });
                          }}
                        >
                          <span className="text-xs font-medium">{FRIENDLY_STEP_NAMES[type] || type}</span>
                          <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recipes" className="p-6 mt-0 space-y-4">
                <div className="mb-6">
                  <h2 className="text-sm font-semibold mb-1">Pre-built Recipes</h2>
                  <p className="text-xs text-muted-foreground">Load high-converting flow templates.</p>
                </div>
                {RECIPES.map(recipe => (
                  <Card 
                    key={recipe.id}
                    className="cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-all group overflow-hidden"
                    onClick={() => {
                      if (confirm(`Load "${recipe.name}"? Current flow will be replaced.`)) {
                        setConfig(prev => {
                          const next = { ...prev };
                          if (!next[currentFlowType]) next[currentFlowType] = [];
                          
                          const newList = [...next[currentFlowType]];
                          const newFlow = { name: recipe.id, steps: JSON.parse(JSON.stringify(recipe.steps)) };
                          
                          if (newList[currentFlowIndex]) {
                            newList[currentFlowIndex] = newFlow;
                          } else {
                            newList.push(newFlow);
                            setCurrentFlowIndex(newList.length - 1);
                          }
                          
                          next[currentFlowType] = newList;
                          return next;
                        });
                        setSelectedNode(null);
                      }
                    }}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
                      <CardDescription className="text-[11px] leading-tight line-clamp-2">{recipe.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </aside>

        <section className="flex-1 relative bg-slate-50/50">
          <FlowCanvas 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
          />
        </section>

        <aside className="w-96 border-l bg-card shrink-0 overflow-hidden flex flex-col">
          <div className="p-6 h-full">
            <YamlPreview yaml={yamlOutput} />
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
