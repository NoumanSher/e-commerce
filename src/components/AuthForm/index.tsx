// import { logIn , logOut} from "@/app/actions/auth";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useStore } from "@/Context/storeContext";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { useSocialAuth } from "@/hooks/useSocialAuth";

interface FormField {
  name: string;
  type: string;
  placeholder: string;
}
interface AuthFormProps {
  formType: "login" | "register"; // Define allowed values
  initialValues: { [key: string]: any }; // Shape of the form's initial values
  validationSchema: Yup.ObjectSchema<any>; // Validation schema from Yup
  onSubmit: any; // write correct type
  buttonText: string; // Text for the submit button
  fields: FormField[]; // Array of form fields to render
}

interface FormField {
  name: string;
  type: string;
  placeholder: string;
  inputMode?: string; // Optional input mode
  prefix?: string; // Optional prefix for field
}

interface AuthFormProps {
  formType: "login" | "register";
  initialValues: { [key: string]: any };
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: any; // Correct onSubmit type
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

  const { setActiveTab } = useStore();
  const { handleGoogleLogin, handleLinkedInLogin } = useSocialAuth();

  return (
    <div className="flex items-center justify-center">
      <div className=" w-full max-w-xl">
        {/* <h2 className="text-lg font-medium mb-6 text-gray-900">
          {formType.toUpperCase()}
        </h2> */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {fields.map((field, index) => (
                <div className="mb-4" key={index}>
                  <div className="relative flex items-center">
                    <Field
                      placeholder={field.placeholder}
                      type={field.type}
                      name={field.name}
                      id={field.name}
                      inputMode={field.inputMode}
                      className={`mt-1 block h-14 w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 `}
                    />
                  </div>
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              ))}

              <div className="mb-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 h-16 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleLinkedInLogin}
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#0077b5] hover:bg-[#006097]"
                >
                  <FaLinkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </button>
              </div>

              <div className="text-center text-sm">
                <p className="text-gray-900">
                  {formType === "login"
                    ? "No account yet?"
                    : "Have an account?"}{" "}
                  <a
                    href="#"
                    className="font-medium underline text-black hover:text-red-500"
                  >
                    {formType === "login" ? (
                      <span onClick={() => setActiveTab("register")}>
                        Create an account
                      </span>
                    ) : (
                      <span onClick={() => setActiveTab("login")}>Login</span>
                    )}
                  </a>
                </p>
              </div>
            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
};

export default AuthForm;
