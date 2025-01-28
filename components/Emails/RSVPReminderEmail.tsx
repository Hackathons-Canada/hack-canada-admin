import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Button,
  Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type Props = { name: string };

const RSVPReminderEmail = ({ name }: Props) => (
  <Html>
    <Head />
    <Preview>🔔 Final Reminder: RSVP to secure your spot</Preview>
    <Tailwind>
      <Body></Body>
    </Tailwind>
  </Html>
);

export default RSVPReminderEmail;
