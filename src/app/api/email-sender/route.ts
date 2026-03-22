import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = 'edge';

// Initialize lazily or with a fallback so it doesn't crash during build-time
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email to your team
    const teamEmailResponse = await resend.emails.send({
      from: "Pakshipper Team <support@pakshipper.com>",
      to: "pakshipperstore@gmail.com",
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top: 1.5rem; color: #6b7280; font-size: 0.875rem;">
            This email was sent from your website's contact form.
          </p>
        </div>
      `,
    });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Pakshipper Team <support@pakshipper.com>",
      to: email,
      replyTo: "pakshipperstore@gmail.com",
      subject: "Thank you for contacting us",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting us!</h2>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>Here's a copy of your message for your records:</p>
          <div style="background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top: 1.5rem; color: #6b7280; font-size: 0.875rem;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
    });

    if (teamEmailResponse.error || userEmailResponse.error) {
      console.error(
        "Resend API error:",
        teamEmailResponse.error || userEmailResponse.error
      );
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Emails sent successfully",
      teamEmail: teamEmailResponse.data,
      userEmail: userEmailResponse.data,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
