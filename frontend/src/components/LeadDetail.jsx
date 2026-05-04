import React from 'react';
import { ArrowLeft, Clock, MessageSquare, Activity, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadDetail({ onBack, data }) {
  // Fallback for demo
  const mockData = {
    name: 'Rahul Sharma',
    score: 85,
    suggested_opener: "Hi Rahul, this is RM from Rupeezy. I saw you requested the Baner off-market brochure...",
    transcript: []
  };

  const currentData = data || mockData;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
            Lead Detail: {currentData.name || 'Rahul Sharma'} 
            <span className={`px-3 py-1 text-sm font-bold rounded-full border ${currentData.score >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              {currentData.score >= 70 ? 'HOT LEAD' : 'WARM LEAD'}
            </span>
          </h2>
          <p className="text-slate-500">Deep dive into the conversation and AI intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Analytics Breakdown */}
        <div className="col-span-1 space-y-6">
          <div className="glass-panel p-6 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Engagement</span><span className="text-slate-900 font-bold">35/40</span></div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full w-[85%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Objection Handling</span><span className="text-slate-900 font-bold">25/30</span></div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full"><div className="bg-orange-500 h-1.5 rounded-full w-[80%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Intent Signals</span><span className="text-slate-900 font-bold">25/30</span></div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div></div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-600">Final Score</span>
                <span className={`text-2xl font-black ${currentData.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{currentData.score || 85}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Emotion Timeline</h3>
            <div className="flex items-center justify-between text-2xl">
              <span title="Neutral">😐</span>
              <div className="flex-1 h-px bg-slate-200 mx-2"></div>
              <span title="Frustrated" className="animate-pulse">😠</span>
              <div className="flex-1 h-px bg-slate-200 mx-2"></div>
              <span title="Curious">🤔</span>
              <div className="flex-1 h-px bg-slate-200 mx-2"></div>
              <span title="Happy" className="text-emerald-600">😊</span>
            </div>
          </div>

          <div className="glass-panel p-6 bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">🤖 RM Suggested Opener</h3>
            <p className="text-slate-700 italic leading-relaxed text-sm">
              "{currentData.suggested_opener || mockData.suggested_opener}"
            </p>
          </div>
        </div>

        {/* Full Transcript */}
        <div className="col-span-2 glass-panel flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100/50 rounded-t-2xl">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600"/> Full Transcript</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4"/> Duration: Live Call Sync
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {((currentData.transcript?.length > 0 ? currentData.transcript : null) || mockData.transcript).map((msg, idx) => (
              <div key={idx} className={`flex ${msg.speaker === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.speaker === 'user' ? 'bg-blue-50 border border-blue-200 text-slate-800 rounded-tl-sm' : 'bg-white text-slate-700 rounded-tr-sm border border-slate-200 shadow-sm'}`}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50 flex items-center gap-1 text-slate-500">
                    {msg.speaker === 'user' ? <><User className="w-3 h-3"/> Lead</> : <><Activity className="w-3 h-3"/> AI Agent</>}
                  </p>
                  <p className="leading-relaxed text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
