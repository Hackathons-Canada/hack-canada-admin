import React from "react";
import Container from "@/components/Container";

const RoleManagementLoading = () => {
  return (
    <Container>
      <h1 className="mb-4 text-2xl font-bold">Role Management</h1>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-zinc-800 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } animate-pulse`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default RoleManagementLoading;
