import { CheckCircle2, AlertTriangle, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import { mockLeads } from '../data/mockLeads';

const lead = mockLeads[0]; // Special lead

export default function RMHandoff() {
  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">RM Handoff Workspace</h1>
        <p className="text-slate-400 text-sm mt-1">Review AI pre-qualified leads and take over the final close.</p>
      </header>

      <div className="grid grid-cols-2 gap-6 flex-1 h-[calc(100vh-140px)]">
        
        {/* LEFT: Call Outcome Summary */}
        <div className="glass-panel p-6 flex flex-col overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">AI Call Outcome</h2>
          
          <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center text-2xl font-bold">
              {lead.FullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{lead.FullName}</h3>
              <p className="text-green-400 font-bold text-sm uppercase tracking-wider mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Qualified • Hot Lead
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Transcript Summary
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                Lead expressed strong interest in the Partner Program. They mentioned having a network of over 500 active clients in the Pune region. Primary motivation is revenue sharing and white-labeled API access. Language preference was Hinglish.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> Objections & Resolutions
              </h4>
              <div className="space-y-3">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                  <p className="text-xs font-bold text-yellow-400 uppercase mb-1">Objection: Pricing Model</p>
                  <p className="text-sm text-slate-300">Lead thought the upfront fee was high. AI resolved by explaining the waiving condition for first 100 onboardings.</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                  <p className="text-xs font-bold text-blue-400 uppercase mb-1">Query: API Limits</p>
                  <p className="text-sm text-slate-300">Lead asked about rate limits. AI informed them about the enterprise slab and promised an RM will provide documentation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: RM Action Workspace */}
        <div className="glass-panel p-6 flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">RM Action Workspace</h2>
          
          <div className="bg-[#0a0f1c] border border-cyan-500/30 rounded-xl p-5 mb-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold text-white mb-2">Recommended Pitch Strategy</h3>
            <p className="text-sm text-slate-300 mb-4">Focus on the Rev-Share aspect. This is a High-Volume MFD; they care about scaling efficiently. Send API docs immediately after contact.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-cyan-400">#RevShare</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-cyan-400">#EnterpriseAPI</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)] flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Initiate Dial
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" /> Email Proposal
            </button>
          </div>

          <div className="flex-1 border border-white/10 rounded-xl bg-white/5 p-4 flex flex-col">
            <h4 className="text-sm font-bold text-white mb-4">Draft Notes</h4>
            <textarea 
              className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-300 placeholder-slate-600"
              placeholder="Enter meeting notes here..."
              defaultValue={`AI Prep Note: Ensure to clarify the API rate limits as requested during the AI qualification call.`}
            />
            <div className="mt-4 flex justify-end">
              <button className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                Save & Update CRM <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
