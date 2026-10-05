import { useLocation } from "react-router-dom";

const SITE_URL = "https://crewaura.com";
const SITE_NAME = "Crew Aura";
const DEFAULT_TITLE = "Destination Wedding Planner in Navi Mumbai";
const DEFAULT_DESCRIPTION =
  "Crew Aura is a destination wedding planner in Navi Mumbai. We design and manage dream weddings across India and abroad, from venues to décor to guest experience.";
  
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
  schema,
}) {
  const { pathname } = useLocation();

  // Home page uses the default title; other pages get "Page | Crew Aura"
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | ${DEFAULT_TITLE}`;

  // Strip trailing slash so /about/ and /about share one canonical
  const cleanPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");
  const canonical = `${SITE_URL}${cleanPath}`;

  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </>
  );
}