
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
interface FormField {
  name: string;
  type: string;
  placeholder: string;
}
interface AuthFormProps {
  formType: 'login' | 'register'; // Define allowed values
  initialValues: { [key: string]: any }; // Shape of the form's initial values
  validationSchema: Yup.ObjectSchema<any>; // Validation schema from Yup
  onSubmit: (values: { [key: string]: any }) => void; // Function to handle form submission
  buttonText: string; // Text for the submit button
  fields: FormField[]; // Array of form fields to render
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  initialValues,
  validationSchema,
  onSubmit,
  buttonText,
  fields,
}) => {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className=" p-8 w-full max-w-xl">
        <h2 className="text-lg font-medium mb-6 text-gray-900">{formType.toUpperCase()}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {fields.map((field, index) => (
                <div className="mb-4" key={index}>
                  <Field
                    placeholder={field.placeholder}
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    className="mt-1 block h-14 w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  />
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
                  disabled={isSubmitting}
                  className="w-full py-2 h-16 px-4 border border-transparent  text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {buttonText}
                </button>
              </div>

              {/* Conditional render for registration */}
              {formType === 'register' && (
                <p className="text-sm text-center text-gray-500 mb-4">
                  A password will be sent to your email address.
                </p>
              )}

              <div className="text-center text-sm">
                <p className="text-gray-900">
                  {formType === 'login' ? 'No account yet?' : 'Have an account?'}{' '}
                  <a href="#" className="font-medium underline text-black hover:text-red-500">
                    {formType === 'login' ?  <span onClick={() => router.push('/pages/register')}>Create an account</span> : <span onClick={() => router.push('/pages/login')}>Login</span>}
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
