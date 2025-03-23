
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Users, FlaskConical, ArrowRight, GitBranch, Zap, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [animateFeatures, setAnimateFeatures] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setAnimateFeatures(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-border">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">AI Agent Builder</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-sm font-medium hover:text-primary transition-colors">
              Workflow
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>
          
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-team max-w-3xl">
              Build Advanced AI Agent Workflows With Ease
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Create, connect, and manage AI agents and teams with our intuitive drag-and-drop interface. 
              Maximize the potential of your AI systems with minimal effort.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            
            <div className="mt-16 max-w-5xl w-full h-64 sm:h-80 rounded-xl bg-gradient-to-br from-background via-primary/5 to-team/5 border border-border p-1">
              <div className="w-full h-full rounded-lg bg-card/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-medium text-muted-foreground">
                    Agent Builder Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center">Key Features</h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to build sophisticated AI agent systems.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className={`overflow-hidden transition-all duration-500 ${animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} 
                style={{ transitionDelay: '0ms' }}>
                <CardHeader className="p-6 pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Agent Builder</CardTitle>
                  <CardDescription>
                    Drag-and-drop interface to create and connect AI agents with customizable capabilities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Visual workflow creation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>LLM selection and configuration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Custom toolset integration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={`overflow-hidden transition-all duration-500 ${animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} 
                style={{ transitionDelay: '100ms' }}>
                <CardHeader className="p-6 pb-4">
                  <div className="w-12 h-12 rounded-full bg-team/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-team" />
                  </div>
                  <CardTitle>Agent Teams</CardTitle>
                  <CardDescription>
                    Group agents together to form teams with different execution strategies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-team" />
                      <span>Parallel execution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <List className="h-4 w-4 text-team" />
                      <span>Selection-based execution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-team" />
                      <span>Sequential flowchart execution</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={`overflow-hidden transition-all duration-500 ${animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} 
                style={{ transitionDelay: '200ms' }}>
                <CardHeader className="p-6 pb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <FlaskConical className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>Testing Lab</CardTitle>
                  <CardDescription>
                    Test your agents and teams before deploying them to production.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>Chat-based agent testing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>Background process testing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>Real-time result display</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Workflow Section */}
        <section id="workflow" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center">How It Works</h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the process of building and managing AI agent systems.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-medium">Design</h3>
                <p className="mt-2 text-muted-foreground">
                  Create agents and teams using our intuitive drag-and-drop interface.
                </p>
                
                <div className="hidden md:block absolute top-8 right-0 w-24 h-0.5 bg-border before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:border-t-4 before:border-r-4 before:border-b-4 before:border-l-0 before:border-t-transparent before:border-r-border before:border-b-transparent" />
              </div>
              
              <div className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-team/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-team">2</span>
                </div>
                <h3 className="text-xl font-medium">Test</h3>
                <p className="mt-2 text-muted-foreground">
                  Verify your agents and teams work as expected in our testing lab.
                </p>
                
                <div className="hidden md:block absolute top-8 right-0 w-24 h-0.5 bg-border before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:border-t-4 before:border-r-4 before:border-b-4 before:border-l-0 before:border-t-transparent before:border-r-border before:border-b-transparent" />
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-500">3</span>
                </div>
                <h3 className="text-xl font-medium">Deploy</h3>
                <p className="mt-2 text-muted-foreground">
                  Deploy your agents and teams to production and monitor their performance.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Start building your AI agent workflows today and unlock the full potential of your AI systems.
            </p>
            
            <Button size="lg" onClick={handleGetStarted} className="mt-8 gap-2">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Agent Builder</span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            © 2023 AI Agent Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
