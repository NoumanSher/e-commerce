"use client";
import React from "react";
import * as Yup from "yup";
import { useRegister } from "./query";
import { RegisterPayload } from "./service";
import AuthForm from "../AuthForm";

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  username: Yup.string().required("Username is required"),
  mobilePhone: Yup.string()
    .matches(/^\+92\d{9,10}$/, "Phone number must start with +92 and be valid")
    .required("Phone number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const { mutate, isPending } = useRegister();

  const handleSubmit = (values: RegisterPayload) => {
    mutate(values);
  };

  return (
    <AuthForm
      formType="register"
      initialValues={{
        email: "",
        username: "",
        mobilePhone: "+92",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleSubmit}
      isLoading={isPending}
      buttonText={isPending ? "Registering..." : "REGISTER"}
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "username", type: "text", placeholder: "User Name" },
        {
          name: "mobilePhone",
          type: "numeric",
          placeholder: "Phone Number",
          inputMode: "numeric", // Add numeric input mode
          prefix: "+92", // Add prefix
        },
        { name: "password", type: "password", placeholder: "Password" },
        {
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm Password",
        },
      ]}
    />
  );
}
