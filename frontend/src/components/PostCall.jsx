import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, AlertCircle, TrendingUp, Send } from 'lucide-react';

export default function PostCall({ data, onGoToDashboard }) {
  if (!data) return null;

  const { score, emotion, classification, executive_summary, objections_handled } = data;

  const colorClass = classification === 'HOT' ? 'text-emerald-400' : classification === 'WARM' ? 'text-amber-400' : 'text-blue-400';
  const bgClass = classification === 'HOT' ? 'bg-emerald-50 border-emerald-200' : classification === 'WARM' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Post-Call Analysis</h2>
        <p className="text-slate-500">Call concluded. AI has successfully scored and summarized the interaction.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Score & Classification */}
        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className={`glass-panel p-8 flex flex-col items-center justify-center border-2 ${bgClass.split(' ')[1]}`}>
          <p className="text-slate-500 font-bold uppercase tracking-widest mb-4">Final Score</p>
          <h1 className={`text-8xl font-black mb-4 ${colorClass}`}>{score}</h1>
          <div className={`px-6 py-2 rounded-full text-xl font-bold tracking-widest ${bgClass} ${colorClass}`}>
            {classification} LEAD
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Emotion Summary */}
          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.1}} className="glass-panel p-6">
            <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Emotion Summary
            </h3>
            <p className="text-lg text-slate-800 font-medium mb-2">User ended the call feeling <span className={colorClass}>{emotion}</span>.</p>
          </motion.div>

          {/* Objection Summary */}
          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.2}} className="glass-panel p-6 border-l-4 border-l-orange-500 h-full">
            <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Objections Handled
            </h3>
            <ul className="space-y-3">
              {objections_handled && objections_handled.length > 0 ? (
                objections_handled.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{obj}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-sm italic">No major objections encountered.</li>
              )}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* AI Summary */}
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="glass-panel p-6 bg-blue-50/50">
        <h3 className="text-blue-600 font-bold uppercase tracking-wider mb-3">🧠 AI Executive Summary</h3>
        <p className="text-slate-700 leading-relaxed italic">
          "{executive_summary}"
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="flex gap-4">
        {classification === 'HOT' && (
          <button onClick={onGoToDashboard} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
            <Send className="w-5 h-5" /> Hand-off to RM
          </button>
        )}
        {(classification === 'HOT' || classification === 'WARM') && (
          <button className="flex-1 py-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
            <MessageSquare className="w-5 h-5" /> Send WhatsApp Brochure
          </button>
        )}
        <button onClick={onGoToDashboard} className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all shadow-sm">
          Back to Dashboard
        </button>
      </motion.div>

    </div>
  );
}
