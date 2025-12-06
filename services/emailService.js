const nodemailer = require('nodemailer');
const { logger } = require('../config/database');

// Create transporter
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('Email service not configured - emails will not be sent');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const transporter = createTransporter();

// Send purchase confirmation email
exports.sendPurchaseConfirmation = async (purchase, track, customerEmail) => {
  if (!transporter) {
    logger.warn('Skipping email - transporter not configured');
    return;
  }

  try {
    const downloadLink = `${process.env.VITE_API_URL || 'http://localhost:3001'}/api/payments/download/${purchase.downloadToken}`;
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'JustMalik Beats'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Your Purchase: ${track.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .track-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .download-btn { 
              display: inline-block; 
              background: #667eea; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
              font-weight: bold;
            }
            .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
            .important { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Purchase!</h1>
            </div>
            <div class="content">
              <p>Hey there,</p>
              <p>Your purchase was successful! Here are the details:</p>
              
              <div class="track-info">
                <h2>${track.title}</h2>
                <p><strong>Artist:</strong> ${track.artist}</p>
                <p><strong>Genre:</strong> ${track.genre}</p>
                <p><strong>BPM:</strong> ${track.metadata?.bpm || 'N/A'}</p>
                <p><strong>Key:</strong> ${track.metadata?.key || 'N/A'}</p>
                <p><strong>Amount Paid:</strong> $${purchase.amount.toFixed(2)}</p>
              </div>
              
              <div class="important">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>You have <strong>${purchase.maxDownloads} downloads</strong> available</li>
                  <li>Download link expires on <strong>${new Date(purchase.downloadExpiry).toLocaleDateString()}</strong></li>
                  <li>Save your file in a safe location after downloading</li>
                </ul>
              </div>
              
              <center>
                <a href="${downloadLink}" class="download-btn">Download Your Track</a>
              </center>
              
              <p>Or copy this link: <br><code style="background:#e0e0e0;padding:5px;border-radius:3px;">${downloadLink}</code></p>
              
              <p>If you have any issues with your download, please reply to this email.</p>
              
              <p>Thanks for supporting independent music!</p>
              <p><strong>- JustMalik Beats</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly.</p>
              <p>&copy; ${new Date().getFullYear()} JustMalik Beats. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Thank you for your purchase!

Track: ${track.title}
Artist: ${track.artist}
Amount: $${purchase.amount.toFixed(2)}

Download your track here:
${downloadLink}

Important:
- You have ${purchase.maxDownloads} downloads available
- Link expires: ${new Date(purchase.downloadExpiry).toLocaleDateString()}
- Save your file after downloading

Thanks for supporting independent music!
- JustMalik Beats
      `.trim()
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Purchase confirmation email sent: ${info.messageId} to ${customerEmail}`);
    
    return info;
  } catch (error) {
    logger.error('Error sending purchase confirmation email:', error);
    throw error;
  }
};

// Send download link email
exports.sendDownloadLink = async (email, track, downloadToken) => {
  if (!transporter) {
    logger.warn('Skipping email - transporter not configured');
    return;
  }

  try {
    const downloadLink = `${process.env.VITE_API_URL || 'http://localhost:3001'}/api/payments/download/${downloadToken}`;
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'JustMalik Beats'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: `Download Link: ${track.title}`,
      html: `
        <h2>Your Download Link</h2>
        <p>Click the link below to download your track:</p>
        <p><a href="${downloadLink}" style="background:#667eea;color:white;padding:15px 30px;text-decoration:none;border-radius:5px;display:inline-block;">Download ${track.title}</a></p>
        <p>Or copy this link: <br><code>${downloadLink}</code></p>
        <p>This link will expire in 30 days and can be used 3 times.</p>
      `,
      text: `
Download your track: ${track.title}

${downloadLink}

This link expires in 30 days and can be used 3 times.
      `.trim()
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Download link email sent: ${info.messageId}`);
    
    return info;
  } catch (error) {
    logger.error('Error sending download link email:', error);
    throw error;
  }
};

module.exports = exports;
