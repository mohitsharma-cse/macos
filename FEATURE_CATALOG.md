# Feature Catalog

This project now includes a generated catalog of 10,000 roadmap ideas for the macOS-style web desktop.

How the 10,000 ideas are generated:

- 10 product categories
- 10 UI surfaces
- 10 capability types
- 10 delivery layers

That creates `10 x 10 x 10 x 10 = 10,000` unique feature ideas.

Categories:

- System
- Finder
- Safari
- Communication
- Productivity
- Developer
- Creative
- Media
- Gaming
- Backend

Surfaces:

- Dock
- Menu Bar
- Windows
- Launchpad
- Spotlight
- Widgets
- Notifications
- Settings
- Files
- Search

Capabilities:

- AI Copilot
- Realtime Sync
- Smart Automation
- Offline Mode
- Collaboration
- Theme Engine
- Analytics Hub
- Security Layer
- Template Library
- Accessibility Boost

Delivery layers:

- Frontend
- Backend
- API
- Database
- Realtime
- Storage
- Automation
- AI
- Testing
- Hosting

Frontend integration:

- `Feature Lab` desktop app lets you search, filter, and inspect the catalog.
- The app uses the backend API when available.
- If the backend is not configured, it falls back to the same in-browser generator.

Backend API:

- `GET /api/features`
- `GET /api/features/stats`
- `GET /api/features/:id`

Shared source of truth:

- `feature-catalog-core.js`

That file is used by both the browser app and the backend so the list stays consistent.
