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

const RejectionEmail = ({ name }: Props) => (
  <Html>
    <Head />
    <Preview>Thank You for Your Application to Hack Canada</Preview>
    <Tailwind>
      <Body className="bg-blue-50">
        <Container className="mx-auto max-w-2xl px-3 py-6">
          <Img
            src="https://i.imgur.com/oSOENiE.png"
            width={500}
            alt="Hack Canada Banner"
            className="w-full rounded-t-lg"
          />
          <Section className="rounded-b-lg bg-white p-8 shadow-md">
            <Heading className="mb-6 text-2xl font-semibold text-zinc-800">
              Hello {name},
            </Heading>
            <Text className="mt-4 text-zinc-700">
              We truly loved reading your application. We loved seeing all the
              passion, creativity and love that you put into your application to
              Hack Canada.
            </Text>
            <Text className="mt-4 text-zinc-700">
              We wish we could bring everyone who applied to our hackathon, but
              unfortunately, that&apos;s just not possible. We regret to inform
              you that we are unable to offer you a spot at this time.
            </Text>
            <Text className="mt-4 text-zinc-700">
              We hope to see you at our future events. Furthermore, if
              interested, we encourage you to apply as a mentor!
            </Text>
            <Text className="mt-4 text-zinc-700">
              Keep building, innovating, and solving problems—qualities that
              make the hackathon community so vibrant and inspiring!
            </Text>
            <Section className="mt-6 flex justify-center">
              <Button
                href="https://app.hackcanada.org/applications/hacker/review"
                className="inline-block rounded-lg bg-[#0A1F44] px-8 py-3 text-center font-semibold text-white no-underline transition-all duration-200 hover:brightness-110"
              >
                Review Application
              </Button>
            </Section>
            <Section className="mt-6">
              <Text className="mt-4 text-zinc-700">
                If you have any questions or would like to stay connected, feel
                free to reach out to us at{" "}
                <a
                  href="mailto:hello@hackcanada.org"
                  className="text-zinc-800 underline"
                >
                  hello@hackcanada.org
                </a>
                . Be sure to follow us on{" "}
                <a
                  href="https://instagram.com/hackcanada"
                  className="text-zinc-800 underline"
                >
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href="https://www.linkedin.com/company/hack-canada"
                  className="text-zinc-800 underline"
                >
                  LinkedIn
                </a>{" "}
                for updates on upcoming events and resources for hackers.
              </Text>
            </Section>
            <Text className="mt-4 text-zinc-700">
              Thank you once again for your interest in Hack Canada. We wish you
              all the best in your future endeavours!
            </Text>
            <Text className="mt-8 font-semibold text-zinc-800">Cheers,</Text>
            <Text className="mb-8 mt-2 font-semibold text-blue-500">
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
                  href="https://www.linkedin.com/company/hack-canada/"
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

export default RejectionEmail;
