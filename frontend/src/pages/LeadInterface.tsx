import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadInterface() {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Click to Connect');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const playAudioChunk = async (arrayBuffer: ArrayBuffer) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    try {
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error("Error decoding audio data", e);
    }
  };

  const startStreaming = async () => {
    try {
      setStatus('Requesting permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setStatus('Connecting...');
      wsRef.current = new WebSocket('ws://localhost:8000/ws');
      
      wsRef.current.onopen = () => {
        setStatus('Listening...');
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(event.data);
          }
        };
        
        mediaRecorderRef.current.start(250); // 250ms chunks
      };

      wsRef.current.onmessage = async (event) => {
        setStatus('AI is Speaking...');
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          playAudioChunk(arrayBuffer);
        }
        // Reset status after a delay assuming speech stops, this is naive but works for UI
        setTimeout(() => {
           if (wsRef.current?.readyState === WebSocket.OPEN) {
              setStatus('Listening...');
           }
        }, 2000);
      };

      wsRef.current.onerror = () => {
        setStatus('Connection Error');
        stopStreaming();
      };

      wsRef.current.onclose = () => {
        setStatus('Disconnected');
        stopStreaming();
      };
      
      setIsActive(true);
    } catch (err) {
      console.error("Error starting stream:", err);
      setStatus('Microphone access denied');
    }
  };

  const stopStreaming = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsActive(false);
    setStatus('Click to Connect');
  };

  const toggleMic = () => {
    if (isActive) {
      stopStreaming();
    } else {
      startStreaming();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] glass-panel p-6">
      <div className="text-center">
        <motion.button
          onClick={toggleMic}
          className={`relative flex items-center justify-center w-40 h-40 rounded-full shadow-2xl transition-all duration-300 focus:outline-none ${isActive ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white glow-cyan'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
          {isActive ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
        </motion.button>
        <h2 className="mt-8 text-2xl font-light text-slate-300 tracking-wide">{status}</h2>
      </div>
    </div>
  );
}
