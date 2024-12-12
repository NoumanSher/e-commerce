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
  const {setIsLogIn} = useStore()

  const router = useRouter();
  return useMutation< LogInResponse,CustomError,LogInPayload>({
    mutationFn: logInUser,
    onSuccess: (data) => {
      debugger
      setIsLogIn(data.token)
      toast.success(data.message);
      router.push("/");
    },
    onError: (error) => {
      debugger
      toast.error("An unexpected error occurred.");

      console.error("Registration failed:", error);
    },
  });
};
