import { useMutation } from "@tanstack/react-query";
import { RegisterPayload, RegisterResponse, registerUser } from "./service";
import { toast } from "react-toastify";

interface CustomError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useRegister = () => {
  return useMutation<RegisterResponse, CustomError, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data);
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
