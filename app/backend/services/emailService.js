import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

// Brevo API configuration - works on Render (HTTP, no SMTP ports)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@campushive.app';
const SENDER_NAME = 'CampusHive';
const emailConfigured = !!BREVO_API_KEY;

// Initialize Brevo API client
let apiInstance = null;

if (emailConfigured) {
  // Create API instance with authentication
  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
  
  console.log('✅ Email service ready (Brevo API - 300 emails/day free)');
  console.log('💡 Using HTTP API (works on Render, no SMTP ports needed)');
} else {
  console.warn('⚠️  Email service not configured. Add BREVO_API_KEY to .env');
  console.log('💡 Get free API key: https://app.brevo.com/settings/keys/api');
}

// Helper to send emails via Brevo API
async function sendBrevoEmail(to, subject, htmlContent) {
  if (!emailConfigured || !apiInstance) {
    console.warn('Email not configured. Skipping.');
    return;
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: SENDER_NAME, email: EMAIL_FROM };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
  }
}

export async function sendTaskDeadlineEmail(userEmail, userName, task) {
  const subject = `⏰ Task Deadline Reminder: ${task.title}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">��� CampusHive</h1>
      </div>
      <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
        <h2 style="color: #212529;">Hi ${userName},</h2>
        <p style="color: #6c757d; font-size: 16px;">Your task is due soon!</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <h3 style="color: #F59E0B; margin-top: 0;">${task.title}</h3>
          ${task.description ? `<p style="color: #6c757d;">${task.description}</p>` : ''}
          <p style="color: #212529; font-weight: bold;">��� Due: ${new Date(task.dueDate).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          ${task.priority ? `<p style="color: #6c757d;">Priority: <span style="color: #dc3545; font-weight: bold;">${task.priority}</span></p>` : ''}
        </div>
        <p style="color: #6c757d;">Log in to CampusHive to manage your tasks.</p>
      </div>
    </div>
  `;
  await sendBrevoEmail(userEmail, subject, htmlContent);
}

export async function sendEventRegistrationEmail(userEmail, userName, event) {
  const subject = `✅ Event Registration Confirmed: ${event.title}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">��� CampusHive</h1>
      </div>
      <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
        <h2 style="color: #212529;">Hi ${userName},</h2>
        <p style="color: #28a745; font-size: 18px; font-weight: bold;">You're registered for this event! ���</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">${event.title}</h3>
          ${event.description ? `<p style="color: #6c757d;">${event.description}</p>` : ''}
          <p style="color: #212529; margin: 5px 0;"><strong>��� Date:</strong> ${new Date(event.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          ${event.location ? `<p style="color: #212529; margin: 5px 0;"><strong>��� Location:</strong> ${event.location}</p>` : ''}
        </div>
        <p style="color: #6c757d;">See you there!</p>
      </div>
    </div>
  `;
  await sendBrevoEmail(userEmail, subject, htmlContent);
}

export async function sendLibraryCheckoutEmail(userEmail, userName, bookDetails, checkout) {
  const subject = `��� Book Checked Out: ${bookDetails.title}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">��� CampusHive Library</h1>
      </div>
      <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
        <h2 style="color: #212529;">Hi ${userName},</h2>
        <p style="color: #007bff; font-size: 18px; font-weight: bold;">Book checked out! ���</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="color: #007bff; margin-top: 0;">${bookDetails.title}</h3>
          <p><strong>��� Code:</strong> ${bookDetails.bookCode}</p>
          <p><strong>��� Checkout:</strong> ${new Date(checkout.checkoutDate).toLocaleDateString()}</p>
          <p style="color: #dc3545; font-weight: bold;"><strong>⏰ Return By:</strong> ${new Date(checkout.returnDeadline).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  `;
  await sendBrevoEmail(userEmail, subject, htmlContent);
}

export async function sendTaskCreatedEmail(userEmail, userName, task) {
  const subject = `✅ Task Created: ${task.title}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFD54F 0%, #F59E0B 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">��� CampusHive</h1>
      </div>
      <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
        <h2 style="color: #212529;">Hi ${userName},</h2>
        <p style="color: #28a745; font-size: 16px;">Task created successfully! ✨</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">${task.title}</h3>
          ${task.description ? `<p style="color: #6c757d;">${task.description}</p>` : ''}
          ${task.dueDate ? `<p style="color: #212529; font-weight: bold;">��� Due: ${new Date(task.dueDate).toLocaleString()}</p>` : ''}
        </div>
      </div>
    </div>
  `;
  await sendBrevoEmail(userEmail, subject, htmlContent);
}

export default {
  sendTaskDeadlineEmail,
  sendEventRegistrationEmail,
  sendLibraryCheckoutEmail,
  sendTaskCreatedEmail,
};
