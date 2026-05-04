import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Bot, User, BrainCircuit, Activity, ShieldAlert, CheckCircle2, AlertCircle, PhoneOff, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi('f7fdd93f-d345-4da0-90ae-008a1129b7c1');

export default function LiveCall({ lead, onCallEnd }) {
  const [transcript, setTranscript] = useState([]);
  const [callStatus, setCallStatus] = useState('inactive'); // inactive, connecting, active
  const [textInput, setTextInput] = useState('');
  
  // AI State
  const [score, setScore] = useState(45);
  const [emotion, setEmotion] = useState('Neutral');
  const [interest, setInterest] = useState('Low');
  const [activeAgent, setActiveAgent] = useState('sales');
  const [aiThinking, setAiThinking] = useState('');
  
  // Ref for score so event listeners always have the latest value without remounting
  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    // Vapi Event Listeners
    const onCallStart = () => {
      setCallStatus('active');
      setAiThinking('');
      setTranscript(prev => [...prev, { id: Date.now(), speaker: 'ai', text: `Hi ${lead?.name || 'Rahul'}, this is Rupeezy AI. We saw your interest in the Baner property. Is this a good time to talk?` }]);
    };

    const onCallEnd = () => {
      setCallStatus('inactive');
      setAiThinking('');
    };

    const onMessage = (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const text = message.transcript;
        const speaker = message.role === 'user' ? 'user' : 'ai';
        setTranscript(prev => [...prev, { id: Date.now(), speaker, text }]);
        
        // Update Live Score quietly on backend
        if (speaker === 'user') {
          processLogicQuietly(text, scoreRef.current);
        }
      }
    };

    const onError = (e) => {
      console.error(e);
      setCallStatus('inactive');
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
    };
  }, [lead]);

  const startVapiCall = async () => {
    setCallStatus('connecting');
    setAiThinking('Connecting to Vapi.ai voice server...');
    
    await vapi.start({
      name: "Rupeezy Sales Agent",
      firstMessage: `Hi ${lead?.name || 'Rahul'}, this is Rupeezy AI. We saw your interest in the Baner property. Is this a good time to talk?`,
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI Voice Sales Agent for converting leads into partners. Speak naturally in Hinglish (Hindi + English mix). You engage users, ask follow-up questions, and handle objections intelligently. Keep responses short, human-like, and engaging."
          }
        ]
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "hi" // Configured for Hindi/Hinglish
      },
      voice: {
        provider: "11labs",
        voiceId: "burt" 
      }
    });
  };

  const processLogicQuietly = async (text, currentScore) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_text: text, current_score: currentScore })
      });
      const data = await response.json();
      setEmotion(data.emotion);
      setInterest(data.interest);
      setScore(data.new_score);
      if (data.agent_type) setActiveAgent(data.agent_type);
    } catch (e) {
      console.error(e);
    }
  };

  const finishCall = async () => {
    vapi.stop();
    setAiThinking('Generating Call Analysis & Executive Summary...');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: transcript.map(t => ({ speaker: t.speaker, text: t.text })), 
          final_score: score 
        })
      });
      
      const analysis = await response.json();
      
      onCallEnd({
        score: analysis.score,
        emotion: emotion,
        transcript: transcript,
        classification: analysis.classification,
        executive_summary: analysis.executive_summary,
        suggested_opener: analysis.suggested_opener,
        objections_handled: analysis.objections_handled
      });
    } catch (error) {
      console.error("Backend analyze error:", error);
      // Fallback if backend is down
      onCallEnd({
        score,
        emotion,
        transcript,
        classification: score >= 70 ? 'HOT' : score >= 40 ? 'WARM' : 'COLD',
        executive_summary: "Call analysis generated via fallback.",
        suggested_opener: "Hi, I am reaching out regarding your recent AI call.",
        objections_handled: []
      });
    }
  };

  const getAgentColor = (agent) => {
    if (agent === 'sales') return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30';
    if (agent === 'objection') return 'text-orange-400 bg-orange-400/10 border-orange-500/30';
    return 'text-blue-400 bg-blue-400/10 border-blue-500/30';
  };

  return (
    <div className="h-[85vh] flex gap-6">
      
      {/* LEFT: Lead & Conversation Panel (70%) */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header Panels */}
        <div className="flex gap-4">
          <div className="glass-panel p-4 flex-1 flex items-center gap-4 bg-blue-50 border-blue-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><User /></div>
            <div>
              <p className="text-xs text-blue-600 uppercase tracking-wider font-bold mb-1">You (Lead)</p>
              <h3 className="font-bold text-lg text-slate-900">{lead?.name || 'Rahul Sharma'}</h3>
            </div>
          </div>
          <div className="flex items-center justify-center px-4 text-slate-400"><Activity className="animate-pulse" /></div>
          <div className="glass-panel p-4 flex-1 flex items-center gap-4 justify-end bg-emerald-50 border-emerald-200">
            <div className="text-right">
              <p className="text-xs text-emerald-600 uppercase tracking-wider font-bold mb-1">AI Agent</p>
              <h3 className="font-bold text-lg text-slate-900">Rupeezy AI</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><Bot /></div>
          </div>
        </div>

        {/* Live Transcript Area */}
        <div className="glass-panel flex-1 flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-center text-xs font-medium text-slate-500 tracking-widest uppercase">
            Live Transcript
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {transcript.map((msg) => (
                <motion.div key={msg.id} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className={`flex ${msg.speaker === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl ${msg.speaker === 'user' ? 'bg-blue-600 text-white rounded-tl-sm' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tr-sm'}`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={transcriptEndRef} />
          </div>

          {/* User Input Area */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex gap-3">
            <button 
              onClick={callStatus === 'active' ? () => vapi.stop() : startVapiCall}
              disabled={callStatus === 'connecting'}
              className={`p-4 rounded-xl flex items-center justify-center transition-all ${callStatus === 'active' ? 'bg-red-500 animate-pulse text-white shadow-md' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'}`}
            >
              {callStatus === 'active' ? <PhoneOff className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
            </button>
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textInput) {
                  vapi.send({ type: 'add-message', message: { role: 'user', content: textInput } });
                  setTextInput('');
                }
              }}
              placeholder={callStatus === 'active' ? "Speak naturally or type here..." : "Click the phone button to start voice call..."}
              disabled={callStatus !== 'active'}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm disabled:opacity-50"
            />
            <button 
              onClick={() => {
                if (textInput && callStatus === 'active') {
                  vapi.send({ type: 'add-message', message: { role: 'user', content: textInput } });
                  setTextInput('');
                }
              }}
              disabled={callStatus !== 'active'}
              className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Intelligence Panel (30%) */}
      <div className="w-96 flex flex-col gap-6">
        
        {/* Agent Indicator & Thinking */}
        <div className="glass-panel p-6 border-t-4 border-t-blue-500">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Multi-Agent Engine</h4>
          
          <div className={`p-4 rounded-xl border mb-4 transition-all flex items-center gap-3 ${getAgentColor(activeAgent)}`}>
            <BrainCircuit className={`w-6 h-6 ${aiThinking ? 'animate-pulse' : ''}`} />
            <div>
              <p className="font-bold uppercase text-sm">{activeAgent} Agent Active</p>
            </div>
          </div>

          {aiThinking && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                {aiThinking}
              </p>
            </motion.div>
          )}
        </div>

        {/* Emotion & Interest */}
        <div className="glass-panel p-6">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Real-Time Analysis</h4>
          
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-2">Emotion Detection</p>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${emotion === 'Frustrated' ? 'bg-red-500/20 text-red-400' : emotion === 'Happy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {emotion === 'Frustrated' ? <ShieldAlert/> : emotion === 'Happy' ? <CheckCircle2/> : <Activity/>}
              </div>
              <span className="font-bold text-lg">{emotion}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-2">Interest Meter: {interest}</p>
            <div className="flex gap-2 h-2">
              <div className={`flex-1 rounded-full ${interest !== 'Low' ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
              <div className={`flex-1 rounded-full ${interest === 'High' || interest === 'Medium' ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
              <div className={`flex-1 rounded-full ${interest === 'High' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            </div>
          </div>
        </div>

        {/* Live Score */}
        <div className="glass-panel p-6 flex-1 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"></div>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Live Lead Score</p>
          <motion.h2 
            key={score}
            initial={{scale: 1.5, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            className={`text-6xl font-black ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}
          >
            {score}
          </motion.h2>
        </div>

        <button 
          onClick={finishCall}
          className="w-full py-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <PhoneOff className="w-5 h-5" /> End Call & Analyze
        </button>

      </div>
    </div>
  );
}
