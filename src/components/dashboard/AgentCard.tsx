
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Edit, Trash2, Copy, Users } from "lucide-react";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    llm: string;
    tools: string[];
    clientAssigned?: string[];
    active?: boolean;
  };
  onEdit: () => void;
  onAssignClients?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onAssignClients }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          {agent.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">LLM Model</span>
            <Badge variant="outline">{agent.llm}</Badge>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tools</span>
              <Badge variant="outline">{agent.tools.length}</Badge>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {agent.tools.map((tool, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          
          {agent.clientAssigned && (
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assigned Clients</span>
                <Badge variant="outline">{agent.clientAssigned.length}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {agent.clientAssigned.slice(0, 3).map((client, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {client}
                  </Badge>
                ))}
                {agent.clientAssigned.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{agent.clientAssigned.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 pb-4 border-t mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-xs"
          onClick={onAssignClients}
        >
          <Users className="h-3 w-3" />
          Assign
        </Button>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
