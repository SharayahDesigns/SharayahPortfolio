export type ProjectImage = {
  src?: string
  type: 'desktop' | 'mobile' | 'dashboard' | 'storefront' | 'game'
  visual: 'cabana' | 'dashboard' | 'ecommerce' | 'barnes' | 'atlas'
  alt: string
  caption?: string
  width?: number
  height?: number
  color: string
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
  challenge: string
  role: string[]
  responsibilities: string[]
  platform: string
  team?: string
  process: CaseStudyStep[]
  solution: string[]
  solutionFeatures: { title: string; description: string }[]
  technicalImplementation: string[]
  constraints?: string[]
  outcomes: string[]
  technologies: string[]
  images: ProjectImage[]
  liveUrl?: string
  repositoryUrl?: string
  color: string
  visual: ProjectImage['visual']
  seo: {
    title: string
    description: string
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
      { type: 'desktop', visual: 'cabana', alt: 'Cabana Filters storefront showing product discovery grid with filter comparison cards', caption: 'Product discovery grid with visual filter comparison', color: '#00ffc6' },
    ],
    color: '#00ffc6',
    visual: 'cabana',
    liveUrl: 'https://cabanafilters.com/',
    seo: {
      title: 'Cabana Filters Case Study — Sharayah Hefner',
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
      { title: 'Consistent Layout System', description: 'Every dashboard view now follows the same spacing, navigation, and component patterns — reducing cognitive load.' },
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
      { type: 'dashboard', visual: 'dashboard', alt: 'StudioPlayer dashboard showing sidebar navigation, metric cards, and a data chart', caption: 'Redesigned dashboard with consistent layout and clear hierarchy', color: '#4dc9ff' },
    ],
    color: '#4dc9ff',
    visual: 'dashboard',
    liveUrl: 'https://studioplayer.com/',
    seo: {
      title: 'StudioPlayer Case Study — Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the UX design and frontend engineering of StudioPlayer.',
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
      'Customers needed to customize branded products, manage artwork, receive accurate estimates, maintain cart sessions and complete a reliable checkout across a complex multi-step experience. The workflow involved product configuration, visual proofing, payment processing, address validation and bot protection — all of which had to work together seamlessly.',
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
      'Integrated third-party services — Zakeke for customization, PayPal for payments, Google Places for addresses, and Cloudflare for bot protection — into a cohesive frontend workflow.',
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
      { type: 'storefront', visual: 'ecommerce', alt: 'My Logo Mat product customization interface showing artwork preview area and customization controls', caption: 'Product customization with live artwork preview and checkout controls', color: '#00ffc6' },
    ],
    color: '#00ffc6',
    visual: 'ecommerce',
    liveUrl: 'https://mylogomat.com/',
    seo: {
      title: 'My Logo Mat Case Study — Sharayah Hefner',
      description: 'See how Sharayah Hefner approached the UX design and frontend engineering of My Logo Mat.',
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
      { title: 'Understand', description: 'Defined the customer journey from landing through size comparison, pricing, and booking — identifying the decisions a dumpster-rental customer needs to make.' },
      { title: 'Simplify', description: 'Structured the site around a clear comparison and pricing flow, removing unnecessary steps between interest and booking.' },
      { title: 'Design', description: 'Created the complete visual system — layout, typography, color, and components — for a professional, trustworthy hauling brand.' },
      { title: 'Build', description: 'Built the full frontend in Next.js with a Supabase backend, including responsive pages, pricing interface, and booking flow.' },
      { title: 'Validate', description: 'Tested responsive layouts, booking flow, and the admin dashboard to ensure the customer and business sides both work correctly.' },
      { title: 'Ship', description: 'Deployed to production on Vercel with the live site now serving customers. Admin and notification systems are in continued development.' },
    ],
    solution: [
      'Built a responsive dumpster-rental website with size comparison, clear pricing, and a booking flow — giving customers a self-service path from research to starting a booking.',
      'Planned a custom admin dashboard for inventory management and customer notifications to support business operations behind the customer-facing site.',
    ],
    solutionFeatures: [
      { title: 'Size Comparison', description: 'Customers can compare dumpster sizes visually and understand which option fits their project.' },
      { title: 'Clear Pricing', description: 'Pricing is displayed clearly so customers understand costs before committing to a booking.' },
      { title: 'Booking Flow', description: 'Customers can begin the booking process directly through the website — online booking is being tested.' },
      { title: 'Admin Dashboard', description: 'A planned admin interface for inventory management and customer notifications — in active development.' },
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
      { type: 'desktop', visual: 'barnes', alt: 'Barnes Hauling website showing dumpster size comparison cards with pricing and booking interface', caption: 'Live dumpster-rental site with size comparison and pricing', color: '#00d97e' },
    ],
    color: '#00d97e',
    visual: 'barnes',
    liveUrl: 'https://barnes-hauling.vercel.app/',
    seo: {
      title: 'Barnes Hauling & Disposal Case Study — Sharayah Hefner',
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
      'Designed a geography-learning game that makes exploration feel collectible, competitive and visually rich — built around an atlas-inspired identity.',
    challenge:
      'Traditional geography-learning apps can feel repetitive and academic. Atlas League is designed to make learning feel collectible, competitive and exploratory — turning country knowledge into a game you want to keep playing.',
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
      { title: 'Understand', description: 'Researched what makes learning games engaging — progression, collection, competition — and how geography content could be structured around those mechanics.' },
      { title: 'Simplify', description: 'Focused the core loop on Explore (discover countries), Collect (earn country cards and stamps), and Compete (league rankings) to keep the experience focused.' },
      { title: 'Design', description: 'Created the full visual identity around an atlas-inspired aesthetic — maps, stamps, passports, and a warm gold-and-teal palette that evokes exploration.' },
      { title: 'Build', description: 'Developing the mobile interface in React with Supabase for data, building the navigation, game screens, and progression UI.' },
      { title: 'Validate', description: 'Iterating on game flow and visual design to ensure the progression feels rewarding and the interface stays intuitive on mobile.' },
      { title: 'Ship', description: 'Currently in development — social systems, payments, and competitive features are planned but not yet launched.' },
    ],
    solution: [
      'Designed a game system built on three pillars: Explore to discover countries, Collect to build your atlas, and Compete to climb league rankings.',
      'Created a full atlas-inspired visual identity — country cards, passport stamps, museum collections — that makes learning feel like treasure hunting.',
    ],
    solutionFeatures: [
      { title: 'Explore Mode', description: 'Players discover countries through interactive exploration, unlocking new regions and challenges as they progress.' },
      { title: 'Country Collections', description: 'Country cards and passport stamps give players a tangible sense of collection and progress — like filling a real atlas.' },
      { title: 'League Progression', description: 'Competitive league tiers motivate players to keep improving their geography knowledge and climb the rankings.' },
      { title: 'Atlas-Inspired Branding', description: 'The entire visual system — color, typography, iconography — is built around the aesthetic of vintage maps and exploration.' },
    ],
    technicalImplementation: [
      'Developing the mobile interface in React',
      'Using Supabase for data management and progression state',
      'Designing game-progression systems including league tiers, collections, and unlock mechanics',
      'Building the mobile navigation and screen architecture for Explore, Passport, and competitive views',
      'Creating the full visual identity and component system around the atlas theme',
    ],
    constraints: [
      'Atlas League is currently in development — not yet launched or in production use',
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
      { type: 'mobile', visual: 'atlas', alt: 'Atlas League mobile game showing a globe with location pins, a country card, and a progression bar in an atlas-inspired visual style', caption: 'Atlas League mobile interface with globe exploration and country collection', color: '#ffb84d' },
    ],
    color: '#ffb84d',
    visual: 'atlas',
    seo: {
      title: 'Atlas League Case Study — Sharayah Hefner',
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
