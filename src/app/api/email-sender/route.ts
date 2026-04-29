import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Use environment variable for from email or fallback to onboarding
    const fromEmail = process.env.NEXT_PUBLIC_RESEND_DOMAIN || "onboarding@resend.dev";

    // Send email to your team
    const teamEmailResponse = await resend.emails.send({
      from: `Pak Shipper Store <${fromEmail}>`,
      to: "pakshipperstore@gmail.com",
      replyTo: email,
      subject: `${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">New Contact Form Submission</h2>
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
      from: `Pakshipper Team <${fromEmail}>`,
      to: email,
      replyTo: "pakshipperstore@gmail.com",
      subject: "Thank you for contacting us",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Thank you for contacting us!</h2>
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

    if (teamEmailResponse.error) {
      console.error("Team email failed:", teamEmailResponse.error);
      return NextResponse.json(
        { message: "Failed to send notification email", error: teamEmailResponse.error },
        { status: 500 }
      );
    }

    if (userEmailResponse.error) {
      console.warn("User confirmation email failed:", userEmailResponse.error);
    }

    return NextResponse.json({
      message: "Message sent successfully",
      teamEmail: teamEmailResponse.data,
      userEmail: userEmailResponse.data,
      userEmailError: userEmailResponse.error ? "Confirmation email not sent (check sandbox restrictions)" : null
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}


