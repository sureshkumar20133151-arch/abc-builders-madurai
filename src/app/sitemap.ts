import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://abcbuildersmadurai.com";
  const locales = ["en", "ta"];
  const paths = ["", "/about", "/services", "/projects", "/process", "/blog", "/contact"];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    // Add default entry (e.g. https://abcbuildersmadurai.com/about)
    sitemapEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1.0 : 0.8,
    });

    // Add localized entries (e.g. https://abcbuildersmadurai.com/en/about)
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
