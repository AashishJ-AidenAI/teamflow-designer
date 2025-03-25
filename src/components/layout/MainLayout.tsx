
import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  Activity, 
  Layout, 
  FlaskConical, 
  User, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  // Set theme based on user preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span>AI Agent Builder</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">MAIN NAVIGATION</p>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => cn("nav-link flex items-center gap-2", isActive && "nav-link-active")}
          >
            <Layout className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/builder" 
            className={({ isActive }) => cn("nav-link flex items-center gap-2", isActive && "nav-link-active")}
          >
            <Users className="h-4 w-4" />
            <span>Agent Workflow Builder</span>
          </NavLink>
          
          <NavLink 
            to="/testing" 
            className={({ isActive }) => cn("nav-link flex items-center gap-2", isActive && "nav-link-active")}
          >
            <FlaskConical className="h-4 w-4" />
            <span>Testing Lab</span>
          </NavLink>
          
          <NavLink 
            to="/finetuning" 
            className={({ isActive }) => cn("nav-link flex items-center gap-2", isActive && "nav-link-active")}
          >
            <Cpu className="h-4 w-4" />
            <span>Fine-Tuning</span>
          </NavLink>
          
          <p className="px-3 text-xs font-semibold text-muted-foreground mt-6 mb-2">USER</p>
          <a href="#" className="nav-link flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </a>
          
          <a href="#" className="nav-link flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </a>
          
          <a href="#" className="nav-link flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </a>
          
          <a href="#" className="nav-link flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-full p-2 rounded-md border border-border hover:bg-secondary transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <h2 className="text-xl font-medium">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/builder" && "Agent Workflow Builder"}
            {location.pathname === "/testing" && "Testing Lab"}
            {location.pathname === "/finetuning" && "Fine-Tuning Lab"}
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                A
              </div>
              <span className="font-medium">Admin User</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-enter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
