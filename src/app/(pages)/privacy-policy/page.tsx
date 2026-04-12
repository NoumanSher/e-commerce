import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PakShipper",
  description: "Our Privacy Policy outlines how your data is collected, used, and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 md:px-8">
      <div className="max-w-4xl w-full bg-white shadow-sm p-8 md:p-12 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: April 7, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to PakShipper. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our
              e-commerce platform, use our services, or interact with us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
            <p className="mb-2">We may collect and process the following data about you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Identity Data (e.g., first name, last name, username).</li>
              <li>Contact Data (e.g., billing address, delivery address, email address, telephone numbers).</li>
              <li>Financial Data (e.g., payment card details, processed securely via our payment providers).</li>
              <li>Transaction Data (e.g., details about payments and other details of products you purchased).</li>
              <li>Profile Data (e.g., your username and password, purchases or orders made by you).</li>
              <li>Usage Data (e.g., information about how you use our website).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <p className="mb-2">We will only use your personal data when the law allows us to. Most commonly, we use it to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and deliver your order, including managing payments.</li>
              <li>Manage our relationship with you, such as notifying you of changes to terms or asking you to leave a review.</li>
              <li>Administer and protect our business and this website.</li>
              <li>Use data analytics to improve our website, products/services, marketing, and user relationships.</li>
              <li>Enable third-party authentication services, such as Google Login, to streamline your access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Services & Authentication</h2>
            <p>
              When you choose to securely authenticate via third-party providers (like Google), we receive limited 
              profile information required strictly for authentication and account creation purposes (e.g., email and name).
              We do not track or store your third-party passwords.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Data Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including the right to request access, correction, erasure, restriction, transfer, to object to processing, 
              to portability of data, and (where the lawful ground of processing is consent) to withdraw consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at: <br/>
              <strong>Email:</strong> pakshipperstore@gmail.com <br/>
              <strong>Phone:</strong> +923176872900
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
