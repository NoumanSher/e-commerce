import { useMutation } from "@tanstack/react-query";
import { authService, LogInPayload, LogInResponse } from "@/services/authService";
import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
import { useStore } from "@/Context/storeContext";
interface CustomError extends Error {
  response?: {
    message?: string;
  };
}

export const useLogIn = () => {
  const { setAuthToken, setUserId, setUserName } = useStore();
  return useMutation<LogInResponse, CustomError, LogInPayload>({
    mutationFn: authService.logInUser,
    onSuccess: (data) => {

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
