import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginPayload, RegisterPayload, AuthResponse } from "@/services/authService";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import type { ApiError } from "@/lib/apiClient";

export const useLogin = () => {
  const { setAuthToken, setUserId, setUserName } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginPayload>({
    mutationFn: authService.loginUser,
    onSuccess: (data) => {
      storageApi.set(STORAGE_KEYS.refreshToken, data.refreshToken);
      setAuthToken(data.token);
      setUserId(data.data._id);
      setUserName(data.data.username);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const { setAuthToken, setUserId, setUserName } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterPayload>({
    mutationFn: authService.registerUser,
    onSuccess: (data) => {
      storageApi.set(STORAGE_KEYS.refreshToken, data.refreshToken);
      setAuthToken(data.token);
      setUserId(data.data._id);
      setUserName(data.data.username);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.warning(error.message || "Registration failed");
    },
  });
};
