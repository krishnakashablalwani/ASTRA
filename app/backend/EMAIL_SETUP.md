# Email Notifications Setup Guide

CampusHive now supports automated email notifications for tasks, events, and library checkouts.

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

### 1. Gmail Account Setup

The system uses **astra.campushive@gmail.com** for sending emails.

1. Log in to the Gmail account
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Google Account Settings → Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Configure Environment Variables

Add these to your `.env` file in `/app/backend/`:

```env
# Email Configuration
EMAIL_USER=astra.campushive@gmail.com
EMAIL_PASS=your_16_character_app_password

# Admin Configuration
ADMIN_EMAIL=astra.campushive@gmail.com
ADMIN_PASSWORD=AstraCampusHive2025!
```

**Important:** 
- Use the App Password (not the regular Gmail password) for `EMAIL_PASS`
- Change `ADMIN_PASSWORD` to a secure password of your choice

### 3. Admin Account

A special admin account is automatically created on server startup:

- **Email:** astra.campushive@gmail.com
- **Password:** Set via `ADMIN_PASSWORD` in .env (default: AstraCampusHive2025!)
- **Role:** admin

This account is hardcoded and will be created even if other users exist.

### 4. Testing Email Functionality

1. Start the backend server:
   ```bash
   cd app/backend
   npm start
   ```

2. Check the console for:
   ```
   Email service ready
   ✅ ASTRA admin account already exists: astra.campushive@gmail.com
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

1. **Check App Password:** Make sure you're using the 16-character App Password, not the regular password
2. **Check Console:** Look for errors like "Email service configuration error"
3. **Verify .env:** Ensure EMAIL_USER and EMAIL_PASS are set correctly
4. **Gmail Settings:** Verify 2FA is enabled and App Password is active

### Server won't start?

1. Make sure all dependencies are installed: `npm install`
2. Check that nodemailer is installed: `npm list nodemailer`
3. Verify .env file exists and is readable

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

- App Password is specific to this application and can be revoked anytime
- Never commit the `.env` file to version control
- The `.env.example` file shows the required format but doesn't contain real credentials
- Change the default admin password in production

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
