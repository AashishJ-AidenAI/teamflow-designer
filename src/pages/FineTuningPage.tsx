
import AgentWorkflowBuilder from "@/components/builder/AgentWorkflowBuilder";

const FineTuningPage = () => {
  return (
    <div className="h-full w-full" style={{ height: "calc(100vh - 64px)" }}>
      <AgentWorkflowBuilder />
    </div>
  );
};

export default FineTuningPage;
