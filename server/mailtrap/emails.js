import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
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