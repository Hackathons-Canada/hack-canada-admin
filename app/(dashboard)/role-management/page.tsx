import Container from "@/components/Container";
import AdminUsersTable from "@/components/AdminUsersTable";
import { getAdminUsers } from "@/data/user";
import PageBanner from "@/components/PageBanner";
import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";

const RoleManagementPage = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("https://app.hackcanada.org/login");
  }

  const adminUsersData = await getAdminUsers();

  const adminUsers = adminUsersData.map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return (
    <Container>
      <PageBanner
        heading="Role Management"
        className="mb-4 md:mb-8"
        subheading="Get an overview of all the users with special roles like Admin and Organizer."
      />
      <AdminUsersTable users={adminUsers} />
    </Container>
  );
};

export default RoleManagementPage;
