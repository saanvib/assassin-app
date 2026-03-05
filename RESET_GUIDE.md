# Assassin App Reset & Setup Guide

## Overview
This guide will help you reset the game data and ensure everything is functioning correctly for a new game.

## Architecture Summary

### Data Storage
- **Vercel Edge Config**: All student data is stored here
- Each student has: `username`, `killCount`, `assassin`, `status`, `target`, `targetStatus`

### Authentication
- **Descope**: Handles all authentication
- Admin roles are managed in Descope dashboard (not in code)
- Users with "admin" role can access `/admin` route

### Key Functions
1. **Initialize**: Resets all students to initial state (alive, killCount=0, no targets)
2. **Randomize Targets**: Creates circular chain of targets for students with kills > 0
3. **Register Kill**: Marks target as "pending" (requires confirmation)
4. **Register Death**: Confirms elimination and reassigns targets

## Step-by-Step Reset Process

### 1. Set Up Admins in Descope

**IMPORTANT**: Admin roles are managed in Descope, not in the code!

1. Go to your Descope dashboard (https://app.descope.com)
2. Navigate to **Access Control** → **Roles**
3. Ensure the "admin" role exists
4. Go to **Users** and assign the "admin" role to the email addresses you want as admins
5. Users must sign in with their email (the app uses `sign-up-or-in` flow)

**Note**: The app extracts username from email (part before @), so `26saanvib@students.harker.org` becomes username `26saanvib`

### 2. Update Student List (if needed)

The student list is hardcoded in `api/initialize.ts` (lines 8-186). If you need to:
- Add new students: Add their email to the `users` array
- Remove students: Remove their email from the `users` array

**Current count**: Update with class of 2026 student count

**For Class of 2026**: Update all email addresses in the `users` array to use "26" prefix instead of "25" (e.g., `26saanvib@students.harker.org`)

### 3. Clear Existing Data

To reset all game data:

1. **Log in as an admin** (user with "admin" role in Descope)
2. Navigate to `/admin` route
3. Click the **"Initialize"** button
   - This will reset all students to:
     - `status: "alive"`
     - `killCount: 0`
     - `assassin: ""`
     - `target: ""`
     - `targetStatus: "alive"`

### 4. Randomize Targets (After First Kills)

**Important**: Targets can only be randomized when:
- No students have `status: "pending"`
- No students have `targetStatus: "pending"`

The randomize function:
- Only includes students with `killCount > 0` and `status: "alive"`
- Creates a circular chain (A→B→C→...→A)
- Eliminates students with `killCount == 0` and `status: "alive"`

**Workflow**:
1. Students play and register kills
2. Once some students have kills, admin clicks "Randomize"
3. This creates a new target chain for surviving players

### 5. Verify Environment Variables

Ensure these are set in Vercel (or `.env.local` for local dev):

- `DESCOPE_PROJECT`: Your Descope project ID
- `EDGE_CONFIG`: Your Vercel Edge Config connection string
- `EDGE_CONFIG_ID`: Your Edge Config ID
- `ASSASSIN_APP_API_TOKEN`: Vercel API token for updating Edge Config
- `CRON_SECRET`: (Optional) For cron-based randomization

### 6. Test All Functionality

#### Frontend Routes
- `/` - Login page (Descope authentication)
- `/dashboard` - Student dashboard (protected, requires auth)
- `/admin` - Admin panel (protected, requires admin role)
- `/leaderboard` - Public leaderboard

#### API Endpoints
- `GET /api/initialize` - Reset all student data (admin only)
- `GET /api/randomizeTargets` - Randomize targets (admin only)
- `GET /api/getStudentList` - Get all students (admin only)
- `GET /api/getStudentInfo` - Get current user's info
- `GET /api/getLeaderBoard` - Get leaderboard (public)
- `POST /api/registerKill` - Register a kill
- `POST /api/registerDeath` - Accept death
- `PATCH /api/updateStudentStatus` - Manual student update (admin only)

## Common Issues & Solutions

### Issue: Can't access admin panel
**Solution**: Ensure your user has "admin" role in Descope dashboard

### Issue: Initialize doesn't work
**Solution**: Check that `ASSASSIN_APP_API_TOKEN` is set correctly in Vercel

### Issue: Can't randomize targets
**Solution**: Ensure no students have `status: "pending"` or `targetStatus: "pending"`. Resolve all pending kills/deaths first.

### Issue: Student not found
**Solution**: Username is extracted from email (part before @). Make sure the student's email matches the format in the `users` array.

## Status Values

- `"alive"` - Student is alive and playing
- `"pending"` - Student has been killed but hasn't confirmed death yet
- `"eliminated"` - Student is dead
- `"disqualified"` - Student removed from game
- `"dispute"` - Kill is being disputed

## Next Steps After Reset

1. ✅ Set admins in Descope
2. ✅ Update student list if needed
3. ✅ Click "Initialize" to clear data
4. ✅ Test login with a student account
5. ✅ Test admin panel access
6. ✅ Test registering a kill (requires targets to be set)
7. ✅ Test leaderboard
8. ✅ Randomize targets after first round of kills

## Notes

- The app uses email-based authentication via Descope
- All data is stored in Vercel Edge Config (no traditional database)
- Admin functions require both authentication AND the "admin" role
- The student list in `initialize.ts` should be updated for the current class year
