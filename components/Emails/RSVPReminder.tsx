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
      🚨 Final RSVP Reminder - Please Respond by Tonight for Hack Canada
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
              🚨 Final RSVP Reminder
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

            <Section className="mt-6 flex justify-center space-x-4">
              <Button
                href="https://app.hackcanada.org/rsvp"
                className="inline-block rounded-lg bg-[#0A1F44] px-4 py-2 text-center text-sm font-semibold text-white no-underline transition-all duration-200 hover:brightness-110"
              >
                RSVP Now
              </Button>
              <Button
                href="https://app.hackcanada.org"
                className="ml-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white no-underline transition-all duration-200 hover:brightness-110"
              >
                Cancel RSVP
              </Button>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-zinc-700">
              Just a reminder that Hack Canada is happening tomorrow at
              Lazaridis Hall, Wilfrid Laurier University (64 University Ave W,
              Waterloo). Check-ins start at 4:30 PM!
            </Text>

            <Text className="mt-6 text-zinc-700">
              If you have decided not to attend Hack Canada, please use the
              Cancel RSVP button above to let us know before 11:59 PM EST
              tonight. This will help us offer your spot to someone on our
              waitlist who is eager to participate.
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

            <Text className="mt-6 text-zinc-700">Best regards,</Text>
            <Text className="mt-2 font-semibold text-[#0A1F44]">
              Hack Canada Team 🦫🍁
            </Text>

            <Hr className="my-6 border-gray-200" />

            {/* Footer */}
            <div className="text-center">
              <div className="mb-4">
                <Link
                  className="text-xs text-gray-400 no-underline"
                  href="https://hackcanada.org"
                >
                  Hack Canada
                </Link>
                <span className="mx-3 text-gray-400">|</span>
                <Link
                  className="text-xs text-gray-400 no-underline"
                  href="https://app.hackcanada.org"
                >
                  Dashboard
                </Link>
                <span className="mx-3 text-gray-400">|</span>
                <Link
                  className="text-xs text-gray-400 no-underline"
                  href="https://discord.gg/wp42amwcWy"
                >
                  Discord
                </Link>
                <span className="mx-3 text-gray-400">|</span>
                <Link
                  className="text-xs text-gray-400 no-underline"
                  href="https://www.instagram.com/hackcanada/"
                >
                  Instagram
                </Link>
                <span className="mx-3 text-gray-400">|</span>
                <Link
                  className="text-xs text-gray-400 no-underline"
                  href="https://www.linkedin.com/company/hack-canada"
                >
                  LinkedIn
                </Link>
                <span className="mx-3 text-gray-400">|</span>
                <Link
                  className="text-xs text-gray-400 no-underline"
                  href="mailto:hello@hackcanada.org"
                >
                  Email
                </Link>
              </div>
              <Text className="m-2 text-xs text-gray-400">
                Copyright © 2025 Hack Canada
              </Text>
              <Text className="m-2 text-xs text-gray-400">
                All rights reserved.
              </Text>
            </div>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default RSVPReminder;
