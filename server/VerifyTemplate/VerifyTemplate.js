const verifyTemplate = (name, url) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background-color: #f4f7fc;
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
          background-color: #4caf50;
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
        .email-button {
          display: inline-block;
          background-color: #4caf50;
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
          background-color: #388e3c;
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
          Welcome to Friend & Counselor AI
        </div>
        <div class="email-content">
          <img class="logo" src="https://example.com/logo.png" alt="Logo" />
          <p>Hi <strong>${name}</strong>,</p>
          <p>We’re excited to have you on board! To get started, please verify your email address by clicking the button below.</p>
          <a href="${url}" class="email-button">Verify Your Email</a>
        </div>
        <div class="email-footer">
          <p>If you didn’t sign up for this account, please disregard this email.</p>
          <p>Stay healthy and mindful,</p>
          <p>The Friend & Counselor AI Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default verifyTemplate;
