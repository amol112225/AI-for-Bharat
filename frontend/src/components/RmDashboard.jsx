import React from 'react';
import { ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RmDashboard({ onBack, onViewDetail }) {
  const hotLeads = [
    { id: 1, name: 'Rahul Sharma', score: 85, emotion: 'Happy', time: '2 mins ago' },
    { id: 2, name: 'Priya Desai', score: 92, emotion: 'Excited', time: '15 mins ago' },
  ];

  const warmLeads = [
    { id: 3, name: 'Amit Kumar', score: 65, emotion: 'Curious', time: '1 hr ago', msgSent: true },
    { id: 4, name: 'Neha Singh', score: 55, emotion: 'Neutral', time: '2 hrs ago', msgSent: true },
  ];

  const coldLeads = [
    { id: 5, name: 'Sanjay Gupta', score: 25, emotion: 'Frustrated', time: '3 hrs ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">RM Dashboard (Business View)</h2>
          <p className="text-slate-500">Final output of the system. Actionable insights for Relationship Managers.</p>
        </div>
      </div>

      {/* Metrics & Funnel */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Leads</p>
          <h3 className="text-2xl font-bold text-slate-900">1,245</h3>
        </div>
        <div className="glass-panel p-5 text-center bg-blue-50">
          <p className="text-xs text-blue-600 uppercase tracking-wider mb-1">Contacted</p>
          <h3 className="text-2xl font-bold text-blue-600">890</h3>
        </div>
        <div className="glass-panel p-5 text-center bg-amber-50">
          <p className="text-xs text-amber-600 uppercase tracking-wider mb-1">Qualified (Warm+)</p>
          <h3 className="text-2xl font-bold text-amber-600">420</h3>
        </div>
        <div className="glass-panel p-5 text-center bg-emerald-50 border-emerald-200">
          <p className="text-xs text-emerald-600 uppercase tracking-wider mb-1">Hot Hand-offs</p>
          <h3 className="text-2xl font-bold text-emerald-600">145</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* HOT LEADS */}
        <div className="glass-panel overflow-hidden border-t-4 border-t-emerald-500">
          <div className="bg-emerald-50 p-4 border-b border-slate-200">
            <h3 className="font-bold text-emerald-700 flex items-center gap-2">🔥 HOT LEADS (Priority)</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {hotLeads.map(lead => (
              <motion.div key={lead.id} initial={{opacity:0}} animate={{opacity:1}} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors" onClick={onViewDetail}>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{lead.name}</h4>
                  <p className="text-xs text-slate-500">Score: <span className="text-emerald-600 font-bold">{lead.score}</span> • Emotion: {lead.emotion}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-slate-500">{lead.time}</span>
                  <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded shadow-sm">Call Now</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WARM LEADS */}
        <div className="glass-panel overflow-hidden border-t-4 border-t-amber-500">
          <div className="bg-amber-50 p-4 border-b border-slate-200">
            <h3 className="font-bold text-amber-700 flex items-center gap-2">🟡 WARM LEADS</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {warmLeads.map(lead => (
              <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{lead.name}</h4>
                  <p className="text-xs text-slate-500">Score: <span className="text-amber-600 font-bold">{lead.score}</span></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-slate-500">{lead.time}</span>
                  {lead.msgSent ? (
                    <span className="text-xs text-green-600 flex items-center gap-1"><MessageSquare className="w-3 h-3"/> WhatsApp Sent ✅</span>
                  ) : (
                    <button className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded font-medium shadow-sm">Follow-up</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLD LEADS */}
        <div className="glass-panel overflow-hidden border-t-4 border-t-slate-300 opacity-70 mt-6 md:col-span-2">
          <div className="bg-slate-100 p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-600 flex items-center gap-2">🔵 COLD LEADS (Low Priority)</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {coldLeads.map(lead => (
              <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-slate-50 grayscale transition-colors">
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">{lead.name}</h4>
                  <p className="text-xs text-slate-500">Score: <span className="font-bold">{lead.score}</span> • Dropped due to: {lead.emotion}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-slate-400">{lead.time}</span>
                  <span className="text-xs text-slate-400">Archived for Retargeting</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
