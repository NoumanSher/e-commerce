import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PakShipper",
  description: "Read the rules, guidelines, and terms for using the PakShipper store.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 md:px-8">
      <div className="max-w-4xl w-full bg-white shadow-sm p-8 md:p-12 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: April 7, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing and using PakShipper, you agree to be bound by these Terms of Service. If you disagree
              with any part of the terms, you must not access or use our services. These terms apply to all visitors,
              users, and others who access or use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. User Accounts</h2>
            <p>
              When you create an account with us, including authenticating via a third-party like Google, you must provide
              accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms,
              which may result in immediate termination of your account on our service.
            </p>
            <p className="mt-2">
              You are responsible for safeguarding the password or authentication method that you use to access the service
              and for any activities or actions under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Products and Purchases</h2>
            <p>
              We make every effort to display as accurately as possible the colors and images of our products. However,
              we cannot guarantee that your computer monitor&apos;s display of any color will be accurate. We reserve the
              right to limit the sales of our products or Services to any person, geographic region, or jurisdiction.
            </p>
            <p className="mt-2">
              All descriptions of products or product pricing are subject to change at anytime without notice, at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of
              PakShipper and its licensors. Our trademarks and trade dress may not be used in connection with any product or
              service without the prior written consent of PakShipper.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Links To Other Web Sites</h2>
            <p>
              Our Service may contain links to third-party web sites or services that are not owned or controlled by
              PakShipper. We have no control over, and assume no responsibility for, the content, privacy policies, or practices
              of any third-party web sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p>
              In no event shall PakShipper, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or
              inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at: <br />
              <strong>Email:</strong> pakshipperstore@gmail.com <br />
              <strong>Phone:</strong> +923176872900
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
