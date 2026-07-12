const BASE = "https://carcalc-sigma.vercel.app";
const LOGO = `${BASE}/images/logo_new.png`;

/**
 * Invisible Article structured data for a guide page — helps search engines
 * understand and index the article. Renders only a JSON-LD <script>; no UI.
 */
export default function ArticleJsonLd({
  headline,
  description,
  path,
  locale,
}: {
  headline: string;
  description: string;
  path: string;
  locale: string;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: locale,
    image: LOGO,
    mainEntityOfPage: `${BASE}${path}`,
    publisher: {
      "@type": "Organization",
      name: "CarCalc",
      logo: { "@type": "ImageObject", url: LOGO },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
