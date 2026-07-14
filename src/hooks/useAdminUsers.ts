import { adminUserApi } from "@/lib/api/users";
import { adminUserKeys } from "@/lib/queryKeys";
import { UserFilters } from "@/types/adminUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAdminUsers(filters: UserFilters) {
  return useQuery({
    queryKey: [...adminUserKeys.all, filters],
    queryFn: () => adminUserApi.getUsers(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => adminUserApi.getUser(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof adminUserApi.updateUser>[1];
    }) => adminUserApi.updateUser(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(variables.id),
      });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminUserApi.updateStatus(id, isActive),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUserApi.deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
      });
    },
  });
}
