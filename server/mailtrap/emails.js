import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { createTransporter, sender } from "./emailApi.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = email;

  try {
    const transporter = await createTransporter();
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Account Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });

    console.log("Verification email sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = email;

  try {
    const transporter = await createTransporter();
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      html: WELCOME_EMAIL_TEMPLATE,
      subject: "Welcome to Nexify",
      category: "Welcome email",
    });

    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = email;

  try {
    const transporter = await createTransporter();
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccesfullEmail = async (email) => {
  const recipient = email;

  try {
    const transporter = await createTransporter();
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset successful email sent:", response);
  } catch (error) {
    console.error(
      "Error sending password reset successful email:",
      error.message
    );
    throw new Error("Failed to send password reset successful email");
  }
};
