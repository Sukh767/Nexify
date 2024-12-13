import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Account Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification",
        })

        console.log("Verification email sent:", response);
    } catch (error) {
        throw new Error("Error sending verification email:", error);
    }
} 

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email, name }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "6af0afae-6050-4e69-8329-d9822fb0922b",
            template_variables: {
                "company_info_name": "NEXIFY",
                "name": name ,
              }
        });

        console.log("Welcome email sent:", response);
    } catch (error) {
        throw new Error("Error sending welcome email:", error);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
    } catch (error) {
        console.log("Password reset email sent:", response);
        throw new Error("Error sending password reset email:", error);

    }
}

export const sendResetSuccesfulEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset successful email sent:", response);
    } catch (error) {
        throw new Error("Error sending password reset successful email:", error);
    }
}