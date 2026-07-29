export type ProjectImage = {
  src?: string
  /** 720w variant served to narrow viewports via srcset. */
  srcSmall?: string
  type: 'desktop' | 'mobile' | 'dashboard' | 'storefront' | 'game'
  /** Only needed when no `src` is supplied and the simplified illustration is used instead. */
  visual?: 'cabana' | 'dashboard' | 'ecommerce' | 'barnes' | 'atlas'
  alt: string
  caption?: string
  width?: number
  height?: number
  color: string
}

/**
 * A narrative section rendered inside the standard case-study section frame.
 * Studies that supply `sections` use them in place of the default fixed body
 * sections, so a case study can follow its own storyline while reusing the
 * same headings, cards, lists and motion as every other study.
 */
export type CaseStudySection = {
  /** Section rail label, rendered as the section h2. */
  label: string
  /** Section heading, rendered as an h3 beneath the label. */
  heading: string
  paragraphs?: string[]
  /** Bulleted supporting points. */
  list?: string[]
  /** Rendered with the shared feature-card grid. */
  cards?: { title: string; description: string }[]
  /** Rendered with the shared numbered-step grid. */
  steps?: string[]
}

export type CaseStudyStep = {
  title: string
  description: string
}

export type CaseStudy = {
  slug: string
  title: string
  category: string
  status?: string
  summary: string
  valueStatement: string
  role: string[]
  responsibilities: string[]
  platform: string
  team?: string
  /** Additional overview rows, shown only when supplied. */
  client?: string
  projectType?: string
  audience?: string
  /** Intro paragraph shown above the overview grid. */
  overviewIntro?: string
  technologies: string[]
  images: ProjectImage[]
  liveUrl?: string
  repositoryUrl?: string
  color: string
  /** Simplified illustration used when no real hero screenshot exists. */
  visual?: ProjectImage['visual']
  /** Real screenshot used in place of the simplified hero illustration. */
  heroImage?: string
  /** 720w variant of the hero screenshot for narrow viewports. */
  heroImageSmall?: string
  heroImageAlt?: string
  heroImageWidth?: number
  heroImageHeight?: number
  /** Social-share image for this study; falls back to the site default. */
  ogImage?: string
  /** Custom narrative sections. When present they replace the default body sections. */
  sections?: CaseStudySection[]
  /** Default body sections, used when `sections` is not supplied. */
  challenge?: string
  process?: CaseStudyStep[]
  solution?: string[]
  solutionFeatures?: { title: string; description: string }[]
  technicalImplementation?: string[]
  constraints?: string[]
  outcomes?: string[]
  seo: {
    title: string
    description: string
    ogTitle?: string
    ogDescription?: string
  }
  /** Optional closing call to action; falls back to the shared default. */
  finalCta?: {
    heading: string
    highlight?: string
    body: string
  }
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'cabana-filters',
    title: 'Cabana Filters',
    category: 'E-Commerce · UX Engineering · Product Discovery',
    status: 'Live in Production',
    summary:
      'A customer-focused e-commerce experience that simplifies product education and helps shoppers confidently find the correct replacement filter.',
    valueStatement:
      'Turned a confusing filter catalog into a guided discovery experience that helps customers buy with confidence.',
    challenge:
      'Customers needed to understand filter differences and find compatible products without becoming overwhelmed by a complex catalog. The existing shopping experience presented too many similar-looking options with unclear distinctions, making it difficult for users to feel confident they were selecting the right product.',
    role: ['UX/UI Design', 'Frontend Development', 'Product Education', 'Responsive Design', 'E-Commerce Experience'],
    responsibilities: [
      'Designed customer-facing product-discovery experiences',
      'Created product education and comparison content',
      'Built responsive landing-page and e-commerce interfaces',
      'Produced branded visual assets',
      'Improved consistency across the customer journey',
    ],
    platform: 'Web · Responsive E-Commerce',
    process: [
      { title: 'Understand', description: 'Studied the filter product line, compatibility requirements, and the most common customer confusion points around filter selection.' },
      { title: 'Simplify', description: 'Distilled the catalog into a guided discovery flow that groups filters by use case rather than overwhelming users with every option at once.' },
      { title: 'Design', description: 'Created comparison layouts, product education visuals, and a visual system that makes filter differences immediately scannable.' },
      { title: 'Build', description: 'Implemented responsive interfaces with clean component architecture that handles the product data flexibly.' },
      { title: 'Validate', description: 'Reviewed the experience against product information and common selection scenarios to improve clarity and compatibility guidance.' },
      { title: 'Ship', description: 'Released the experience as part of the live e-commerce storefront and continued refining based on customer feedback.' },
    ],
    solution: [
      'Designed a product-discovery flow that guides customers through filter selection step by step instead of dumping them into a full catalog.',
      'Built comparison and education components that make the differences between filters visually clear and easy to understand.',
    ],
    solutionFeatures: [
      { title: 'Guided Discovery', description: 'Customers are led through their filter choice with clear visual cues rather than navigating a flat product grid.' },
      { title: 'Product Education', description: 'Comparison content helps shoppers understand what makes each filter different and which one fits their needs.' },
      { title: 'Responsive Storefront', description: 'The entire experience adapts cleanly from desktop to mobile, ensuring customers can research and purchase on any device.' },
    ],
    technicalImplementation: [
      'Built responsive interfaces for product discovery, comparison, and landing-page layouts',
      'Applied consistent component architecture across the storefront for maintainability',
      'Ensured responsive behavior across mobile, tablet, and desktop breakpoints',
    ],
    outcomes: [
      'Simplified a complex catalog into a guided, intuitive filter-finding flow',
      'Made filter differences easier to scan and understand',
      'Shipped a responsive e-commerce experience that works across all device sizes',
      'Established reusable product-display components for the storefront',
    ],
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Responsive Design', 'E-Commerce'],
    images: [
      { type: 'desktop', src: '/images/cabana.webp', width: 1563, height: 841,
        alt: 'Cabana Filters storefront homepage showing the hero section and product navigation',
        caption: 'Cabana Filters storefront, guided product discovery', color: '#00ffc6' },
    ],
    color: '#00ffc6',
    heroImage: '/images/cabana.webp',
    heroImageSmall: '/images/cabana-720.webp',
    heroImageAlt: 'Cabana Filters storefront homepage showing the hero section and product navigation',
    heroImageWidth: 1563,
    heroImageHeight: 841,
    liveUrl: 'https://cabanafilters.com/',
    seo: {
      title: 'Cabana Filters Case Study - Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the UX design and frontend engineering of Cabana Filters.',
    },
  },
  {
    slug: 'studioplayer',
    title: 'StudioPlayer',
    category: 'SaaS Dashboard · UX Redesign · Frontend Engineering',
    status: 'Live in Production',
    summary:
      'A redesigned media-management dashboard that makes complex content workflows clearer, more consistent and easier to operate.',
    valueStatement:
      'Redesigned a dense media-management dashboard into a clearer, more consistent tool that operators can actually navigate.',
    challenge:
      'The existing dashboard contained complex media-management workflows that needed stronger hierarchy, visual consistency and clearer user interactions. Interface elements were inconsistent across views, making it difficult for users to know where they were and what actions were available.',
    role: ['Product Design', 'Dashboard UX', 'Frontend Development', 'Interaction Design', 'Production Deployment'],
    responsibilities: [
      'Evaluated existing workflows and interface problems',
      'Redesigned the dashboard experience',
      'Established more consistent layout and styling patterns',
      'Implemented the redesigned frontend',
      'Added purposeful interface motion',
      'Helped deploy the updated experience through AWS',
    ],
    platform: 'Web · SaaS Dashboard',
    process: [
      { title: 'Understand', description: 'Audited the existing dashboard to map the current workflows, identify interface inconsistencies, and pinpoint where users were getting lost.' },
      { title: 'Simplify', description: 'Consolidated overlapping views and established a clearer information hierarchy so the most important actions are immediately visible.' },
      { title: 'Design', description: 'Created a consistent layout system with unified spacing, typography, and component patterns across the entire dashboard.' },
      { title: 'Build', description: 'Implemented the redesigned frontend in React with CSS Modules, adding purposeful Framer Motion animations that guide attention without distracting.' },
      { title: 'Validate', description: 'Reviewed and refined the redesigned workflows to improve navigation, hierarchy and interface consistency.' },
      { title: 'Ship', description: 'Deployed the updated experience to production through AWS.' },
    ],
    solution: [
      'Redesigned the dashboard with a consistent layout system that gives every view the same structural rhythm, so users always know where to look.',
      'Added purposeful motion to guide attention between states and confirm actions, replacing the static interface with one that feels responsive and alive.',
    ],
    solutionFeatures: [
      { title: 'Consistent Layout System', description: 'Every dashboard view now follows the same spacing, navigation, and component patterns, reducing cognitive load.' },
      { title: 'Clearer Workflow Hierarchy', description: 'The most important actions and information are immediately visible, with secondary controls revealed contextually.' },
      { title: 'Purposeful Animation', description: 'Framer Motion transitions guide users between states and confirm interactions without being decorative noise.' },
    ],
    technicalImplementation: [
      'Implemented the redesigned dashboard frontend in React with CSS Modules for scoped, maintainable styling',
      'Established consistent component and layout patterns across all dashboard views',
      'Added Framer Motion animations for state transitions and interaction feedback',
      'Deployed the updated experience to production through AWS',
    ],
    outcomes: [
      'Streamlined complex media-management workflows into a more navigable interface',
      'Improved interface consistency across all dashboard views',
      'Deployed a redesigned, production-ready experience via AWS',
      'Established reusable layout and styling patterns for the dashboard',
    ],
    technologies: ['React', 'JavaScript', 'CSS Modules', 'Framer Motion', 'AWS'],
    images: [
      { type: 'dashboard', src: '/images/studioPlayerUXUI.webp', width: 1280, height: 939,
        alt: 'StudioPlayer dashboard, media library and screen-manager views shown across three displays',
        caption: 'StudioPlayer, dashboard, media library and screen manager', color: '#4dc9ff' },
    ],
    color: '#4dc9ff',
    heroImage: '/images/studioPlayerUXUI.webp',
    heroImageSmall: '/images/studioPlayerUXUI-720.webp',
    heroImageAlt: 'StudioPlayer dashboard, media library and screen-manager views shown across three displays',
    heroImageWidth: 1280,
    heroImageHeight: 939,
    liveUrl: 'https://studioplayer.com/',
    seo: {
      title: 'StudioPlayer Case Study - Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the UX design and frontend engineering of StudioPlayer.',
    },
  },
  {
    slug: 'monnit-software',
    title: 'Monnit Software',
    category: 'IoT SaaS · Device Setup UX · User Flow Redesign',
    status: 'Product UX Redesign',
    summary:
      'A software UX project focused on wireframing and redesigning the setup flow for Monnit devices inside the iMonnit platform.',
    valueStatement:
      'Redesigned the device setup experience inside Monnit\'s software to make onboarding and configuration clearer, more guided, and less error-prone.',
    overviewIntro:
      'Monnit\'s iMonnit platform is the software hub customers use to manage sensors, gateways, alerts, and monitoring data. My work focused on the software experience for setting up Monnit devices, specifically improving the flow customers move through when getting devices connected and configured.',
    role: ['UX/UI Design', 'Wireframing', 'User Flow Design', 'Software Experience', 'Onboarding UX'],
    responsibilities: [
      'Mapped the existing setup journey and identified friction points',
      'Created wireframes for the redesigned setup experience',
      'Reworked the user flow for account access, onboarding, and device configuration',
      'Focused the interaction model around clarity, sequence, and reduced confusion',
      'Designed a more structured software experience for customers setting up hardware in the platform',
    ],
    platform: 'Web · SaaS Software',
    client: 'Monnit Software',
    projectType: 'Internal Product UX Redesign',
    audience:
      'Customers using the iMonnit platform to register, configure, and manage Monnit monitoring devices',
    technologies: ['Wireframing', 'User Flows', 'UX Design', 'SaaS', 'IoT Software'],
    sections: [
      {
        label: 'Project Overview',
        heading: 'Improving the setup experience inside Monnit\'s device-management software',
        paragraphs: [
          'Monnit customers use iMonnit to connect sensors, configure devices, and manage ongoing monitoring. The setup process is one of the most important moments in that experience because it directly affects how quickly a customer can get from hardware in hand to usable data inside the platform.',
          'My work focused on the software experience rather than the marketing website. I created wireframes and redesigned the user flow system for setting up Monnit software devices, with the goal of making onboarding and configuration more understandable and easier to complete.',
        ],
      },
      {
        label: 'The Challenge',
        heading: 'Device setup needed to feel more guided and less fragmented',
        paragraphs: [
          'When users are onboarding connected devices, confusion compounds quickly. They are often balancing account access, hardware steps, network understanding, configuration choices, and confirmation feedback at the same time.',
          'The setup flow needed clearer sequencing so users could understand where they were in the process, what was required next, and how their actions inside the software connected to the physical devices they were trying to bring online.',
        ],
        list: [
          'Reduce friction during device setup and onboarding',
          'Clarify the sequence of actions users need to take',
          'Make the software flow easier to understand for non-technical users',
          'Create wireframes that support a more consistent setup journey',
          'Improve confidence during configuration and confirmation steps',
        ],
      },
      {
        label: 'UX Goals',
        heading: 'The redesign centered on clarity, flow, and confidence',
        cards: [
          { title: 'Orientation', description: 'Users should always know what step they are in and what comes next.' },
          { title: 'Guidance', description: 'The software should support setup with a more directed, sequential experience instead of feeling fragmented.' },
          { title: 'Efficiency', description: 'Reduce unnecessary hesitation, backtracking, and uncertainty during onboarding.' },
          { title: 'Trust', description: 'Customers need clear confirmation that devices are being connected and configured correctly.' },
        ],
      },
      {
        label: 'Process',
        heading: 'Using wireframes to redesign the setup journey before implementation',
        steps: [
          'Reviewed the existing flow and identified the moments most likely to create confusion or drop-off',
          'Mapped the device setup journey from login and onboarding through configuration and confirmation',
          'Created wireframes to test a more structured, sequential setup system',
          'Simplified screen-to-screen transitions so the flow felt more cohesive',
          'Refined the experience around customer understanding rather than software complexity',
        ],
      },
      {
        label: 'Design Decisions',
        heading: 'Structuring the experience around what users need at each step',
        paragraphs: [
          'The redesign focused on making each step carry one clear purpose. Instead of forcing users to interpret too many system decisions at once, the flow was organized around the immediate action, the supporting context, and the expected outcome.',
          'This approach supports users who may be comfortable with the hardware but unfamiliar with the software, as well as users who need the interface to explain the setup path more explicitly.',
        ],
        list: [
          'Clearer progression through setup stages',
          'More deliberate information hierarchy within each screen',
          'Reduced ambiguity around configuration actions',
          'Stronger continuity between onboarding, setup, and confirmation states',
        ],
      },
      {
        label: 'Outcome',
        heading: 'A more understandable foundation for software onboarding',
        paragraphs: [
          'The resulting wireframes and user flow redesign created a clearer foundation for the Monnit software setup experience. The work was intended to reduce confusion, support customer confidence, and make device onboarding feel more like a guided system than a scattered collection of screens.',
        ],
        list: [
          'Redesigned the setup journey for Monnit software devices',
          'Created wireframes for a clearer software onboarding experience',
          'Improved flow continuity between account access, setup, and configuration',
          'Focused the experience around usability and reduced setup friction',
        ],
      },
      {
        label: 'Reflection',
        heading: 'What this project demonstrates',
        paragraphs: [
          'This project reflects my strength in software UX: identifying where user understanding breaks down, structuring better flows, and using wireframes to clarify the path before implementation begins. It also shows how I think about connected-product software, where the interface needs to support both digital decisions and real-world device actions.',
        ],
      },
    ],
    images: [
      {
        type: 'dashboard',
        src: '/images/monnitSoftware.webp',
        width: 600,
        height: 400,
        alt: 'Monnit software interface and device setup workflow screens',
        caption: 'Monnit software setup and management interface',
        color: '#4dc9ff',
      },
    ],
    color: '#4dc9ff',
    heroImage: '/images/monnitSoftware.webp',
    heroImageAlt: 'Monnit software interface and device setup workflow screens',
    heroImageWidth: 600,
    heroImageHeight: 400,
    seo: {
      title: 'Monnit Software Case Study - Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the UX redesign of Monnit\'s device setup flow inside the iMonnit software platform.',
      ogTitle: 'Monnit Software - Device Setup UX Case Study',
      ogDescription:
        'A UX case study focused on wireframing and redesigning the device setup flow inside Monnit\'s iMonnit software platform.',
    },
    finalCta: {
      heading: 'Need someone to clarify',
      highlight: 'a complicated software flow?',
      body: 'I design software experiences that reduce friction, guide users through complex steps, and make product workflows feel more understandable from the first screen forward.',
    },
  },
  {
    slug: 'my-logo-mat',
    title: 'My Logo Mat',
    category: 'Product Customization · E-Commerce · Checkout Engineering',
    status: 'Live in Production',
    summary:
      'A production e-commerce platform supporting product customization, artwork proofing, cart sessions, checkout, payments and order workflows.',
    valueStatement:
      'Owned the frontend of a multi-step e-commerce experience where customers customize products, upload artwork, and complete checkout reliably. Separate from the established React platform, a Shopify Hydrogen storefront initiative is underway.',
    challenge:
      'Customers needed to customize branded products, manage artwork, receive accurate estimates, maintain cart sessions and complete a reliable checkout across a complex multi-step experience. The workflow involved product configuration, visual proofing, payment processing, address validation and bot protection, and all of it had to work together seamlessly.',
    role: ['Frontend UX Engineering', 'React Development', 'E-Commerce Integration', 'Checkout Experience', 'Third-Party Integrations', 'Production Support'],
    responsibilities: [
      'Built and maintained React customer-facing interfaces',
      'Integrated Zakeke customization and preview experiences',
      'Implemented cart and checkout workflows',
      'Integrated PayPal payment handling',
      'Added Google Places address autocomplete',
      'Supported Cloudflare bot-protection flows',
      'Worked with guest and authenticated sessions',
      'Improved metadata, canonical URLs and SEO behavior',
      'Supported production releases through AWS',
    ],
    platform: 'Web · Multi-Storefront E-Commerce',
    process: [
      { title: 'Understand', description: 'Mapped the full customer journey from product landing through customization, proofing, cart, checkout, payment and confirmation.' },
      { title: 'Simplify', description: 'Broke the multi-step flow into clear stages so customers always know where they are and what comes next.' },
      { title: 'Design', description: 'Designed interface patterns for customization, artwork upload, and checkout that work across multiple storefronts.' },
      { title: 'Build', description: 'Implemented the React frontend, integrating Zakeke for live product preview, PayPal for payments, and Google Places for address autocomplete.' },
      { title: 'Validate', description: 'Tested the full checkout flow including guest sessions, payment handling, address validation and bot-protection edge cases.' },
      { title: 'Ship', description: 'Supported production releases through AWS across multiple storefronts with ongoing maintenance and improvements.' },
    ],
    solution: [
      'Built a multi-step customization and checkout flow that handles product configuration, live artwork preview, and payment in one connected experience.',
      'Integrated third-party services, including Zakeke for customization, PayPal for payments, Google Places for addresses, and Cloudflare for bot protection, into a cohesive frontend workflow.',
    ],
    solutionFeatures: [
      { title: 'Product Customization', description: 'Zakeke integration gives customers a live preview of their branded product before purchase.' },
      { title: 'Cart & Checkout', description: 'Session-based cart management handles both guest and authenticated users through a reliable multi-step checkout.' },
      { title: 'Payment & Address', description: 'PayPal payment handling and Google Places address autocomplete reduce friction and improve accuracy at checkout.' },
      { title: 'Bot Protection', description: 'Cloudflare integration helps protect checkout and form submissions from automated abuse.' },
      { title: 'Shopify Hydrogen Initiative', description: 'A separate Shopify Hydrogen storefront implementation is underway for product presentation, customer education and modern e-commerce page structure. Only features confirmed to be running on Hydrogen are described as part of it.' },
    ],
    technicalImplementation: [
      'Built React customer-facing interfaces across multiple e-commerce storefronts',
      'Integrated Zakeke for real-time product customization and visual preview',
      'Implemented cart and checkout workflows with support for both guest and authenticated sessions',
      'Integrated PayPal payment handling into the checkout flow',
      'Added Google Places address autocomplete for accurate shipping information',
      'Supported Cloudflare bot-protection flows for form and checkout security',
      'Improved metadata, canonical URLs and SEO behavior across storefront pages',
      'Supported production releases through AWS',
    ],
    constraints: [
      'Multiple storefronts shared the customization and checkout infrastructure, requiring flexible component architecture',
      'Guest and authenticated sessions needed to coexist without breaking cart state',
      'Third-party integrations (Zakeke, PayPal, Google Places, Cloudflare) each had their own API constraints and lifecycle requirements',
    ],
    outcomes: [
      'Owned checkout, customization, and payment flows across multiple customer-facing storefronts',
      'Delivered a reliable multi-step checkout experience with payment and address validation',
      'Reduced input errors through Google Places address autocomplete',
      'Improved SEO behavior with proper metadata and canonical URL handling',
      'Maintained production stability through ongoing releases and integration support',
    ],
    technologies: ['React', 'JavaScript', 'REST APIs', 'Zakeke', 'PayPal', 'Google Places', 'Cloudflare', 'AWS'],
    images: [
      { type: 'storefront', src: '/images/logomat.webp', width: 1548, height: 902,
        alt: 'My Logo Mat storefront showing the custom mat product experience',
        caption: 'My Logo Mat, Shopify Hydrogen storefront', color: '#00ffc6' },
    ],
    color: '#00ffc6',
    heroImage: '/images/logomat.webp',
    heroImageSmall: '/images/logomat-720.webp',
    heroImageAlt: 'My Logo Mat storefront showing the custom mat product experience',
    heroImageWidth: 1548,
    heroImageHeight: 902,
    liveUrl: 'https://mylogomat.com/',
    seo: {
      title: 'My Logo Mat Case Study - Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the UX design and frontend engineering of My Logo Mat.',
    },
  },
  {
    slug: 'concrete-connections-nwa',
    title: 'Concrete Connections NWA',
    category: 'Client Website · UX/UI Design · Frontend Engineering',
    status: 'Launched',
    summary:
      'An immersive lead-generation website for a specialty artificial-rockwork and themed-concrete contractor serving residential and commercial clients.',
    valueStatement:
      'Designing a digital experience where construction, craftsmanship, and environmental storytelling intersect.',
    overviewIntro:
      'Concrete Connections NWA creates artificial rockwork, pool grottos, waterfalls, themed environments, scenic walls, and custom concrete features for residential and commercial clients. I designed and developed a responsive website that communicates the company’s specialized capabilities through immersive visuals, clear service organization, market-specific messaging, project imagery, and conversion-focused quote paths.',
    role: ['UX/UI Design', 'Visual Direction', 'Information Architecture', 'Frontend Development', 'Responsive Design', 'Technical SEO'],
    responsibilities: [
      'Established the visual direction and brand presentation for the website',
      'Structured the information architecture around customer questions',
      'Designed the service, market, and project-gallery experiences',
      'Built the responsive frontend as reusable React components',
      'Implemented gallery filtering and quote-focused calls to action',
      'Set up page metadata, structured data, sitemap, and robots configuration',
    ],
    platform: 'Responsive Web',
    client: 'Concrete Connections NWA',
    projectType: 'Independent Client Website',
    audience:
      'Homeowners, pool builders, landscape professionals, architects, zoos, aquariums, museums, resorts, attractions, and commercial partners',
    technologies: ['React', 'JavaScript', 'Responsive Design', 'Three.js', 'Technical SEO'],
    sections: [
      {
        label: 'Project Overview',
        heading: 'Turning specialized craftsmanship into a clear digital experience',
        paragraphs: [
          'Concrete Connections NWA works at the intersection of structural construction and environmental artistry. The website needed to communicate both sides of that work: the engineering required to create durable outdoor installations and the artistic process used to make sculpted concrete feel like natural stone.',
          'The final experience presents the company as a specialized design-and-build partner rather than a general concrete contractor. It gives residential and commercial visitors clear ways to understand the services, explore relevant applications, review project imagery, and begin a quote conversation.',
        ],
      },
      {
        label: 'The Challenge',
        heading: 'A highly visual service that is difficult to explain with words alone',
        paragraphs: [
          'Artificial rockwork is a specialized service that many potential customers do not immediately understand. The website needed to explain what the company builds, who it serves, how the work differs from ordinary concrete construction, and why the finished installations are both artistic and structurally dependable.',
          'The experience also needed to serve very different audiences, from homeowners considering a pool grotto to organizations planning zoo habitats, resort environments, museum exhibits, or public attractions.',
        ],
        list: [
          'Explain an uncommon and highly specialized service',
          'Balance artistic presentation with technical credibility',
          'Organize a wide range of services and markets',
          'Make project imagery central to the experience',
          'Support both residential and commercial lead generation',
          'Create a distinct brand presence without feeling theatrical or unprofessional',
        ],
      },
      {
        label: 'Experience Goals',
        heading: 'The experience needed to feel crafted, capable, and credible',
        cards: [
          { title: 'Clarity', description: 'Help visitors quickly understand what themed concrete and artificial rockwork can include.' },
          { title: 'Visual impact', description: 'Use imagery and movement to reflect the scale and craftsmanship of the physical work.' },
          { title: 'Trust', description: 'Communicate durability, weather resistance, drainage considerations, and design-to-installation capability.' },
          { title: 'Discovery', description: 'Let different audiences recognize the services and market applications relevant to their project.' },
          { title: 'Conversion', description: 'Maintain a clear path to requesting a quote without overwhelming visitors with premature form fields.' },
        ],
      },
      {
        label: 'Information Architecture',
        heading: 'Organizing the experience around customer questions',
        paragraphs: ['The homepage was structured around the questions a prospective customer is most likely to ask:'],
        list: [
          'What does the company build?',
          'Can it handle my type of project?',
          'Does the work look realistic?',
          'Is it designed for outdoor exposure?',
          'Can the team manage both design and installation?',
          'How do I start a conversation about my project?',
        ],
        steps: [
          'Brand and capability introduction',
          'Core service categories',
          'Craftsmanship imagery',
          'Markets and project applications',
          'Featured work',
          'Quote-focused call to action',
          'Contact and service information',
        ],
      },
      {
        label: 'Visual Direction',
        heading: 'A visual system inspired by stone, shadow, and natural environments',
        paragraphs: [
          'The visual direction uses dark charcoal surfaces, restrained natural greens, stone-inspired textures, large environmental imagery, and clean typography. The goal was to create an experience that feels premium and immersive while keeping navigation and service information direct and readable.',
        ],
        list: [
          'Dark, natural color palette',
          'Large-scale project photography',
          'Subtle depth and environmental motion',
          'Clean service and market cards',
          'Strong contrast between visual storytelling and conversion actions',
          'Responsive layouts designed to preserve impact on smaller screens',
        ],
      },
      {
        label: 'Service Discovery',
        heading: 'Making a complex service offering easier to scan',
        paragraphs: [
          'The service architecture breaks the company’s capabilities into recognizable project types, including pool grottos and waterfalls, rock veneers and retaining features, themed environments, caves and scenic walls, custom boulders, restoration work, and faux wood or stone finishes.',
          'This approach helps visitors identify the closest match to their project without requiring them to understand industry terminology before contacting the company.',
        ],
      },
      {
        label: 'Serving Multiple Markets',
        heading: 'One visual system for residential and commercial audiences',
        paragraphs: [
          'The site needed to support both private clients and professional project partners. Market-specific content helps pool builders, resorts, zoos, museums, theme parks, municipalities, restaurants, and homeowners recognize how the same core craft can be adapted to different environments.',
          'The design keeps these applications connected under one brand while avoiding separate experiences that would fragment the website.',
        ],
      },
      {
        label: 'Frontend Implementation',
        heading: 'Building the visual direction into a responsive production experience',
        paragraphs: [
          'I translated the visual direction into a responsive frontend experience with reusable sections, structured project content, responsive media treatments, accessible navigation, gallery interactions, and focused calls to action.',
        ],
        list: [
          'Component-based React architecture',
          'Responsive layouts across desktop, tablet, and mobile',
          'Reusable service, market, and project-card components',
          'Interactive gallery filtering by project category',
          'Three.js-enhanced visual elements alongside CSS-driven motion',
          'Semantic content structure with a single page-level heading',
          'Descriptive image alternative text',
          'Click-to-call and email actions',
        ],
      },
      {
        label: 'SEO & Discoverability',
        heading: 'Supporting a specialized regional service with technical SEO',
        paragraphs: [
          'The site includes search-focused page metadata and structured information designed to help search engines understand the business, its service area, and its specialty services.',
        ],
        list: [
          'Descriptive page title and meta description',
          'Canonical homepage URL',
          'Open Graph and Twitter sharing metadata',
          'LocalBusiness structured data',
          'FAQ structured data',
          'Geographic and service-area information',
          'XML sitemap',
          'Robots configuration',
          'Descriptive image alt text',
        ],
      },
      {
        label: 'Outcome',
        heading: 'A distinctive digital foundation for a highly specialized business',
        paragraphs: [
          'The completed website gives Concrete Connections NWA a professional digital presence that reflects the creativity and technical skill behind its physical work. It transforms a broad and unfamiliar service offering into an organized experience that helps residential and commercial visitors understand the company’s capabilities, explore project possibilities, and begin a quote conversation.',
        ],
        list: [
          'Created a complete visual direction for the client’s online presence',
          'Organized specialized services into understandable categories',
          'Connected residential and commercial audiences through shared project applications',
          'Built a responsive frontend experience around visual storytelling',
          'Established a clear quote and contact journey',
          'Added the technical SEO foundation needed for future service and location content',
        ],
      },
      {
        label: 'Reflection',
        heading: 'What this project demonstrates',
        paragraphs: [
          'This project demonstrates my ability to combine visual design, UX strategy, information architecture, and frontend engineering within a single client engagement. It required me to understand an uncommon physical service, establish a credible digital identity, organize content for multiple customer groups, and implement the final experience as a responsive production website.',
        ],
        cards: [
          { title: 'Designing for understanding', description: 'Strong visuals still need clear information architecture and service language.' },
          { title: 'Balancing emotion and utility', description: 'An immersive experience works best when navigation and conversion actions remain straightforward.' },
          { title: 'Translating physical craft into digital form', description: 'The website needed to feel shaped and intentional without competing with the craftsmanship it was presenting.' },
        ],
      },
    ],
    images: [
      { type: 'desktop', src: '/images/ccnwa-services.webp', srcSmall: '/images/ccnwa-services-720.webp', width: 1440, height: 981, alt: 'Services section showing project-type cards for pool grottos, rock veneers, themed environments, caves and scenic walls, custom boulders, repairs, and faux finishes', caption: 'Service categories that let visitors self-identify their project type', color: '#00ffc6' },
      { type: 'desktop', src: '/images/ccnwa-markets.webp', srcSmall: '/images/ccnwa-markets-720.webp', width: 1440, height: 1053, alt: 'Markets We Serve section listing twelve market cards including pool builders, hotels and resorts, zoos and aquariums, museums, theme parks, and municipal parks', caption: 'Market applications connecting residential and commercial audiences', color: '#00ffc6' },
      { type: 'desktop', src: '/images/ccnwa-gallery.webp', srcSmall: '/images/ccnwa-gallery-720.webp', width: 1440, height: 882, alt: 'Featured Projects gallery with category filter buttons for All, Commercial, Exhibits, and Scenic Walls above a grid of rockwork installation photographs', caption: 'Filterable project gallery built from real installation photography', color: '#00ffc6' },
      { type: 'desktop', src: '/images/ccnwa-quote.webp', srcSmall: '/images/ccnwa-quote-720.webp', width: 1440, height: 270, alt: 'Closing call-to-action band reading “Bring your environment to life” with request-a-quote and call-now buttons', caption: 'Closing conversion band with quote and click-to-call actions', color: '#00ffc6' },
      { type: 'mobile', src: '/images/ccnwa-mobile.webp', width: 720, height: 1558, alt: 'Mobile homepage with stacked hero heading, description, and full-width request-a-quote and view-gallery buttons', caption: 'Mobile homepage: stacked hierarchy with full-width actions', color: '#00ffc6' },
      { type: 'mobile', src: '/images/ccnwa-mobile-nav.webp', width: 720, height: 1558, alt: 'Mobile navigation panel open, listing Services, Markets, Process, Gallery, FAQ, and Contact with a request-a-quote button', caption: 'Mobile navigation keeps the quote action within reach', color: '#00ffc6' },
    ],
    color: '#00ffc6',
    heroImage: '/images/ccnwa-hero.webp',
    heroImageSmall: '/images/ccnwa-hero-720.webp',
    heroImageAlt: 'Concrete Connections NWA themed concrete contractor website homepage',
    heroImageWidth: 1440,
    heroImageHeight: 900,
    ogImage: '/images/ccnwa-og.jpg',
    liveUrl: 'https://concreteconnectionsnwa.com/',
    seo: {
      title: 'Concrete Connections NWA Case Study | Sharayah Hefner',
      description:
        'A UX/UI and frontend development case study for Concrete Connections NWA, an immersive lead-generation website created for a specialty artificial-rockwork and themed-concrete contractor.',
      ogTitle: 'Concrete Connections NWA - UX/UI & Frontend Case Study',
      ogDescription:
        'See how Sharayah Hefner designed and developed an immersive, responsive website for a specialty artificial-rockwork and themed-concrete contractor.',
    },
    finalCta: {
      heading: 'Need someone who can design the experience',
      highlight: 'and build the frontend?',
      body: 'I work across UX/UI design, visual systems, and frontend engineering to turn complex products and services into clear, polished digital experiences.',
    },
  },
  {
    slug: 'barnes-hauling',
    title: 'Barnes Hauling & Disposal',
    category: 'Product Design · Booking Experience · Frontend Build',
    status: 'Client Project · Active Development',
    summary:
      'Designed and developed a responsive dumpster-rental website that helps customers compare sizes, understand pricing and begin the service-booking process. Deployed on Vercel with a Supabase backend; administrative workflows are in progress.',
    valueStatement:
      'Owned the product design, frontend build, and responsive experience for a dumpster-rental website with the foundation for online booking and administrative workflows.',
    challenge:
      'A hauling and disposal business needed a modern web presence where customers could compare dumpster sizes, understand pricing, and schedule service online. The previous experience lacked a clear customer journey, and there was no self-service way to compare options or initiate a booking.',
    role: ['Product Strategy', 'UX/UI Design', 'Frontend Development', 'Responsive Design', 'Pricing Experience', 'Supporting System Design'],
    responsibilities: [
      'Defined the website structure and customer journey',
      'Designed the complete visual system',
      'Built responsive customer-facing pages',
      'Created dumpster-size and pricing comparisons',
      'Developed the booking experience',
      'Planned supporting administrative and customer-notification workflows',
    ],
    platform: 'Web · Next.js · Supabase',
    process: [
      { title: 'Understand', description: 'Defined the customer journey from landing through size comparison, pricing, and booking, identifying the decisions a dumpster-rental customer needs to make.' },
      { title: 'Simplify', description: 'Structured the site around a clear comparison and pricing flow, removing unnecessary steps between interest and booking.' },
      { title: 'Design', description: 'Created the complete visual system of layout, typography, color, and components for a professional, trustworthy hauling brand.' },
      { title: 'Build', description: 'Built the full frontend in Next.js with a Supabase backend, including responsive pages, pricing interface, and booking flow.' },
      { title: 'Validate', description: 'Tested responsive layouts, booking flow, and the admin dashboard to ensure the customer and business sides both work correctly.' },
      { title: 'Ship', description: 'Deployed to production on Vercel with the live site now serving customers. Admin and notification systems are in continued development.' },
    ],
    solution: [
      'Built a responsive dumpster-rental website with size comparison, clear pricing, and a booking flow, giving customers a self-service path from research to starting a booking.',
      'Planned a custom admin dashboard for inventory management and customer notifications to support business operations behind the customer-facing site.',
    ],
    solutionFeatures: [
      { title: 'Size Comparison', description: 'Customers can compare dumpster sizes visually and understand which option fits their project.' },
      { title: 'Clear Pricing', description: 'Pricing is displayed clearly so customers understand costs before committing to a booking.' },
      { title: 'Booking Flow', description: 'Customers can begin the booking process directly through the website; online booking is being tested.' },
      { title: 'Admin Dashboard', description: 'A planned admin interface for inventory management and customer notifications, now in active development.' },
    ],
    technicalImplementation: [
      'Built the full frontend in Next.js with a Supabase backend',
      'Deployed to production on Vercel',
      'Implemented responsive customer-facing pages with Next.js component architecture',
      'Created dumpster-size comparison and pricing interface components',
      'Developed the booking experience flow',
      'Planned supporting admin and customer-notification system architecture',
    ],
    constraints: [
      'Administrative dashboard, customer notifications, payments, waivers and scheduling are planned features, not completed functionality',
      'Online booking is being tested; the admin dashboard is not yet production-ready',
      'The project is designed to serve both customers (booking) and business operators (admin) from the same platform',
    ],
    outcomes: [
      'Delivered the visual system, responsive frontend, pricing experience and foundation for online booking and administrative workflows',
      'Owned the product design, frontend build, responsive experience, and pricing interface',
      'Delivered a self-service booking experience that did not previously exist',
      'Built a complete visual system and brand presence for the business',
    ],
    technologies: ['Next.js', 'Supabase', 'Vercel', 'Responsive Design', 'E-Commerce UX'],
    images: [
      { type: 'desktop', src: '/images/bhanddisposal.webp', width: 1641, height: 844,
        alt: 'Barnes Hauling & Disposal homepage with the dumpster-rental hero section',
        caption: 'Barnes Hauling & Disposal, dumpster rental homepage', color: '#00d97e' },
    ],
    color: '#00d97e',
    heroImage: '/images/bhanddisposal.webp',
    heroImageSmall: '/images/bhanddisposal-720.webp',
    heroImageAlt: 'Barnes Hauling & Disposal homepage with the dumpster-rental hero section',
    heroImageWidth: 1641,
    heroImageHeight: 844,
    liveUrl: 'https://barnes-hauling.vercel.app/',
    seo: {
      title: 'Barnes Hauling & Disposal Case Study - Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the product design and frontend engineering of Barnes Hauling & Disposal.',
    },
  },
  {
    slug: 'atlas-league',
    title: 'Atlas League',
    category: 'Mobile Product · Game UX · Creative Development',
    status: 'In Development',
    summary:
      'A mobile geography-learning game combining exploration, competitive progression, country collections and an atlas-inspired visual identity.',
    valueStatement:
      'Designed a geography-learning game that makes exploration feel collectible, competitive, and visually rich, built around an atlas-inspired identity.',
    challenge:
      'Traditional geography-learning apps can feel repetitive and academic. Atlas League is designed to make learning feel collectible, competitive, and exploratory, turning country knowledge into a game you want to keep playing.',
    role: ['Product Strategy', 'UX/UI Design', 'Game-System Design', 'Mobile Interface Development', 'Branding', 'Visual Systems'],
    responsibilities: [
      'Created the product concept and brand direction',
      'Designed the navigation and mobile experience',
      'Developed league tiers and progression systems',
      'Designed Passport, Explore and collection experiences',
      'Created country-card, stamp and museum concepts',
      'Planned social and competitive systems',
      'Built the visual language around maps, exploration and global mastery',
    ],
    platform: 'Mobile · React',
    process: [
      { title: 'Understand', description: 'Researched what makes learning games engaging, including progression, collection, and competition, and how geography content could be structured around those mechanics.' },
      { title: 'Simplify', description: 'Focused the core loop on Explore (discover countries), Collect (earn country cards and stamps), and Compete (league rankings) to keep the experience focused.' },
      { title: 'Design', description: 'Created the full visual identity around an atlas-inspired aesthetic, with maps, stamps, passports, and a warm gold-and-teal palette that evokes exploration.' },
      { title: 'Build', description: 'Developing the mobile interface in React with Supabase for data, building the navigation, game screens, and progression UI.' },
      { title: 'Validate', description: 'Iterating on game flow and visual design to ensure the progression feels rewarding and the interface stays intuitive on mobile.' },
      { title: 'Ship', description: 'Currently in development; social systems, payments, and competitive features are planned but not yet launched.' },
    ],
    solution: [
      'Designed a game system built on three pillars: Explore to discover countries, Collect to build your atlas, and Compete to climb league rankings.',
      'Created a full atlas-inspired visual identity with country cards, passport stamps, and museum collections that makes learning feel like treasure hunting.',
    ],
    solutionFeatures: [
      { title: 'Explore Mode', description: 'Players discover countries through interactive exploration, unlocking new regions and challenges as they progress.' },
      { title: 'Country Collections', description: 'Country cards and passport stamps give players a tangible sense of collection and progress, like filling a real atlas.' },
      { title: 'League Progression', description: 'Competitive league tiers motivate players to keep improving their geography knowledge and climb the rankings.' },
      { title: 'Atlas-Inspired Branding', description: 'The entire visual system, from color to typography to iconography, is built around the aesthetic of vintage maps and exploration.' },
    ],
    technicalImplementation: [
      'Developing the mobile interface in React',
      'Using Supabase for data management and progression state',
      'Designing game-progression systems including league tiers, collections, and unlock mechanics',
      'Building the mobile navigation and screen architecture for Explore, Passport, and competitive views',
      'Creating the full visual identity and component system around the atlas theme',
    ],
    constraints: [
      'Atlas League is currently in development and not yet launched or in production use',
      'Social and competitive systems, payments, and production infrastructure are planned features, not completed functionality',
    ],
    outcomes: [
      'Owned product strategy, game-system design, and the full atlas-inspired brand system',
      'Designed a focused three-pillar game loop (Explore, Collect, Compete) that makes geography learning engaging',
      'Created a complete mobile interface design and visual identity',
      'Designed and began implementing the progression, collection and mobile-interface systems',
    ],
    technologies: ['React', 'JavaScript', 'Supabase', 'Mobile Development', 'Game UX', 'Product Design'],
    images: [
      { type: 'mobile', src: '/images/AtlasMobileview.webp', width: 1254, height: 1254,
        alt: 'Atlas League mobile screens showing the globe explorer, onboarding, sign-in, country card and daily expedition',
        caption: 'Atlas League, globe exploration, collection and progression screens', color: '#ffb84d' },
    ],
    color: '#ffb84d',
    heroImage: '/images/AtlasMobileview.webp',
    heroImageSmall: '/images/AtlasMobileview-720.webp',
    heroImageAlt: 'Atlas League mobile screens showing the globe explorer, onboarding, sign-in, country card and daily expedition',
    heroImageWidth: 1254,
    heroImageHeight: 1254,
    seo: {
      title: 'Atlas League Case Study - Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the product design and frontend engineering of Atlas League.',
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}

export function getAdjacentCaseStudies(slug: string): { prev: CaseStudy; next: CaseStudy } {
  const index = caseStudies.findIndex((cs) => cs.slug === slug)
  const prev = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length]
  const next = caseStudies[(index + 1) % caseStudies.length]
  return { prev, next }
}
