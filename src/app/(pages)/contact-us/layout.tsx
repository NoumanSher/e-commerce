import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | PakShipper',
  description: 'Get in touch with our team',
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
