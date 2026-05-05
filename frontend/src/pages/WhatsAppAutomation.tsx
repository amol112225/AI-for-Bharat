import { MessageSquare, Check, CheckCheck, Clock, Send, FileText, Image as ImageIcon, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const sequences = [
  { id: 1, name: 'Warm Lead - Post Call', triggers: 'Call score 50-75', active: 450 },
  { id: 2, name: 'Hot Lead - Direct RM Intro', triggers: 'Call score > 75', active: 120 },
  { id: 3, name: 'No Answer - Drip Campaign', triggers: 'Call Unanswered', active: 890 },
];

export default function WhatsAppAutomation() {
  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">WhatsApp Automation</h1>
        <p className="text-slate-400 text-sm mt-1">Autonomous multi-channel engagement routing.</p>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 h-[calc(100vh-140px)]">
        
        {/* LEFT: Sequence Manager */}
        <div className="col-span-4 glass-panel p-6 flex flex-col relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Active Sequences</h2>
          
          <div className="space-y-4">
            {sequences.map((seq, i) => (
              <div key={seq.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-white/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold ${i === 0 ? 'text-green-400' : 'text-white'}`}>{seq.name}</h3>
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">{seq.active} Active</span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <ZapIcon /> Trigger: {seq.triggers}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-auto w-full py-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
            <span className="text-lg">+</span> Create New Sequence
          </button>
        </div>

        {/* RIGHT: Live Preview & Tracking */}
        <div className="col-span-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-3 gap-6">
            <StatCard label="Messages Sent Today" value="12,450" trend="+15%" />
            <StatCard label="Read Rate" value="84%" trend="+2%" />
            <StatCard label="Link Clicks" value="3,210" trend="+8%" />
          </div>

          <div className="glass-panel flex-1 flex p-6 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500/10 blur-3xl rounded-full pointer-events-none" />
            
            {/* Phone Mockup */}
            <div className="w-80 h-[500px] border-4 border-slate-800 rounded-[2.5rem] bg-[#0b141a] overflow-hidden flex flex-col relative shadow-2xl shrink-0 z-10">
              <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <span className="text-xs font-bold">RS</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Rahul Sharma</p>
                  <p className="text-[10px] text-slate-400">Online</p>
                </div>
              </div>
              
              <div className="flex-1 bg-[#0b141a] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center">
                  <span className="bg-[#182229] text-slate-400 text-[10px] px-3 py-1 rounded-lg uppercase">Today</span>
                </div>
                
                <ChatMessage 
                  text="Namaste Rahul! Main AP Hunter se baat kar rahi hoon. Humari baat abhi call pe hui thi."
                  time="10:45 AM"
                  status="read"
                />
                
                <ChatMessage 
                  text="Jaisa ki humne discuss kiya, yahan Partner Program ka brochure hai. Isme Rev-Share details hain."
                  time="10:45 AM"
                  status="read"
                />

                <div className="self-end max-w-[85%] bg-[#005c4b] rounded-lg p-1.5 shadow-sm">
                  <div className="bg-[#0b141a] p-3 rounded-md flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 text-red-400 flex items-center justify-center rounded">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Partner_Brochure.pdf</p>
                      <p className="text-xs text-slate-400">2.4 MB • PDF</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-1 mt-1 pr-1">
                    <span className="text-[10px] text-green-200/70">10:46 AM</span>
                    <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="self-end max-w-[85%] bg-[#005c4b] rounded-lg p-2 px-3 shadow-sm"
                >
                  <p className="text-sm text-white">Humare RM Priya aapse jaldi hi connect karengi. Dhanyawad!</p>
                  <div className="flex justify-end gap-1 mt-1">
                    <span className="text-[10px] text-green-200/70">10:46 AM</span>
                    <Check className="w-3 h-3 text-slate-400" />
                  </div>
                </motion.div>
              </div>

              <div className="bg-[#202c33] p-3 flex items-center gap-3">
                <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-sm text-slate-400 flex items-center justify-between">
                  Type a message...
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                  <Send className="w-5 h-5 -ml-1" />
                </div>
              </div>
            </div>

            {/* Campaign Analytics */}
            <div className="flex-1 pl-8 flex flex-col justify-center gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Brochure Delivery Flow</h3>
                <p className="text-sm text-slate-400">This sequence is triggered automatically for all leads scored between 50-75 (Warm).</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Delay: 5 mins after call</p>
                      <p className="text-xs text-slate-400">Wait for context processing</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-1 h-4 bg-white/10 ml-8" />
                
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Send Template: Intro + Brochure</p>
                      <p className="text-xs text-slate-400">Dynamic language based on call</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string, value: string, trend: string }) {
  return (
    <div className="glass-panel p-5">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-bold">{value}</p>
        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded mb-1">{trend}</span>
      </div>
    </div>
  );
}

function ChatMessage({ text, time, status }: { text: string, time: string, status: 'sent' | 'read' }) {
  return (
    <div className="self-end max-w-[85%] bg-[#005c4b] rounded-lg p-2 px-3 shadow-sm relative group">
      <p className="text-sm text-white pr-2">{text}</p>
      <div className="flex justify-end gap-1 mt-1">
        <span className="text-[10px] text-green-200/70">{time}</span>
        {status === 'read' ? <CheckCheck className="w-3 h-3 text-[#53bdeb]" /> : <Check className="w-3 h-3 text-slate-400" />}
      </div>
    </div>
  );
}

function ZapIcon() {
  return <Zap className="w-3 h-3 text-yellow-400" />;
}
