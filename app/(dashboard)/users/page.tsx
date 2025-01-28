import Container from "@/components/Container";
import React from "react";
import { getUsersSearch, getNumUsersSearch } from "@/data/user";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import PaginationControls from "@/components/UsersTable/PaginationControls";
import PageBanner from "@/components/PageBanner";
import DownloadOptions from "@/components/DownloadOptions";
import { UserSearch } from "@/components/UserSearch";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

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
  const role = searchParams["role"] ?? "all";
  const firstName = searchParams["firstName"] ?? "";
  const lastName = searchParams["lastName"] ?? "";

  const start = (Number(page) - 1) * Number(perPage); //the 50*(page-1)th user
  const end = start + Number(perPage);

  const params = new URLSearchParams();
  params.append("role", role.toString());
  params.append("firstName", firstName.toString());
  params.append("lastName", lastName.toString());

  // Getting a list of RESULTS_PER_PAGE users, offset by "start"
  const totalNumOfUsers: number =
    (await getNumUsersSearch(role, firstName, lastName)) ?? 0;
  const users = await getUsersSearch(role, firstName, lastName, start);

  return (
    <Container className="space-y-6 md:space-y-8">
      <PageBanner subheading="List of all users in the database. Note that these are just accounts created with us and not necessarily people who have applied to the hackathon. To view a list of hackers, navigate to the Hackers page." />
      <DownloadOptions entity="users" />
      <UserSearch />
      <div className="space-y-2">
        {users.length ? (
          <p className="max-md:text-center max-md:text-sm">
            Displaying users {start + 1} - {start + users.length} from{" "}
            {totalNumOfUsers} users
          </p>
        ) : (
          <p className="max-md:text-center max-md:text-sm">
            No users match the search criteria.
          </p>
        )}
        {/* <PaginationControls
          totalNumOfUsers={totalNumOfUsers}
          table={"users"}
          search={params.toString()}
        /> */}

        <table className="w-full">
          <thead className="border-2 text-sm">
            <tr>
              <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="flexbox align-middle">
                <td className="overflow-x-hidden border-2 border-inherit px-3 py-2">
                  <Link
                    href={`/users/${user.id}`}
                    prefetch={false}
                    className=""
                  >
                    <ExternalLinkIcon size={20} className="mx-auto" />
                  </Link>
                </td>
                <td className="overflow-x-hidden border-2 border-inherit px-3 py-2">
                  {user.name.split(" ")[0]}
                </td>
                <td className="overflow-x-hidden border-2 border-inherit px-3 py-2">
                  {user.name.split(" ")[1]}
                </td>
                <td className="overflow-x-hidden border-2 border-inherit px-3 py-2">
                  {user.email}
                </td>
                <td className="overflow-x-hidden border-2 border-inherit px-3 py-2">
                  {user.role}
                </td>
                <td
                  className={
                    "overflow-x-hidden border-2 border-inherit px-3 py-2"
                  }
                >
                  <p
                    className={
                      user.applicationStatus === "pending" ||
                      user.applicationStatus === "waitListed"
                        ? "text-amber-500"
                        : user.applicationStatus === "accepted"
                          ? "text-emerald-500"
                          : user.applicationStatus === "rejected"
                            ? "text-red-500"
                            : ""
                    }
                  >
                    {user.applicationStatus}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length ? (
          <PaginationControls
            totalNumOfUsers={totalNumOfUsers}
            search={params.toString()}
            table={"users"}
            className="max-w-lg rounded-md border bg-zinc-100 py-2.5 dark:bg-zinc-950 max-md:mx-auto md:mt-8"
          />
        ) : null}
      </div>
    </Container>
  );
};

export default UsersPage;
