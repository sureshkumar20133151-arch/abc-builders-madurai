import { Cormorant_Garamond, DM_Sans, Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageContext";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

const notoTamilSans = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-notosans-tamil",
  display: "swap",
});

const notoTamilSerif = Noto_Serif_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "700"],
  variable: "--font-notoserif-tamil",
  display: "swap",
});

type Locale = "en" | "ta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTa = locale === "ta";
  return {
    title: isTa
      ? "ஏபிசி பில்டர்ஸ், மதுரை — வரைபடம் முதல் நிஜம் வரை"
      : "ABC Builders, Madurai — From Blueprint to Reality",
    description: isTa
      ? "தமிழ்நாட்டின் முன்னணி கட்டுமான நிறுவனம். வீடுகள், வில்லாக்கள் மற்றும் வணிகக் கட்டிடங்களை வாஸ்து முறைப்படி தரமாக கட்டித் தருகிறோம்."
      : "Tamil Nadu's premier construction company. Building high-end contemporary bungalows, houses, and commercial spaces since 2013.",
    metadataBase: new URL("https://abcbuildersmadurai.com"),
    openGraph: {
      title: isTa ? "ஏபிசி பில்டர்ஸ், மதுரை" : "ABC Builders, Madurai",
      description: isTa
        ? "தமிழ்நாட்டின் முன்னணி கட்டுமான நிறுவனம்."
        : "Tamil Nadu's premier construction company.",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === "ta" ? "ta" : "en") as Locale;

  return (
    <html
      lang={safeLocale}
      className={`${cormorant.variable} ${dmSans.variable} ${notoTamilSans.variable} ${notoTamilSerif.variable} h-full antialiased`}
    >
      <body className="font-ui min-h-full flex flex-col relative bg-surface-0 text-text-primary">
        <LanguageProvider initialLocale={safeLocale}>
          {/* Smooth Scroll via Lenis */}
          <SmoothScroll />

          {/* Fixed Top Navbar */}
          <Navbar />
          
          {/* Main viewport */}
          <main className="flex-1">{children}</main>
          
          {/* Footer & WhatsApp Floating widget */}
          <Footer />
          <WhatsAppFloat />
        </LanguageProvider>
      </body>
    </html>
  );
}
