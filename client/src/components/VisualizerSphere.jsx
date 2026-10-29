import React from 'react';
import { Mic, Volume2, Sparkles, Loader2 } from 'lucide-react';

export default function VisualizerSphere({ state = 'idle', onClick, isListening }) {
  // state: 'idle' | 'listening' | 'thinking' | 'speaking'

  return (
    <div className="visualizer-wrapper">
      <div className="orb-container">
        {/* Ripple wave rings */}
        <div className={`orb-ring r1 ${state !== 'idle' ? 'active' : ''}`} />
        <div className={`orb-ring r2 ${state !== 'idle' ? 'active' : ''}`} />
        <div className={`orb-ring r3 ${state !== 'idle' ? 'active' : ''}`} />

        {/* Core Animated Orb */}
        <div
          className={`orb-sphere ${state}`}
          onClick={onClick}
          title={isListening ? "Nhấn để dừng thu âm" : "Nhấn để nói chuyện"}
        >
          {state === 'listening' && <Mic size={28} className="animate-pulse" />}
          {state === 'thinking' && <Loader2 size={28} className="animate-spin" />}
          {state === 'speaking' && <Volume2 size={28} />}
          {state === 'idle' && <Sparkles size={26} />}
        </div>
      </div>
    </div>
  );
}
