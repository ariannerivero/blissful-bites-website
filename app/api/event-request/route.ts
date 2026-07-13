import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type EventRequestBody = {
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  guestCount?: string;
  message?: string;
  website?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date: string) {
  if (!date) {
    return "Not provided";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
  }).format(parsedDate);
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY environment variable.");

      return NextResponse.json(
        {
          error: "Email service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body = (await request.json()) as EventRequestBody;

    const {
      name = "",
      email = "",
      phone = "",
      eventType = "",
      eventDate = "",
      eventTime = "",
      location = "",
      guestCount = "",
      message = "",
      website = "",
    } = body;

    // Honeypot field for basic spam protection.
    if (website.trim()) {
      return NextResponse.json({
        success: true,
      });
    }

    if (
      !name.trim() ||
      !phone.trim() ||
      !eventType.trim() ||
      !eventDate.trim() ||
      !location.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() && !emailPattern.test(email.trim())) {
        return NextResponse.json(
            {
            error: "Please provide a valid email address.",
            },
            {
            status: 400,
            }
        );
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());
    const safeEventType = escapeHtml(eventType.trim());
    const safeEventDate = escapeHtml(formatDate(eventDate.trim()));
    const safeEventTime = escapeHtml(eventTime.trim() || "Not provided");
    const safeLocation = escapeHtml(location.trim());
    const safeGuestCount = escapeHtml(
      guestCount.trim() || "Not provided"
    );
    const safeMessage = escapeHtml(message.trim() || "No message provided");

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: "Blissful Bites Website <onboarding@resend.dev>",

      // Testing recipient
      to: ["ariannerivero32@gmail.com"],

      ...(email.trim() ? { replyTo: email.trim() } : {}),

      subject: `New Event Request: ${eventType.trim()} from ${name.trim()}`,

      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #fff8ea;
              font-family: Arial, Helvetica, sans-serif;
              color: #4f281b;
            "
          >
            <div
              style="
                width: 100%;
                padding: 32px 16px;
                box-sizing: border-box;
              "
            >
              <div
                style="
                  max-width: 650px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 18px;
                  overflow: hidden;
                  box-shadow: 0 10px 35px rgba(91, 48, 25, 0.12);
                "
              >
                <div
                  style="
                    background-color: #ffad22;
                    padding: 30px;
                    text-align: center;
                  "
                >
                  <p
                    style="
                      margin: 0 0 8px;
                      color: #6b311d;
                      font-size: 12px;
                      font-weight: 700;
                      letter-spacing: 2px;
                      text-transform: uppercase;
                    "
                  >
                    Blissful Bites Mini Doughnuts
                  </p>

                  <h1
                    style="
                      margin: 0;
                      color: #6b311d;
                      font-family: Georgia, serif;
                      font-size: 30px;
                    "
                  >
                    New Event Request
                  </h1>
                </div>

                <div style="padding: 30px">
                  <p
                    style="
                      margin: 0 0 24px;
                      color: #5f4438;
                      font-size: 15px;
                      line-height: 1.7;
                    "
                  >
                    A new event request was submitted through the Blissful
                    Bites website.
                  </p>

                  <table
                    role="presentation"
                    cellspacing="0"
                    cellpadding="0"
                    style="
                      width: 100%;
                      border-collapse: collapse;
                      font-size: 15px;
                    "
                  >
                    <tr>
                      <td style="${labelStyle}">Customer</td>
                      <td style="${valueStyle}">${safeName}</td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Email</td>
                      <td style="${valueStyle}">
                        <a
                          href="mailto:${safeEmail}"
                          style="color: #9c431d"
                        >
                          ${safeEmail}
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Phone</td>
                      <td style="${valueStyle}">${safePhone}</td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Event type</td>
                      <td style="${valueStyle}">${safeEventType}</td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Preferred date</td>
                      <td style="${valueStyle}">${safeEventDate}</td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Preferred time</td>
                      <td style="${valueStyle}">${safeEventTime}</td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Location</td>
                      <td style="${valueStyle}">${safeLocation}</td>
                    </tr>

                    <tr>
                      <td style="${labelStyle}">Estimated guests</td>
                      <td style="${valueStyle}">${safeGuestCount}</td>
                    </tr>
                  </table>

                  <div
                    style="
                      margin-top: 24px;
                      padding: 20px;
                      background-color: #fff8ea;
                      border-radius: 12px;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 8px;
                        color: #7a381f;
                        font-size: 13px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      "
                    >
                      Event details
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #5f4438;
                        font-size: 15px;
                        line-height: 1.7;
                        white-space: pre-wrap;
                      "
                    >
                      ${safeMessage}
                    </p>
                  </div>

                  <div style="margin-top: 28px; text-align: center">
                    <a
                      href="mailto:${safeEmail}"
                      style="
                        display: inline-block;
                        padding: 14px 25px;
                        border-radius: 10px;
                        background-color: #963f18;
                        color: #ffffff;
                        font-size: 15px;
                        font-weight: 700;
                        text-decoration: none;
                      "
                    >
                      Reply to ${safeName}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          error: "Unable to send the event request.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Event request error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}

const labelStyle = `
  width: 38%;
  padding: 13px 12px;
  border-bottom: 1px solid #f1e5d2;
  color: #7a381f;
  font-weight: 700;
  vertical-align: top;
`;

const valueStyle = `
  padding: 13px 12px;
  border-bottom: 1px solid #f1e5d2;
  color: #5f4438;
  vertical-align: top;
`;