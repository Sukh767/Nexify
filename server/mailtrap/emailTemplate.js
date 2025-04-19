export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to NEXIFY</title>
</head>
<body class="bg-gray-100">
    <div class="max-w-lg mx-auto p-6">
        <table class="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <tr>
                <td class="p-8">
                    <div class="text-center">
                        <img 
                            src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735308869/fashion_store_1_jcfvvc.png" 
                            alt="NEXIFY Logo" 
                            class="h-16 mx-auto mb-4"
                        >
                        <h1 class="text-2xl font-bold text-gray-900 mb-8">Welcome to NEXIFY</h1>
                    </div>
                    <p class="text-gray-700 mb-4">
                        Dear Valued Customer,
                    </p>
                    <p class="text-gray-700 mb-4">
                        We're thrilled to welcome you to NEXIFY, your new favorite destination for online shopping! 
                        Thank you for joining our community of savvy shoppers.
                    </p>
                    <p class="text-gray-700 mb-4">
                        At NEXIFY, we're committed to providing you with:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 mb-4">
                        <li>A wide range of high-quality products</li>
                        <li>Competitive prices and regular deals</li>
                        <li>Excellent customer service</li>
                        <li>Fast and reliable shipping</li>
                    </ul>
                    <p class="text-gray-700 mb-8">
                        We can't wait for you to start exploring our store and finding amazing products!
                    </p>
                    <div class="text-center">
                        <a 
                            href="https://www.nexify.com/shop" 
                            class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg inline-block text-lg transition-all"
                        >
                            Start Shopping Now
                        </a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="bg-gray-100 p-6 text-center">
                    <p class="text-gray-600 mb-4">Follow us on social media:</p>
                    <div class="mb-4">
                        <a href="#" class="text-blue-600 hover:underline mx-2">Facebook</a>
                        <a href="#" class="text-blue-600 hover:underline mx-2">Twitter</a>
                        <a href="#" class="text-blue-600 hover:underline mx-2">Instagram</a>
                    </div>
                    <p class="text-gray-600 text-sm">
                        © 2023 NEXIFY. All rights reserved.
                    </p>
                    <p class="text-gray-600 text-sm">
                        You're receiving this email because you signed up for NEXIFY. 
                        <a href="#" class="text-blue-600 hover:underline">Unsubscribe</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
