'use server';

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function sendPasswordRecovery(email: string) {
  if (!email || !email.includes('@')) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    });

    if (!user) {
      return { success: false, error: "No account found with this email address." };
    }

    const property = await prisma.property.findFirst({
      where: { hostId: user.id }
    });

    if (!property || !property.adminEmail) {
      return { 
        success: false, 
        error: "No Admin Email has been configured for this property. Please contact support." 
      };
    }

    const adminEmail = property.adminEmail.trim();

    const emailResult = await sendEmail({
      to: adminEmail,
      subject: `🗝️ Password Recovery - ${property.name || 'Checkin Me'}`,
      text: `Hello,\n\nA password recovery request was triggered for your host account: ${user.email}.\n\nYour login password is: ${user.password}\n\nPlease keep this information secure.\n\nBest regards,\nCheckin Me Support Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px;">
          <h2 style="color: #FF385C; margin-top: 0;">Password Recovery</h2>
          <p>Hello,</p>
          <p>A password recovery request was triggered for your host account: <strong>${user.email}</strong>.</p>
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #374151;">Your login password is:</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #111827; letter-spacing: 0.5px;">${user.password}</p>
          </div>
          <p style="font-size: 12px; color: #6B7280;">If you did not request this, please update your password inside your settings dashboard immediately.</p>
          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9CA3AF; margin-bottom: 0;">This is an automated security notification from Checkin Me.</p>
        </div>
      `
    });

    if (!emailResult.success) {
      return { 
        success: false, 
        error: `SMTP sending failed: ${emailResult.error}` 
      };
    }

    const parts = adminEmail.split('@');
    const name = parts[0];
    const domain = parts[1];
    const obscuredName = name.length > 2 ? name.substring(0, 2) + '*'.repeat(name.length - 2) : name + '*';
    const obscuredEmail = `${obscuredName}@${domain}`;

    return { 
      success: true, 
      message: `A password recovery email has been successfully sent to the Admin Email: ${obscuredEmail}` 
    };
  } catch (error) {
    console.error("Password recovery failed:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred during password recovery." 
    };
  }
}
