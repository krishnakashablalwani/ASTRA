# Email Notifications Setup Guide

CampusHive uses **Brevo API** (formerly Sendinblue) for automated email notifications.

## Features

✅ **Task Notifications**
- Email sent when a new task is created
- Reminder email sent 24 hours before task deadline

✅ **Event Notifications**
- Confirmation email sent when you RSVP to an event
- Includes event details, date, time, and location

✅ **Library Notifications**
- Confirmation email sent when a book is checked out
- Includes book details and return deadline
- Reminder email sent 24 hours before return deadline

## Setup Instructions

### 1. Create Brevo Account

1. Go to https://www.brevo.com
2. Click "Sign up free"
3. Complete registration (no credit card required)
4. Verify your email address

**Free Tier Benefits:**
- 300 emails per day
- No credit card required
- Works on all hosting platforms (including Render)
- Uses HTTP API (no SMTP port blocking issues)

### 2. Get API Key

1. Log in to your Brevo account
2. Go to https://app.brevo.com/settings/keys/api
3. Click "Create a new API key"
4. Give it a name (e.g., "CampusHive")
5. Copy the API key (starts with `xkeysib-`)

**Note:** This is different from SMTP - we use the HTTP API which works better on cloud platforms.

### 3. Configure Environment Variables

Add these to your `.env` file in `/app/backend/`:

```env
# Email Configuration (Brevo API)
BREVO_API_KEY=xkeysib-your-actual-api-key-here
EMAIL_FROM=noreply@campushive.app

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your_secure_password
```

**Important:** 
- Use the API key (not SMTP key) from https://app.brevo.com/settings/keys/api
- EMAIL_FROM can be any sender address you want to display
- Keep your API key secret and never commit it to version control

### 3. Admin Account

A special admin account is automatically created on server startup:

- **Email:** Set via `ADMIN_EMAIL` in .env
- **Password:** Set via `ADMIN_PASSWORD` in .env
- **Role:** admin

This account is created automatically when the server starts.

### 4. Testing Email Functionality

1. Start the backend server:
   ```bash
   cd app/backend
   npm start
   ```

2. Check the console for:
   ```
   ✅ Email service ready (Brevo API - 300 emails/day free)
   💡 Using HTTP API (works on Render, no SMTP ports needed)
   ```

3. Test by:
   - Creating a new task (should receive creation email)
   - RSVPing to an event (should receive confirmation email)
   - Checking out a library book (should receive checkout email)

### 5. Email Templates

All emails include:
- CampusHive branded header with honey gradient
- Clear, formatted content
- Relevant details (dates, times, locations)
- Professional styling
- Footer with automated message disclaimer

## Troubleshooting

### Email not sending?

1. **Check API Key:** Make sure you copied the entire key from https://app.brevo.com/settings/keys/api
2. **Check Console:** Look for "✅ Email service ready" message on startup
3. **Verify Brevo Account:** Ensure your Brevo account is verified and active
4. **Check Logs:** Look for error messages like "Error sending email"

### "Email service not configured" message?

1. Verify `BREVO_API_KEY` is set in your `.env` file
2. Make sure the API key starts with `xkeysib-`
3. Restart the server after adding the key

### Still not working on Render?

1. **Check Environment Variables:** Go to Render Dashboard → Your Service → Environment
2. **Add BREVO_API_KEY:** Make sure it's added to Render's environment variables
3. **Verify EMAIL_FROM:** Set to a valid email address
4. **Redeploy:** Save environment variables to trigger redeployment

### Server won't start?

1. Make sure all dependencies are installed: `npm install`
2. Check that @getbrevo/brevo is installed: `npm list @getbrevo/brevo`
3. Verify .env file exists and has correct format

## Why API Instead of SMTP?

**Previous Setup (SMTP):**
- Used port 587 for email sending
- Blocked by many cloud platforms (including Render)
- Timeout issues on free hosting tiers

**Current Setup (HTTP API):**
- ✅ Uses standard HTTP/HTTPS (port 80/443)
- ✅ Works on all cloud platforms
- ✅ No port blocking issues
- ✅ Faster and more reliable
- ✅ Same free tier (300 emails/day)

### No emails received?

1. Check spam/junk folder
2. Verify the user has a valid email address in their profile
3. Check server logs for email sending errors
4. Test with a different email address

## Email Schedule

- **Task Creation:** Immediate
- **Task Deadline:** 24 hours before due date
- **Event RSVP:** Immediate
- **Event Reminder:** 24 hours before event (push notifications only for now)
- **Library Checkout:** Immediate
- **Book Return:** 24 hours before deadline (push notifications only for now)

## Security Notes

- API key is specific to Brevo and can be regenerated anytime at https://app.brevo.com/settings/keys/api
- Never commit the `.env` file to version control
- Add `.env` to `.gitignore`
- The `.env.example` file shows required format but doesn't contain real credentials
- Change the default admin password in production

## Why Brevo API?

✅ **Completely Free:** 300 emails/day, no credit card required  
✅ **Works Everywhere:** HTTP API works on all cloud platforms (Render, Vercel, etc.)  
✅ **No Port Blocking:** Uses HTTP/HTTPS instead of SMTP port 587  
✅ **Easy Setup:** Just sign up and get API key  
✅ **Reliable:** Professional email service designed for transactional emails  
✅ **Fast:** HTTP API is faster than SMTP protocol

## API Endpoints Modified

### Tasks
- `POST /api/task` - Now sends creation email

### Events
- `POST /api/events/:id/rsvp` - New endpoint, sends confirmation email

### Library
- `POST /api/library/checkout` - Now sends checkout email

### Scheduler
- Hourly task runs in `index.js` - Now sends deadline emails

---

For questions or issues, contact the development team.
