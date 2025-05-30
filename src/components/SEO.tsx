import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
  path?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'ParamCebimde - Akıllı Hesaplama Platformu',
  description = 'ParamCebimde ile gıda, finans ve seyahat maliyetlerinizi kolayca hesaplayın. Kullanıcı dostu arayüzümüzle bütçenizi kontrol altında tutun.',
  canonicalUrl = 'https://paramcebimde.com',
  ogImage = '/og-image.jpg',
  structuredData,
  path = '',
}) => {
  const fullUrl = `${canonicalUrl}${path}`;
  
  // Default structured data for the website
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'ParamCebimde',
    'description': description,
    'url': canonicalUrl,
    'applicationCategory': 'FinanceApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'TRY'
    },
    'operatingSystem': 'Web',
    'author': {
      '@type': 'Organization',
      'name': 'ParamCebimde',
      'url': canonicalUrl
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
