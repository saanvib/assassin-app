
# Assassin App

This web application powers a live-action "Assassin" game for students. It tracks players, assigns targets, handles eliminations, and maintains a leaderboard — all via a secure React + TypeScript frontend and a serverless backend deployed on Vercel.

## Tech Stack

- **Frontend:** React (TypeScript)
- **Backend/API:** Serverless functions (`/api`) deployed with Vercel
- **Authentication:** [Descope](https://descope.com) SDK
- **UI Components:** Material UI + Emotion
- **Deployment:** Vercel (see `vercel.json`)
- **Package Management:** npm

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/assassin-app.git
cd assassin-app
npm install
```

### 2. Set Up Environment

Create a `.env` file in the root directory with your Descope project info:

```env
REACT_APP_DESCOPE_PROJECT_ID=your_project_id
```

You may also need to configure additional env variables depending on deployment setup (e.g., Vercel project settings).

### 3. Run Locally

```bash
npm start
```

This launches the app on `http://localhost:3000`.

## Project Structure

```
assassin-app/
├── api/                   # Serverless functions (Vercel backend)
│   ├── getLeaderBoard.ts
│   ├── registerKill.ts
│   └── ...
├── public/                # Static files
├── src/                   # Frontend React components (if applicable)
├── .gitignore
├── package.json
├── tsconfig*.json
├── vercel.json            # Vercel routing config
└── README.md
```

## Authentication

This project uses Descope for passwordless login. Authentication is already integrated via the `@descope/react-sdk`.

New players sign in using their school email and are matched with a unique target.

## Key API Routes

All API endpoints are located in the `api/` folder and deployed as serverless functions.

| Endpoint               | Description                        |
|------------------------|------------------------------------|
| `getLeaderBoard.ts`    | Returns current leaderboard        |
| `getStudentList.ts`    | Lists all registered players       |
| `randomizeTargets.ts`  | Assigns each player a target       |
| `registerKill.ts`      | Logs a kill + updates targets      |
| `registerDeath.ts`     | Marks player as eliminated         |
| `updateStudentStatus.ts` | Manual status override          |


## Testing & Debugging

Currently no formal tests are implemented. For manual testing:
- Use Postman or a browser to hit `api/` routes
- Console logs in Vercel can be viewed for backend debugging

## Deployment

This app is configured for Vercel:
- All serverless routes are under `/api/`
- Static frontend served from the root

To redeploy:
1. Push to `main` or your configured Vercel branch
2. Vercel auto-builds and deploys
3. Monitor logs on Vercel dashboard
