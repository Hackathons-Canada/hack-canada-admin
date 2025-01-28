import Container from "@/components/Container";
import React from "react";
import { getUsersSearch, getNumUsersSearch } from "@/data/user";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import PaginationControls from "@/components/UsersTable/PaginationControls";
import PageBanner from "@/components/PageBanner";
import DownloadOptions from "@/components/DownloadOptions";
import { UserSearch } from "@/components/UserSearch";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserStatusBadge } from "@/components/UserSearch/UserStatusBadge";

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("https://app.hackcanada.org");
  }

  const page = searchParams["page"] ?? "1";
  const perPage = searchParams["perPage"] ?? "50";
  const role = String(searchParams["role"] ?? "all");
  const firstName = String(searchParams["firstName"] ?? "");
  const lastName = String(searchParams["lastName"] ?? "");
  const email = String(searchParams["email"] ?? "");
  const status = String(searchParams["status"] ?? "all");

  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  const params = new URLSearchParams();
  params.append("role", role.toString());
  params.append("firstName", firstName.toString());
  params.append("lastName", lastName.toString());
  params.append("email", email.toString());
  params.append("status", status.toString());

  const totalNumOfUsers: number =
    (await getNumUsersSearch(role, firstName, lastName, email, status)) ?? 0;
  const users = await getUsersSearch(
    role,
    firstName,
    lastName,
    email,
    status,
    start,
  );

  return (
    <Container className="space-y-8">
      <PageBanner subheading="List of all users in the database. Note that these are just accounts created with us and not necessarily people who have applied to the hackathon. To view a list of hackers, navigate to the Hackers page." />

      <div className="space-y-6">
        <DownloadOptions entity="users" />
        <UserSearch />
      </div>

      <div className="space-y-4">
        {users.length ? (
          <p className="text-sm text-muted-foreground max-md:text-center">
            Displaying users {start + 1} - {start + users.length} from{" "}
            {totalNumOfUsers} users
          </p>
        ) : (
          <p className="text-sm text-muted-foreground max-md:text-center">
            No users match the search criteria.
          </p>
        )}

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="text-center">
                    <Link
                      href={`/users/${user.id}`}
                      prefetch={false}
                      className="inline-block transition-colors hover:text-primary"
                    >
                      <ExternalLinkIcon size={18} />
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.applicationStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {users.length ? (
          <PaginationControls
            totalNumOfUsers={totalNumOfUsers}
            search={params.toString()}
            table="users"
            className="mx-auto mt-6 max-w-lg rounded-lg border bg-card p-2"
          />
        ) : null}
      </div>
    </Container>
  );
};

export default UsersPage;
