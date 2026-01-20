export enum ServiceCategoryType {
    CREATIVE = 'Creative & Content',
    DEVELOPMENT = 'Development & Search',
    GROWTH = 'Management & Growth'
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string; // Short summary for cards
    details?: string;    // Long description for single page
    category: ServiceCategoryType;
    imageUrl: string;    // Main thumbnail
    gallery?: string[];  // Array of image URLs
    client?: string;
  }
  
  export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    category: ServiceCategoryType;
  }
  
  export interface Lead {
    id: string;
    name: string;
    email: string;
    serviceInterest: string;
    message: string;
    date: string;
  }

  // --- Landing Page Sections ---

  export interface LandingSectionHero {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  }

  export interface TrustLogo {
    id: string;
    name: string;
    url: string;
  }

  export interface LandingSectionTrust {
    visible: boolean;
    title: string;
    logos: TrustLogo[];
  }

  export interface FeatureItem {
    id: string;
    title: string;
    description: string;
    
  }

  export interface LandingSectionFeatures {
    visible: boolean;
    title: string;
    subtitle: string;
    items: FeatureItem[];
  }

  export interface LandingSectionCaseStudy {
    visible: boolean;
    badge: string;
    title: string;
    description: string;
    statValue: string;
    statLabel: string;
    ctaText: string;
  }

  export interface TestimonialItem {
    id: string;
    quote: string;
    author: string;
    role: string;
    company: string;
  }

  export interface LandingSectionTestimonials {
    visible: boolean;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  }

  export interface LandingSectionCTA {
    visible: boolean;
    title: string;
    subtitle: string;
    buttonText: string;
  }

  export interface LandingPageConfig {
    hero: LandingSectionHero;
    trust: LandingSectionTrust;
    features: LandingSectionFeatures;
    caseStudy: LandingSectionCaseStudy;
    testimonials: LandingSectionTestimonials;
    cta: LandingSectionCTA;
  }
  
  export interface SiteConfig {
    agencyName: string;
    tagline: string;
    logoUrl: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    socials: Record<string, string>;
    legal: {
      privacyPolicy: string;
      termsConditions: string;
      refundPolicy: string;
    };
    landingPage: LandingPageConfig;
  }
  
  export interface UserSession {
    isAuthenticated: boolean;
    token?: string;
  }