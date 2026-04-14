import React from 'react';

export default function CheckinCard({ checkin }) {
  if (!checkin) {
    return <div style={{ marginTop: 10, color: '#ff6b6b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>✗ Check-in failed.</div>;
  }

  const passengers = Array.isArray(checkin.passengers)
    ? checkin.passengers
    : checkin.passenger
      ? [checkin.passenger]
      : checkin.seat_number
        ? [{ full_name: checkin.passenger_name || 'Passenger', seat_number: checkin.seat_number }]
        : [];

  return (
    <div style={{
      marginTop: 12,
      background: '#0e0e18',
      border: '1px solid #2a2a3a',
      borderLeft: '3px solid #38bdf8',
      borderRadius: 8,
      padding: '14px 16px',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ fontSize: 11, color: '#38bdf8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        ✓ Check-In Complete
      </div>
      {passengers.length > 0 ? passengers.map((p, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 0',
          borderTop: i > 0 ? '1px solid #1e1e2e' : 'none',
        }}>
          <span style={{ fontSize: 14, color: '#e0e0f0', fontWeight: 500 }}>
            {p.full_name || p.name || 'Passenger'}
          </span>
          <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.05em' }}>
            SEAT {p.seat_number || '--'}
          </span>
        </div>
      )) : (
        <div style={{ color: '#e0e0f0', fontSize: 13 }}>
          {checkin.message || 'Check-in processed successfully.'}
        </div>
      )}
    </div>
  );
}
