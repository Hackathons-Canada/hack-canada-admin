import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import UserRoleModal from "@/components/UserRoleModal";
import { UserRoleModalTrigger } from "@/components/search/UserRoleModalTrigger";
import { UserStatusBadge } from "@/components/search/UserStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type User } from "@/lib/db/schema";

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
            <TableHead className="w-[50px] py-4"></TableHead>
            <TableHead className="py-4 font-semibold">Name</TableHead>
            <TableHead className="py-4 font-semibold">Email</TableHead>
            <TableHead className="py-4 font-semibold">Role</TableHead>
            <TableHead className="py-4 font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell className="text-center">
                <Link
                  href={`/users/${user.id}`}
                  prefetch={false}
                  className="inline-block rounded-md p-1 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <ExternalLinkIcon size={18} />
                </Link>
              </TableCell>
              <TableCell className="py-4 font-medium">{user.name}</TableCell>
              <TableCell className="py-4">{user.email}</TableCell>
              <TableCell className="py-4">
                <UserRoleModal
                  userId={user.id}
                  name={user.name}
                  email={user.email}
                  role={user.role as UserRole}
                >
                  <UserRoleModalTrigger role={user.role as UserRole} />
                </UserRoleModal>
              </TableCell>
              <TableCell className="py-4">
                <UserStatusBadge
                  status={user.applicationStatus as ApplicationStatus}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
