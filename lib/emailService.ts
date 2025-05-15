import nodemailer from 'nodemailer';

/**
 * Sends a personalized networking guide email with PDF attachment
 * 
 * @param to - Recipient's email address
 * @param userName - Recipient's name for personalization
 * @param pdfBuffer - Buffer containing the PDF guide
 * @param htmlContent - HTML content for the email body
 * @returns Promise that resolves when email is sent
 */
export async function sendGuideEmail(
  to: string,
  userName: string,
  pdfBuffer: Buffer,
  htmlContent: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check for required environment variables
    const requiredEnvVars = [
      'GMAIL_EMAIL_ADDRESS',
      'GMAIL_CLIENT_ID',
      'GMAIL_CLIENT_SECRET',
      'GMAIL_REFRESH_TOKEN'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
      return {
        success: false,
        message: `Email configuration incomplete. Missing: ${missingEnvVars.join(', ')}`
      };
    }

    // Create the transporter with OAuth2 authentication
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_EMAIL_ADDRESS,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });

    // Sanitize the username for the filename
    const sanitizedUserName = userName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    
    // Define the email options
    const mailOptions = {
      from: `"Coffee-Chat Coach" <${process.env.GMAIL_EMAIL_ADDRESS}>`,
      to,
      subject: `Hi ${userName}, here is your Coffee-Chat Guide!`,
      html: htmlContent,
      attachments: [
        {
          filename: `Coffee-Chat_Guide_${sanitizedUserName}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    
    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      success: false,
      message: `Failed to send email: ${error.message}`
    };
  }
}
