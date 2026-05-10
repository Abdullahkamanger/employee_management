import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInviteEmail(email: string, name: string, token: string) {
  const onboardingUrl = `${process.env.AUTH_URL}/onboarding?token=${token}&email=${email}`;
  
  const mailOptions = {
    from: `"EMS Pro Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to the Team! - Action Required",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #6366f1;">Welcome to the Team, ${name}!</h2>
        <p>You have been added to the <b>EMS Pro</b> management system by your administrator.</p>
        <p>To get started, please set up your secure password on our onboarding page:</p>
        <div style="margin: 30px 0;">
          <a href="${onboardingUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Complete Onboarding</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #64748b; font-size: 14px;">${onboardingUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px;">This is an automated message from EMS Pro. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}
export async function sendApprovalEmail(email: string, name: string) {
  const loginUrl = `${process.env.AUTH_URL}/signin`;
  
  const mailOptions = {
    from: `"EMS Pro Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Account Approved! - EMS Pro",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #10b981;">Good news, ${name}!</h2>
        <p>Your account has been reviewed and approved by the administration team.</p>
        <p>You now have full access to the EMS Pro dashboard, where you can manage your profile, view payroll history, and message your team.</p>
        <div style="margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px;">This is an automated message from EMS Pro. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}
