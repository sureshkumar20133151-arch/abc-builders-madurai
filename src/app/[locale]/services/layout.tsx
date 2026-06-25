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
      ? "எங்கள் கட்டுமான சேவைகள் | ஏபிசி பில்டர்ஸ் மதுரை"
      : "Our Construction Services | ABC Builders Madurai",
    description: isTa
      ? "எங்கள் சேவைகள்: கட்டிட வரைபட வடிவமைப்பு, CMDA/DTCP அப்ரூவல், பொது ஒப்பந்தம், புதுப்பித்தல் மற்றும் வாஸ்து முறைப்படி வீடு கட்டுதல்."
      : "Explore our core services: structural designing, blueprint approvals, DTCP permits, general contracting, renovations, and custom residential building.",
  };
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
