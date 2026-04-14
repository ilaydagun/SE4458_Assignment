import React, { useState, useRef, useEffect } from 'react';
import AuthScreen      from './components/AuthScreen';
import MessageBubble   from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import { askAgent, searchFlights, buyTicket, checkIn, getPassengers } from './api';

const BASE_URL = 'http://63.178.228.72:5000';

const WELCOME = {
  role: 'assistant',
  text: "Hello. I'm SkyDesk — your flight AI agent.\nI can search flights, buy tickets, handle check-in, and pull passenger lists.\nWhat do you need?",
  ts: Date.now(),
  quickActions: true,
};

const QUICK = [
  { label: '/ search flights',    text: 'Find flights from IST to FRA on 2026-05-01' },
  { label: '/ buy ticket',        text: 'Buy a ticket on flight ID 1 for John Doe' },
  { label: '/ check in',          text: 'Check in with ticket ID 3' },
  { label: '/ passenger list',    text: 'Show passengers for flight ID 1' },
];

export default function App() {
  const [jwt,      setJwt]      = useState(null);
  const [email,    setEmail]    = useState('');
  const [messages, setMessages] = useState([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [history,  setHistory]  = useState([]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function handleLogin(token, userEmail) {
    setJwt(token);
    setEmail(userEmail);
  }

  function handleLogout() {
    setJwt(null);
    setEmail('');
    setMessages([WELCOME]);
    setHistory([]);
    setInput('');
  }

  function addMessage(msg) {
    setMessages(prev => [...prev, { ...msg, ts: Date.now() }]);
  }

  async function handleSend(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    addMessage({ role: 'user', text: userText });
    setLoading(true);

    const newHistory = [...history, { role: 'user', content: userText }];

    try {
      const parsed = await askAgent(newHistory);
      const updatedHistory = [
        ...newHistory,
        { role: 'assistant', content: JSON.stringify(parsed) },
      ];

      if (parsed.action === 'chat') {
        addMessage({ role: 'assistant', text: parsed.message });
        setHistory(updatedHistory);
        setLoading(false);
        return;
      }

      addMessage({ role: 'assistant', text: parsed.message || 'On it...' });

      let result;
      try {
        if (parsed.action === 'search_flights') {
          result = await searchFlights(BASE_URL, jwt, parsed.params);
        } else if (parsed.action === 'buy_ticket') {
          result = await buyTicket(BASE_URL, jwt, parsed.params);
        } else if (parsed.action === 'checkin') {
          result = await checkIn(BASE_URL, jwt, parsed.params);
        } else if (parsed.action === 'get_passengers') {
          result = await getPassengers(BASE_URL, jwt, parsed.params.flight_id);
        }
      } catch (fetchErr) {
        addMessage({
          role: 'assistant',
          text: 'Could not reach the server.',
          apiError: fetchErr.message,
        });
        setHistory(updatedHistory);
        setLoading(false);
        return;
      }

      const resultMsg = { role: 'assistant', text: '' };

      if (parsed.action === 'search_flights') {
        const flights = result.data?.flights
          || result.data?.results
          || (Array.isArray(result.data) ? result.data : []);
        resultMsg.text    = flights.length ? '' : 'No flights found for that route.';
        resultMsg.flights = flights;
      } else if (parsed.action === 'buy_ticket') {
        const d = result.data;
        const success = result.status === 200 || result.status === 201 || d?.success === true;
        resultMsg.text    = success ? 'Ticket purchased successfully.' : 'Purchase failed — check flight ID and credentials.';
        resultMsg.booking = d?.data || d;
      } else if (parsed.action === 'checkin') {
        resultMsg.text    = result.status === 200 ? 'Check-in complete.' : 'Check-in failed — verify ticket ID.';
        resultMsg.checkin = result.data;
      } else if (parsed.action === 'get_passengers') {
        const list = result.data?.passengers || (Array.isArray(result.data) ? result.data : []);
        resultMsg.text       = list.length ? `${list.length} passenger(s) on this flight:` : 'No passengers found.';
        resultMsg.passengers = list;
      }

      addMessage(resultMsg);
      setHistory([
        ...updatedHistory,
        { role: 'user', content: `[API result for ${parsed.action}]: ${JSON.stringify(result.data)}` },
      ]);
    } catch (err) {
      addMessage({ role: 'assistant', text: 'Something went wrong. ' + err.message });
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  if (!jwt) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      fontFamily: "'Syne', sans-serif",
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.35,
      }} />

      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 720,
        background: '#12121a',
        border: '1px solid #2a2a3a',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '1px solid #2a2a3a',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#0e0e18',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed22, #38bdf822)',
            border: '1px solid #a78bfa33',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#a78bfa',
          }}>✦</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f8', letterSpacing: '-0.01em' }}>SkyDesk</div>
            <div style={{ fontSize: 11, color: '#444', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
              SE4458 — AIRLINE AI AGENT
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555', fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: loading ? '#f59e0b' : '#4ade80',
                display: 'inline-block',
                boxShadow: loading ? '0 0 6px #f59e0b' : '0 0 6px #4ade80',
                animation: 'skydeskPulse 2s infinite',
              }} />
              {loading ? 'THINKING' : 'ONLINE'}
            </div>
            <div style={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: '#a78bfa', letterSpacing: '0.04em',
            }}>
              {email}
            </div>
            <button
              onClick={handleLogout}
              style={{
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                background: 'transparent', border: '1px solid #2a2a3a',
                borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                color: '#555', letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.target.style.borderColor = '#ff6b6b44'; e.target.style.color = '#ff6b6b'; }}
              onMouseOut={e  => { e.target.style.borderColor = '#2a2a3a'; e.target.style.color = '#555'; }}
            >
              EXIT
            </button>
          </div>
          <style>{`
            @keyframes skydeskPulse{0%,100%{opacity:1}50%{opacity:0.4}}
          `}</style>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minHeight: 400,
          maxHeight: 480,
        }}>
          {messages.map((msg, i) => (
            <div key={i}>
              <MessageBubble msg={msg} />
              {msg.quickActions && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, marginLeft: 42 }}>
                  {QUICK.map(q => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.text)}
                      style={{
                        fontSize: 11, padding: '5px 12px',
                        background: '#0e0e18',
                        border: '1px solid #2a2a3a',
                        borderRadius: 6, cursor: 'pointer',
                        color: '#a78bfa',
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.04em',
                        transition: 'all 0.12s',
                      }}
                      onMouseOver={e => { e.target.style.borderColor = '#a78bfa55'; e.target.style.background = '#1e1e2e'; }}
                      onMouseOut={e  => { e.target.style.borderColor = '#2a2a3a'; e.target.style.background = '#0e0e18'; }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          borderTop: '1px solid #2a2a3a',
          padding: '12px 16px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          background: '#0e0e18',
        }}>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="type a command or ask anything..."
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              background: '#12121a',
              border: '1px solid #2a2a3a',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#e0e0f0',
              resize: 'none',
              lineHeight: 1.5,
              outline: 'none',
              maxHeight: 120,
              overflowY: 'auto',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#a78bfa55'}
            onBlur={e  => e.target.style.borderColor = '#2a2a3a'}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42,
              borderRadius: 10,
              background: loading || !input.trim() ? '#1e1e2e' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              border: '1px solid #2a2a3a',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s',
              fontSize: 16,
              color: loading || !input.trim() ? '#333' : 'white',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
