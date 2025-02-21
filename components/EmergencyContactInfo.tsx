import { db } from "@/lib/db";
import { rsvp } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import InfoRow from "./InfoRow";
import { Phone, User2, Users2 } from "lucide-react";

type Props = {
  userId: string;
};

const EmergencyContactInfo = async ({ userId }: Props) => {
  const [contact] = await db.select().from(rsvp).where(eq(rsvp.userId, userId));

  if (!contact) {
    return null;
  }

  return (
    <Card className="w-full bg-gradient-to-br from-background via-background/80 to-background max-sm:border-none">
      <CardHeader className="max-sm:p-0">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Emergency Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="max-sm:p-0">
        <div className="grid w-full gap-y-3">
          <InfoRow
            label="Contact Name"
            value={contact.emergencyContactName}
            icon={<User2 className="size-4" />}
          />
          <InfoRow
            label="Relationship"
            value={contact.relationshipToParticipant}
            icon={<Users2 className="size-4" />}
          />
          <InfoRow
            label="Phone Number"
            value={contact.emergencyContactPhoneNumber}
            icon={<Phone className="size-4" />}
          />
          {contact.alternativePhoneNumber && (
            <InfoRow
              label="Alternative Phone"
              value={contact.alternativePhoneNumber}
              icon={<Phone className="size-4" />}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactInfo;
