
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  message: string;
  recaptchaToken: string;
}

async function verifyRecaptcha(token: string) {
  const formData = new FormData();
  formData.append("secret", recaptchaSecret as string);
  formData.append("response", token);

  const url = "https://www.google.com/recaptcha/api/siteverify";
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("reCAPTCHA verification response:", data);
  return data.success === true && typeof data.score === 'number' && data.score >= 0.5;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const data = await req.json();
    
    // Type guard to ensure data has the required properties
    if (
      !data ||
      typeof data !== 'object' ||
      typeof data.firstName !== 'string' ||
      typeof data.lastName !== 'string' ||
      typeof data.email !== 'string' ||
      typeof data.telephone !== 'string' ||
      typeof data.message !== 'string' ||
      typeof data.recaptchaToken !== 'string'
    ) {
      throw new Error('Invalid request data format');
    }
    
    const { firstName, lastName, email, telephone, message, recaptchaToken }: ContactFormData = data;

    // Verify reCAPTCHA token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      console.error("reCAPTCHA validation failed");
      return new Response(
        JSON.stringify({ error: "reCAPTCHA validation failed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Heritage Journey <no-reply@heritagejourneynepal.com>",
      to: ["admin@heritagejourneynepal.com"],
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${telephone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Heritage Journey <no-reply@heritagejourneynepal.com>",
      to: [email],
      subject: "Thank you for contacting Heritage Journey Nepal",
      html: `
        <h1>Thank you for contacting Heritage Journey Nepal!</h1>
        <p>Dear ${firstName} ${lastName},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Heritage Journey Nepal Team</p>
      `,
    });

    console.log("Emails sent successfully:", adminEmailResponse, userEmailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
