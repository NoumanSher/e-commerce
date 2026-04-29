import { useMutation } from "@tanstack/react-query";
import { authService, LoginPayload, AuthResponse } from "@/services/authService";
import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
interface CustomError extends Error {
  response?: {
    message?: string;
  };
}

export const useLogIn = () => {
  const { setAuthToken, setUserId, setUserName } = useAuth();
  return useMutation<AuthResponse, CustomError, LoginPayload>({
    mutationFn: authService.loginUser,
    onSuccess: (data) => {
      localStorage.setItem('refreshToken', data.refreshToken);
      setAuthToken(data.token);
      setUserId(data.data._id);
      setUserName(data.data.username);
      toast.success(data.message);
    },
    onError: (error) => {

      toast.error(`${error.response?.message}`);
      console.error("Registration failed:", error.response?.message);
    },
  });
};
