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

const AcceptanceEmail = ({ name }: Props) => (
  <Html>
    <Head />
    <Preview>🎉 Hack Canada Acceptance - RSVP by Nov 08</Preview>
    <Tailwind>
      <Body className="bg-orange-100">
        <Container className="mx-auto max-w-2xl px-3 py-6">
          <Img
            src="https://i.imgur.com/hzjyuYn.png"
            width={500}
            alt="Hack Canada Banner"
            className="w-full rounded-t-lg"
          />
          <Section className="rounded-b-lg bg-white p-6 shadow-md">
            <Heading className="mb-4 text-2xl font-bold text-orange-600">
              Hello, {name}!
            </Heading>
            <Text className="mt-4 text-zinc-700">
              Roar-some news! Your application for Hack Canada has been
              accepted! Your creativity and passion blew us away, and we
              can&apos;t wait to see what amazing things you&apos;ll build with
              us! Let&apos;s make some dino-mite hacks together!
            </Text>
            <Text className="text-zinc-700">- Elf, Hack Canada Mascot</Text>
            <Section className="mt-6 rounded-lg bg-gray-50 p-4">
              <Heading className="text-xl font-bold text-orange-700">
                📅 Event Details
              </Heading>
              <Text className="mt-2 text-zinc-700">
                <strong>Dates:</strong> November 09–10, 2024
                <br />
                <strong>Location:</strong> TBA, York University
                <br />
                <strong>Duration:</strong> 24 hours of hacking
              </Text>
            </Section>
            <Heading className="mt-6 text-xl font-bold text-orange-600">
              ✅ What&apos;s Next? RSVP by November 8th
            </Heading>
            <Text className="mt-2 text-zinc-700">
              To confirm your participation, please RSVP by November 8th, 2024.
              Your response helps us with the final preparations and ensures
              everything is perfect for you.
            </Text>
            <Heading className="mt-6 text-lg font-semibold text-orange-600">
              🚀 How to RSVP:
            </Heading>
            <Text className="mt-2 text-zinc-700">
              <strong>Visit Your Dashboard:</strong>
              <br />
              Use the link below to RSVP and secure your spot:
            </Text>
            <Section className="mt-4">
              <Button
                href="https://app.hackcanada.org"
                className="rounded-md bg-orange-600 px-4 py-2 font-bold text-white"
              >
                Secure Your Spot
              </Button>
            </Section>
            <Text className="mt-6 text-zinc-700">
              <strong>Stay Tuned for More Details:</strong>
              <br />
              Event schedule, team formation information, and other exciting
              updates will be shared with you soon!
            </Text>
            <Text className="mt-6 text-zinc-700">
              If you have any questions or need help with anything, feel free to
              reach out to us at{" "}
              <a
                href="mailto:hello@hackcanada.org"
                className="text-orange-600 underline"
              >
                hello@hackcanada.org
              </a>{" "}
              – we&apos;re happy to assist!
            </Text>
            <Text className="mt-6 text-zinc-700">
              We can&apos;t wait to welcome you to Hack Canada and experience an
              unforgettable 24 hours together. See you soon!
            </Text>
            <Text className="mt-8 font-semibold text-zinc-800">
              Warm regards,
            </Text>
            <Text className="mt-2 font-semibold text-orange-600">
              The Hack Canada Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AcceptanceEmail;
