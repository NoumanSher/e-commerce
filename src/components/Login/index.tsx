"use client";
import React, { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import * as Yup from "yup";
import { LogInPayload } from "./service";
import { useLogIn } from "./query";
import { useStore } from "@/Context/storeContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();

  const searchParams = useSearchParams(); // Access query parameters
  const callbackUrl = searchParams.get("callbackUrl"); // Get 'callbackUrl' param
  const { mutate, isPending, data, isSuccess } = useLogIn();
  const Url = callbackUrl || "/";
  useEffect(() => {
    if (isSuccess) router.push(Url);
  }, [Url, isSuccess, router]);

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
