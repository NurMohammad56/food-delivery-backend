import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
}): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "NUB Food Delivery <noreply@nubfood.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${options.email}`);
  } catch (error) {
    console.error(`✗ Email sending failed: ${error}`);
    throw new Error("Email could not be sent");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
    Hi ${name},
    
    You requested a password reset for your NUB Food Delivery account.
    
    Please click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    NUB Food Delivery Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2E75B6;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested a password reset for your NUB Food Delivery account.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #2E75B6; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 1 hour.
      </p>
      <p style="color: #666; font-size: 14px;">
        If you didn't request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        NUB Food Delivery Team<br>
        Northern University Bangladesh
      </p>
    </div>
  `;

  await sendEmail({
    email,
    subject: "Password Reset Request - NUB Food Delivery",
    message,
    html,
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  email: string,
  name: string,
  orderId: string,
  orderDetails: any,
): Promise<void> => {
  const message = `
    Hi ${name},
    
    Your order has been confirmed!
    
    Order ID: ${orderId}
    Total Amount: BDT ${orderDetails.totalAmount}
    Estimated Ready Time: ${orderDetails.estimatedReadyTime}
    
    Thank you for your order!
    
    Best regards,
    NUB Food Delivery Team
  `;

  await sendEmail({
    email,
    subject: `Order Confirmation - ${orderId}`,
    message,
  });
};
