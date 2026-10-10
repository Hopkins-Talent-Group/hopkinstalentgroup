/**
 * All editable copy and imagery for the site lives here.
 * Update this file to change content without touching components.
 */

export const site = {
  brand: {
    crest: 'HTG',
    name: 'Hopkins Talent Group',
    sub: 'Artist Management · Live Entertainment',
    tagline: 'Representation with purpose. Promotion with vision.',
    copyrightName: 'Hopkins Talent Group',
  },

  /**
   * Where the inquiry form hands off to. Leave empty to keep the demo
   * behaviour (validate only, nothing is sent). Set an address to enable
   * the mailto handoff, e.g. 'hello@hopkinstalentgroup.com'.
   */
  inquiryRecipientEmail: '',

  navLinks: [
    { label: 'What We Do', href: '#services' },
    { label: 'Our Approach', href: '#approach' },
    { label: 'Talent', href: '#talent' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    kicker: 'Management · Promotion · Representation',
    title: {
      lead: 'Talent is the act.',
      highlight: 'Business is the',
      tail: 'backstage.',
    },
    body:
      "Hopkins Talent Group connects artists, opportunities, and audiences. From career strategy to live entertainment and booking inquiries, we bring a manager's mindset and a promoter's drive to every move.",
    primaryCta: { label: 'Discuss an Opportunity', href: '#contact' },
    secondaryCta: { label: 'Explore Our Services', href: '#services' },
    stats: [
      { strong: 'Artist Management', small: 'Career direction' },
      { strong: 'Live Entertainment', small: 'Events & appearances' },
      { strong: 'Talent Booking', small: 'New opportunities' },
    ],
    /** OWNER PHOTO: drop the file in public/images and set the path below. */
    photo: '/images/hero.webp',
    photoAlt: 'Hopkins Talent Group owner portrait',
    photoTag: {
      strong: 'Behind the talent. Beyond the stage.',
      span: 'Professional representation starts here.',
      mark: 'HTG / LIVE',
    },
  },

  trustBar: [
    {
      icon: '♬',
      strong: 'Artist Management',
      small: 'Build the bigger picture',
    },
    {
      icon: '✦',
      strong: 'Talent Booking',
      small: 'Connect talent to opportunity',
    },
    {
      icon: '▣',
      strong: 'Event Promotion',
      small: 'Bring live experiences to life',
    },
    {
      icon: '↗',
      strong: 'Career Development',
      small: 'Move forward with a plan',
    },
  ],

  services: {
    kicker: 'What we bring to the table',
    title: 'Representation with a business mindset.',
    body:
      'Talent is the starting point. Good management takes organization, relationships, follow-through, and an understanding of what makes the next opportunity worthwhile.',
    items: [
      {
        num: '01 / MANAGEMENT',
        icon: '♬',
        title: 'Artist Management',
        body: "Career planning, professional positioning, opportunity review, and ongoing guidance tailored to each artist's goals.",
        link: { label: 'Discuss management ↗', href: '#contact' },
      },
      {
        num: '02 / BOOKING',
        icon: '✦',
        title: 'Talent & Booking',
        body: 'Coordinate inquiries for performances, appearances, collaborations, and other opportunities that put talent in front of the right audience.',
        link: { label: 'Make a booking inquiry ↗', href: '#contact' },
      },
      {
        num: '03 / PROMOTION',
        icon: '▣',
        title: 'Live Event Promotion',
        body: 'Support event concepts, talent coordination, promotional planning, and communication between artists, venues, and partners.',
        link: { label: 'Plan an event ↗', href: '#contact' },
      },
    ],
  },

  approach: {
    kicker: 'The HTG approach',
    titleLines: ['Think like a manager.', 'Move like a promoter.'],
    body:
      'Great representation is equal parts vision and execution. We focus on the details behind the scenes so artists and partners can approach each opportunity with clarity and professionalism.',
    checklist: [
      'Clear communication and professional follow-through',
      'Thoughtful career and opportunity planning',
      'Strong relationships with artists and industry partners',
      'A focus on long-term value, not just the next date',
    ],
    cta: { label: 'Start a Conversation ↗', href: '#contact' },
    image: {
      src: '/images/photo-1470229722913-7c0e2dbbafd3.jpg',
      alt: 'Concert crowd with hands raised toward a brightly lit stage',
      stamp: 'The show is only the beginning',
    },
  },

  talent: {
    kicker: 'Talent & representation',
    title: 'Every artist has a next level.',
    body:
      'Use this space to showcase represented artists, performers, and talent available for inquiries. Each profile can be expanded with approved photos, bios, genres, credits, and booking details.',
    artists: [
      {
        name: 'Featured Artist',
        bio: 'Artist biography, genre, selected credits, and booking information will appear here.',
        label: 'Artist profile / placeholder',
        photo: '/images/photo-1500648767791-00dcc994a43e.jpg',
        alt: 'Temporary stock portrait for an artist profile',
      },
      {
        name: 'Featured Talent',
        bio: "Introduce the artist's sound, style, live experience, and current opportunities.",
        label: 'Artist profile / placeholder',
        photo: '/images/photo-1534528741775-53994a69daeb.jpg',
        alt: 'Temporary stock portrait for an artist profile',
      },
      {
        name: 'Featured Performer',
        bio: 'Highlight professional background, audience, notable work, and availability.',
        label: 'Artist profile / placeholder',
        photo: '/images/photo-1506794778202-cad84cf45f1d.jpg',
        alt: 'Temporary stock portrait for an artist profile',
      },
    ],
    foot: 'Sample profiles and stock portraits are placeholders and should be replaced with approved talent details before launch.',
  },

  gallery: {
    kicker: 'Gallery',
    title: 'Gallery',
    /** GALLERY PHOTOS: drop the files in public/images and set the paths below. */
    images: [
      { src: '/images/gallery-1.webp', alt: 'Gallery photo' },
      { src: '/images/gallery-2.webp', alt: 'Gallery photo' },
      { src: '/images/gallery-3.png', alt: 'Gallery photo' },
      { src: '/images/gallery-4.webp', alt: 'Gallery photo' },
      { src: '/images/gallery-5.webp', alt: 'Gallery photo' },
    ],
  },

  quote: {
    lines: ['The spotlight belongs to the artist.', 'The strategy belongs behind them.'],
    attribution: 'Hopkins Talent Group · Artist Management & Live Entertainment',
  },

  contact: {
    kicker: 'Business starts with a conversation',
    titleLines: ["Let's make", 'something happen.'],
    body:
      'Are you an artist looking for representation, a venue seeking talent, or a partner planning a live experience? Send the details and start the conversation.',
    points: [
      {
        strong: 'Artist inquiries',
        body: 'Representation, career direction, roster consideration',
      },
      {
        strong: 'Booking & event inquiries',
        body: 'Performances, appearances, venues, and promotion',
      },
      {
        strong: 'Partnerships',
        body: 'Collaborations, business opportunities, and media',
      },
    ],
    form: {
      title: 'Submit an inquiry',
      intro: "Give us the essentials. We'll take it from there.",
      submitLabel: 'Prepare Inquiry',
      note: 'Prototype form: submissions are not transmitted or stored. Connect the form to a secure backend or form service before publishing.',
      successNoRecipient:
        'Your inquiry details have been validated. Add the confirmed agency email address in the code to enable email handoff. Nothing has been sent or stored by this demo.',
      successWithRecipient: 'Opening your email app to send the inquiry.',
      inquiryTypes: [
        'Artist management',
        'Talent booking',
        'Event promotion',
        'Venue / partnership',
        'Press / media',
        'Other',
      ],
    },
  },

  footerLinks: [
    { label: 'Services', href: '#services' },
    { label: 'Talent', href: '#talent' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ],
};

export type Site = typeof site;
