"use client";
import React from "react";
import * as Yup from "yup";
import { useRegister } from "./query";
import AuthForm from "../AuthForm";
import { RegisterPayload } from "./service";
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
});

// Array of form fields to render
type value = string | number

export default function Register() {
  const {mutate,isPending} = useRegister()
  const handleSubmit = (values: RegisterPayload) => {
    console.log(values);
    debugger;
    mutate(values)
  };
  return (
    <AuthForm
      formType="register"
      initialValues={{
        email: "",
        username: "",
        mobilePhone: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleSubmit}
      buttonText={isPending ? "Registering..." : "REGISTER"}
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "username", type: "text", placeholder: "User Name" },
        { name: "mobilePhone", type: "number", placeholder: "Phone Number" },
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
