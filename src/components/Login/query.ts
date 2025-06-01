import { useMutation } from "@tanstack/react-query";
import { LogInPayload, LogInResponse, logInUser } from "./service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useStore } from "@/Context/storeContext";
interface CustomError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useLogIn = () => {
  const { setIsLogIn, setUserId } = useStore();
  const router = useRouter();
  return useMutation<LogInResponse, CustomError, LogInPayload>({
    mutationFn: logInUser,
    onSuccess: (data) => {
      
      setIsLogIn(data.token);
      setUserId(data.data._id);
      toast.success(data.message);
      router.push("/");
    },
    onError: (error) => {
      toast.error(`${error.response?.data?.message}`);
      console.error("Registration failed:", error.response?.data?.message);
    },
  });
};
