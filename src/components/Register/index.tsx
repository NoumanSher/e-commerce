"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { useRegister } from "@/hooks/mutations/useAuthMutations";
import { RegisterPayload } from "@/services/authService";
import AuthForm from "../AuthForm";
import { useRouter } from "next/navigation";
import { useAppUIContext } from "@/context/AppUIContext";

const registerSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email address is required"),
  username: z.string().min(1, "Username is required"),
  mobilePhone: z.string()
    .regex(/^(?:\+923\d{9}|03\d{9})$/, "Enter valid phone number +923XXXXXXXXX or 03XXXXXXXXX")
    .min(1, "Phone number is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
    .min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type RegisterFormProps = {
  from?: string;
};

export default function Register({ from }: RegisterFormProps) {
  const router = useRouter();
  const { setIsAuthModalOpen } = useAppUIContext();

  const { mutate, isPending, isSuccess } = useRegister();

  useEffect(() => {
    const el = document.getElementById('pobtn');
    if (isSuccess) {
      setIsAuthModalOpen(false);
      if (from === 'checkout' || from === 'order-summary') {
        el?.click();
      } else if (from !== 'productDetail' && from !== 'cart') {
        router.push("/");
      }
    }
  }, [from, isSuccess, router, setIsAuthModalOpen]);

  const handleSubmit = (values: RegisterPayload) => {
    let phone = values.mobilePhone.trim();

    if (/^03\d{9}$/.test(phone)) {
      phone = "+92" + phone.slice(1);
    }

    if (/^92\d{10}$/.test(phone)) {
      phone = "+" + phone;
    }

    values.mobilePhone = phone;
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
      validationSchema={registerSchema}
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
          inputMode: "numeric",
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
