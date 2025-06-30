
import React from 'react';
import { Helmet } from 'react-helmet-async';

const HomePageSEO = () => {
  const currentYear = new Date().getFullYear();
  
  // Structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Marhaba Haji",
    "alternateName": "Marhaba Haji Umrah Services",
    "description": "Leading Umrah visa processing and pilgrimage services provider with 97% approval rate. Complete Umrah packages, hotel booking, transport, and spiritual guidance for your sacred journey to Mecca and Medina.",
    "url": "https://marhabahaji.com",
    "logo": "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//Marhaba%20Haji%20Logo%20ICon%20PNG.png",
    "image": "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//Marhaba%20Haji%20Logo%20ICon%20PNG.png",
    "telephone": "+91-9008447887",
    "email": "support@marhabahaji.com",
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "Marhaba Haji Team"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Karnataka",
      "addressLocality": "Bangalore"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Country", 
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Country",
        "name": "Pakistan"
      },
      {
        "@type": "Country",
        "name": "Bangladesh"
      }
    ],
    "serviceType": [
      "Umrah Visa Processing",
      "Hajj Services",
      "Saudi Arabia Visa Services",
      "Islamic Pilgrimage Services",
      "Travel Documentation",
      "Hotel Booking Services",
      "Transport Services",
      "Spiritual Journey Guidance"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Umrah Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Basic Umrah Visa",
            "description": "Essential visa processing with standard approval timeline"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Umrah Visa",
            "description": "Enhanced service with hotel booking and higher approval rate"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Express Umrah Visa",
            "description": "Guaranteed fast-track processing in less than 24 hours"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Ahmad Hassan"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Excellent service for Umrah visa processing. Got my visa approved in just 3 days with all documentation support."
      }
    ],
    "sameAs": [
      "https://www.facebook.com/marhabahaji",
      "https://www.instagram.com/marhabahaji",
      "https://www.twitter.com/marhabahaji"
    ]
  };

  // FAQ Schema for People Also Ask
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does Umrah visa processing take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Umrah visa processing typically takes 2-7 days depending on the service type. Express processing is completed within 24 hours, Premium processing takes 3-5 days, and Basic processing takes 5-7 days."
        }
      },
      {
        "@type": "Question",
        "name": "What documents are required for Umrah visa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Required documents include: Valid passport with 6+ months validity, passport-size photographs, completed application form, vaccination certificates (Meningitis, COVID-19), confirmed hotel booking, and return flight tickets."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Umrah visa approval rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Marhaba Haji maintains a 99% Umrah visa approval rate with our Premium and Express services, and 85% approval rate with Basic service, backed by expert document verification and processing."
        }
      },
      {
        "@type": "Question",
        "name": "How much does Umrah visa cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Umrah visa costs vary by service type: Basic Umrah Visa starts from ₹8,500, Premium Umrah Visa from ₹12,000, and Express Umrah Visa from ₹18,000. Prices include processing fees and support."
        }
      },
      {
        "@type": "Question",
        "name": "Can I apply for Umrah visa online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can apply for Umrah visa online through Marhaba Haji's secure platform. Our online application process is simple, fast, and includes document upload, verification, and real-time tracking."
        }
      },
      {
        "@type": "Question",
        "name": "What is included in Umrah packages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Umrah packages include visa processing, hotel accommodation in Makkah and Madinah, ground transportation, airport transfers, spiritual guidance, and 24/7 customer support throughout your journey."
        }
      }
    ]
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Umrah Visa Processing Services",
    "description": "Professional Umrah visa processing with guaranteed approval. Fast, secure, and hassle-free service for your sacred journey to Mecca and Medina.",
    "provider": {
      "@type": "Organization",
      "name": "Marhaba Haji"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Umrah Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Umrah Visa Processing"
          },
          "price": "8500",
          "priceCurrency": "INR"
        }
      ]
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://marhabahaji.com"
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Umrah Visa Online | 99% Approval Rate | Apply in 2-4 Days | Marhaba Haji</title>
      <meta name="title" content="Umrah Visa Online | 99% Approval Rate | Apply in 2-4 Days | Marhaba Haji" />
      <meta name="description" content="Apply for Umrah visa online with 99% approval rate. Fast processing in 2-4 days, complete documentation support, and guaranteed approval. Start your sacred journey to Mecca & Medina with Marhaba Haji - trusted by 50,000+ pilgrims." />
      <meta name="keywords" content="umrah visa online, umrah visa application, saudi umrah visa, mecca visa, medina visa, hajj visa, islamic pilgrimage visa, umrah visa processing, umrah visa approval, fast umrah visa, umrah visa guaranteed, umrah visa documents, umrah visa requirements, umrah visa cost, umrah visa fee, apply umrah visa, umrah visa service, umrah visa consultant, umrah visa agent, umrah visa help, umrah visa support, umrah visa expert, umrah visa specialist, umrah visa fast track, umrah visa express, umrah visa premium, umrah visa basic, umrah visa India, umrah visa USA, umrah visa UK, umrah visa Pakistan, umrah visa Bangladesh, marhaba haji, umrah packages, umrah travel, umrah booking, umrah services, umrah guidance, umrah assistance, umrah facilitation" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Marhaba Haji" />
      <meta name="publisher" content="Marhaba Haji" />
      <meta name="copyright" content={`© ${currentYear} Marhaba Haji. All rights reserved.`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://marhabahaji.com/" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://marhabahaji.com/" />
      <meta property="og:title" content="Umrah Visa Online | 97% Approval Rate | Apply in 2-4 Days | Marhaba Haji" />
      <meta property="og:description" content="Apply for Umrah visa online with 97% approval rate. Fast processing in 2-4 days, complete documentation support, and guaranteed approval. Start your sacred journey to Mecca & Medina with Marhaba Haji." />
      <meta property="og:image" content="https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//Marhaba%20Haji%20Logo%20ICon%20PNG.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Marhaba Haji - Umrah Visa Processing Services" />
      <meta property="og:site_name" content="Marhaba Haji" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://marhabahaji.com/" />
      <meta property="twitter:title" content="Umrah Visa Online | 97% Approval Rate | Apply in 2-4 Days | Marhaba Haji" />
      <meta property="twitter:description" content="Apply for Umrah visa online with 97% approval rate. Fast processing in 2-4 days, complete documentation support, and guaranteed approval." />
      <meta property="twitter:image" content="https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//Marhaba%20Haji%20Logo%20ICon%20PNG.png" />
      <meta property="twitter:image:alt" content="Marhaba Haji - Umrah Visa Processing Services" />
      <meta property="twitter:site" content="@marhabahaji" />
      <meta property="twitter:creator" content="@marhabahaji" />
      
      {/* Additional Open Graph for better social sharing */}
      <meta property="og:updated_time" content={new Date().toISOString()} />
      <meta property="article:modified_time" content={new Date().toISOString()} />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Bangalore" />
      <meta name="geo.position" content="12.9716;77.5946" />
      <meta name="ICBM" content="12.9716, 77.5946" />
      
      {/* Mobile and Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Additional meta tags for enhanced SEO */}
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />
      <meta name="application-name" content="Marhaba Haji" />
      <meta name="apple-mobile-web-app-title" content="Marhaba Haji" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Alternative languages */}
      <link rel="alternate" hrefLang="en" href="https://marhabahaji.com/" />
      <link rel="alternate" hrefLang="ar" href="https://marhabahaji.com/ar/" />
      <link rel="alternate" hrefLang="ur" href="https://marhabahaji.com/ur/" />
      <link rel="alternate" hrefLang="x-default" href="https://marhabahaji.com/" />
    </Helmet>
  );
};

export default HomePageSEO;
