# StatGate Engineering Guidelines

StatGate is a National Data Intelligence Operating System. It is NOT a simple CRUD app or dashboard collection.

## Stack
- **Frontend**: React, Vite, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript (server.ts)
- **Communication**: HTTP APIs / WebSockets

## Responsibilities
- **Frontend**: UI rendering, routing, session-aware UI, state management. NEVER access DB directly or implement backend analytics logic. 
- **Backend**: APIs, analytics, AI orchestration, real-time systems, auth, business logic, simulations.

## Project Phases & Rules
- You MUST maintain architectural discipline and preserve frontend/backend separation.
- Check `ROADMAP.md` for the full 36-phase execution roadmap.
- No deviation is permitted without architectural review.
