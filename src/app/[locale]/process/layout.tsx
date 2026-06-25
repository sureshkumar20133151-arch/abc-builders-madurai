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
      ? "எங்கள் கட்டுமான செயல்முறை | படிப்படியான கட்டிட முறை"
      : "Our Construction Process | Step-by-Step Builders",
    description: isTa
      ? "திட்ட வரைபடம், மதிப்பீடு மற்றும் அரசு அப்ரூவல் முதல் அஸ்திவாரம், RCC கான்கிரீட் கட்டமைப்பு மற்றும் இறுதி சாவி ஒப்படைப்பு வரை எங்கள் செயல்முறை."
      : "From initial drawing design and CMDA/DTCP approval to RCC structural framing, brickwork layout, and final keys handover.",
  };
}

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
