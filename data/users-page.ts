import { getUsersSearch, getNumUsersSearch } from "@/data/user";

import { type User } from "@/lib/db/schema";

interface GetUsersProps {
  page?: string;
  perPage?: string;
  role?: string;
  name?: string;
  email?: string;
  status?: string;
}

export const getUsers = async ({
  page = "1",
  perPage = "50",
  role = "all",
  name = "",
  email = "",
  status = "all",
}: GetUsersProps = {}) => {
  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  const params = new URLSearchParams();
  params.append("role", role.toString());
  params.append("name", name.toString());
  params.append("email", email.toString());
  params.append("status", status.toString());

  const totalUsers = (await getNumUsersSearch(role, name, email, status)) ?? 0;
  const users = (await getUsersSearch(
    role,
    name,
    email,
    status,
    start,
  )) as User[];

  return {
    users,
    totalUsers,
    start,
    params: params.toString(),
  };
};
