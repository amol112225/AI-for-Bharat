import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import { mockLeads, type Lead } from '../data/mockLeads';

export default function LeadQueue() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const leads = mockLeads.filter(l => 
    l.FullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.Phone.includes(searchTerm)
  );

  const getStatusBadge = (status: Lead['Status']) => {
    switch(status) {
      case 'New': return 'bg-slate-500/10 text-slate-400 border-slate-500/50';
      case 'Calling': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
      case 'Listening': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]';
      case 'Objection Handling': return 'bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'RM Assigned': return 'bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'Converted': return 'bg-green-500/10 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      case 'Lost': return 'bg-red-500/10 text-red-400 border-red-500/50';
      default: return 'bg-white/10 text-white border-white/50';
    }
  };

  const getConfidenceColor = (prob: string) => {
    const val = parseInt(prob);
    if (val > 70) return 'text-green-400';
    if (val > 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead Queue</h1>
          <p className="text-slate-400 text-sm mt-1">Enterprise lead data & real-time routing status.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder-slate-500 w-64"
            />
          </div>
          <button className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
          <button className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </header>

      <div className="glass-panel flex-1 overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0f1c] sticky top-0 z-10 shadow-md">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Name & Contact</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Location</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Source</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Language</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Confidence</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((l) => (
                <tr 
                  key={l.LeadID} 
                  onClick={() => navigate('/console')}
                  className="hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">{l.LeadID}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{l.FullName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{l.Phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-200">{l.City}</p>
                    <p className="text-xs text-slate-500">{l.State}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{l.Source}</td>
                  <td className="px-6 py-4 text-slate-300">{l.PreferredLanguage}</td>
                  <td className="px-6 py-4 font-mono font-bold">
                    <span className={getConfidenceColor(l.ConversionProbability)}>{l.ConversionProbability}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getStatusBadge(l.Status)}`}>
                      {l.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-[#0a0f1c] border-t border-white/5 px-6 py-4 flex items-center justify-between text-sm text-slate-400">
          <p>Showing {leads.length} entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-white/10 bg-cyan-500/20 text-cyan-400 border-cyan-500/50">1</button>
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">2</button>
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">3</button>
            <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
