import React from 'react';

export default function TicketCard({ booking }) {
  if (!booking) {
    return (
      <div style={{ marginTop: 10, color: '#ff6b6b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
        ✗ Booking info unavailable.
      </div>
    );
  }

  const tickets = booking.tickets || (booking.ticket_numbers ? [] : null);
  const ticketNumbers = booking.ticket_numbers || [];

  return (
    <div style={{
      marginTop: 12,
      background: '#0e0e18',
      border: '1px solid #2a2a3a',
      borderLeft: '3px solid #4ade80',
      borderRadius: 8,
      padding: '14px 16px',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ fontSize: 11, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        ✓ Booking Confirmed
      </div>

      {tickets && tickets.length > 0 ? tickets.map((t, i) => (
        <div key={i} style={{
          padding: '7px 0',
          borderTop: i > 0 ? '1px solid #1e1e2e' : 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, color: '#e0e0f0', fontWeight: 500 }}>
            {t.passenger_name || `Passenger ${i + 1}`}
          </span>
          <span style={{ fontSize: 11, color: '#a78bfa', letterSpacing: '0.05em' }}>
            TICKET #{t.id || ticketNumbers[i] || '—'}
          </span>
        </div>
      )) : ticketNumbers.length > 0 ? (
        <div style={{ color: '#e0e0f0', fontSize: 13 }}>
          Ticket ID{ticketNumbers.length > 1 ? 's' : ''}: {ticketNumbers.join(', ')}
        </div>
      ) : (
        <div style={{ color: '#e0e0f0', fontSize: 13 }}>
          {booking.message || 'Purchase processed successfully.'}
        </div>
      )}
    </div>
  );
}
