import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Heading,
  Button,
  Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type Props = {
  name: string;
  userId: string;
};

const OnboardingEmail = ({ name, userId }: Props) => {
  // Generate QR code URL using QR Server
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(userId)}`;

  return (
    <Html>
      <Head />
      <Preview>🎉 Welcome</Preview>
      <Tailwind>
        <Body className=""></Body>
      </Tailwind>
    </Html>
  );
};

export default OnboardingEmail;
