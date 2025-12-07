"use client";
import React, { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import * as Yup from "yup";
import { LogInPayload } from "./service"; 
import { useLogIn } from "./query";
import { useRouter } from "next/navigation";
import { useStore } from "@/Context/storeContext";

type LoginFormProps = {
  from?: string;
};

export default function LoginForm({ from }: LoginFormProps) {
  const router = useRouter();
  const { setIsAuthModalOpen } = useStore();

  const { mutate, isPending, isSuccess } = useLogIn();
  useEffect(() => {
    const el =  document.getElementById('pobtn');
    if (isSuccess) {
      if(from === 'checkout' || from === 'order-summary' ){
        setIsAuthModalOpen(false);
        el?.click()
        return;
      }
      setIsAuthModalOpen(false);
      router.push("/");
    }
  }, [from, isSuccess, router, setIsAuthModalOpen]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Username or Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values: LogInPayload) => {
    mutate(values);
  };

  return (
    <AuthForm
      formType="login"
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
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
