import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Mic, UserCheck, MessageSquare, BarChart3, Bot } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Mission Control', path: '/', icon: LayoutDashboard },
  { name: 'Lead Queue', path: '/queue', icon: Users },
  { name: 'Voice Console', path: '/console', icon: Mic },
  { name: 'RM Handoff', path: '/handoff', icon: UserCheck },
  { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-white/10 glass-panel flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center glow-cyan">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">AP Hunter</h1>
          <p className="text-xs text-cyan-400 font-medium tracking-wider uppercase">OS V2.4 Active</p>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 flex flex-col">
        <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-widest pl-3 mb-2">Modules</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group',
                isActive 
                  ? 'bg-blue-600/10 text-cyan-400 neon-border-blue' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="font-medium text-sm">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 mt-auto">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 blur-xl rounded-full" />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <span className="text-xs text-slate-300 font-medium">System Online</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="text-slate-500">Latency</p>
              <p className="text-white font-mono">12ms</p>
            </div>
            <div>
              <p className="text-slate-500">GPU</p>
              <p className="text-white font-mono">34%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
