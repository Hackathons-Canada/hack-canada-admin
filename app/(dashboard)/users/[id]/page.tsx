import { getCurrentUser } from "@/auth";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import UserActions from "@/components/UserActions";
import UserInfo from "@/components/UserInfo";
import { getUserById } from "@/data/user";
import { redirect } from "next/navigation";
import React from "react";

const UserPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("https://app.hackcanada.org/login");
  }

  const user = await getUserById(id);

  if (!user) {
    return null;
  }

  return (
    <Container className="space-y-6 md:space-y-8">
      <PageBanner
        name={user.name.split(" ")[0]}
        subheading={`More information on the user. This is a dedicated page for users of all kinds as long as they have an account with us.`}
        backButton
      />
      <div className="flex space-y-6 max-xl:flex-col md:space-y-8 xl:space-x-8 xl:space-y-0">
        <div className="w-full space-y-6 md:space-y-8 xl:max-w-screen-md">
          <UserInfo user={user} />
        </div>
        {user && (
          <UserActions
            id={user.id}
            name={user.name.split(" ")[0]}
            email={user.email}
            status={user.applicationStatus as ApplicationStatus}
          />
        )}
      </div>
    </Container>
  );
};

export default UserPage;
