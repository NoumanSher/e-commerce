import { useMutation } from "@tanstack/react-query";
import { authService, RegisterPayload, RegisterResponse } from "@/services/authService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useStore } from "@/Context/storeContext";

interface CustomError extends Error {
  response?: {
    message?: string;
  };
}

export const useRegister = () => {
  const { setAuthToken, setUserId, setUserName } = useStore();

  const router = useRouter();
  return useMutation<RegisterResponse, CustomError, RegisterPayload>({
    mutationFn: authService.registerUser,
    onSuccess: (data) => {
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
