
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserCheck, AlertTriangle, TrendingUp } from "lucide-react";

// Sample data for charts
const responseTimeData = [
  { name: "Agent 1", value: 220 },
  { name: "Agent 2", value: 300 },
  { name: "Agent 3", value: 150 },
  { name: "Agent 4", value: 180 },
  { name: "Agent 5", value: 250 },
];

const usageData = [
  { name: "Agent 1", value: 35 },
  { name: "Agent 2", value: 20 },
  { name: "Agent 3", value: 15 },
  { name: "Agent 4", value: 20 },
  { name: "Agent 5", value: 10 },
];

const healthData = [
  { name: "Healthy", value: 85 },
  { name: "Degraded", value: 10 },
  { name: "Failed", value: 5 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ef4444"];

const MetricsCard = ({ title, value, icon, description, trend, className = "" }) => (
  <Card className={`overflow-hidden ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent className="px-4 pt-0 pb-4">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        {trend > 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <div className="h-3 w-3" />}
        {description}
      </p>
    </CardContent>
  </Card>
);

const Metrics = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Real-time Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard 
          title="Response Time (Avg)" 
          value="220ms" 
          icon={<Clock className="h-4 w-4 text-primary" />}
          description="15% faster than last week"
          trend={1}
        />
        
        <MetricsCard 
          title="Active Agents" 
          value="12/15" 
          icon={<UserCheck className="h-4 w-4 text-primary" />}
          description="3 agents currently inactive"
          trend={0}
        />
        
        <MetricsCard 
          title="Total Executions" 
          value="1,254" 
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          description="23% increase from yesterday"
          trend={1}
        />
        
        <MetricsCard 
          title="Health Status" 
          value="85% Healthy" 
          icon={<AlertTriangle className="h-4 w-4 text-primary" />}
          description="5% agents with issues"
          trend={-1}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Response Time Per Agent</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={responseTimeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}ms`, "Response Time"]}
                    labelStyle={{ color: "var(--foreground)" }}
                    contentStyle={{ 
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)" 
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Most Used Agents</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usageData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Usage"]}
                    labelStyle={{ color: "var(--foreground)" }}
                    contentStyle={{ 
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)" 
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-md">Agent Health Status</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    labelStyle={{ color: "var(--foreground)" }}
                    contentStyle={{ 
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)" 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
