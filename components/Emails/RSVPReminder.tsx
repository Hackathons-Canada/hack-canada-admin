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
  Hr,
  Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type Props = { name: string };

const RSVPReminder = ({ name }: Props) => (
  <Html>
    <Head />
    <Preview>
      🚨 Urgent: Final RSVP Reminder - Please Respond by Tonight for Hack Canada
    </Preview>
    <Tailwind>
      <Body className="bg-blue-50">
        <Container className="mx-auto max-w-2xl px-3 py-6">
          <Img
            src="https://i.imgur.com/N36vrSu.png"
            width={500}
            alt="Hack Canada Banner"
            className="w-full rounded-t-lg"
          />
          <Section className="rounded-b-lg bg-white p-8 shadow-md">
            <Heading className="mb-6 text-2xl font-semibold text-red-500">
              🚨 Urgent: Final RSVP Reminder
            </Heading>
            <Text className="mt-4 text-zinc-700">Hi {name},</Text>
            <Text className="mt-4 text-zinc-700">
              We noticed you haven&apos;t confirmed your spot for Hack Canada
              happening tomorrow! We need your immediate response to ensure we
              can accommodate everyone properly.
            </Text>
            <Text className="mt-4 font-semibold text-zinc-700">
              Please RSVP by tonight (February 20th, 2025 at 11:59 PM EST) if
              you would still like to join us for the hackathon. If we
              don&apos;t hear back from you, we may have to release your spot to
              someone on the waitlist.
            </Text>

            <Section className="mt-6 flex justify-center">
              <Button
                href="https://app.hackcanada.org/rsvp"
                className="inline-block rounded-lg bg-red-600 px-8 py-3 text-center font-semibold text-white no-underline transition-all duration-200 hover:brightness-110"
              >
                RSVP Now
              </Button>
            </Section>

            <Text className="mt-6 text-zinc-700">
              If you have decided not to attend Hack Canada, you can cancel your
              RSVP through your dashboard at any time. However, please do so
              before 11:59 PM EST tonight so we can offer your spot to someone
              on our waitlist who is eager to participate.
            </Text>

            <Text className="mt-8 text-zinc-700">
              If you have any questions or issues, please reach out to us
              immediately at{" "}
              <Link
                href="mailto:hello@hackcanada.org"
                className="text-zinc-800 underline"
              >
                hello@hackcanada.org
              </Link>
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="mt-4 text-zinc-700">Best regards,</Text>
            <Text className="mt-2 font-semibold text-blue-500">
              Hack Canada Team 🦫🍁
            </Text>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="text-xs text-gray-400">
                © 2025 Hack Canada. All rights reserved.
              </Text>
              <Text className="text-xs text-gray-400">
                64 University Ave W, Waterloo, ON N2L 3C7
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default RSVPReminder;
