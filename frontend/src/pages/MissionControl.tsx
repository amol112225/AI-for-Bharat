import { Users, Bot, Zap, TrendingUp, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const kpis = [
  { label: 'Leads Imported', value: '12,405', icon: Users, color: 'text-blue-400', glow: 'glow-blue' },
  { label: 'Active AI Agents', value: '42', icon: Bot, color: 'text-cyan-400', glow: 'glow-cyan' },
  { label: 'Avg First Response', value: '1.2s', icon: Zap, color: 'text-yellow-400', glow: 'glow-yellow' },
  { label: 'RM Load Reduced', value: '84%', icon: TrendingUp, color: 'text-green-400', glow: 'glow-green' },
];

const funnelStages = [
  { name: 'Upload', count: 12405, color: 'bg-slate-700' },
  { name: 'Contacted', count: 11200, color: 'bg-blue-600' },
  { name: 'Engaged', count: 8450, color: 'bg-cyan-600' },
  { name: 'Qualified', count: 4120, color: 'bg-purple-600' },
  { name: 'RM Handoff', count: 1850, color: 'bg-pink-600' },
  { name: 'Converted', count: 820, color: 'bg-green-500' },
];

const liveTicker = [
  { time: 'Just now', msg: 'Agent #12 calling Rahul...', type: 'action' },
  { time: '2s ago', msg: 'Hindi detected on L-8472', type: 'info' },
  { time: '14s ago', msg: 'Warm -> Hot (L-8421)', type: 'upgrade' },
  { time: '32s ago', msg: 'Objection handled (Pricing)', type: 'success' },
  { time: '1m ago', msg: 'RM Assigned: Priya (L-8302)', type: 'handoff' },
  { time: '1m ago', msg: 'Agent #04 completed sequence', type: 'info' },
  { time: '2m ago', msg: 'WhatsApp brochure sent (L-8299)', type: 'action' },
];

export default function MissionControl() {
  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-slate-400 text-sm mt-1">Global view of autonomous operations.</p>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass-panel p-5 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${kpi.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <Activity className={`w-4 h-4 ${kpi.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{kpi.value}</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-[400px]">
        {/* CENTER: Funnel */}
        <div className="col-span-8 glass-panel p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-8">Conversion Funnel</h2>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            {funnelStages.map((stage, i) => {
              const maxWidth = 100;
              const width = Math.max(20, (stage.count / funnelStages[0].count) * maxWidth);
              
              return (
                <div key={stage.name} className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-sm font-medium text-slate-300">{stage.name}</p>
                    <p className="text-xs text-slate-500">{stage.count.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 flex items-center">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-8 rounded-r-lg ${stage.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                    </motion.div>
                    {i < funnelStages.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-slate-600 ml-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Live Ticker */}
        <div className="col-span-4 glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-cyan-500 to-transparent" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Live Orchestration</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-medium">LIVE</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#0a0f1c] to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0f1c] to-transparent z-10" />
            
            <div className="space-y-4">
              {liveTicker.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 items-start border-l-2 border-white/10 pl-3 relative"
                >
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-[#0a0f1c] ${
                    item.type === 'action' ? 'bg-blue-500' :
                    item.type === 'upgrade' ? 'bg-yellow-500' :
                    item.type === 'success' ? 'bg-green-500' :
                    item.type === 'handoff' ? 'bg-purple-500' : 'bg-slate-500'
                  }`} />
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{item.time}</p>
                    <p className={`text-sm ${item.type === 'upgrade' ? 'text-yellow-400 font-medium' : 'text-slate-300'}`}>
                      {item.msg}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
