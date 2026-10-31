import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Toaster } from '@/components/ui/toaster';
import SEOHead from '@/components/SEOHead';

const SEOLayout = ({ title, description, children, canonical, schema, ogImage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={canonical}
        schema={schema}
        ogImage={ogImage}
      />

      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </>
  );
};

export default SEOLayout;
