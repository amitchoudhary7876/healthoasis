
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Services from '@/components/home/Services';
import Doctors from '@/components/home/Doctors';
import Cta from '@/components/home/Cta';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <Services />
      <Doctors />
      <Cta />
    </Layout>
  );
};

export default Index;
