const otpTemplate = (name, otp, verifyEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background-color: #f8c2d3; /* Soft pink background */
          color: #333;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .email-container {
          background-color: #ffffff;
          width: 100%;
          max-width: 650px;
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 0 25px 25px;
        }
        .email-header {
          background-color: #ff80ab; /* Pink header */
          color: white;
          padding: 30px;
          text-align: center;
          font-size: 28px;
          font-weight: 600;
        }
        .email-content {
          padding: 20px;
          text-align: center;
          font-size: 16px;
          line-height: 1.6;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #ff6090; /* Darker pink for the OTP */
          margin-top: 10px;
        }
        .email-button {
          display: inline-block;
          background-color: #ff80ab; /* Same pink shade for the button */
          color: white;
          padding: 18px 30px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 20px;
          transition: background-color 0.3s ease;
          font-size: 18px;
        }
        .email-button:hover {
          background-color: #ff6090; /* Slightly darker pink on hover */
        }
        .email-footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777;
          text-align: center;
          padding: 10px;
          border-top: 1px solid #eeeeee;
        }
        .email-footer p {
          margin: 5px 0;
        }
        .logo {
          display: block;
          margin: 0 auto 20px;
          width: 70px;
        }
        .email-content p {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          Password Reset Request
        </div>
        <div class="email-content">
          <img class="logo" src="https://example.com/logo.png" alt="Logo" />
          <p>Hi <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Use the One-Time Password (OTP) below to proceed with resetting your password:</p>
          <div class="otp-code">${otp}</div>
          <p>If you didn't request a password reset, please disregard this email.</p>
          <a href="${verifyEmail}" class="email-button">Reset Your Password</a>
        </div>
        <div class="email-footer">
          <p>If you didn’t make this request, please ignore this email.</p>
          <p>Stay healthy and mindful,</p>
          <p>The Friend & Counselor AI Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default otpTemplate;
