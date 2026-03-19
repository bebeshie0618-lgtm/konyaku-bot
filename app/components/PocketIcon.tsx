'use client';
import { useState } from 'react';

const IMAGE_URL = 'https://illust.daysnet.net/illust/robot_blue.png';

export default function PocketIcon({ size = 32 }: { size?: number }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src={IMAGE_URL}
        alt="ポケットくん"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  // CSS/HTML fallback: cute blue robot with round eyes and antenna
  const s = size;
  return (
    <div className="shrink-0 relative" style={{ width: s, height: s }}>
      {/* Antenna stem */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: s * 0.06,
        height: s * 0.2,
        background: '#93c5fd',
        borderRadius: s * 0.03,
      }} />
      {/* Antenna ball */}
      <div style={{
        position: 'absolute',
        top: -s * 0.06,
        left: '50%',
        transform: 'translateX(-50%)',
        width: s * 0.16,
        height: s * 0.16,
        background: '#fbbf24',
        borderRadius: '50%',
        boxShadow: '0 0 4px rgba(251,191,36,0.5)',
      }} />
      {/* Face (main body) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: s,
        height: s * 0.82,
        background: 'linear-gradient(145deg, #60a5fa, #3b82f6)',
        borderRadius: s * 0.3,
        boxShadow: `inset 0 ${s * 0.02}px ${s * 0.06}px rgba(255,255,255,0.3)`,
      }}>
        {/* Left eye */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '22%',
          width: s * 0.22,
          height: s * 0.22,
          background: 'white',
          borderRadius: '50%',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: s * 0.11,
            height: s * 0.11,
            background: '#1e293b',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '22%',
            width: s * 0.05,
            height: s * 0.05,
            background: 'white',
            borderRadius: '50%',
          }} />
        </div>
        {/* Right eye */}
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '22%',
          width: s * 0.22,
          height: s * 0.22,
          background: 'white',
          borderRadius: '50%',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: s * 0.11,
            height: s * 0.11,
            background: '#1e293b',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '22%',
            width: s * 0.05,
            height: s * 0.05,
            background: 'white',
            borderRadius: '50%',
          }} />
        </div>
        {/* Mouth (smile) */}
        <div style={{
          position: 'absolute',
          bottom: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: s * 0.28,
          height: s * 0.1,
          borderBottom: `${Math.max(2, s * 0.04)}px solid #1e3a5f`,
          borderRadius: `0 0 ${s * 0.14}px ${s * 0.14}px`,
        }} />
      </div>
    </div>
  );
}
