'use client'
import React from "react";
import AuthForm from "@/components/AuthForm";
import * as Yup from "yup";
import { LogInPayload } from "./service";
import { useLogIn } from "./query";

export default function LoginForm() {
  const { mutate, isPending } = useLogIn();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Username or Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values: LogInPayload) => {
    debugger;
    console.log(values);
    mutate(values);
  };

  return (
    <AuthForm
      formType="login"
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
      isLoading={isPending}
      buttonText={isPending ? 'LOG IN...' : "LOG IN"}
      fields={[
        { name: "email", type: "text", placeholder: "User or Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
    />
  );
}
