import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTa = locale === "ta";
  return {
    title: isTa
      ? "எங்களைத் தொடர்பு கொள்ள | ஏபிசி பில்டர்ஸ் மதுரை"
      : "Contact Us & Get Quote | ABC Builders Madurai",
    description: isTa
      ? "ஏபிசி பில்டர்ஸ் மதுரையுடன் தொடர்பு கொள்ளுங்கள். உங்கள் புதிய வீடு அல்லது வணிக கட்டிடத்திற்கு மதிப்பீடு மற்றும் வரைபடக் கலந்தாய்வு பெறுக."
      : "Get in touch with ABC Builders Madurai. Request an estimate quote for your construction, permit consultation, or house building project.",
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
