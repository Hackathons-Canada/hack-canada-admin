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

const ReminderEmail = () => (
  <Html>
    <Head />
    <Preview>URGENT: Applications Closing Soon</Preview>
    <Tailwind>
      <Body></Body>
    </Tailwind>
  </Html>
);

export default ReminderEmail;
