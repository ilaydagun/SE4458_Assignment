import React, { useState } from 'react';
import { registerUser, loginUser } from '../api';

const BASE_URL = 'http://63.178.228.72:5000';

export default function AuthScreen({ onLogin }) {
  const [tab,      setTab]      = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (tab === 'register') {
        const res = await registerUser(BASE_URL, email.trim(), password);
        if (res.status === 200 || res.status === 201) {
          setSuccess('Account created! Please sign in.');
          setTab('login');
          setPassword('');
        } else {
          setError(res.data?.message || res.data?.msg || 'Registration failed.');
        }
      } else {
        const res = await loginUser(BASE_URL, email.trim(), password);
        const token = res.data?.access_token || res.data?.token || res.data?.jwt || res.data?.data?.access_token;
        if ((res.status === 200 || res.status === 201) && token) {
          onLogin(token, email.trim());
        } else {
          setError(res.data?.message || res.data?.msg || 'Login failed. Check your credentials.');
        }
      }
    } catch (e) {
      setError('Could not reach the server. Is EC2 running?');
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  const inputStyle = {
    width: '100%',
    background: '#0a0a0f',
    border: '1px solid #2a2a3a',
    borderRadius: 8,
    padding: '11px 14px',
    fontSize: 14,
    color: '#e0e0f0',
    fontFamily: "'JetBrains Mono', monospace",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

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
      {/* Subtle grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.4,
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #a78bfa22, #38bdf822)',
            border: '1px solid #a78bfa44',
            marginBottom: 16, fontSize: 24,
          }}>✦</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f0f8', letterSpacing: '-0.02em' }}>SkyDesk</div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
            SE4458 — AIRLINE AI AGENT
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#12121a',
          border: '1px solid #2a2a3a',
          borderRadius: 16,
          padding: '28px 28px',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: '#0a0a0f',
            border: '1px solid #2a2a3a',
            borderRadius: 10,
            marginBottom: 24,
            padding: 3,
          }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '8px 0',
                  background: tab === t ? '#1e1e2e' : 'transparent',
                  border: tab === t ? '1px solid #2a2a3a' : '1px solid transparent',
                  borderRadius: 8,
                  color: tab === t ? '#a78bfa' : '#555',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'all 0.15s',
                }}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{
              background: '#ff6b6b15', border: '1px solid #ff6b6b44',
              borderRadius: 8, padding: '9px 12px', marginBottom: 16,
              fontSize: 13, color: '#ff6b6b', fontFamily: "'JetBrains Mono', monospace",
            }}>✗ {error}</div>
          )}
          {success && (
            <div style={{
              background: '#4ade8015', border: '1px solid #4ade8044',
              borderRadius: 8, padding: '9px 12px', marginBottom: 16,
              fontSize: 13, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace",
            }}>✓ {success}</div>
          )}

          {/* Fields */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="you@example.com"
              onFocus={e => e.target.style.borderColor = '#a78bfa'}
              onBlur={e  => e.target.style.borderColor = '#2a2a3a'}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Password</label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••••"
              onFocus={e => e.target.style.borderColor = '#a78bfa'}
              onBlur={e  => e.target.style.borderColor = '#2a2a3a'}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? '#1e1e2e' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              border: 'none', borderRadius: 10,
              color: 'white', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Syne', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'opacity 0.15s',
              opacity: loading ? 0.6 : 1,
            }}>
            {loading ? '...' : tab === 'login' ? 'Enter ✦' : 'Create Account'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#333', fontFamily: "'JetBrains Mono', monospace" }}>
          {BASE_URL}
        </div>
      </div>
    </div>
  );
}
