"use server";

import AcceptanceEmail from "@/components/Emails/AcceptanceEmail";
import RejectionEmail from "@/components/Emails/RejectionEmail";
import ReminderEmail from "@/components/Emails/ReminderEmail";
import OnboardingEmail from "@/components/Emails/OnboardingEmail";
import HackathonPrepEmail from "@/components/Emails/HackathonPrepEmail";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import RSVPReminder from "@/components/Emails/RSVPReminder";

const ses = new SES({ region: process.env.AWS_SES_REGION });

export const sendEmail = async (to: string, subject: string, body: string) => {
  const params = {
    Source: `Hack Canada <${process.env.AWS_SES_NO_REPLY_EMAIL!}>`,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
        Text: {
          Charset: "UTF-8",
          Data: body.replace(/<[^>]+>/g, ""),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };

  try {
    await ses.sendEmail(params);

    console.log("Email sent successfully to " + to);
    return { success: true };
  } catch (error) {
    console.error("Error sending email with SES: ", error);
    return { error: "Something went wrong. Email could not be sent." };
  }
};

export const sendApplicationEmail = async (
  recipientName: string,
  recipientEmail: string,
  status: "accepted" | "rejected",
) => {
  let emailTemplate;
  if (status === "accepted") {
    emailTemplate = render(RejectionEmail({ name: recipientName }));
  } else {
    emailTemplate = render(RejectionEmail({ name: recipientName }));
  }

  const emailSubject = "We've assessed your application - Hack Canada";

  const result = await sendEmail(recipientEmail, emailSubject, emailTemplate);

  return result;
};

export const sendAcceptanceEmail = async (
  recipientName: string,
  recipientEmail: string,
) => {
  const emailTemplate = render(AcceptanceEmail({ name: recipientName }));
  const emailSubject =
    "[ACTION REQUIRED] Congratulations, you have been accepted to Hack Canada";

  const result = await sendEmail(recipientEmail, emailSubject, emailTemplate);
  return result;
};

export const sendRejectionEmail = async (
  recipientName: string,
  recipientEmail: string,
) => {
  const emailTemplate = render(RejectionEmail({ name: recipientName }));
  const emailSubject = "Thank You for Your Application to Hack Canada";

  const result = await sendEmail(recipientEmail, emailSubject, emailTemplate);
  return result;
};

export const sendRSVPReminderEmail = async (name: string, email: string) => {
  const emailTemplate = render(RSVPReminder({ name: name }));

  const emailSubject =
    "🚨 Urgent: Final RSVP Reminder - Please Respond by Tonight for Hack Canada";
  const result = await sendEmail(email, emailSubject, emailTemplate);
  return result;
};

export const sendReminderEmail = async (emails: string[]) => {
  const emailTemplate = render(ReminderEmail());

  const params = {
    Source: `<${process.env.AWS_SES_EMAIL_SOURCE!}>`,
    Destination: {
      BccAddresses: emails,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailTemplate,
        },
        Text: {
          Charset: "UTF-8",
          Data: emailTemplate.replace(/<[^>]+>/g, ""),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "We Noticed You Haven't Applied Yet – Don't Miss Out on Hack Canada!",
      },
    },
  };

  try {
    const result = await ses.sendEmail(params);

    console.log("Email sent!", result);
  } catch (error) {
    console.error("Error sending email with SES: ", error);
  }
};

export const sendHackathonPrepEmail = async (
  recipientEmail: string,
  recipientName: string,
  userId: string,
) => {
  const emailTemplate = render(
    HackathonPrepEmail({
      name: recipientName,
      userId: userId,
    }),
  );

  const emailSubject = "🚀 Hack Canada Event Details and Check-in Information";
  const result = await sendEmail(recipientEmail, emailSubject, emailTemplate);
  return result;
};

export const sendOnboardingEmail = async (
  hackers: { email: string; name: string | null; userId: string }[],
) => {
  for (const hacker of hackers) {
    try {
      const emailTemplate = render(
        OnboardingEmail({
          name: hacker.name || "Hacker",
          userId: hacker.userId,
        }),
      );

      const params = {
        Source: `<${process.env.AWS_SES_EMAIL_SOURCE!}>`,
        Destination: {
          ToAddresses: [hacker.email],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: emailTemplate,
            },
            Text: {
              Charset: "UTF-8",
              Data: emailTemplate.replace(/<[^>]+>/g, ""),
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "🎉 Welcome to - Important Event Information",
          },
        },
      };

      await ses.sendEmail(params);
      console.log(`Onboarding email sent to ${hacker.email}`);
      // Add a delay between emails to respect SES rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to send email to ${hacker.email}:`, error);
    }
  }
};
