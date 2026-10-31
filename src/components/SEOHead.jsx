import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const DEFAULT_IMAGE = 'https://www.jericoacoarapremium.com/images/hero-jeri-mobile.webp';
const SITE_NAME = 'Jericoacoara Premium';

function setOrUpdateMeta(attr, key, content) {
  if (typeof document === 'undefined') return;
  if (!content) return;
  
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setOrUpdateCanonical(url) {
  if (typeof document === 'undefined') return;
  if (!url) return;

  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function setOrUpdateJsonLd(schema) {
  if (typeof document === 'undefined') return;
  
  let element = document.getElementById('route-jsonld');
  if (!element) {
    element = document.createElement('script');
    element.id = 'route-jsonld';
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  if (schema) {
    element.textContent = JSON.stringify(schema, null, 2);
  }
}

/**
 * Reusable SEO Head component for page-level metadata, canonical URLs,
 * OpenGraph / Twitter Cards, and structured JSON-LD data.
 *
 * Guarantees direct DOM mutation on SPA client-side navigation to prevent
 * duplicate tags in document.head.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  schema = null,
}) {
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (title) {
      document.title = title;
    }

    if (description) {
      setOrUpdateMeta('name', 'description', description);
      setOrUpdateMeta('property', 'og:description', description);
      setOrUpdateMeta('property', 'twitter:description', description);
      setOrUpdateMeta('name', 'twitter:description', description);
    }

    setOrUpdateMeta('name', 'robots', robotsContent);

    if (canonical) {
      setOrUpdateCanonical(canonical);
      setOrUpdateMeta('property', 'og:url', canonical);
      setOrUpdateMeta('property', 'twitter:url', canonical);
      setOrUpdateMeta('name', 'twitter:url', canonical);
    }

    if (title) {
      setOrUpdateMeta('property', 'og:title', title);
      setOrUpdateMeta('property', 'twitter:title', title);
      setOrUpdateMeta('name', 'twitter:title', title);
    }

    setOrUpdateMeta('property', 'og:type', ogType);
    setOrUpdateMeta('property', 'og:site_name', SITE_NAME);

    if (ogImage) {
      setOrUpdateMeta('property', 'og:image', ogImage);
      setOrUpdateMeta('property', 'twitter:image', ogImage);
      setOrUpdateMeta('name', 'twitter:image', ogImage);
    }

    setOrUpdateMeta('property', 'twitter:card', 'summary_large_image');
    setOrUpdateMeta('name', 'twitter:card', 'summary_large_image');

    if (schema) {
      setOrUpdateJsonLd(schema);
    }
  }, [title, description, canonical, ogType, ogImage, robotsContent, schema]);

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robotsContent} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* OpenGraph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {canonical && <meta name="twitter:url" content={canonical} />}
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script id="route-jsonld" type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
