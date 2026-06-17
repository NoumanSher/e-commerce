import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { FaAward, FaHandsHolding, FaLeaf } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";
import teamPic from "@/assets/img/teampic.jpg";
import nouman from "@/assets/img/nouman.jpg";
import usman from "@/assets/img/usman.png";
import gorge from "@/assets/img/gorge.png";
import Link from "next/link";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";

export async function generateMetadata(): Promise<Metadata> {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {}

  try {
    const storeSettings = await getStoreSettingServer(host);
    const storeName = storeSettings?.title || "PakShipper";
    return {
      title: `About Us | ${storeName}`,
      description: storeSettings?.description || 'Learn about our story, mission, and values',
    };
  } catch (error) {
    return {
      title: 'About Us | PakShipper',
      description: 'Learn about our story, mission, and values',
    };
  }
}

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-black text-white pt-16 pb-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-light text-gray-300">
            Crafting exceptional experiences since 2024
          </p>
        </div>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
              Our Mission & Values
            </h2>
            <div className="w-20 md:w-24 h-1 bg-black mx-auto"></div>
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
      {/* <section className="py-12 md:py-16 bg-white">
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
        </section> */}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-100 border-t border-gray-200 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-gray-900 tracking-tight">
            Join Our Community
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl mb-8 md:mb-10 max-w-2xl mx-auto font-light">
            Be part of our growing family of satisfied customers and
            experience the difference.
          </p>
          <Link href="/" className="inline-block bg-black text-white font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full hover:bg-gray-800 transition duration-300">Shop Now</Link>

        </div>
      </section>
    </div>
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
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300 text-center h-full">
      <div className="text-black mb-4 md:mb-5 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight">
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
      <h3 className="text-lg md:text-xl font-bold text-gray-900">{name}</h3>
      <p className="text-gray-500 font-medium text-sm md:text-base mt-1">{role}</p>
    </div>
  );
};

export default AboutUsPage;
