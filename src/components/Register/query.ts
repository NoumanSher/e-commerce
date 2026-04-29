import { useMutation } from "@tanstack/react-query";
import { authService, RegisterPayload, AuthResponse } from "@/services/authService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface CustomError extends Error {
  response?: {
    message?: string;
  };
}

export const useRegister = () => {
  const { setAuthToken, setUserId, setUserName } = useAuth();

  const router = useRouter();
  return useMutation<AuthResponse, CustomError, RegisterPayload>({
    mutationFn: authService.registerUser,
    onSuccess: (data) => {
      localStorage.setItem('refreshToken', data.refreshToken);

      setAuthToken(data.token);
      setUserId(data.data._id);
      setUserName(data.data.username);
      toast.success(data.message);
    },
    onError: (error) => {
      if (error.response?.message) {
        toast.warning(error.response?.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Registration failed:", error);
    },
  });
};
