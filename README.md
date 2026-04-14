# SkyDesk — Flight AI Agent
### SE4458 Midterm · ilaydagun

A dark-themed React flight assistant chatbot connected to your EC2 backend at `http://63.178.228.72:5000`.

---

## Features
- Login / Register screen (JWT auth via `/auth/register` and `/auth/login`)
- AI agent powered by Claude that understands natural language
- Search flights (`/flights/query`)
- Buy tickets (`/tickets/buy`)
- Check in passengers (`/tickets/checkin`)
- View passenger list (`/tickets/passengers`)

---

## Setup

### 1. Start the proxy (required — opens Claude API access)

```bash
cd proxy
npm install
# Set your Anthropic API key:
export ANTHROPIC_API_KEY=sk-ant-...      # Mac/Linux
set ANTHROPIC_API_KEY=sk-ant-...         # Windows
node server.js
```

Proxy runs at `http://localhost:3001`.

### 2. Start the React app (new terminal)

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

---

## Usage

1. Open `http://localhost:3000`
2. Register or sign in with your account
3. Chat naturally — examples:
   - *"Find flights from IST to FRA on 2026-05-01"*
   - *"Buy a ticket on flight ID 2 for Jane Doe"*
   - *"Check in with ticket ID 5"*
   - *"Show passengers for flight ID 1"*

---

## EC2 Backend
`http://63.178.228.72:5000`

Make sure CORS is enabled on the Flask app and port 5000 is open in the EC2 security group.
