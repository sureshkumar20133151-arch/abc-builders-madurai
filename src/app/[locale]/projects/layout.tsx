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
      ? "எங்கள் கட்டுமான திட்டங்கள் | ஏபிசி பில்டர்ஸ் மதுரை"
      : "Featured Projects Portfolio | ABC Builders Madurai",
    description: isTa
      ? "மதுரையில் எங்களால் வாஸ்து முறைப்படி கட்டப்பட்ட நவீன வீடுகள், வில்லாக்கள், வணிக வளாகங்கள் மற்றும் புதுப்பிக்கப்பட்ட கட்டிடங்களை ஆராயுங்கள்."
      : "Browse our portfolio of high-end residential bungalows, villas, commercial office complexes, and structural renovations in Madurai.",
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
