import { useMutation } from "@tanstack/react-query";
import { RegisterPayload, RegisterResponse, registerUser } from "./service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
interface CustomError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useRegister = () => {
    const router = useRouter()
  return useMutation<RegisterResponse, CustomError, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message);
      

    },
    onError: (error) => {
      if (error.response?.data?.message) {
         toast.warning(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Registration failed:", error);
    },
  });
};
