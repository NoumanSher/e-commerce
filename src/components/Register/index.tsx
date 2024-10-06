'use client'
import React from 'react'
import * as Yup from "yup";

import AuthForm from '../AuthForm';
const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email address is required'),
  });
export default function Register() {
    return (
        <AuthForm
          formType="register"
          initialValues={{ email: '' }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => console.log(values)}
          buttonText="REGISTER"
          fields={[
            { name: 'email', type: 'email', placeholder: 'Email address' },
          ]}
        />
      );
}
