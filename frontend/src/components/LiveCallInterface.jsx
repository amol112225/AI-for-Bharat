import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User, BrainCircuit, Activity, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LiveCallInterface() {
  const [callState, setCallState] = useState('idle'); // idle, ringing, active, completed
  const [activeAgent, setActiveAgent] = useState('sales'); // sales, objection, scoring
  const [score, setScore] = useState(45);
  const [emotion, setEmotion] = useState('Neutral');
  const [transcript, setTranscript] = useState([]);

  // Mock a conversation flow for the prototype
  const startMockCall = () => {
    setCallState('ringing');
    setTimeout(() => {
      setCallState('active');
      addTranscript('ai', 'Hi Rahul, this is Priya from AP Hunter. Are you looking for a new investment property in Pune?', 'sales');
      setEmotion('Neutral');
    }, 2000);
  };

  const handleUserReply = (type) => {
    if (type === 'objection') {
      addTranscript('user', 'I already have a broker, I don\'t need this.');
      setEmotion('Frustrated');
      setScore(prev => Math.max(20, prev - 15));
      
      // Visual AI thinking and switching
      setTimeout(() => {
        setActiveAgent('objection');
        setTimeout(() => {
          addTranscript('ai', 'I completely understand, Rahul. Most of our top clients also had brokers. But what we offer is off-market deals your broker doesn\'t have access to. Can I just show you one property?', 'objection');
          setEmotion('Slightly Interested');
          setScore(prev => prev + 25);
        }, 1500);
      }, 500);
    } else if (type === 'interest') {
      addTranscript('user', 'Hmm, what kind of off-market deals?');
      setEmotion('Curious');
      setScore(prev => Math.min(100, prev + 30));
      
      setTimeout(() => {
        setActiveAgent('sales');
        setTimeout(() => {
          addTranscript('ai', 'We have premium 3BHKs in Baner before they hit the market, at 15% lower than market rate. Should I send the details on WhatsApp?', 'sales');
        }, 1000);
      }, 500);
    }
  };

  const addTranscript = (speaker, text, agent = null) => {
    setTranscript(prev => [...prev, { id: Date.now(), speaker, text, agent }]);
  };

  const endCall = () => {
    setCallState('completed');
    setActiveAgent('scoring');
  };

  const getAgentColor = (agent) => {
    switch(agent) {
      case 'sales': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30';
      case 'objection': return 'text-orange-400 bg-orange-400/10 border-orange-500/30';
      case 'scoring': return 'text-blue-400 bg-blue-400/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
      
      {/* Left Panel: Lead Info & Analytics */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Lead Profile */}
        <motion.div className="glass-panel p-6 flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Lead Profile
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Tech Pro
            </span>
          </div>
          
          <div className="space-y-4 text-sm">
            <div><span className="text-slate-400 block mb-1">Name</span><p className="font-medium text-lg text-white">Rahul Sharma</p></div>
            <div><span className="text-slate-400 block mb-1">Phone</span><p className="text-slate-200">+91 98765 43210</p></div>
            <div><span className="text-slate-400 block mb-1">Language</span><p className="text-slate-200">Hinglish</p></div>
            <div><span className="text-slate-400 block mb-1">Source</span><p className="text-slate-200">Facebook Ad - Pune Real Estate</p></div>
          </div>
        </motion.div>

        {/* Live Analytics Engine */}
        <motion.div className="glass-panel p-6 flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-purple-400" />
            Real-Time Analysis
          </h2>
          
          {/* Score Meter */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-slate-400">Lead Score</span>
              <span className={`text-2xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {score}/100
              </span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.5, type: 'spring' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">
              <span>Cold</span>
              <span>Warm</span>
              <span>Hot</span>
            </div>
          </div>

          {/* Emotion Tracker */}
          <div>
            <span className="text-sm text-slate-400 block mb-3">Detected Emotion</span>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${emotion === 'Frustrated' ? 'bg-red-500/20 text-red-400' : emotion === 'Curious' || emotion.includes('Interested') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {emotion === 'Frustrated' ? <ShieldAlert className="w-5 h-5" /> : emotion.includes('Interest') ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              </div>
              <span className="font-medium text-slate-200">{emotion}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: AI Call Engine & Multi-Agent View */}
      <motion.div className="lg:col-span-8 glass-panel flex flex-col overflow-hidden relative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        
        {/* Header - Agent Status */}
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Multi-Agent Intelligence Layer</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {callState === 'active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${callState === 'active' ? 'bg-emerald-500' : callState === 'idle' ? 'bg-slate-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-sm text-slate-400 capitalize">Status: {callState}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {callState === 'active' && (
              <motion.div 
                key={activeAgent}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getAgentColor(activeAgent)}`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">{activeAgent} Agent Active</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transcript Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-transparent to-slate-900/50">
          {transcript.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
              <p>System ready. Waiting to initiate call.</p>
            </div>
          ) : (
            <AnimatePresence>
              {transcript.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.speaker === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : `bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm relative ${msg.agent === 'objection' ? 'shadow-[0_0_15px_rgba(249,115,22,0.1)] border-orange-500/30' : ''}`
                  }`}>
                    {msg.speaker === 'ai' && (
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1 opacity-70">
                        <BrainCircuit className="w-3 h-3" />
                        {msg.agent} Agent
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Prototype Controls */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-900/80">
          {callState === 'idle' ? (
            <button 
              onClick={startMockCall}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Phone className="w-5 h-5" />
              Initiate AI Call
            </button>
          ) : callState === 'ringing' ? (
            <div className="w-full py-4 bg-amber-600/20 text-amber-500 border border-amber-500/30 rounded-xl font-bold flex items-center justify-center gap-2">
              <span className="animate-pulse flex items-center gap-2">Calling Lead...</span>
            </div>
          ) : callState === 'active' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Simulate Lead Response:</div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleUserReply('objection')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  "I already have a broker"
                </button>
                <button 
                  onClick={() => handleUserReply('interest')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-blue-400" />
                  "What kind of deals?"
                </button>
              </div>
              <button 
                onClick={endCall}
                className="w-full py-3 mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <PhoneOff className="w-5 h-5" />
                End Call & Score
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Call Completed</h3>
              <p className="text-slate-400 text-sm mb-4">Lead has been scored and routed successfully.</p>
              <button 
                onClick={() => { setCallState('idle'); setTranscript([]); setScore(45); setEmotion('Neutral'); setActiveAgent('sales'); }}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reset Prototype
              </button>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
