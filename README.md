<p align="center">
  <img src="client/src/assets/logo.png" width="180" alt="Musicall logo" />
  <h1 align="center">Musicall</h1>
</p>

<p align="center">
  A social network for Spotify listeners: share posts, see what friends are playing, and chat with people listening to the same music.
</p>

<p align="center">
  <a href="https://github.com/diegosoriarios/musicall/actions/workflows/ci.yml">
    <img src="https://github.com/diegosoriarios/musicall/actions/workflows/ci.yml/badge.svg" alt="CI status" />
  </a>
</p>

## Features

- Sign in with Spotify using the OAuth authorization code flow.
- Personal feed with paginated posts and owner-only deletion.
- Live presence: see which users are listening to the same artist right now.
- Chat rooms for artists, songs, and other listeners.
- "Similar artist" discovery from the currently playing track.
- Server-side Spotify token refresh with a httpOnly session cookie.

## Tech stack

| Layer   | Tools                                                                                     |
| ------- | ----------------------------------------------------------------------------------------- |
| Client  | React 18, TypeScript, Vite, React Router, styled-components, MUI, Axios, Socket.IO client |
| Server  | Node.js, TypeScript, Express 5, Socket.IO, Knex, SQLite, Zod, JWT                         |
| Tooling | npm workspaces, ESLint, Prettier, Vitest, Supertest, Testing Library, MSW, GitHub Actions |

## Project structure

```text
musicall/
├── client/                 # Vite + React single-page app
│   ├── src/api/            # Axios client and auth endpoints
│   ├── src/auth/           # AuthProvider and session bootstrap
│   ├── src/components/     # Shared UI and chat pieces
│   ├── src/lib/            # Spotify Web API wrapper with 401 retry
│   ├── src/pages/          # Home (player), Feed, Profile, Chat
│   ├── src/sockets/        # Socket.IO singleton
│   └── src/test/           # MSW server and test setup
├── server/                 # Express + Socket.IO API
│   ├── src/config/         # Environment validation
│   ├── src/database/       # Knex connection and migrations
│   ├── src/middleware/     # Auth and error handling
│   ├── src/modules/        # auth, posts, users
│   ├── src/sockets/        # chat and presence handlers
│   └── test/               # Supertest integration tests
├── .github/workflows/      # CI
├── package.json            # Workspace scripts
└── .nvmrc                  # Node 22
```

## Prerequisites

- Node.js 22 (`.nvmrc`); Node 20.19+ also works for the runtime, but the lint/test toolchain expects a current 20.x or 22.13+.
- npm 10+.
- A [Spotify developer app](https://developer.spotify.com/dashboard) with this redirect URI registered:

  ```text
  http://localhost:3001/api/auth/callback
  ```

## Getting started

1. Use the pinned Node version and install dependencies from the repo root:

   ```bash
   nvm use
   npm install
   ```

2. Create the server environment file:

   ```bash
   cp server/.env.example server/.env
   ```

   Fill in `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and a long random `JWT_SECRET`. The remaining defaults are fine for local development.

3. Optionally create the client environment file. Leave `VITE_API_URL` empty to use the Vite dev proxy:

   ```bash
   cp client/.env.example client/.env
   ```

4. Start the client and API together:

   ```bash
   npm run dev
   ```

   - Client: <http://localhost:5173>
   - API: <http://localhost:3001>
   - Health check: <http://localhost:3001/api/health>

   Database migrations run automatically when the server starts.

## Environment variables

### Server (`server/.env`)

| Variable                | Required | Default                 | Description                                            |
| ----------------------- | -------- | ----------------------- | ------------------------------------------------------ |
| `NODE_ENV`              | no       | `development`           | `development`, `test`, or `production`.                |
| `PORT`                  | no       | `3001`                  | API port.                                              |
| `CLIENT_URL`            | no       | `http://localhost:5173` | CORS origin and OAuth redirect target.                 |
| `SERVER_URL`            | no       | `http://localhost:3001` | Public API URL used to build the Spotify redirect URI. |
| `SPOTIFY_CLIENT_ID`     | yes      | —                       | Spotify app client ID.                                 |
| `SPOTIFY_CLIENT_SECRET` | yes      | —                       | Spotify app client secret.                             |
| `JWT_SECRET`            | yes      | —                       | Session signing secret, at least 16 characters.        |
| `DB_FILENAME`           | no       | `./db.sqlite3`          | SQLite file, relative to the `server` folder.          |

### Client (`client/.env`)

| Variable       | Required | Default | Description                                                    |
| -------------- | -------- | ------- | -------------------------------------------------------------- |
| `VITE_API_URL` | no       | empty   | API base URL. Empty means same-origin (dev proxy/self-hosted). |

## Scripts

Run these from the repository root:

| Script                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start API and Vite dev server with one command. |
| `npm run dev:server`   | Start only the API with watch mode.             |
| `npm run dev:client`   | Start only the Vite dev server.                 |
| `npm run build`        | Typecheck and build the server and client.      |
| `npm start`            | Run the built API (`server/dist/server.js`).    |
| `npm run typecheck`    | Typecheck server (including tests) and client.  |
| `npm run lint`         | Run ESLint across both workspaces.              |
| `npm run format`       | Format the repository with Prettier.            |
| `npm run format:check` | Verify formatting without writing changes.      |
| `npm test`             | Run server and client test suites once.         |

## Testing

```bash
npm test
```

- **Server:** Vitest + Supertest integration tests against an in-memory SQLite database. Spotify calls are mocked.
- **Client:** Vitest + jsdom + Testing Library, with MSW intercepting API requests and Socket.IO mocked.

Watch mode is available per workspace:

```bash
npm run test:watch -w server
npm run test:watch -w client
```

## Authentication flow

1. `GET /api/auth/login` generates a random OAuth state, stores it in an httpOnly cookie, and redirects to Spotify.
2. Spotify redirects back to `GET /api/auth/callback`, where the state is validated and the code is exchanged for tokens.
3. The Spotify profile is upserted into `users`; the refresh token stays server-side.
4. The app issues its own JWT in an httpOnly `musicall_session` cookie and sends the Spotify access token to the client through the URL hash.
5. The client keeps the Spotify access token in memory only and asks `POST /api/auth/spotify-token` for a refreshed token when needed.

Socket.IO connections reuse the same session cookie and reject unauthenticated clients.

## Deployment notes

- Build with `npm run build`; serve `client/dist` from a static host or reverse proxy.
- Run the API with `npm start` after setting production environment variables.
- Prefer serving the client and API from the same origin so the session cookie works without cross-site configuration.
- Set `NODE_ENV=production` to enable secure cookies.
- SQLite is fine for a single instance. Use a shared database before scaling the API horizontally.

## Known limitations

- Chat message history and presence are in memory, so they reset on restart and are not shared across multiple API instances.
- Likes are displayed but there is no like/unlike endpoint yet.
- Room access is currently name-based; there is no membership or private-room authorization.
