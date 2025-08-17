"use client";
import React, { use, useEffect } from "react";
import * as Yup from "yup";
import { useRegister } from "./query";
import { RegisterPayload } from "./service";
import AuthForm from "../AuthForm";
import { useRouter, useSearchParams } from "next/navigation";
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  username: Yup.string().required("Username is required"),
  mobilePhone: Yup.string()
    .matches(/^(?:\+923\d{9}|03\d{9})$/, "Enter valid phone number +923XXXXXXXXX  or 03XXXXXXXXX")
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
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const { mutate, isPending, isSuccess } = useRegister();
  const callbackUrl = searchParams.get("callbackUrl"); // Get 'callbackUrl' param
  const Url = callbackUrl || "/";
  useEffect(() => {
    if (isSuccess) router.push("/login?callbackUrl=" + Url);
  }, [Url, isSuccess, router]);

  const handleSubmit = (values: RegisterPayload) => {
    let phone = values.mobilePhone.trim();

    // If starts with 03 -> convert to +923
    if (/^03\d{9}$/.test(phone)) {
      phone = "+92" + phone.slice(1);
    }

    // If starts with 92 without + -> fix it
    if (/^92\d{10}$/.test(phone)) {
      phone = "+" + phone;
    }

    

    values.mobilePhone = phone; // normalized value
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
