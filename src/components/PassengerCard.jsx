import React from 'react';

export default function PassengerCard({ passengers }) {
  const list = Array.isArray(passengers) ? passengers : [];

  if (!list.length) {
    return <div style={{ marginTop: 10, color: '#888', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>No passengers found.</div>;
  }

  return (
    <div style={{
      marginTop: 12,
      background: '#0e0e18',
      border: '1px solid #2a2a3a',
      borderLeft: '3px solid #f59e0b',
      borderRadius: 8,
      padding: '14px 16px',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        Passenger Manifest — {list.length} pax
      </div>
      {list.map((p, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '5px 0',
          borderTop: i > 0 ? '1px solid #1e1e2e' : 'none',
          fontSize: 13, color: '#e0e0f0',
        }}>
          <span>{p.passenger_name || p.name || `Passenger ${i + 1}`}</span>
          {p.seat_number && <span style={{ color: '#a78bfa' }}>Seat {p.seat_number}</span>}
          {p.ticket_id && <span style={{ color: '#666' }}>#{p.ticket_id}</span>}
        </div>
      ))}
    </div>
  );
}
