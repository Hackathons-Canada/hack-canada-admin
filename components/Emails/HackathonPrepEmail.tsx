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

type Props = {
  name: string;
  userId: string;
};

const HackathonPrepEmail = ({ name, userId }: Props) => {
  // Generate QR code URL using QR Server
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `https://app.hackcanada.org/profile/${userId}`,
  )}`;

  return (
    <Html>
      <Head />
      <Preview>🚀 Hack Canada Event Details and Check-in Information</Preview>
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
              <Heading className="mb-6 text-2xl font-semibold text-blue-500">
                Hello {name}! 👋
              </Heading>
              <Text className="mt-4 text-zinc-700">
                We&apos;re getting closer to the big day! Here&apos;s everything
                you need to know about Hack Canada at Wilfrid Laurier University
                this weekend.
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
                  📍 Location & Check-in Details
                </Text>
                <div className="mt-4 text-zinc-700">
                  <div className="mb-6">
                    <strong className="text-xs font-bold text-zinc-800">
                      CHECK-IN TIME
                    </strong>
                    <div className="mt-1">
                      Friday, February 21st, 4:30 PM — 6:30 PM
                    </div>
                    <Text className="mt-1 text-xs text-zinc-600">
                      If you&apos;re going to be late, please email us at
                      hello@hackcanada.org or message us in the
                      #ask-an-organizer channel on Discord.
                    </Text>
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-zinc-800">
                      VENUE ADDRESS
                    </strong>
                    <div className="mt-1">
                      Lazaridis School of Business and Economics
                      <br />
                      64 University Ave W, Waterloo, ON N2L 3C7
                    </div>
                    <Text className="mt-1 text-xs text-zinc-600">
                      Note: Overnight parking is not permitted. For parking
                      information, visit:{" "}
                      <a
                        href="https://www.wlu.ca/information-for/visiting-laurier/parking.html"
                        className="text-blue-600 underline"
                      >
                        WLU Parking Information
                      </a>
                    </Text>
                  </div>
                </div>
              </Section>

              <Section className="mt-4 rounded-lg bg-blue-50 p-6 shadow-lg">
                <Heading className="text-xl font-bold text-[#0A1F44]">
                  🎫 Your Multi-Purpose QR Code
                </Heading>
                <Text className="mt-2 text-zinc-700">
                  This QR code is your digital key to the hackathon experience:
                  <br />
                  <ul className="list-inside list-disc space-y-2">
                    <li>Use it for hackathon check-in and meal check-ins</li>
                    <li>Connect with other hackers during the event</li>
                    <li>
                      Access it anytime through your dashboard at
                      app.hackcanada.org
                    </li>
                  </ul>
                  <br />
                  <strong>Important Notes:</strong>
                  <br />• Your badge must be worn at all times during the event
                  <br />• High school students must bring a signed letter from
                  their guardian permitting attendance
                  <br />• If you lose your badge, find an event organizer
                  immediately
                </Text>
                <div className="mt-6 flex w-full flex-col items-center justify-center">
                  <div className="rounded-lg bg-white p-2.5 shadow-md">
                    <Img
                      src={qrCodeUrl}
                      width="150"
                      height="150"
                      alt="Multi-Purpose QR Code"
                      className="inline-block"
                    />
                  </div>
                </div>
              </Section>

              <Section className="mt-4">
                <Heading className="text-xl font-bold text-[#0A1F44]">
                  🔗 Important Links & Resources
                </Heading>
                <Text className="mt-2 text-zinc-700">
                  Please join our Discord server—it&apos;s where all important
                  announcements and communications will happen during the event:
                </Text>
                <Button
                  href="https://discord.gg/6sHskEpdpb"
                  className="mt-2 rounded-md bg-[#0A1F44] px-4 py-2 font-bold text-white"
                >
                  Join Discord Server
                </Button>

                <Text className="mt-4 text-zinc-700">
                  Other important links:
                </Text>
                <Text className="mt-2 text-zinc-700">
                  •{" "}
                  <a
                    href="https://torpid-tuesday-6d4.notion.site/Hack-Canada-Hacker-Package-1805d88c3a21800198e9e0731d94dc3f"
                    className="text-blue-600 underline"
                  >
                    Hacker Package
                  </a>{" "}
                  - Essential information and guidelines
                  <br />•{" "}
                  <a
                    href="https://discord.gg/6sHskEpdpb"
                    className="text-blue-600 underline"
                  >
                    Discord Server
                  </a>{" "}
                  - Join our community
                  <br />•{" "}
                  <a
                    href="https://docs.google.com/spreadsheets/d/1AVNb3k0e6ly5n9tv4BI1HLt_JrkNqfgZ3L1vhcU0vso/edit?gid=171852866#gid=171852866"
                    className="text-blue-600 underline"
                  >
                    Event Schedule
                  </a>{" "}
                  - Full event timeline
                  <br />•{" "}
                  <a
                    href="https://app.hackcanada.org"
                    className="text-blue-600 underline"
                  >
                    Hacker Dashboard
                  </a>{" "}
                  - Access your profile and event information
                  <br />•{" "}
                  <a
                    href="https://dorahacks.io/hackathon/hackcanada/detail"
                    className="text-blue-600 underline"
                  >
                    DoraHacks
                  </a>{" "}
                  - For project submissions (register and submit here!)
                </Text>
                <Text className="mt-2 text-sm text-zinc-600">
                  Note: The Schedule, Discord Server, and Hacker Package links
                  are also available through your dashboard.
                </Text>
              </Section>

              <Section className="mt-4">
                <Heading className="text-xl font-bold text-[#0A1F44]">
                  🎒 What to Bring
                </Heading>
                <Text className="mt-2 text-zinc-700">
                  • Valid Photo ID (required for check-in)
                  <br />
                  • Laptop & charger
                  <br />
                  • Any other devices or hardware you plan to use
                  <br />
                  • Toiletries & any medication you need
                  <br />
                  • Comfortable clothes and a light jacket (temperature varies)
                  <br />
                  • Sleeping bag/blanket if you plan to rest
                  <br />• Water bottle to stay hydrated
                </Text>
              </Section>

              <Section className="mt-4">
                <Heading className="text-xl font-bold text-[#0A1F44]">
                  🤝 Mentor Support
                </Heading>
                <Text className="mt-2 text-zinc-700">
                  Mentors will be available both in-person and on Discord
                  throughout the event:
                  <br />• In-person mentors can be found at the Balcony of
                  LH1001
                  <br />• Discord mentors are available through our server
                  <br />
                  <br />
                  Don&apos;t hesitate to reach out for help with your project!
                </Text>
              </Section>

              <Hr className="mt-4 border-gray-200" />

              <Text className="mt-4 text-zinc-700">
                If you have any questions before the event, feel free to reach
                out to us at{" "}
                <a
                  href="mailto:hello@hackcanada.org"
                  className="text-zinc-800 underline"
                >
                  hello@hackcanada.org
                </a>{" "}
                or message us on Discord.
              </Text>

              <Text className="mt-8 font-semibold text-zinc-800">
                See you soon!
              </Text>
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
};

export default HackathonPrepEmail;
