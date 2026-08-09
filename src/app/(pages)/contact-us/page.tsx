"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactUsPage() {
  const { data: storeSettings } = useGetStoreSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activeTheme = storeSettings?.theme || "default";
  const isAqua = activeTheme === "aquamist";

  const contactUs = storeSettings?.contactUs;

  const pageTitle = contactUs?.title || "Get in Touch";
  const pageSubtitle = contactUs?.subtitle || "We'd love to hear from you. Reach out anytime with questions or support!";
  const phone = contactUs?.phone || storeSettings?.mobile || "+92 317 6872900";
  const email = contactUs?.email || storeSettings?.email || "pakshipperstore@gmail.com";
  const address = contactUs?.address || storeSettings?.address || "Main Commercial Area, Lahore, Pakistan";
  const workingHours = contactUs?.workingHours || "Mon - Sat: 9:00 AM - 6:00 PM";
  const mapEmbedUrl = contactUs?.mapEmbedUrl || "";
  const enableForm = contactUs?.enableForm !== false;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/email-sender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        const resData = await response.json();
        setErrorMessage(resData?.message || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 md:px-8 max-w-6xl mx-auto ${isAqua ? "text-white" : "text-gray-900"}`}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <h1 className={`font-eb-garamond text-4xl sm:text-5xl font-bold tracking-tight ${isAqua ? "text-white" : "text-gray-900"}`}>
          {pageTitle}
        </h1>
        <p className={`font-inter text-base sm:text-lg font-light leading-relaxed ${isAqua ? "text-white/70" : "text-gray-600"}`}>
          {pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Direct Contact Info Cards (Left Column) ──────────────────── */}
        <div className="lg:col-span-5 space-y-4">

          <div className={`rounded-2xl p-6 space-y-6 ${
            isAqua 
              ? "bg-white/5 border border-white/10 backdrop-blur-xl" 
              : "bg-white border border-gray-200/80 shadow-sm"
          }`}>
            <h2 className={`font-eb-garamond text-xl font-bold pb-3 ${
              isAqua ? "text-white border-b border-white/10" : "text-gray-900 border-b border-gray-200"
            }`}>
              Contact Information
            </h2>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                isAqua ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-blue-50 border border-blue-100 text-blue-600"
              }`}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-xs uppercase tracking-wider font-medium block mb-0.5 ${isAqua ? "text-white/50" : "text-gray-400"}`}>Phone / WhatsApp</span>
                <a href={`tel:${phone}`} className={`text-sm sm:text-base font-medium transition-colors ${
                  isAqua ? "text-white hover:text-sky-400" : "text-gray-800 hover:text-blue-600"
                }`}>
                  {phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                isAqua ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-blue-50 border border-blue-100 text-blue-600"
              }`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-xs uppercase tracking-wider font-medium block mb-0.5 ${isAqua ? "text-white/50" : "text-gray-400"}`}>Email Support</span>
                <a href={`mailto:${email}`} className={`text-sm sm:text-base font-medium transition-colors break-all ${
                  isAqua ? "text-white hover:text-sky-400" : "text-gray-800 hover:text-blue-600"
                }`}>
                  {email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                isAqua ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-blue-50 border border-blue-100 text-blue-600"
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-xs uppercase tracking-wider font-medium block mb-0.5 ${isAqua ? "text-white/50" : "text-gray-400"}`}>Location</span>
                <p className={`text-sm font-medium leading-relaxed ${isAqua ? "text-white/90" : "text-gray-700"}`}>
                  {address}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                isAqua ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-blue-50 border border-blue-100 text-blue-600"
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-xs uppercase tracking-wider font-medium block mb-0.5 ${isAqua ? "text-white/50" : "text-gray-400"}`}>Business Hours</span>
                <p className={`text-sm font-medium ${isAqua ? "text-white/90" : "text-gray-700"}`}>
                  {workingHours}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Map Embed */}
          {mapEmbedUrl && (
            <div className={`rounded-2xl p-2 overflow-hidden h-64 relative ${
              isAqua ? "bg-white/5 border border-white/10 backdrop-blur-xl" : "bg-white border border-gray-200 shadow-sm"
            }`}>
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                title="Store location map"
              />
            </div>
          )}

        </div>

        {/* ── Contact Form Section (Right Column) ───────────────────────── */}
        {enableForm && (
          <div className={`lg:col-span-7 rounded-2xl p-6 sm:p-10 ${
            isAqua 
              ? "bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl" 
              : "bg-white border border-gray-200/80 shadow-sm"
          }`}>
            <h2 className={`font-eb-garamond text-2xl font-bold mb-2 ${isAqua ? "text-white" : "text-gray-900"}`}>
              Send Us a Message
            </h2>
            <p className={`text-sm mb-6 ${isAqua ? "text-white/60" : "text-gray-500"}`}>
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className={`text-xl font-bold ${isAqua ? "text-white" : "text-gray-900"}`}>Thank You!</h3>
                <p className={`text-sm max-w-md mx-auto ${isAqua ? "text-white/80" : "text-gray-600"}`}>
                  Your message has been sent successfully. We will respond to your inquiry shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-500 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className={`block text-xs uppercase tracking-wider mb-2 font-medium ${isAqua ? "text-white/70" : "text-gray-700"}`}>
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        isAqua 
                          ? "bg-white/5 border border-white/10 focus:border-sky-400 text-white placeholder-white/30" 
                          : "bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-xs uppercase tracking-wider mb-2 font-medium ${isAqua ? "text-white/70" : "text-gray-700"}`}>
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        isAqua 
                          ? "bg-white/5 border border-white/10 focus:border-sky-400 text-white placeholder-white/30" 
                          : "bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className={`block text-xs uppercase tracking-wider mb-2 font-medium ${isAqua ? "text-white/70" : "text-gray-700"}`}>
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Order Inquiry / Product Support"
                    {...register("subject")}
                    className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                      isAqua 
                        ? "bg-white/5 border border-white/10 focus:border-sky-400 text-white placeholder-white/30" 
                        : "bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-xs text-rose-500 mt-1">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-xs uppercase tracking-wider mb-2 font-medium ${isAqua ? "text-white/70" : "text-gray-700"}`}>
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    {...register("message")}
                    className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                      isAqua 
                        ? "bg-white/5 border border-white/10 focus:border-sky-400 text-white placeholder-white/30" 
                        : "bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>
                  )}
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 ${
                    isAqua 
                      ? "bg-sky-400 hover:bg-sky-300 text-slate-950" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
