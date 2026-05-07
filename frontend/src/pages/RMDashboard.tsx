import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Search, Download, Upload, AlertCircle, PhoneCall, CheckCircle2, Clock, Briefcase } from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  phone: string;
  tag: 'HOT' | 'WARM' | 'COLD';
  hook: string;
  size: string;
  closingLine: string;
  transcript: Array<{speaker: string, text: string}>;
  sentiment: string;
  objections: Array<{text: string, resolved: boolean}>;
};

const initialLeads: Lead[] = [
  {
    id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', tag: 'HOT',
    hook: 'Currently with Zerodha—hates their 70% share.',
    size: '500 clients, mostly F&O traders.',
    closingLine: 'Ready to sign, just needs confirmation on daily payouts.',
    transcript: [
      { speaker: 'AI', text: 'Hi Rahul, this is AP Hunter. How are you today?' },
      { speaker: 'Lead', text: 'I am good. Tell me about your partnership.' },
      { speaker: 'AI', text: 'We offer great payout structures unlike Zerodha.' },
      { speaker: 'Lead', text: 'That sounds interesting. What are the rates?' }
    ],
    sentiment: 'Skeptical but excited',
    objections: [{ text: 'Payout frequency', resolved: true }, { text: 'Platform reliability', resolved: false }]
  },
  {
    id: '2', name: 'Sneha Patel', phone: '+91 91234 56789', tag: 'WARM',
    hook: 'Looking for a new broker for her 200 clients.',
    size: '200 clients, equity delivery.',
    closingLine: 'Wants a demo of the trading terminal.',
    transcript: [{ speaker: 'AI', text: 'Hi Sneha, looking for a new broker?' }],
    sentiment: 'Curious',
    objections: [{ text: 'Terminal speed', resolved: true }]
  }
];

export default function RMDashboard() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Single Lead Form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');

  // Analytics logic
  const analytics = {
    total: leads.length,
    qualified: leads.filter(l => l.tag === 'HOT' || l.tag === 'WARM').length,
    handedToRM: leads.filter(l => l.tag === 'HOT').length
  };

  // Queue logic
  const filteredLeads = useMemo(() => {
    let filtered = leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.phone.includes(searchTerm)
    );
    // Sort HOT first
    filtered.sort((a, b) => {
      const rank = { 'HOT': 1, 'WARM': 2, 'COLD': 3 };
      return rank[a.tag] - rank[b.tag];
    });
    return filtered;
  }, [leads, searchTerm]);

  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const newLeads = results.data.map((row: any, i) => ({
            id: `imported-${Date.now()}-${i}`,
            name: row.name || 'Unknown',
            phone: row.phone || 'N/A',
            tag: ['HOT', 'WARM', 'COLD'].includes(row.tag) ? row.tag : 'COLD',
            hook: row.hook || 'No hook provided',
            size: row.size || 'Unknown size',
            closingLine: row.closingLine || 'No closing line',
            transcript: [],
            sentiment: 'Neutral',
            objections: []
          })) as Lead[];
          setLeads([...leads, ...newLeads]);
        }
      });
    }
  };

  const handleAddSingleLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;
    
    const newLead: Lead = {
      id: `manual-${Date.now()}`,
      name: newLeadName,
      phone: newLeadPhone || 'N/A',
      tag: 'COLD',
      hook: 'Pending analysis',
      size: 'Pending size',
      closingLine: 'Pending closing line',
      transcript: [],
      sentiment: 'Neutral',
      objections: []
    };
    
    setLeads([newLead, ...leads]);
    setNewLeadName('');
    setNewLeadPhone('');
  };

  const exportCSV = () => {
    const csv = Papa.unparse(leads);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 h-[85vh] glass-panel p-6">
      {/* Analytics Pipeline (Top Header) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 p-4 rounded-xl shadow-sm border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Contacted</p>
            <p className="text-2xl font-bold text-white">{analytics.total}</p>
          </div>
          <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center glow-cyan">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl shadow-sm border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Qualified</p>
            <p className="text-2xl font-bold text-white">{analytics.qualified}</p>
          </div>
          <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl shadow-sm border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Handed to RM</p>
            <p className="text-2xl font-bold text-white">{analytics.handedToRM}</p>
          </div>
          <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center glow-purple">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Priority Queue */}
        <div className="w-1/3 flex flex-col gap-4 min-h-0">
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
             <h3 className="font-semibold text-white mb-3 text-sm">Add Lead</h3>
             <form onSubmit={handleAddSingleLead} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded text-sm px-2 py-1 focus:outline-none focus:border-cyan-400"
                />
                <input 
                  type="text" 
                  placeholder="Phone" 
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  className="w-1/3 min-w-0 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded text-sm px-2 py-1 focus:outline-none focus:border-cyan-400"
                />
                <button type="submit" className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded text-sm hover:bg-cyan-500/30 transition-colors">Add</button>
             </form>
          </div>

          <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Priority Queue</h3>
                <div className="flex gap-2">
                  <label className="cursor-pointer p-2 hover:bg-white/10 rounded-lg border border-white/10 transition-colors" title="Upload CSV">
                    <Upload className="w-4 h-4 text-slate-300" />
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button onClick={exportCSV} className="p-2 hover:bg-white/10 rounded-lg border border-white/10 transition-colors" title="Export CSV">
                    <Download className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search name or phone..." 
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {paginatedLeads.map(lead => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedLead?.id === lead.id ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-white text-sm">{lead.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      lead.tag === 'HOT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                      lead.tag === 'WARM' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                      'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}>
                      {lead.tag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">{lead.phone}</div>
                  {lead.tag === 'HOT' && (
                    <div className="flex items-center gap-1 text-[10px] text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-1 rounded">
                      <Clock className="w-3 h-3" />
                      Respond within 15 mins
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-white/5 flex justify-between items-center text-xs">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1 border border-white/10 text-slate-300 hover:text-white rounded disabled:opacity-50"
              >Prev</button>
              <span className="text-slate-400">Page {currentPage} of {totalPages || 1}</span>
              <button 
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 border border-white/10 text-slate-300 hover:text-white rounded disabled:opacity-50"
              >Next</button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {selectedLead ? (
            <>
              {/* Pre-Digested Lead Card */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-slate-300">{selectedLead.sentiment}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/20">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">The Hook</p>
                    <p className="text-sm text-slate-200">{selectedLead.hook}</p>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">The Size</p>
                    <p className="text-sm text-slate-200">{selectedLead.size}</p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Closing Line</p>
                    <p className="text-sm text-slate-200">{selectedLead.closingLine}</p>
                  </div>
                </div>
              </div>

              {/* Deep-Dive Call Details */}
              <div className="flex-1 flex gap-6 min-h-0">
                <div className="w-2/3 bg-white/5 rounded-xl border border-white/10 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <h3 className="font-semibold text-white">Call Transcript</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {selectedLead.transcript.map((t, i) => (
                      <div key={i} className={`flex ${t.speaker === 'AI' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm ${t.speaker === 'AI' ? 'bg-gradient-to-br from-cyan-500/80 to-blue-600/80 text-white rounded-tr-none border border-cyan-400/30' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'}`}>
                          <p className="text-[10px] opacity-70 mb-1 uppercase font-bold">{t.speaker}</p>
                          <p>{t.text}</p>
                        </div>
                      </div>
                    ))}
                    {selectedLead.transcript.length === 0 && (
                      <p className="text-sm text-slate-500 italic text-center mt-4">No transcript available.</p>
                    )}
                  </div>
                </div>

                <div className="w-1/3 bg-white/5 rounded-xl border border-white/10 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <h3 className="font-semibold text-white">Objections</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {selectedLead.objections.map((obj, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className={`mt-0.5 ${obj.resolved ? 'text-green-400' : 'text-orange-400'}`}>
                          {obj.resolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className={`text-sm ${obj.resolved ? 'text-slate-500 line-through' : 'text-slate-200 font-medium'}`}>{obj.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{obj.resolved ? 'Resolved' : 'Needs attention'}</p>
                        </div>
                      </div>
                    ))}
                    {selectedLead.objections.length === 0 && (
                      <p className="text-sm text-slate-500 italic text-center mt-4">No objections recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20 text-cyan-400" />
                <p className="text-lg text-slate-300">Select a lead from the queue</p>
                <p className="text-sm opacity-70">View their detailed cheat sheet and transcript</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
