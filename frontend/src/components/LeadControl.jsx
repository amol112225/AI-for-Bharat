import React, { useState } from 'react';
import { Upload, Play, Pause, Users, PhoneCall, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadControl({ onStartCall, onGoToDashboard }) {
  const [leads] = useState([
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', language: 'Hinglish', status: 'Pending', priority: 'High' },
    { id: 2, name: 'Sneha Patel', phone: '+91 99887 76655', language: 'Hindi', status: 'Pending', priority: 'Medium' },
    { id: 3, name: 'Amit Kumar', phone: '+91 91234 56789', language: 'English', status: 'Completed', priority: 'Low' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lead Control Dashboard</h2>
          <p className="text-slate-500">Manage leads and trigger the AI calling engine.</p>
        </div>
        <button 
          onClick={onGoToDashboard}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium shadow-sm transition-colors"
        >
          View RM Dashboard
        </button>
      </div>

      {/* Mini Insights */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <motion.div className="glass-panel p-6 flex items-center gap-4" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6" /></div>
          <div><p className="text-slate-500 text-sm font-medium">Total Leads</p><h3 className="text-2xl font-bold text-slate-900">1,245</h3></div>
        </motion.div>
        <motion.div className="glass-panel p-6 flex items-center gap-4" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
          <div><p className="text-slate-500 text-sm font-medium">Calls Completed</p><h3 className="text-2xl font-bold text-slate-900">890</h3></div>
        </motion.div>
        <motion.div className="glass-panel p-6 flex items-center gap-4" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><PhoneCall className="w-6 h-6" /></div>
          <div><p className="text-slate-500 text-sm font-medium">Pending</p><h3 className="text-2xl font-bold text-slate-900">355</h3></div>
        </motion.div>
      </div>

      <div className="glass-panel overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg text-sm border border-slate-200 text-slate-700 shadow-sm transition-colors">
              <Upload className="w-4 h-4" /> Upload CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg text-sm border border-slate-200 text-slate-700 shadow-sm transition-colors">
              + Add Single Lead
            </button>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg text-sm border border-slate-200 text-slate-600 shadow-sm transition-colors">
              <Pause className="w-4 h-4" /> Pause
            </button>
            <button 
              onClick={() => onStartCall(leads[0])}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              <Play className="w-4 h-4" /> Start AI Calls
            </button>
          </div>
        </div>

        {/* Lead Table */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/50 text-slate-600 sticky top-0">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Language</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{lead.name}</td>
                  <td className="p-4 text-slate-600">{lead.phone}</td>
                  <td className="p-4 text-slate-600">{lead.language}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      lead.priority === 'High' ? 'bg-red-100 text-red-700' : 
                      lead.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-2 font-medium ${lead.status === 'Completed' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {lead.status === 'Completed' && <CheckCircle className="w-4 h-4" />}
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onStartCall(lead)}
                      disabled={lead.status === 'Completed'}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Call Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
