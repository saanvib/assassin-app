# Updating for Class of 2026

## Required Changes

To adapt this app for class of 2026, you need to make the following changes:

### 1. Update Student List in `api/initialize.ts`

**Location**: `api/initialize.ts` lines 8-186

**What to change**: Replace all email addresses in the `users` array with class of 2026 student emails.

**Pattern**: 
- Class of 2025 emails: `25[username]@students.harker.org`
- Class of 2026 emails: `26[username]@students.harker.org`

**Example**:
```typescript
// OLD (2025):
const users = [
   "25aaravb@students.harker.org",
   "25aaronb@students.harker.org",
   // ... etc
]

// NEW (2026):
const users = [
   "26aaravb@students.harker.org",  // Update if student exists
   "26aaronb@students.harker.org",  // Update if student exists
   // ... add all class of 2026 students
]
```

**Important Notes**:
- The username is extracted from the email (part before @)
- Make sure all emails follow the format: `26[username]@students.harker.org`
- Add all students who will participate in the game
- Remove any students who are not participating

### 2. Steps to Update

1. **Get the class of 2026 student email list**
   - You'll need the complete list of student emails for class of 2026
   - Format should be: `26[firstname][lastinitial]@students.harker.org` (or whatever naming convention your school uses)

2. **Replace the `users` array in `api/initialize.ts`**
   - Open `api/initialize.ts`
   - Find the `users` array (starts around line 8)
   - Replace all entries with class of 2026 emails
   - Make sure each email is in quotes and followed by a comma (except the last one)

3. **Verify the format**
   - Each email should be a string: `"26username@students.harker.org"`
   - Each email should end with `@students.harker.org`
   - The array should be properly formatted with commas

### 3. Example Template

Here's a template you can use (replace with actual student emails):

```typescript
const users = [
   "26student1@students.harker.org",
   "26student2@students.harker.org",
   "26student3@students.harker.org",
   // ... add all class of 2026 students here
]
```

### 4. After Updating

1. **Test locally** (if possible):
   ```bash
   npm start
   ```

2. **Deploy to Vercel**:
   - Push changes to your repository
   - Vercel will auto-deploy

3. **Initialize the game**:
   - Log in as admin
   - Go to `/admin`
   - Click "Initialize" to reset all data with the new student list

### 5. Other Files (Optional Cleanup)

These files contain old test data but are NOT used by the app:
- `api/checkKillCount.js` - Can be deleted (test file)
- `api/newRandomize.js` - Can be deleted (test file)
- `api/randomizeTargets.ts` lines 140-465 - Example data, can be removed if desired

These don't affect functionality, but cleaning them up keeps the codebase tidy.

## Quick Checklist

- [ ] Get list of class of 2026 student emails
- [ ] Update `users` array in `api/initialize.ts`
- [ ] Verify all emails follow correct format
- [ ] Test locally (optional)
- [ ] Deploy to Vercel
- [ ] Log in as admin and click "Initialize"
- [ ] Test with a student account
- [ ] (Optional) Delete old test files

## Need Help?

If you need to bulk-update emails or have questions about the format, the key is:
- Username = part of email before @
- Email format = `26[username]@students.harker.org`
- All emails go in the `users` array in `api/initialize.ts`
