'use client'
import React, { useState } from 'react';

import { FaPaperPlane, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;


const ContactUsPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    try {
      console.log('Submitting contact form:', data);
      const response = await fetch('/api/email-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        console.error('API Error:', result);
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative bg-black text-white pt-16 pb-20 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">Contact Us</h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-light text-gray-300">
              We&apos;d love to hear from you
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      {...register('subject')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors ${
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full md:w-auto bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="space-y-6">
                    {/* <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaMapMarkerAlt className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Our Location</h3>
                        <p className="text-gray-600">123 Business Street, City, Country</p>
                      </div>
                    </div> */}

                    <div className="flex items-start">
                      <div className="bg-gray-200 p-3 rounded-full mr-5">
                        <FaPhone className="text-black text-lg" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h3>
                        <p className="text-gray-600">+923176872900</p>
                        {/* <p className="text-gray-600">+1 (987) 654-3210</p> */}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-gray-200 p-3 rounded-full mr-5">
                        <FaEnvelope className="text-black text-lg" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Email Address</h3>
                        <p className="text-gray-600">pakshipperstore@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default ContactUsPage;