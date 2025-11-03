import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Brevo (formerly Sendinblue) SMTP configuration
// Free tier: 300 emails/day, no credit card required
// Sign up at: https://www.brevo.com
const BREVO_SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN;
const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@campushive.app';
const emailConfigured = BREVO_SMTP_LOGIN && BREVO_SMTP_KEY;

// Create reusable transporter only if credentials are available
let transporter = null;

if (emailConfigured) {
  transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: BREVO_SMTP_LOGIN,
      pass: BREVO_SMTP_KEY,
    },
    connectionTimeout: 10000, // 10 seconds (reduced for faster startup)
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify transporter configuration (but don't block startup)
  // Use a timeout to prevent hanging during verification
  const verifyTimeout = setTimeout(() => {
    console.warn('⚠️  Email service verification timeout (this is OK - emails will still work)');
    console.log('💡 Brevo SMTP may take time to connect, but service is configured');
  }, 5000); // 5 second timeout for verification only

  transporter.verify((error, success) => {
    clearTimeout(verifyTimeout);
    if (error) {
      console.error('❌ Email service configuration error:', error.message);
      console.log('💡 Get free SMTP key from: https://app.brevo.com/settings/keys/smtp');
      console.log('💡 Note: Server will continue running, emails may not send');
    } else {
      console.log('✅ Email service ready (Brevo - 300 emails/day free)');
    }
  });
} else {
  console.warn('⚠️  Email service not configured. Add BREVO_SMTP_KEY to .env file.');
  console.log('💡 Sign up free at https://www.brevo.com (no credit card required)');
}

/**
 * Send task deadline reminder email
 */
export async function sendTaskDeadlineEmail(userEmail, userName, task) {
  if (!emailConfigured) {
    console.warn('Email not configured. Skipping task deadline email.');
    return;
  }
  
  const mailOptions = {
    from: EMAIL_FROM,
    to: userEmail,
    subject: `⏰ Task Deadline Reminder: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🐝 CampusHive</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #212529;">Hi ${userName},</h2>
          <p style="color: #6c757d; font-size: 16px;">Your task is due soon!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
            <h3 style="color: #F59E0B; margin-top: 0;">${task.title}</h3>
            ${task.description ? `<p style="color: #6c757d;">${task.description}</p>` : ''}
            <p style="color: #212529; font-weight: bold;">
              📅 Due: ${new Date(task.dueDate).toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            ${task.priority ? `<p style="color: #6c757d;">Priority: <span style="color: #dc3545; font-weight: bold;">${task.priority}</span></p>` : ''}
          </div>
          
          <p style="color: #6c757d;">Log in to CampusHive to manage your tasks.</p>
          <p style="color: #adb5bd; font-size: 12px; margin-top: 30px;">This is an automated message from CampusHive. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Task deadline email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending task deadline email:', error.message);
    // Don't throw - make emails optional
  }
}

/**
 * Send event registration confirmation email
 */
export async function sendEventRegistrationEmail(userEmail, userName, event) {
  const mailOptions = {
    from: EMAIL_FROM,
    to: userEmail,
    subject: `✅ Event Registration Confirmed: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🐝 CampusHive</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #212529;">Hi ${userName},</h2>
          <p style="color: #28a745; font-size: 18px; font-weight: bold;">You're registered for this event! 🎉</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">${event.title}</h3>
            ${event.description ? `<p style="color: #6c757d;">${event.description}</p>` : ''}
            
            <div style="margin-top: 15px;">
              <p style="color: #212529; margin: 5px 0;">
                <strong>📅 Date:</strong> ${new Date(event.date).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              ${event.location ? `<p style="color: #212529; margin: 5px 0;"><strong>📍 Location:</strong> ${event.location}</p>` : ''}
              ${event.club?.name ? `<p style="color: #212529; margin: 5px 0;"><strong>🎪 Club:</strong> ${event.club.name}</p>` : ''}
            </div>
          </div>
          
          <p style="color: #6c757d;">We'll send you a reminder before the event. See you there!</p>
          <p style="color: #adb5bd; font-size: 12px; margin-top: 30px;">This is an automated message from CampusHive. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Event registration email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending event registration email:', error.message);
    // Don't throw - make emails optional
  }
}

/**
 * Send library book checkout confirmation email
 */
export async function sendLibraryCheckoutEmail(userEmail, userName, bookDetails, checkout) {
  const mailOptions = {
    from: EMAIL_FROM,
    to: userEmail,
    subject: `📚 Book Checked Out: ${bookDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">📚 CampusHive Library</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #212529;">Hi ${userName},</h2>
          <p style="color: #007bff; font-size: 18px; font-weight: bold;">Book successfully checked out! 📖</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">${bookDetails.title}</h3>
            
            <div style="margin-top: 15px;">
              <p style="color: #212529; margin: 5px 0;"><strong>📕 Book Code:</strong> ${bookDetails.bookCode}</p>
              ${bookDetails.isbn ? `<p style="color: #212529; margin: 5px 0;"><strong>📋 ISBN:</strong> ${bookDetails.isbn}</p>` : ''}
              <p style="color: #212529; margin: 5px 0;">
                <strong>📅 Checkout Date:</strong> ${new Date(checkout.checkoutDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
              <p style="color: #dc3545; margin: 5px 0; font-weight: bold;">
                <strong>⏰ Return By:</strong> ${new Date(checkout.returnDeadline).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="color: #856404; margin: 0;">
              <strong>⚠️ Important:</strong> Please return the book by the due date to avoid late fees. We'll send you a reminder 24 hours before the deadline.
            </p>
          </div>
          
          <p style="color: #adb5bd; font-size: 12px; margin-top: 30px;">This is an automated message from CampusHive Library. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Library checkout email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending library checkout email:', error.message);
    // Don't throw - make emails optional
  }
}

/**
 * Send task creation confirmation email
 */
export async function sendTaskCreatedEmail(userEmail, userName, task) {
  const mailOptions = {
    from: EMAIL_FROM,
    to: userEmail,
    subject: `✅ Task Created: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🐝 CampusHive</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #212529;">Hi ${userName},</h2>
          <p style="color: #28a745; font-size: 16px;">Your task has been created successfully! ✨</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">${task.title}</h3>
            ${task.description ? `<p style="color: #6c757d;">${task.description}</p>` : ''}
            ${task.dueDate ? `
              <p style="color: #212529; font-weight: bold;">
                📅 Due: ${new Date(task.dueDate).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            ` : ''}
            ${task.priority ? `<p style="color: #6c757d;">Priority: <span style="font-weight: bold;">${task.priority}</span></p>` : ''}
          </div>
          
          <p style="color: #6c757d;">We'll remind you 24 hours before the deadline. Stay productive!</p>
          <p style="color: #adb5bd; font-size: 12px; margin-top: 30px;">This is an automated message from CampusHive. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Task created email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending task created email:', error.message);
    // Don't throw, task creation should succeed even if email fails
  }
}

export default {
  sendTaskDeadlineEmail,
  sendEventRegistrationEmail,
  sendLibraryCheckoutEmail,
  sendTaskCreatedEmail,
};
