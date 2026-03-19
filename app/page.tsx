'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TopPage() {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  const handleDoorClick = () => {
    setIsOpening(true);
    setTimeout(() => router.push('/login'), 900);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">

      {/* ロゴ */}
      <div className="mb-16 text-center">
        <h1 className="text-xs font-black tracking-[0.4em] text-gray-900 uppercase">
          Konyaku Bot
        </h1>
        <p className="text-[10px] text-gray-300 mt-2 tracking-[0.3em] uppercase">
          AI Pocket Support
        </p>
      </div>

      {/* どこでもドア */}
      <div
        onClick={handleDoorClick}
        className="cursor-pointer"
        style={{ perspective: '1200px' }}
      >
        <div
          style={{
            width: '180px',
            height: '300px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.9s ease',
            transform: isOpening ? 'rotateY(-110deg)' : 'rotateY(0deg)',
            transformOrigin: 'left center',
          }}
        >
          {/* ドア台座 */}
          <div style={{
            position: 'absolute',
            bottom: '-18px',
            left: '-18px',
            right: '-18px',
            height: '18px',
            background: '#f0676f',
            borderRadius: '0 0 10px 10px',
          }} />
          {/* ドア上部 */}
          <div style={{
            position: 'absolute',
            top: '-16px',
            left: '-10px',
            right: '-10px',
            height: '16px',
            background: '#f0676f',
            borderRadius: '10px 10px 0 0',
          }} />
          {/* ドア本体（前面） */}
          <div style={{
            width: '180px',
            height: '300px',
            background: 'linear-gradient(150deg, #f47c84 0%, #e8606a 60%, #d4555e 100%)',
            borderRadius: '90px 90px 4px 4px',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            boxShadow: isOpening
              ? 'none'
              : '6px 12px 40px rgba(232,96,106,0.4), inset 2px 2px 10px rgba(255,255,255,0.15)',
            transition: 'box-shadow 0.3s',
          }}>
            {/* 上部パネル */}
            <div style={{
              position: 'absolute',
              top: '18px', left: '14px', right: '14px',
              height: '100px',
              border: '1.5px solid rgba(255,255,255,0.2)',
              borderRadius: '70px 70px 4px 4px',
            }} />
            {/* 下部パネル */}
            <div style={{
              position: 'absolute',
              top: '134px', left: '14px', right: '14px',
              height: '130px',
              border: '1.5px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
            }} />
            {/* ノブ */}
            <div style={{
              position: 'absolute',
              left: '22px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              background: '#3a3a4a',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }} />
          </div>

          {/* ドア内側（開いた時に見える） */}
          <div style={{
            width: '180px',
            height: '300px',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)',
            borderRadius: '90px 90px 4px 4px',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: '2rem' }}>✦</span>
          </div>
        </div>
      </div>

      {/* 光フラッシュ */}
      {isOpening && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'white',
            zIndex: 50,
            animation: 'flash 0.9s forwards',
          }}
        />
      )}

      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          60% { opacity: 0; }
          80% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>

      <p className={`mt-12 text-[10px] tracking-[0.4em] text-gray-300 uppercase transition-opacity duration-300 ${
        isOpening ? 'opacity-0' : 'opacity-100'
      }`}>
        tap to enter
      </p>
    </div>
  );
}
