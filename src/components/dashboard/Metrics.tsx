
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserCheck, TrendingUp, DollarSign } from "lucide-react";

// Sample data for charts
const responseTimeData = [
  { name: "Agent 1", value: 220 },
  { name: "Agent 2", value: 300 },
  { name: "Agent 3", value: 150 },
  { name: "Agent 4", value: 180 },
  { name: "Agent 5", value: 250 },
];

const agentUsageData = [
  { name: "Customer Support Agent", value: 35 },
  { name: "Data Processing Agent", value: 28 },
  { name: "Sales Agent", value: 20 },
  { name: "Pre-screening Agent", value: 15 },
  { name: "Validation Agent", value: 10 },
];

const clientUsageData = [
  { name: "Acme Corp", value: 42 },
  { name: "Beta Industries", value: 28 },
  { name: "Catalyst Group", value: 18 },
  { name: "Delta Technologies", value: 12 },
  { name: "Epsilon Software", value: 8 },
];

const dailyExecutionsData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 180 },
  { name: "Wed", value: 160 },
  { name: "Thu", value: 200 },
  { name: "Fri", value: 250 },
  { name: "Sat", value: 100 },
  { name: "Sun", value: 80 },
];

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
          title="Total Expenditure" 
          value="$427.50" 
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          description="$32.10 increase from yesterday"
          trend={-1}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Most used agents</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agentUsageData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 80,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Which client has used the agents the most</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientUsageData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 80,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Usage"]}
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
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-md">Daily Executions</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyExecutionsData}
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
                    formatter={(value) => [`${value}`, "Executions"]}
                    labelStyle={{ color: "var(--foreground)" }}
                    contentStyle={{ 
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)" 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
