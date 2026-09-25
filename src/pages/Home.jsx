import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/home/AboutSection';
import ResearchSection from '../components/home/ResearchSection';
import QualitySection from '../components/home/QualitySection';
import ProductsSection from '../components/home/ProductsSection';
import CropsGallery from '../components/home/CropsGallery';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BrandsSection from '../components/home/BrandsSection';
import ReviewsSection from '../components/home/ReviewsSection';
import ContactCTA from '../components/home/ContactCTA';

const Home = () => (
  <>
    <HeroSection />
    <AboutSection />
    <ResearchSection />
    <QualitySection />
    <ProductsSection />
    <CropsGallery />
    <TestimonialsSection />
    <BrandsSection />
    <ReviewsSection />
    <ContactCTA />
  </>
);

export default Home;
