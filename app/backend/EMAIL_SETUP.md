# Email Notifications Setup Guide

CampusHive uses **Brevo** (formerly Sendinblue) for automated email notifications.

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
- Works perfectly with Render deployment

### 2. Get SMTP Credentials

1. Log in to your Brevo account
2. Go to https://app.brevo.com/settings/keys/smtp
3. Generate a new SMTP key (or copy existing one)
4. Note down:
   - **SMTP Server:** smtp-relay.brevo.com
   - **Port:** 587
   - **Login:** (shown on the page, e.g., `9aa161001@smtp-brevo.com`)
   - **SMTP Key:** (starts with `xsmtpsib-`)

### 3. Configure Environment Variables

Add these to your `.env` file in `/app/backend/`:

```env
# Email Configuration (Brevo)
BREVO_SMTP_LOGIN=9aa161001@smtp-brevo.com
EMAIL_FROM=noreply@campushive.app
BREVO_SMTP_KEY=xsmtpsib-your-actual-smtp-key-here

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your_secure_password
```

**Important:** 
- Use the exact SMTP Login from Brevo (not your email address)
- EMAIL_FROM can be any sender address you want to display
- Keep your SMTP key secret and never commit it to version control

### 3. Admin Account

A special admin account is automatically created on server startup:

- **Email:** Set via `ADMIN_EMAIL` in .env
- **Password:** Set via `ADMIN_PASSWORD` in .env
- **Role:** admin

This account is created automatically when the server starts.

### 4. Testing Email Functionality

#### Option 1: Use the Test Script

```bash
cd app/backend
node test-brevo.js
```

This will:
- Verify SMTP connection
- Send a test email to your admin email
- Display connection status and errors

#### Option 2: Test in the App

1. Start the backend server:
   ```bash
   cd app/backend
   npm start
   ```

2. Check the console for:
   ```
   ✅ Email service configured (Brevo)
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

1. **Check SMTP Key:** Make sure you copied the entire key from Brevo
2. **Check SMTP Login:** Use the exact login from Brevo settings (e.g., `9aa161001@smtp-brevo.com`)
3. **Check Console:** Look for errors like "Email service configuration error" or "Authentication failed"
4. **Verify Brevo Account:** Ensure your Brevo account is verified and active
5. **Run Test Script:** Use `node test-brevo.js` to diagnose connection issues

### Authentication Failed (535 5.7.8)?

1. Generate a **new SMTP key** at https://app.brevo.com/settings/keys/smtp
2. Delete any old/inactive keys
3. Update `BREVO_SMTP_KEY` in your `.env` file
4. Restart the server

### Connection Timeout?

1. Check your internet connection
2. Verify port 587 is not blocked by firewall
3. Try increasing timeout values in `emailService.js` (already set to 30 seconds)
4. Brevo's SMTP relay works on Render (not blocked like Gmail)

### Server won't start?

1. Make sure all dependencies are installed: `npm install`
2. Check that nodemailer is installed: `npm list nodemailer`
3. Verify .env file exists and has correct format

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

- SMTP key is specific to Brevo and can be regenerated anytime at https://app.brevo.com/settings/keys/smtp
- Never commit the `.env` file to version control
- Add `.env` to `.gitignore`
- The `.env.example` file shows required format but doesn't contain real credentials
- Change the default admin password in production
- Brevo works on Render deployment (SMTP not blocked)

## Why Brevo Instead of Gmail?

✅ **Completely Free:** 300 emails/day, no credit card required  
✅ **Works on Render:** Unlike Gmail, Brevo's SMTP relay is not blocked on cloud platforms  
✅ **Easy Setup:** Just sign up and get SMTP key  
✅ **Reliable:** Professional email service designed for transactional emails  
✅ **No 2FA Required:** Simpler authentication than Gmail App Passwords

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
