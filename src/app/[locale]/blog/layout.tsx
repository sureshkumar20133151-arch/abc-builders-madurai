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
      ? "கட்டுமான வலைப்பதிவு & குறிப்புகள் | ஏபிசி பில்டர்ஸ் மதுரை"
      : "Construction Blog & Design Tips | ABC Builders Madurai",
    description: isTa
      ? "வாஸ்து முறை, கட்டுமான செலவு குறைப்பு வழிகள், RCC கான்கிரீட் தரம் மற்றும் நவீன கட்டிட வடிவமைப்பு போக்குகள் பற்றிய கட்டுரைகள்."
      : "Read the latest articles about vastu layouts, cost-saving construction checklists, RCC grades, and modern home trends in Tamil Nadu.",
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
