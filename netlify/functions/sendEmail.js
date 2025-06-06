const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
/**
 * This function sends an email using the Brevo API.
 * It expects a JSON payload with 'to', 'subject', and 'message' fields.
 * The API key and sender email are taken from environment variables.
 */

exports.handler = async (event) => {
  const { to, subject, message } = JSON.parse(event.body || "{}");

  if (!to || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "TaskWise", email: process.env.SENDER_EMAIL },
        to: [{ email: to }],
        subject: subject,
        htmlContent: `<html><body>${message}</body></html>`,
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
