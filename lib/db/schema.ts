import type { AdapterAccount } from "@auth/core/adapters";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified"),
  password: text("password"),
  role: text("role").default("unassigned").notNull(),
  applicationStatus: text("applicationStatus").notNull().default("not_applied"),
  acceptedAt: timestamp("acceptedAt"),
  rsvpAt: timestamp("rsvpAt"),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const passwordResetTokens = pgTable("passwordResetToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text("token"),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: sql`CONCAT(${account.provider}, ${account.providerAccountId})`,
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});

export const authenticators = pgTable("authenticator", {
  credentialID: text("credentialID").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
});

export const emailVerificationTokens = pgTable("emailVerificationToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const hackerApplications = pgTable("hackerApplication", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("firstName"),
  lastName: text("lastName"),
  age: integer("age"),
  pronouns: text("pronouns"),
  email: text("email"),
  github: text("github"),
  linkedin: text("linkedin"),
  personalWebsite: text("personalWebsite"),
  resumeUrl: text("resume"),
  shareResume: boolean("shareResume"),
  school: text("school"),
  major: text("major"),
  levelOfStudy: text("levelOfStudy"),
  graduationYear: integer("graduationYear"),
  gender: text("gender"),
  race: text("race"),
  country: text("country"),
  shortAnswer1: text("shortAnswer1"),
  shortAnswer2: text("shortAnswer2"),
  technicalInterests: text("technicalInterests"),
  hackathonsAttended: text("hackathonsAttended"),
  mlhCheckbox1: boolean("mlhCheckbox1"),
  mlhCheckbox2: boolean("mlhCheckbox2"),
  mlhCheckbox3: boolean("mlhCheckbox3"),
  submissionStatus: text("submissionStatus").notNull().default("draft"),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  internalResult: text("internalResult").default("pending"),
  internalNotes: text("internalNotes"),
});

export type HackerApplicationsInsertData =
  typeof hackerApplications.$inferInsert;
export type HackerApplicationsSelectData =
  typeof hackerApplications.$inferSelect;

export const rsvp = pgTable("rsvp", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  emergencyContactName: text("emergencyContactName").notNull(),
  relationshipToParticipant: text("relationshipToParticipant").notNull(),
  emergencyContactPhoneNumber: text("emergencyContactPhoneNumber").notNull(),
  alternativePhoneNumber: text("alternativePhoneNumber"),
  dietaryRestrictions: text("dietaryRestrictions"),
  tshirtSize: text("tshirtSize").notNull(),
  agreeToTerms: boolean("agreeToTerms").notNull(),
  mediaConsent: boolean("mediaConsent").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type RsvpInsert = typeof rsvp.$inferInsert;
export type RsvpSelect = typeof rsvp.$inferSelect;
