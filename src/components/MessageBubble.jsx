import React from 'react';
import FlightCard    from './FlightCard';
import TicketCard    from './TicketCard';
import CheckinCard   from './CheckinCard';
import PassengerCard from './PassengerCard';

export default function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const time   = new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: isUser ? '#1e1e38' : '#1e1e2e',
        border: `1px solid ${isUser ? '#a78bfa44' : '#2a2a3a'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: isUser ? 10 : 14,
        color: isUser ? '#a78bfa' : '#888',
        fontWeight: 600,
      }}>
        {isUser ? 'YOU' : '✦'}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: isUser ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
          background: isUser ? '#1e1e38' : '#12121a',
          border: `1px solid ${isUser ? '#a78bfa33' : '#2a2a3a'}`,
          color: isUser ? '#d4d4f0' : '#c8c8e0',
          fontSize: 14,
          lineHeight: 1.65,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 400,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.text}
          {msg.flights    && <FlightCard    flights={msg.flights} />}
          {msg.booking    && <TicketCard    booking={msg.booking} />}
          {msg.checkin    && <CheckinCard   checkin={msg.checkin} />}
          {msg.passengers && <PassengerCard passengers={msg.passengers} />}
          {msg.apiError && (
            <div style={{ color: '#ff6b6b', fontSize: 12, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              ✗ {msg.apiError}
            </div>
          )}
        </div>
        <div style={{
          fontSize: 10,
          color: '#3a3a4a',
          marginTop: 3,
          textAlign: isUser ? 'right' : 'left',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.04em',
        }}>
          {time}
        </div>
      </div>
    </div>
  );
}
