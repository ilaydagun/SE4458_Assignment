// ─── Backend API helpers ─────────────────────────────────────────────────────
// All calls go to ilaydagun's EC2 Flask backend (SE4458 Midterm)
// Endpoints: /auth/register, /auth/login, /flights/query,
//            /tickets/buy, /checkin/, /flights/passengers

export async function registerUser(baseUrl, email, password) {
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

export async function loginUser(baseUrl, email, password) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

// FIX #2: renamed departure_airport→airport_from, destination_airport→airport_to
//         and date→date_from to match backend /flights/query params
export async function searchFlights(baseUrl, jwt, params) {
  const q = new URLSearchParams({
    airport_from: params.departure_airport,
    airport_to: params.destination_airport,
    date_from: params.date,
    number_of_people: params.num_passengers || 1,
  });
  const res = await fetch(`${baseUrl}/flights/query?${q}`, {
    headers: { 'Authorization': `Bearer ${jwt}` },
  });
  const data = await res.json();
  return { status: res.status, data };
}

export async function buyTicket(baseUrl, jwt, params) {
  const body = {
    flight_number:   params.flight_number,
    date:            params.date,
    passenger_names: Array.isArray(params.passenger_names)
      ? params.passenger_names
      : [params.passenger_name],
  };

  const res = await fetch(`${baseUrl}/tickets/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

// FIX #1: backend expects flight_number + date + passenger_name, not ticket_id
//         endpoint is /checkin/ not /tickets/checkin
export async function checkIn(baseUrl, jwt, params) {
  const res = await fetch(`${baseUrl}/checkin/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      flight_number:  params.flight_number,
      date:           params.date,
      passenger_name: params.passenger_name,
    }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

// FIX #3: endpoint is /flights/passengers, params are flight_number + date, not flight_id
export async function getPassengers(baseUrl, jwt, params) {
  const q = new URLSearchParams({
    flight_number: params.flight_number,
    date:          params.date,
  });
  const res = await fetch(`${baseUrl}/flights/passengers?${q}`, {
    headers: { 'Authorization': `Bearer ${jwt}` },
  });
  const data = await res.json();
  return { status: res.status, data };
}

// ─── AI Agent (Claude API via local proxy) ───────────────────────────────────
const SYSTEM_PROMPT = `You are SkyDesk, a flight AI agent for an airline ticketing system (SE4458 midterm project by ilaydagun).
You help users search for flights, buy tickets, check in, and view passenger lists.

You have access to these actions:
- search_flights: Search available flights.
  Required params: departure_airport (city name e.g. "Izmir", "Istanbul", "Ankara"), destination_airport (city name e.g. "Ankara", "Frankfurt"), date (YYYY-MM-DD), num_passengers (number, default 1)
- buy_ticket: Purchase a ticket.
  Required params: flight_number (string e.g. "TK500"), date (datetime format e.g. "2026-04-05T10:00:00"), passenger_names (array of full name strings).
  IMPORTANT: Always include ALL three fields. Use flight details from earlier in the conversation. If only a date is known without a time, append "T00:00:00" to it.
- checkin: Check in using a ticket.
  Required params: flight_number (string), date (datetime format e.g. "2026-04-05T10:00:00"), passenger_name (full name string)
- get_passengers: View passenger list for a flight.
  Required params: flight_number (string), date (datetime format e.g. "2026-04-05T10:00:00")
- chat: General conversation, no API call needed.

Always respond with ONLY a raw JSON object (no markdown, no backticks):
{
  "action": "search_flights" | "buy_ticket" | "checkin" | "get_passengers" | "chat",
  "params": { ...relevant params },
  "message": "Friendly message explaining what you are doing or your answer"
}

If the user's request is missing required information (e.g. date, passenger name, flight number), use action "chat" and ask for it.`;

export async function askAgent(history) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:     SYSTEM_PROMPT,
      messages:   history,
    }),
  });

  const data = await res.json();

  if (data.error) {
    const errMsg = data.error.message || JSON.stringify(data.error);
    return { action: 'chat', message: 'API error: ' + errMsg, params: {} };
  }

  const raw = (data.content || []).map(b => b.text || '').join('').trim();

  if (!raw) {
    return { action: 'chat', message: 'Empty response received. Please try again.', params: {} };
  }

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.message) parsed.message = 'Done!';
    return parsed;
  } catch (_) {}

  try {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (!parsed.message) parsed.message = 'Done!';
      return parsed;
    }
  } catch (_) {}

  return { action: 'chat', message: raw, params: {} };
}
