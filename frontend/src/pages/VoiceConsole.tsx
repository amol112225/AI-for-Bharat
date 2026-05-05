import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, PhoneOff, User, Activity, AlertCircle, TrendingUp, Brain, FileText, Target, Shield, Database } from 'lucide-react';
import { mockLeads } from '../data/mockLeads';

// The "Hero" screen lead
const lead = mockLeads[0];

const agentModules = [
  { name: 'Language Agent', icon: FileText, desc: 'Hinglish detected' },
  { name: 'Intent Agent', icon: Target, desc: 'High intent: Partner' },
  { name: 'Objection Agent', icon: Shield, desc: 'Pricing concern handled' },
  { name: 'Sentiment Agent', icon: Activity, desc: 'Positive' },
  { name: 'Persona Agent', icon: User, desc: 'High-Volume MFD' },
  { name: 'Strategy Agent', icon: Brain, desc: 'Pitching Rev-Share' },
  { name: 'Memory Agent', icon: Database, desc: 'Recalling past visit' },
  { name: 'Scoring Agent', icon: TrendingUp, desc: 'Propensity 78%' },
  { name: 'RM Summary', icon: AlertCircle, desc: 'Generating context...' },
];

export default function VoiceConsole() {
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<{speaker: 'AI' | 'Lead', text: string}[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<'none' | 'AI' | 'Lead'>('none');
  const [score, setScore] = useState(45); // Cold -> Warm -> Hot
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Simulate connection after 3 seconds
    const t = setTimeout(async () => {
      setCallStatus('connected');
      setActiveSpeaker('AI');
      
      try {
        const res = await fetch('http://127.0.0.1:8000/calls/start/1', { method: 'POST' });
        const data = await res.json();
        const greeting = data.greeting || "Namaste Rahul! Main AP Hunter se baat kar rahi hoon. Aapne humari website pe Partner Program ke liye interest dikhaya tha. Kya abhi baat karne ka sahi samay hai?";
        
        setTranscript([{ speaker: 'AI', text: greeting }]);
        
        if ('speechSynthesis' in window) {
          synthRef.current = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(greeting);
          synthRef.current.speak(utterance);
          
          utterance.onend = () => {
            setActiveSpeaker('Lead');
            startListening();
          };
        } else {
          setTimeout(() => {
            setActiveSpeaker('Lead');
            startListening();
          }, 4000);
        }
      } catch(e) {
        console.error("Backend unreachable", e);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let interval: any;
    if (callStatus === 'connected') {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const startListening = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';
      
      let isProcessing = false;

      recognition.onresult = async (event: any) => {
        if (isProcessing) return;
        
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        const isFinal = event.results[current].isFinal;
        
        setTranscript(prev => {
          const newTranscript = [...prev];
          if (newTranscript.length > 0 && newTranscript[newTranscript.length - 1].speaker === 'Lead') {
            newTranscript[newTranscript.length - 1].text = transcriptText;
          } else {
            newTranscript.push({ speaker: 'Lead', text: transcriptText });
          }
          return newTranscript;
        });

        if (isFinal) {
          isProcessing = true;
          recognition.stop();
          setActiveSpeaker('AI');
          
          try {
            const res = await fetch('http://127.0.0.1:8000/calls/1/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: transcriptText })
            });
            
            if (!res.ok) {
              const errText = await res.text();
              throw new Error(`HTTP ${res.status}: ${errText}`);
            }
            
            const data = await res.json();
            
            if (data.score) setScore(data.score);
            setTranscript(prev => [...prev, { speaker: 'AI', text: data.response }]);
            
            if ('speechSynthesis' in window && synthRef.current) {
              const utterance = new SpeechSynthesisUtterance(data.response);
              (window as any).currentUtterance = utterance; // Prevent garbage collection
              
              utterance.onend = () => {
                isProcessing = false;
                setActiveSpeaker('Lead');
                try { recognition.start(); } catch(e){}
              };
              
              utterance.onerror = (e) => {
                console.error("TTS Error", e);
                isProcessing = false;
                setActiveSpeaker('Lead');
                try { recognition.start(); } catch(e){}
              };
              
              synthRef.current.speak(utterance);
            } else {
              setTimeout(() => {
                isProcessing = false;
                setActiveSpeaker('Lead');
                try { recognition.start(); } catch(e){}
              }, 4000);
            }
          } catch(e: any) {
            console.error("Backend error", e);
            setTranscript(prev => [...prev, { speaker: 'AI', text: `[System Error: ${e.message}]` }]);
            isProcessing = false;
            setActiveSpeaker('Lead');
            try { recognition.start(); } catch(err){}
          }
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Microphone access failed", e);
    }
  };

  const endCall = async () => {
    setCallStatus('ended');
    setActiveSpeaker('none');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    try {
      await fetch('http://127.0.0.1:8000/calls/1/end', { method: 'POST' });
    } catch(e) {
      console.error("Failed to end call", e);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getScoreColor = () => {
    if (score < 50) return 'text-blue-400 border-blue-400 shadow-[0_0_15px_#60a5fa]';
    if (score < 75) return 'text-yellow-400 border-yellow-400 shadow-[0_0_15px_#facc15]';
    return 'text-red-500 border-red-500 shadow-[0_0_15px_#ef4444]';
  };

  const getScoreLabel = () => {
    if (score < 50) return 'COLD';
    if (score < 75) return 'WARM';
    return 'HOT';
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Voice Console</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time autonomous lead conversion and orchestration.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse glow-purple" />
            <span className="text-sm font-medium">Recording</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 h-[calc(100vh-140px)]">
        
        {/* LEFT PANEL: Lead Intelligence */}
        <div className="col-span-3 glass-panel p-5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Lead Intelligence</h2>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xl font-bold">
              {lead.FullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{lead.FullName}</h3>
              <p className="text-slate-400 text-sm font-mono">{lead.Phone}</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <InfoRow label="Location" value={`${lead.City}, ${lead.State}`} />
            <InfoRow label="Persona" value={lead.Persona} />
            <InfoRow label="Network" value={lead.NetworkSize} />
            <InfoRow label="Source" value={lead.Source} />
            <InfoRow label="Language" value={lead.PreferredLanguage} />
          </div>

          <div className="mt-auto p-4 rounded-xl bg-blue-900/20 border border-blue-500/20">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Predicted Outcome</p>
            <p className="text-xl font-bold text-white">Partner Sign-up</p>
            <p className="text-sm text-slate-400 mt-1">Probability: <span className="text-cyan-400">{lead.ConversionProbability}</span></p>
          </div>
        </div>

        {/* CENTER PANEL: Live Conversation */}
        <div className="col-span-6 glass-panel p-6 flex flex-col relative flex-1">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${callStatus === 'connected' ? 'bg-green-500/10 text-green-400 border-green-500/50' : callStatus === 'dialing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 animate-pulse' : 'bg-red-500/10 text-red-400 border-red-500/50'}`}>
                {callStatus.toUpperCase()}
              </div>
              <span className="font-mono text-xl">{formatTime(timer)}</span>
            </div>
            
            <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getScoreColor()}`}>
              Lead Temp: {getScoreLabel()} ({score}%)
            </div>
          </div>

          {/* Waveform Visualization */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
            
            <div className="flex items-center justify-center gap-1 h-32 w-full max-w-md">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 rounded-full ${activeSpeaker === 'none' ? 'bg-slate-700 h-2' : activeSpeaker === 'AI' ? 'bg-cyan-400 glow-cyan' : 'bg-purple-400 glow-purple'}`}
                  animate={{
                    height: activeSpeaker !== 'none' ? [10, Math.random() * 80 + 20, 10] : 8,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5 + Math.random() * 0.5,
                    ease: "easeInOut",
                    delay: i * 0.02
                  }}
                />
              ))}
            </div>
            <div className="mt-8 text-center min-h-[40px]">
              {activeSpeaker === 'AI' && <p className="text-cyan-400 font-medium tracking-wide animate-pulse">AP Hunter is speaking...</p>}
              {activeSpeaker === 'Lead' && <p className="text-purple-400 font-medium tracking-wide animate-pulse">Lead is speaking...</p>}
            </div>
          </div>

          {/* Transcript Subtitles */}
          <div className="h-48 mt-6 bg-slate-900/50 rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
            {transcript.map((t, i) => (
              <div key={i} className={`flex ${t.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${t.speaker === 'AI' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50' : 'bg-purple-500/10 border border-purple-500/20 text-purple-50'}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${t.speaker === 'AI' ? 'text-cyan-500' : 'text-purple-500'}`}>{t.speaker}</span>
                  {t.text}
                </div>
              </div>
            ))}
            <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-6 mt-8">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-yellow-500 text-slate-900 shadow-[0_0_15px_#eab308]' : 'bg-slate-800 border border-white/10 hover:bg-slate-700'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={endCall}
              disabled={callStatus === 'ended'}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${callStatus === 'ended' ? 'bg-slate-800 text-slate-600' : 'bg-red-500 text-white shadow-[0_0_15px_#ef4444] hover:bg-red-600'}`}
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Multi-Agent Brain */}
        <div className="col-span-3 glass-panel p-5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-purple-500 to-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Multi-Agent Brain</h2>
          
          <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar pr-2">
            {agentModules.map((agent) => (
              <motion.div 
                key={agent.name}
                className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group"
                animate={{
                  borderColor: activeSpeaker !== 'none' && Math.random() > 0.7 ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: activeSpeaker !== 'none' && Math.random() > 0.7 ? '0 0 10px rgba(0, 240, 255, 0.2)' : 'none'
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <agent.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{agent.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{agent.desc}</p>
                </div>
                {activeSpeaker !== 'none' && Math.random() > 0.5 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col border-b border-white/5 pb-3">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</span>
      <span className="text-sm font-medium text-slate-200">{value}</span>
    </div>
  );
}
