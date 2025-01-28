import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type Props = { name: string };

const RejectionEmail = ({ name }: Props) => (
  <Html>
    <Head />
    <Preview>Thank you for applying</Preview>
    <Tailwind>
      <Body className=""></Body>
    </Tailwind>
  </Html>
);

export default RejectionEmail;
