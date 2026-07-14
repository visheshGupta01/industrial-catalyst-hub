import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Eye, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatINR } from "@/lib/format";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useState } from "react";
import { StatusBadge } from "./admin.index";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: UsersAdmin,
});

function UsersAdmin() {
  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    isActive: undefined,
    role: "",
    limit: 10,
  });

  const { data, isLoading } = useAdminUsers(filters);

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const navigate = useNavigate();

  if (isLoading) {
    return <AdminLayout title="Users">Loading...</AdminLayout>;
  }

  return (
    <AdminLayout
      title="Users"
      subtitle="Manage registered users"
      actions={
        <button className="inline-flex items-center gap-1.5 border border-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      }
    >
      <div className="border border-border bg-card">
        <div className="border-b border-border p-4">
          <input
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                keyword: e.target.value,
                page: 1,
              }))
            }
            placeholder="Search user or email..."
            className="w-full max-w-md border border-input bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <select
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                role: e.target.value,
                page: 1,
              }))
            }
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.isActive === undefined ? "" : String(filters.isActive)}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                isActive: e.target.value === "" ? undefined : e.target.value === "true",
                page: 1,
              }))
            }
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              No users found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 text-left font-semibold">User</th>
                  <th className="px-5 py-3 text-left font-semibold">Role</th>
                  <th className="px-5 py-3 text-left font-semibold">Email</th>
                  <th className="px-5 py-3 text-right font-semibold">Orders</th>
                  <th className="px-5 py-3 text-right font-semibold">Total Spending</th>
                  <th className="px-5 py-3 text-right font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-border last:border-0 hover:bg-surface"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {user.name
                            .trim()
                            .split(/\s+/)
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="font-semibold">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-4 text-right font-semibold">{user.orderCount}</td>
                    <td className="px-5 py-4 text-right font-bold">
                      {formatINR(user.totalSpending)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            window.location.href = `mailto:${user.email}`;
                          }}
                          className="border border-border p-1.5 hover:border-primary hover:text-primary"
                          aria-label="Email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="border border-border p-1.5 hover:border-primary hover:text-primary"
                          aria-label="View"
                          onClick={() => {
                            navigate({
                              to: "/admin/users/$id",
                              params: {
                                id: user._id,
                              },
                            });
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
