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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abc-builders-madurai.vercel.app";
  const canonicalUrl = `${baseUrl}/${locale}`;
  const ogImage = `${baseUrl}/assets/project_villa.png`;

  return {
    title: isTa
      ? "ஏபிசி பில்டர்ஸ் மதுரை | சிறந்த கட்டுமான நிறுவனம் | வீடுகள் & வணிக வளாகங்கள்"
      : "ABC Builders Madurai | Premier Construction & Design Company",
    description: isTa
      ? "மதுரையில் 12+ ஆண்டுகள் அனுபவத்துடன் 250+ வீடுகள், வில்லாக்கள் மற்றும் வணிகக் கட்டிடங்களை வாஸ்து முறைப்படி தரமாக கட்டித் தரும் முன்னணி கட்டுமான நிறுவனம்."
      : "Leading construction company in Madurai with 12+ years of experience and 250+ completed high-end residential bungalows, villas, and commercial complexes.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": `${baseUrl}/en`,
        "ta": `${baseUrl}/ta`,
      },
    },
    openGraph: {
      title: isTa
        ? "ஏபிசி பில்டர்ஸ் மதுரை | சிறந்த கட்டுமான நிறுவனம்"
        : "ABC Builders Madurai | Premier Construction Company",
      description: isTa
        ? "வாஸ்து முறைப்படி தரமான வீடுகளைக் கட்டித் தரும் மதுரை முன்னணி கட்டுமான நிறுவனம்."
        : "Leading construction company in Madurai with 12+ years experience. Build your dream home with Vastu-compliant designs.",
      url: canonicalUrl,
      siteName: "ABC Builders Madurai",
      type: "website",
      locale: isTa ? "ta_IN" : "en_IN",
      alternateLocale: isTa ? ["en_IN"] : ["ta_IN"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: isTa
            ? "ஏபிசி பில்டர்ஸ் மதுரை - சிறந்த வில்லா கட்டுமானம்"
            : "ABC Builders Madurai – Premium Villa Construction",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isTa
        ? "ஏபிசி பில்டர்ஸ் மதுரை | சிறந்த கட்டுமான நிறுவனம்"
        : "ABC Builders Madurai | Premier Construction Company",
      description: isTa
        ? "வாஸ்து முறைப்படி தரமான வீடுகளைக் கட்டித் தரும் மதுரை முன்னணி கட்டுமான நிறுவனம்."
        : "Leading construction company in Madurai with 12+ years experience. Build your dream home with Vastu-compliant designs.",
      images: [ogImage],
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abc-builders-madurai.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ABC Builders Madurai",
    "image": `${siteUrl}/assets/project_villa.png`,
    "@id": `${siteUrl}/#localbusiness`,
    "url": siteUrl,
    "telephone": "+919876543210",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "82, Wooden Desk Road, Tallakulam",
      "addressLocality": "Madurai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "625002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.9392,
      "longitude": 78.1382
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "120",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <html
      lang={safeLocale}
      className={`${cormorant.variable} ${dmSans.variable} ${notoTamilSans.variable} ${notoTamilSerif.variable} h-full antialiased`}
    >
      <body className="font-ui min-h-full flex flex-col relative bg-surface-0 text-text-primary">
        {/* LocalBusiness Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
