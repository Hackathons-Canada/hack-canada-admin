import Container from "@/components/Container";
import React from "react";
import PaginationControls from "@/components/PaginationControls";
import PageBanner from "@/components/PageBanner";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";
import { UsersTable } from "@/components/UsersTable";
import { UsersStats } from "@/components/UsersStats";
import { UsersSearchControls } from "@/components/UsersSearchControls";
import { getUsers } from "@/data/users-page";

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("https://app.hackcanada.org");
  }

  const { users, totalUsers, start, params } = await getUsers({
    page: searchParams["page"] as string,
    perPage: searchParams["perPage"] as string,
    role: searchParams["role"] as string,
    name: searchParams["name"] as string,
    email: searchParams["email"] as string,
    status: searchParams["status"] as string,
  });

  return (
    <Container className="space-y-10">
      <PageBanner
        subheading="A list of all users in the system. Manage user roles and permissions here."
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <div className="space-y-10">
        <UsersSearchControls />

        <section aria-label="Users List" className="space-y-6">
          <UsersStats
            totalUsers={totalUsers}
            start={start}
            displayedUsers={users.length}
          />

          <UsersTable users={users} />

          {users.length ? (
            <PaginationControls
              totalNumOfUsers={totalUsers}
              search={params}
              table="users"
              className="mx-auto mt-8 max-w-lg rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md"
            />
          ) : null}
        </section>
      </div>
    </Container>
  );
};

export default UsersPage;
