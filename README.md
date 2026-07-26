# lead-automation-autodigix

A custom, high-speed, stateless Node.js (Express & TypeScript) routing engine designed to automatically receive lead webhooks from Google Sheets (via Google Apps Script) and route them to their corresponding CRM endpoints (`inwo.crmcore.me` or `api.myinvesttrade.com`) across 38+ websites and brand portals.

## Features
- **Stateless & Instantaneous:** Bypasses Zapier task fees with a lightweight pass-through architecture.
- **Multi-Brand Routing:** Pre-mapped to handle 38+ website portals in the AUTODIGIX ecosystem.
- **Ready for Vercel:** Includes `vercel.json` and serverless export compatibility.
- **Google Sheets Integration:** Includes `google-apps-script.js` for instant webhook triggers on row addition.
