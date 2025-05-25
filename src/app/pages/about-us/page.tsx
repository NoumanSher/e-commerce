import React from "react";
import Head from "next/head";
import Image from "next/image";
import { FaAward, FaHandsHolding, FaLeaf } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";
import teamPic from "@/assets/img/teampic.jpg";
import nouman from "@/assets/img/nouman.jpg";
import usman from "@/assets/img/usman.png";
import gorge from "@/assets/img/gorge.png";
import Link from "next/link";
const AboutUsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Us | PakShipper</title>
        <meta
          name="description"
          content="Learn about our story, mission, and values"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-16 pb-20 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
              Our Story
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
              Crafting exceptional experiences since 2024
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-white transform skew-y-1 origin-top-left"></div>
        </section>

        {/* Our Journey */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <div className="relative aspect-video md:aspect-auto md:h-[400px]">
                  <Image
                    src={teamPic}
                    alt="Our Team"
                    fill
                    className="rounded-lg shadow-xl object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                  Our Journey
                </h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2024, we started as a small team with a big dream -
                  to revolutionize the online shopping experience. What began as
                  a passion project in a garage has now grown into a thriving
                  e-commerce platform serving thousands of happy customers
                  worldwide.
                </p>
                <p className="text-gray-600">
                  Our journey hasn&apos;t been without challenges, but each
                  obstacle has only strengthened our commitment to delivering
                  quality products and exceptional service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-12 md:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
                Our Mission & Values
              </h2>
              <div className="w-20 md:w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <ValueCard
                icon={<FaAward className="w-6 h-6 md:w-8 md:h-8" />}
                title="Quality First"
                description="We meticulously source and test every product to ensure it meets our high standards."
              />
              <ValueCard
                icon={<FaHandsHolding className="w-6 h-6 md:w-8 md:h-8" />}
                title="Customer Focus"
                description="Your satisfaction is our top priority. We listen, adapt, and go the extra mile."
              />
              <ValueCard
                icon={<FaLeaf className="w-6 h-6 md:w-8 md:h-8" />}
                title="Sustainability"
                description="We're committed to eco-friendly practices and responsible sourcing."
              />
              <ValueCard
                icon={<FaShippingFast className="w-6 h-6 md:w-8 md:h-8" />}
                title="Fast & Reliable"
                description="Quick shipping and hassle-free returns because we value your time."
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind your seamless shopping
                experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember
                name="Nouman Khan"
                role="Founder & CEO"
                image={nouman.src}
              />
              <TeamMember
                name="Danish George"
                role="Head of Operations"
                image={gorge.src}
              />
              <TeamMember
                name="Usman"
                role="Product Director"
                image={usman.src}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
              Join Our Community
            </h2>
            <p className="text-lg sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Be part of our growing family of satisfied customers and
              experience the difference.
            </p>
            <Link href="/" className="inline-block bg-white text-blue-600 font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-gray-100 transition duration-300">Shop Now</Link>
          
          </div>
        </section>
      </div>
    </>
  );
};

// Value Card Component
interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center h-full">
      <div className="text-blue-600 mb-3 md:mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
  );
};

// Team Member Component
interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image }) => {
  return (
    <div className="text-center">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-4 overflow-hidden rounded-full shadow-md">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{name}</h3>
      <p className="text-blue-600 text-sm md:text-base">{role}</p>
    </div>
  );
};

export default AboutUsPage;
