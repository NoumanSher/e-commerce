"use client";
import React, { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import * as z from "zod";
import { LoginPayload } from "@/services/authService";
import { useAppUIContext } from "@/context/AppUIContext";
import { useLogin } from "@/hooks/mutations/useAuthMutations";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  from?: string;
};

const loginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .min(1, "Username or Email is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm({ from }: LoginFormProps) {
  const router = useRouter();
  const { activeTab, setActiveTab, setIsAuthModalOpen } = useAppUIContext();

  const {
    mutate: loginUser,
    isPending,
    isError,
    error,
    isSuccess,
  } = useLogin();

  useEffect(() => {
    const el = document.getElementById('pobtn');
    if (isSuccess) {
      setIsAuthModalOpen(false);
      if (from === 'checkout' || from === 'order-summary') {
        el?.click()
      } else if (from !== 'productDetail' && from !== 'cart') {
        router.push("/");
      }
    }
  }, [from, isSuccess, router, setIsAuthModalOpen]);

  const handleSubmit = (values: LoginPayload) => {
    loginUser(values);
  };

  return (
    <AuthForm
      formType="login"
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
      isLoading={isPending}
      buttonText={isPending ? "LOG IN..." : "LOG IN"}
      fields={[
        { name: "email", type: "text", placeholder: "User or Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
    />
  );
}
