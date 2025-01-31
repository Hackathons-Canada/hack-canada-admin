import { cn } from "@/lib/utils";
import React from "react";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AdminUsersTableProps {
  users: AdminUser[];
}

const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md dark:shadow-zinc-800">
      <table
        className="min-w-full bg-white dark:bg-zinc-800"
        aria-label="Admin Users Table"
      >
        <thead>
          <tr className="bg-zinc-100 dark:bg-zinc-700">
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Email
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-600">
          {users.map((user, index) => (
            <tr
              key={index}
              className={cn(
                {
                  "bg-zinc-50 dark:bg-zinc-800": index % 2 === 0,
                  "bg-white dark:bg-zinc-900": index % 2 !== 0,
                },
                "transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-700",
              )}
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-800 dark:text-zinc-200">
                {user.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-800 dark:text-zinc-200">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
