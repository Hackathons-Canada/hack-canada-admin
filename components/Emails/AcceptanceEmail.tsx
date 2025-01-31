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
    <Preview>🎉 Hack Canada Acceptance - RSVP Required</Preview>
    <Tailwind>
      <Body className="bg-blue-50">
        <Container className="mx-auto max-w-2xl px-3 py-6">
          <Img
            src="https://i.imgur.com/hzjyuYn.png"
            width={500}
            alt="Hack Canada Banner"
            className="w-full rounded-t-lg"
          />
          <Section className="rounded-b-lg bg-white p-8 shadow-md">
            <Heading className="mb-6 text-2xl font-semibold text-blue-500">
              🎉 Congratulations, {name}! 🎉
            </Heading>
            <Text className="mt-4 text-zinc-700">
              After an intense application process... We would like to
              congratulate you on making it through!
            </Text>
            <Text className="mt-4 text-zinc-700">
              This year we had sooo many applicants and the process was not
              easy. We found your application to stand out above the rest, like
              a rose in a dandelion field. Your creativity and passion were so
              strong, we could sense it from a mile away.
            </Text>
            <Text className="mt-4 text-zinc-700">
              We would love to have you at Hack Canada, and we can&apos;t wait
              to see what amazing things you can build with us!
            </Text>
            <Section
              style={{
                marginTop: "2rem",
                paddingTop: "0.5rem",
                paddingBottom: "1.5rem",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                border: "2px solid #60A5FA",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(59, 130, 246, 0.05)",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <Text className="text-lg font-semibold text-zinc-800">
                Event Details
              </Text>
              <div className="mt-4 text-zinc-700">
                <div className="mb-6">
                  <div className="mb-2">
                    <strong className="text-xs font-bold text-blue-400">
                      📍 WHERE
                    </strong>
                  </div>
                  <div>
                    Lazaridis School of Business and Economics, 64 University
                    Ave W, Waterloo, ON N2L 3C7
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <strong className="text-xs font-bold text-blue-400">
                      📅 WHEN
                    </strong>
                  </div>
                  <div>February 21-23, 2025</div>
                </div>
              </div>
            </Section>
            <Section className="mt-4 border-t border-blue-100">
              <Heading className="text-xl font-semibold text-zinc-800">
                What&apos;s Next?
              </Heading>
              <Text className="mt-4 text-zinc-700">
                To make sure you&apos;re gonna be on our list of super cool
                people, we need you to{" "}
                <strong>RSVP within 7 days of receiving this email.</strong> We
                also have some additional questions to make sure everything is
                perfect for you.
              </Text>
              <Section className="mt-6">
                <Button
                  href="https://app.hackcanada.org/rsvp"
                  className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white"
                >
                  RSVP Now
                </Button>
              </Section>
            </Section>
            <Section className="mt-4 border-t border-blue-100">
              <Heading className="text-xl font-semibold text-zinc-800">
                Stay tuned for more details!
              </Heading>
              <Text className="mt-4 text-zinc-700">
                At this moment we are still hammering out some of the logistics,
                but event schedule, discord server, team formation information,
                and other exciting updates will be shared with you soon!
              </Text>
              <Text className="mt-4 text-zinc-700">
                If you&apos;d like to be the first to learn about the news,
                follow us on{" "}
                <a
                  href="https://instagram.com/hackcanada"
                  className="text-zinc-800 underline"
                >
                  Instagram
                </a>{" "}
                for more information!
              </Text>
              <Text className="mt-6 text-zinc-700">
                If you have any questions or need anything, feel free to reach
                out to us at{" "}
                <a
                  href="mailto:hello@hackcanada.org"
                  className="text-zinc-800 underline"
                >
                  hello@hackcanada.org
                </a>{" "}
                — we&apos;re happy to assist!
              </Text>
              <Text className="mt-6 text-zinc-700">
                We can&apos;t wait to see you!
              </Text>
              <Text className="mt-8 font-semibold text-zinc-800">Cheers,</Text>
              <Text className="mt-2 font-semibold text-blue-500">
                Hack Canada Team 🦫🍁
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AcceptanceEmail;
