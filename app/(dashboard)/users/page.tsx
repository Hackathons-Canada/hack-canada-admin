import Container from "@/components/Container";
import React from "react";
import { getUsersSearch, getNumUsersSearch } from "@/data/user";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import PaginationControls from "@/components/PaginationControls";
import PageBanner from "@/components/PageBanner";
import DownloadOptions from "@/components/DownloadOptions";
import { UserSearch } from "@/components/search/UserSearch";
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
import { UserStatusBadge } from "@/components/search/UserStatusBadge";
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
  const name = String(searchParams["name"] ?? "");
  const email = String(searchParams["email"] ?? "");
  const status = String(searchParams["status"] ?? "all");

  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  const params = new URLSearchParams();
  params.append("role", role.toString());
  params.append("name", name.toString());
  params.append("email", email.toString());
  params.append("status", status.toString());

  const totalNumOfUsers: number =
    (await getNumUsersSearch(role, name, email, status)) ?? 0;
  const users = await getUsersSearch(role, name, email, status, start);

  return (
    <Container className="space-y-10">
      <PageBanner
        subheading="List of all users in the database. Note that these are just accounts created with us and not necessarily people who have applied to the hackathon. To view a list of hackers, navigate to the Hackers page."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <main className="space-y-10">
        <section aria-label="Search and Download Controls">
          <div className="flex items-start justify-between gap-8 max-2xl:flex-col-reverse">
            <div className="w-full flex-1">
              <UserSearch />
            </div>
            <div className="w-full shrink-0 lg:w-auto">
              <DownloadOptions entity="users" />
            </div>
          </div>
        </section>

        <section aria-label="Users List" className="space-y-6">
          {users.length ? (
            <p className="text-sm font-medium text-muted-foreground max-md:text-center">
              Displaying users {start + 1} - {start + users.length} from{" "}
              <span className="text-foreground">{totalNumOfUsers}</span> users
            </p>
          ) : (
            <p className="text-sm font-medium text-muted-foreground max-md:text-center">
              No users match the search criteria.
            </p>
          )}

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
                    <TableCell className="py-4 font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="py-4">{user.email}</TableCell>
                    <TableCell className="py-4">
                      <span className="capitalize">{user.role}</span>
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

          {users.length ? (
            <PaginationControls
              totalNumOfUsers={totalNumOfUsers}
              search={params.toString()}
              table="users"
              className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md"
            />
          ) : null}
        </section>
      </main>
    </Container>
  );
};

export default UsersPage;
