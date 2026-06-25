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
      ? "ஏபிசி பில்டர்ஸ் பற்றி | மதுரையில் 12+ ஆண்டுகள் கட்டுமான அனுபவம்"
      : "About ABC Builders | 12+ Years of Construction in Madurai",
    description: isTa
      ? "ஏபிசி பில்டர்ஸ் மதுரை பற்றிய வரலாறு, எங்கள் குழு மற்றும் வாஸ்து முறைப்படி தரமான வீடுகளைக் கட்டித் தரும் எங்கள் இலக்கு பற்றி அறியுங்கள்."
      : "Learn about ABC Builders Madurai, our team, history since 2013, and how we deliver high-end structural engineering and contemporary architectural designs.",
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
