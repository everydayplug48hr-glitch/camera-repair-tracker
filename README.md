# Camera Repair Tracker

A web app that helps a camera repair shop keep track of every camera
in for repair, whether dropped off in store or booked online.

## Features

- Customer intake form (online or at the counter)
- Unique ticket ID for every repair
- Status tracking: Received, Diagnosing, Quote Sent, Awaiting Parts,
  In Repair, Ready for Collection, Collected
- Owner dashboard with:
  - Number of clients currently waiting
  - Days remaining until each repair is complete (overdue highlighted)
  - Quoted and final prices, plus revenue totals
- Customer tracking page: enter a ticket ID to see status, estimated
  completion and price
- (Planned) WhatsApp/SMS notification when a camera is ready

## Tech Stack

- Frontend: React
- Database, auth and storage: Supabase
- Hosting: Vercel
- Source control: GitHub

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Supabase URL and anon key
4. Run locally: `npm run dev`

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anon key |

Never commit your `.env` file or your Supabase service key.

## Roadmap

- [ ] Intake form
- [ ] Owner dashboard
- [ ] Customer tracking page
- [ ] WhatsApp notifications
- [ ] CSV export

## License

Private project. All rights reserved.
