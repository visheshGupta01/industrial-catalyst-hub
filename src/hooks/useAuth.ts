import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { authKeys } from "@/lib/queryKeys";
import { tokenStore } from "@/lib/store/auth";

export function useAuth() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    enabled: !!tokenStore.get(),
    staleTime: Infinity,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: async () => {
      await queryClient.cancelQueries();

      queryClient.clear();

      tokenStore.clear();
    },
  });
}