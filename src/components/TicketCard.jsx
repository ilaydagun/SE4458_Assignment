import React from 'react';

export default function TicketCard({ booking }) {
  if (!booking) {
    return <div style={{ marginTop: 10, color: '#ff6b6b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>✗ Booking failed. Check your credentials.</div>;
  }

  // Handle nested response: { data: { tickets: [...], ticket_numbers: [...] }, success: true }
  const tickets = booking.tickets || (booking.data?.tickets) || [];
  const ticketNumbers = booking.ticket_numbers || booking.data?.ticket_numbers || [];
  const firstTicket = tickets[0] || {};
  const ticketId = ticketNumbers[0] || firstTicket.id || firstTicket.ticket_id || booking.ticket_id || booking.id;

  if (!ticketId && !tickets.length) {
    return <div style={{ marginTop: 10, color: '#ff6b6b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>✗ Booking failed. Check your credentials.</div>;
  }

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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.04em' }}>#{ticketId}</span>
        <span style={{ fontSize: 10, color: '#888' }}>ticket id</span>
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          ['Flight',     firstTicket.flight_id || booking.flight_number],
          ['Passenger',  firstTicket.passenger_name || booking.passenger_name],
          ['Checked In', firstTicket.is_checked_in != null ? (firstTicket.is_checked_in ? 'Yes' : 'No') : null],
          ['Status',     booking.message || 'Confirmed'],
        ].filter(([, v]) => v != null).map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#e0e0f0' }}>{String(val)}</div>
          </div>
        ))}
      </div>
      {tickets.length > 1 && (
        <div style={{ marginTop: 12, borderTop: '1px solid #1e1e2e', paddingTop: 10 }}>
          {tickets.map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
              #{t.id} — {t.passenger_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}