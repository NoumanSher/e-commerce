import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppUIContext } from "@/context/AppUIContext";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { useSocialAuth } from "@/hooks/useSocialAuth";

interface FormField {
  name: string;
  type: string;
  placeholder: string;
  inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal";
  prefix?: string;
}

interface AuthFormProps {
  formType: "login" | "register";
  initialValues: FieldValues;
  validationSchema: z.ZodType<any>;
  onSubmit: (values: any) => void;
  buttonText: string;
  isLoading: boolean;
  fields: FormField[];
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  initialValues,
  validationSchema,
  onSubmit,
  buttonText,
  fields,
  isLoading,
}) => {
  const { setActiveTab } = useAppUIContext();
  const { handleGoogleLogin } = useSocialAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(validationSchema),
  });

  return (
    <div className="flex items-center justify-center">
      <div className=" w-full max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div className="mb-4" key={index}>
              <div className="relative flex items-center">
                <input
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  type={field.type}
                  id={field.name}
                  inputMode={field.inputMode}
                  className={`mt-1 block h-14 w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 ${errors[field.name] ? "border-red-500" : ""
                    }`}
                />
              </div>
              {errors[field.name] && (
                <div className="text-red-600 text-sm mt-1">
                  {errors[field.name]?.message as string}
                </div>
              )}
            </div>
          ))}

          <div className="mb-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 h-16 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {buttonText}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
              Google
            </button>
            {/* <button
              type="button"
              onClick={handleLinkedInLogin}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#0077b5] hover:bg-[#006097]"
            >
              <FaLinkedin className="h-5 w-5 mr-2" />
              LinkedIn
            </button> */}
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-900">
              {formType === "login" ? "No account yet?" : "Have an account?"}{" "}
              <button
                type="button"
                className="font-medium underline text-black hover:text-red-500"
                onClick={() => setActiveTab(formType === "login" ? "register" : "login")}
              >
                {formType === "login" ? "Create an account" : "Login"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
