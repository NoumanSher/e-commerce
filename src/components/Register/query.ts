import { useMutation } from "@tanstack/react-query";
import { RegisterPayload, RegisterResponse, registerUser } from "./service";

export const useRegister = () => {
    return useMutation<RegisterResponse, Error, RegisterPayload>({
      mutationFn: (registerUser),
      onSuccess: (data) => {
        console.log("Registration successful:", data);
      },
      onError: (error) => {
        debugger
        console.error("Registration failed:", error);
      },
    });
  };
