# SkyDesk — Flight AI Agent

**SE4458 Project · İlayda Gün**

SkyDesk is a dark-themed React-based AI flight assistant that allows users to interact with an airline ticketing system using natural language. It is built on top of an existing Flask backend deployed on AWS EC2.

The system integrates an AI agent (Claude) to interpret user input and map it to backend API operations such as flight search, ticket purchase, and check-in.

---

## Project Links

- **Backend Repository:**  
  https://github.com/ilaydagun/SE4458_Midterm  

- **Frontend (This Project):**  
  https://github.com/ilaydagun/SE4458_Assignment
  
- **API Base URL (EC2):**  
  http://63.178.228.72:5000

- **API Documentation (Swagger):**  
  http://63.178.228.72:5000/apidocs/

- **Chatbot Link:**  
  63.178.228.72

- **Demo Video:**  
  *(Video link here)*

---

## System Architecture

```
User → React UI → Claude AI Agent → Proxy Server → Flask API → PostgreSQL (RDS)
```

- The user sends a natural language message  
- Claude interprets intent (e.g., search, buy, check-in)  
- Proxy server securely communicates with Claude API  
- Request is translated into REST API calls  
- Backend processes request and returns response  

---

## Technologies Used

### Frontend
- React (Dark UI)
- Axios (API communication)

### AI Layer
- Claude (Anthropic API)
- Intent-based command mapping

### Backend
- Python (Flask)
- SQLAlchemy
- JWT Authentication
- Swagger (Flasgger)

### Deployment
- AWS EC2 (Backend)
- PostgreSQL (RDS)
- Gunicorn

---

## Features

### Authentication
- User registration (`/auth/register`)
- User login (`/auth/login`)
- JWT-based authentication

### AI Chatbot
- Natural language understanding
- Converts user input into API actions
- Supports multiple commands in conversational format

### Flight Management
- Search flights (`/flights/query`)
- Filter by location and date

### Ticket Operations
- Buy tickets (`/tickets/buy`)
- Automatic capacity update
- Handles sold-out cases

### Check-in System
- Assign seat automatically (`/tickets/checkin`)

### Passenger Management
- View passenger list (`/tickets/passengers`)

---

## Design Decisions

- AI-driven interaction instead of traditional UI forms  
- Proxy architecture to protect API keys  
- Separation of frontend, AI layer, and backend  
- Reuse of existing REST API without modification  
- Dark theme UI for modern chatbot experience  

---

## Assumptions

- Users provide understandable natural language inputs  
- Claude correctly maps user intent to API actions  
- Backend endpoints are available and responsive  
- Users provide valid flight and ticket IDs  
- No advanced handling for ambiguous input  

---

## Limitations & Issues Encountered

- Claude requires a proxy server → extra setup  
- Basic intent parsing may fail for complex sentences  
- No advanced NLP fallback mechanism  
- CORS issues required backend configuration  
- Gunicorn deployment issues during setup  
- Rate limiting disabled during testing  
- No concurrency control for ticket purchases  

---

## Setup & Installation

### 1. Start the Proxy Server

```bash
cd proxy
npm install
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # Mac/Linux
set ANTHROPIC_API_KEY=sk-ant-...      # Windows
```

Run the proxy:

```bash
node server.js
```

Proxy runs at:  
http://localhost:3001

---

### 2. Start the React App

```bash
npm install
npm start
```

App runs at:  
http://localhost:3000

---

## Usage

1. Open the app in your browser  
2. Register or log in  
3. Start chatting with the AI  

### Example Commands:

- "Find flights from IST to FRA on 2026-05-01"  
- "Buy a ticket on flight ID 2 for Jane Doe"  
- "Check in with ticket ID 5"  
- "Show passengers for flight ID 1"  

---

## Backend

The backend is deployed on AWS EC2:

http://63.178.228.72:5000

Make sure:
- Port 5000 is open  
- CORS is enabled  

---

## Project Demonstration

👉 *(Video link here)*

---

## Conclusion

SkyDesk demonstrates how a conversational AI interface can enhance a traditional REST API system by making it more intuitive and user-friendly.
