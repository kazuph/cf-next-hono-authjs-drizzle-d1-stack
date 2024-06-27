import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </div>
      <Footer />
    </div>
  );
}
