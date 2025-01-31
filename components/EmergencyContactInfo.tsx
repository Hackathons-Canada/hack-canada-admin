// import { db } from "@/lib/db";
// import { emergencyContacts } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

// type Props = {
//   userId: string;
// };

// const EmergencyContactInfo = async ({ userId }: Props) => {
//   const [contact] = await db
//     .select()
//     .from(emergencyContacts)
//     .where(eq(emergencyContacts.userId, userId));

//   if (!contact) {
//     return null;
//   }

//   return (
//     <div className="w-full overflow-x-auto rounded-lg border p-4 md:p-8">
//       <h2 className="mb-4 text-xl font-semibold">
//         Emergency Contact Information
//       </h2>
//       <div className="grid w-full gap-y-4 max-[410px]:mr-20">
//         <div className="flex items-center justify-between gap-12 lg:gap-12">
//           <p className="w-1/2 text-nowrap">Contact Name</p>
//           <p className="w-1/2 text-nowrap text-right">{contact.contactName}</p>
//         </div>

//         <div className="flex items-center justify-between gap-12 lg:gap-12">
//           <p className="w-1/2 text-nowrap">Relationship</p>
//           <p className="w-1/2 text-nowrap text-right">{contact.relationship}</p>
//         </div>

//         <div className="flex items-center justify-between gap-12 lg:gap-12">
//           <p className="w-1/2 text-nowrap">Phone Number</p>
//           <p className="w-1/2 text-nowrap text-right">{contact.phoneNumber}</p>
//         </div>

//         {contact.alternatePhone && (
//           <div className="flex items-center justify-between gap-12 lg:gap-12">
//             <p className="w-1/2 text-nowrap">Alternate Phone</p>
//             <p className="w-1/2 text-nowrap text-right">
//               {contact.alternatePhone}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmergencyContactInfo;
