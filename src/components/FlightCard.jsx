import React from 'react';

export default function FlightCard({ flights }) {
  if (!flights || !flights.length) {
    return (
      <div style={{ marginTop: 12, color: '#ff6b6b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
        ✗ No flights found for that route.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, color: '#666', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {flights.length} result{flights.length > 1 ? 's' : ''} found
      </div>
      {flights.map((f, i) => {
        const dep = f.date_from ? new Date(f.date_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
        const arr = f.date_to   ? new Date(f.date_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })   : '--:--';
        return (
          <div key={i} style={{
            background: '#12121a',
            border: '1px solid #2a2a3a',
            borderLeft: '3px solid #a78bfa',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 15, letterSpacing: '0.05em' }}>
                {f.flight_number || `FL-${f.id}`}
              </span>
              <span style={{ fontSize: 10, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>
                AVAILABLE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f8' }}>{f.departure_airport || f.airport_from}</span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, height: 1, background: '#2a2a3a' }} />
                <span style={{ fontSize: 10, color: '#555' }}>✈</span>
                <div style={{ flex: 1, height: 1, background: '#2a2a3a' }} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f8' }}>{f.destination_airport || f.airport_to}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#888' }}>
              <span>{dep} → {arr}</span>
              {f.duration && <span>{f.duration} min</span>}
              <span style={{ color: '#a78bfa' }}>{f.available_seats ?? f.capacity} seats</span>
              {f.id && <span style={{ color: '#666' }}>ID: {f.id}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
