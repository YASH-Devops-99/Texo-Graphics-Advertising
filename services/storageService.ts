import { supabase } from './supabaseClient';
import { Project, ServiceItem, ServiceCategoryType, SiteConfig, Lead, LandingPageConfig } from '../types';

// --- In-Memory Cache ---
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = {
  config: { data: null as SiteConfig | null, timestamp: 0 },
  projects: { data: null as Project[] | null, timestamp: 0 }
};

// --- DUMMY DATA FOR INITIAL STATE ---

const DUMMY_PROJECTS: Project[] = [
    {
        id: 'p1',
        title: 'Neon Horizon',
        description: 'A futuristic brand identity for a cyber-security startup utilizing neon aesthetics.',
        details: 'We were approached by CyberSec Inc. to revolutionize their brand identity. The goal was to move away from the traditional blue shield imagery and embrace a modern, "hacker-chic" aesthetic that appeals to a younger demographic of developers.\n\nOur approach involved creating a dynamic logo system that adapts to different backgrounds, coupled with a high-contrast color palette of neon green and deep purple. The result was a 40% increase in brand recall within 3 months.',
        category: ServiceCategoryType.CREATIVE,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
        ],
        client: 'CyberSec Inc.'
    },
    {
        id: 'p2',
        title: 'Velvet E-Commerce',
        description: 'High-performance Shopify headless build for a luxury fashion retailer.',
        details: 'Velvet required a lightning-fast shopping experience that didn\'t compromise on visual fidelity. We utilized Next.js for the frontend and Shopify as the headless CMS.\n\nKey challenges included optimizing high-resolution imagery and implementing complex filtering logic without page reloads. We achieved a Lighthouse performance score of 98/100.',
        category: ServiceCategoryType.DEVELOPMENT,
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
        ],
        client: 'Velvet Fashion'
    },
    {
        id: 'p3',
        title: 'FinScale Growth',
        description: 'SEO and PPC campaign that drove 300% ROI for a fintech app.',
        details: 'The fintech market is crowded. To help FinScale stand out, we executed a dual-strategy campaign. First, we targeted long-tail SEO keywords related to "personal finance automation". Second, we ran high-intent Google Ads.\n\nThe campaign resulted in 5,000 new user signups in the first quarter.',
        category: ServiceCategoryType.GROWTH,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
        client: 'FinScale'
    },
    {
        id: 'p4',
        title: 'Architectural Digest',
        description: 'Minimalist portfolio design for an award-winning architecture firm.',
        details: 'Less is more. We stripped away all unnecessary elements to let the architectural photography speak for itself. The site features smooth transitions, micro-interactions, and a custom WebGL slider.',
        category: ServiceCategoryType.CREATIVE,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=800'
        ],
        client: 'Modern Archi'
    },
    {
        id: 'p5',
        title: 'HealthTrack App',
        description: 'React Native mobile application for patient monitoring.',
        details: 'Security and reliability were paramount. We built a React Native app that interfaces with Bluetooth medical devices to track patient vitals in real-time. Data is encrypted end-to-end.',
        category: ServiceCategoryType.DEVELOPMENT,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600',
        client: 'MediCare'
    },
    {
        id: 'p6',
        title: 'EcoDrink Launch',
        description: 'Social media virality campaign for a sustainable beverage brand.',
        details: 'We leveraged TikTok and Instagram Reels to create a viral challenge centered around sustainability. The campaign generated 10M+ views and sold out the initial stock in 48 hours.',
        category: ServiceCategoryType.GROWTH,
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=1600',
        client: 'EcoDrink'
    }
];

const LEGAL_PRIVACY = `## Privacy Policy
**Last Updated: January 2024**

### 1. Introduction
Nexus Agency ("we", "our", "us") values your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website nexus.agency or use our digital services.

### 2. Information We Collect
We collect information that you provide directly to us, such as when you fill out a contact form, request a quote, or sign up for our newsletter.
*   **Personal Identification Information:** Name, email address, phone number, and company name.
*   **Technical Data:** IP address, browser type, version, time zone setting, operating system, and platform.
*   **Usage Data:** Information about how you use our website, products, and services.

### 3. How We Use Your Information
We use the data we collect for various business purposes, including:
*   **Service Delivery:** To provide and maintain our Service, including monitoring the usage of our Service.
*   **Communication:** To contact you regarding your projects, updates, and informative newsletters.
*   **Improvement:** To gather analysis or valuable information so that we can improve our Service.
*   **Security:** To monitor the usage of the Service and detect, prevent and address technical issues.

### 4. Data Retention
We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.

### 5. Data Security
The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.

### 6. Your Data Protection Rights
Depending on your location, you may have the following rights:
*   The right to access, update or to delete the information we have on you.
*   The right of rectification.
*   The right to object.
*   The right of restriction.
*   The right to data portability.
*   The right to withdraw consent.

### 7. Contact Us
If you have any questions about this Privacy Policy, please contact us:
*   By email: legal@nexus.agency
*   By visiting this page on our website: nexus.agency/contact`;

const LEGAL_TERMS = `## Terms of Service
**Last Updated: January 2024**

### 1. Acceptance of Terms
By accessing and using the website and services of Nexus Agency ("Services"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.

### 2. Intellectual Property
The Site and its original content, features, and functionality are owned by Nexus Agency and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.

### 3. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on Nexus Agency's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
*   Modify or copy the materials;
*   Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
*   Attempt to decompile or reverse engineer any software contained on Nexus Agency's website;
*   Remove any copyright or other proprietary notations from the materials.

### 4. Client Deliverables
Upon full payment, Nexus Agency grants to the Client a perpetual, non-exclusive, non-transferable license to use, display, and reproduce the deliverables for the Client's business purposes. Nexus Agency retains the right to display the deliverables in its portfolio and for marketing purposes unless a Non-Disclosure Agreement (NDA) is signed.

### 5. Limitation of Liability
In no event shall Nexus Agency, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service.

### 6. Termination
We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.

### 7. Governing Law
These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.`;

const LEGAL_REFUND = `## Refund Policy
**Last Updated: January 2024**

### 1. General Overview
Nexus Agency is committed to ensuring client satisfaction. However, because our services are digital and labor-intensive, we enforce a strict refund policy to protect our team's time and resources.

### 2. Project Deposits
*   **Non-Refundable:** All initial deposits (typically 50% of the total project fee) are non-refundable once the project kickoff meeting has occurred or work has commenced.
*   **Before Kickoff:** If a project is cancelled by the client before the kickoff meeting or before any work has started, a full refund of the deposit will be issued, minus a 5% administrative processing fee.

### 3. Milestone Payments
For projects with milestone-based payments, once a milestone has been approved by the Client and payment has been made, that payment is non-refundable. Approval constitutes acceptance of the work delivered up to that point.

### 4. Retainer Services
*   **Monthly Retainers:** Fees for monthly retainer services (e.g., SEO, Maintenance, Growth Marketing) are paid in advance and are non-refundable. 
*   **Cancellation:** Clients may cancel retainer services with 30 days' written notice. Services will continue until the end of the paid billing cycle.

### 5. Dispute Resolution
If you are unhappy with the quality of work, please contact your project manager immediately. We offer a revision period as outlined in your specific Service Agreement. We will make every reasonable effort to correct the issue. Refunds based on "change of mind" or "personal taste" after approval are not permitted.

### 6. Contact
For any billing or refund queries, please reach out to billing@nexus.agency.`;


const DEFAULT_LANDING_PAGE: LandingPageConfig = {
  hero: {
    badge: "Redefining Digital Excellence",
    headline: "We Craft Digital",
    subheadline: "Nexus is a premier digital agency blending aesthetics with performance. We build brands that don't just exist—they dominate.",
    ctaPrimary: "Start Your Project",
    ctaSecondary: "View Our Work"
  },
  trust: {
    visible: true,
    title: "Trusted by Forward-Thinking Companies",
    logos: [
        { id: '1', name: 'Acme Corp', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' },
        { id: '2', name: 'Globex', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png' },
        { id: '3', name: 'Soylent', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png' },
        { id: '4', name: 'Umbrella', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png' }
    ]
  },
  features: {
    visible: true,
    title: "Why Partner With Texo",
    subtitle: "We don't just deliver designs; we deliver outcomes.",
    items: [
        { id: '1', title: 'Strategic Design', description: 'Every creative decision is backed by market research and user behavior analytics.' },
        { id: '2', title: 'Speed & Precision', description: 'High-quality assets delivered with rapid turnaround times to keep your campaigns moving.' },
        { id: '3', title: 'Omnichannel Growth', description: 'Campaigns designed to scale seamlessly across social, web, and print.' }
    ]
  },
  caseStudy: {
    visible: true,
    badge: "Featured Success",
    title: "Scaling FinTech Corp to $10M ARR",
    description: "How we completely overhauled the digital presence of a legacy financial institution, resulting in a massive influx of millennial users.",
    statValue: "+300%",
    statLabel: "User Acquisition",
    ctaText: "Read the Case Study"
  },
  testimonials: {
    visible: true,
    title: "Client Success Stories",
    subtitle: "Don't just take our word for it.",
    items: [
        { id: '1', quote: "Nexus transformed our brand from outdated to outstanding. The team is incredibly talented.", author: "Sarah Jenkins", role: "CMO", company: "TechFlow" },
        { id: '2', quote: "The ROI we saw within the first 3 months was unprecedented. Highly recommended.", author: "David Chen", role: "Founder", company: "StartScale" }
    ]
  },
  cta: {
    visible: true,
    title: "Ready to elevate your brand?",
    subtitle: "Let's build something extraordinary together.",
    buttonText: "Schedule Discovery Call"
  }
};

export const DEFAULT_CONFIG: SiteConfig = {
  agencyName: "Nexus Agency",
  tagline: "Experience",
  logoUrl: "", 
  contact: { email: "hello@nexus.agency", phone: "+1 (555) 123-4567", address: "123 Innovation Dr, San Francisco, CA" },
  socials: { twitter: 'https://twitter.com', instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
  legal: { privacyPolicy: LEGAL_PRIVACY, termsConditions: LEGAL_TERMS, refundPolicy: LEGAL_REFUND },
  landingPage: DEFAULT_LANDING_PAGE
};

export const storageService = {
  
  getConfig: async (): Promise<SiteConfig> => {
    // Check Cache
    const now = Date.now();
    if (cache.config.data && (now - cache.config.timestamp < CACHE_DURATION)) {
      return cache.config.data;
    }

    try {
      const { data, error } = await supabase.from('site_config').select('data').eq('id', 1).single();
      
      if (error || !data) {
        return DEFAULT_CONFIG;
      }

      // Merge fetched data with DEFAULT_CONFIG features to ensure the requested content updates
      // even if the DB has old data.
      const fetchedConfig = data.data as SiteConfig;
      if (fetchedConfig.landingPage) {
          // Force update features to match code requirements
          fetchedConfig.landingPage.features = DEFAULT_LANDING_PAGE.features;
      } else {
        fetchedConfig.landingPage = DEFAULT_LANDING_PAGE;
      }

      // Update Cache
      cache.config.data = fetchedConfig;
      cache.config.timestamp = now;

      return fetchedConfig;
    } catch (e) {
      console.error(e);
      return DEFAULT_CONFIG;
    }
  },

  saveConfig: async (config: SiteConfig) => {
    const { error } = await supabase.from('site_config').upsert({ id: 1, data: config });
    if (error) console.error("Error saving config:", error);
    
    // Invalidate Cache
    cache.config.data = config;
    cache.config.timestamp = Date.now();
  },
  
  getProjects: async (): Promise<Project[]> => {
    // Check Cache
    const now = Date.now();
    if (cache.projects.data && (now - cache.projects.timestamp < CACHE_DURATION)) {
      return cache.projects.data;
    }

    try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        
        if (error || !data || data.length === 0) {
            // Return DUMMY projects if DB is empty
            return DUMMY_PROJECTS;
        }
        
        const projects = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            details: p.details || '',
            category: p.category,
            imageUrl: p.image_url,
            gallery: p.gallery || [],
            client: p.client
        }));

        // Update Cache
        cache.projects.data = projects;
        cache.projects.timestamp = now;

        return projects;
    } catch (e) {
        return DUMMY_PROJECTS; // Fallback
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    // Check if it's a dummy ID
    const dummy = DUMMY_PROJECTS.find(p => p.id === id);
    if (dummy) return dummy;

    try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (error || !data) return null;

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            details: data.details || '',
            category: data.category,
            imageUrl: data.image_url,
            gallery: data.gallery || [],
            client: data.client
        };
    } catch (e) {
        return null;
    }
  },

  saveProjects: async (projects: Project[]) => {
    // In a real app, we would sync this to Supabase.
    // For now, if we are in "dummy mode", we might want to actually start saving to DB.
    // This function assumes we are writing to DB.
    try {
        const { data: existing } = await supabase.from('projects').select('id');
        const existingIds = existing?.map(x => x.id) || [];
        const newIds = projects.map(p => p.id);
        
        // Don't delete dummy IDs from DB because they aren't there
        const realProjects = projects.filter(p => !p.id.startsWith('p')); 
        // Logic simplified for this demo:
        // We will just attempt to upsert everything. 
        // If the ID doesn't exist in DB, it creates it.
        
        const toUpsert = projects.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            details: p.details,
            category: p.category,
            image_url: p.imageUrl,
            gallery: p.gallery,
            client: p.client
        }));

        if (toUpsert.length > 0) {
            const { error } = await supabase.from('projects').upsert(toUpsert);
            if (error) console.error("Upsert error", error);
        }

        // Invalidate Cache
        cache.projects.data = null; 

    } catch (e) {
        console.error("Save projects error", e);
    }
  },
  
  getServices: (): ServiceItem[] => {
      return [
        // Creative
        { id: 's1', title: 'Brand Identity', description: 'Logos, typography, and visual language that sets you apart.', category: ServiceCategoryType.CREATIVE },
        { id: 's2', title: 'UI/UX Design', description: 'User-centric interfaces optimized for web and mobile engagement.', category: ServiceCategoryType.CREATIVE },
        { id: 's3', title: 'Motion Graphics', description: 'Engaging 2D/3D animations that tell your brand story vividly.', category: ServiceCategoryType.CREATIVE },
        
        // Development
        { id: 's4', title: 'Full-Stack Web', description: 'Scalable React & Next.js applications built for speed and SEO.', category: ServiceCategoryType.DEVELOPMENT },
        { id: 's5', title: 'eCommerce Solutions', description: 'High-converting Shopify & WooCommerce stores customized for sales.', category: ServiceCategoryType.DEVELOPMENT },
        { id: 's6', title: 'Mobile Apps', description: 'Native & cross-platform mobile experiences for iOS and Android.', category: ServiceCategoryType.DEVELOPMENT },
        
        // Growth
        { id: 's7', title: 'Performance Ads', description: 'Data-driven campaigns on Google & Meta with proven ROI.', category: ServiceCategoryType.GROWTH },
        { id: 's8', title: 'SEO Optimization', description: 'Ranking your brand at the top of search results organically.', category: ServiceCategoryType.GROWTH },
        { id: 's9', title: 'Content Strategy', description: 'Narratives that build community, trust, and authority in your niche.', category: ServiceCategoryType.GROWTH },
      ];
  },

  getLeads: async (): Promise<Lead[]> => {
    const { data } = await supabase.from('leads').select('*').order('date', { ascending: false });
    return (data || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        serviceInterest: l.service_interest,
        message: l.message,
        date: l.date
    }));
  },

  addLead: async (lead: Lead) => {
    await supabase.from('leads').insert({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        service_interest: lead.serviceInterest,
        message: lead.message,
        date: lead.date
    });
  }
};