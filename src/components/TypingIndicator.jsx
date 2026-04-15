import React from 'react';

export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: '#1e1e2e', border: '1px solid #2a2a3a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14,
      }}>✦</div>
      <div style={{
        padding: '12px 16px',
        background: '#12121a',
        border: '1px solid #2a2a3a',
        borderRadius: '4px 12px 12px 12px',
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        {[0, 0.18, 0.36].map((delay, i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#a78bfa',
            display: 'inline-block',
            animation: `skydeskBounce 1.1s ${delay}s infinite`,
          }} />
        ))}
        <style>{`
          @keyframes skydeskBounce {
            0%,80%,100%{transform:translateY(0);opacity:0.4}
            40%{transform:translateY(-5px);opacity:1}
          }
        `}</style>
      </div>
    </div>
  );
}
