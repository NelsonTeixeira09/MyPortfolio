/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — everything you see on the site lives in this file.
 *
 *  • Text inside [square brackets] is a placeholder. On the site it gets a
 *    dashed underline so nothing unfinished goes unnoticed. Replace it
 *    (brackets included) with your real details.
 *  • A link whose address still contains [brackets] won't navigate; it shows
 *    a small "placeholder" notice instead.
 *  • Lists (experience, projects, skills…) can be reordered, extended or
 *    trimmed freely — the layout adapts.
 *  • Dates use the format 'YYYY-MM' (e.g. '2025-07') where noted.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const content = {
  meta: {
    title: 'Nelson Teixeira — Software Developer',
    description:
      'Nelson Teixeira is a software developer from the Azores, Portugal, building OutSystems applications and exploring SAP CAP.',
  },

  person: {
    name: 'Nelson Teixeira',
    role: 'Software Developer',
    location: 'Azores, Portugal',
    intro:
      'I build OutSystems applications — e-commerce features, integrations, back-office tools and employee portals — with around four years of professional experience. Currently expanding into SAP CAP.',
    // Short keywords shown under the hero buttons.
    focus: ['OutSystems Reactive', 'REST APIs', 'SAP CAP'],
  },

  about: {
    heading: 'Practical software, built with care.',
    paragraphs: [
      "I'm a software developer based in the Azores, Portugal. For around four years, most of my professional work has been building applications with OutSystems — from e-commerce features and integrations to back-office tools and internal employee portals.",
      "Day to day that means OutSystems Reactive web development, connecting systems through REST APIs, improving performance, adding analytics tracking and integrating rich-text editing with CKEditor 5. I've worked on e-commerce, government back-office applications and internal company portals.",
      "Right now I'm expanding into SAP CAP — learning it and applying it in project work with Node.js, CDS and SAP BTP.",
      '[Optional: add a personal line — what you enjoy about your work, or the kind of team or project you are looking for next.]',
    ],
    facts: [
      { value: '~4 yrs', label: 'Professional experience' },
      { value: '2', label: 'OutSystems certifications' },
      { value: 'SAP CAP', label: 'Current focus' },
      { value: 'Azores', label: 'Portugal' },
    ],
  },

  // Most recent first. Set `learning: true` to mark an entry as learning/practice.
  experience: [
    {
      role: '[Job title — e.g. OutSystems Developer]',
      company: '[Company name]',
      start: '[Month Year]',
      end: 'Present',
      location: '[City / Remote]',
      summary:
        'Building OutSystems Reactive web applications across e-commerce, government back-office and internal company portal projects.',
      highlights: [
        'E-commerce features and integrations',
        'Back-office tools and employee portals',
        'REST APIs, performance improvements and analytics tracking',
        'CKEditor 5 integrations',
      ],
      tags: ['OutSystems Reactive', 'REST APIs', 'CKEditor 5'],
    },
    {
      role: 'SAP CAP — learning & project work',
      company: '[Company / self-directed]',
      start: '[Month Year]',
      end: 'Present',
      location: '',
      learning: true,
      summary:
        'Learning the SAP Cloud Application Programming Model and applying it in project work.',
      highlights: ['Working with Node.js, CDS and SAP BTP'],
      tags: ['SAP CAP', 'Node.js', 'CDS', 'SAP BTP'],
    },
    {
      role: '[Previous role]',
      company: '[Company name]',
      start: '[Month Year]',
      end: '[Month Year]',
      location: '[City / Remote]',
      summary: '[Short description of this role — or delete this entry.]',
      highlights: [],
      tags: [],
    },
  ],

  /**
   * status:       'professional' | 'learning'
   * confidential: true shows a "Confidential" badge
   * art:          card illustration — 'commerce' | 'gov' | 'portal' | 'integrations' | 'cap'
   * link:         optional URL (leave '' to hide the link)
   */
  projects: [
    {
      title: 'E-commerce Platform',
      status: 'professional',
      confidential: true,
      art: 'commerce',
      summary:
        'Feature development and integrations for an e-commerce platform built with OutSystems.',
      tags: ['OutSystems Reactive', 'E-commerce', 'Integrations'],
      link: '',
    },
    {
      title: 'Government Back-office',
      status: 'professional',
      confidential: true,
      art: 'gov',
      summary:
        'Back-office application work for a public-sector organisation. Client and project details are confidential.',
      tags: ['OutSystems', 'Back-office'],
      link: '',
    },
    {
      title: 'Internal Employee Portals',
      status: 'professional',
      confidential: true,
      art: 'portal',
      summary: 'Internal company portals for employees, built as OutSystems Reactive web applications.',
      tags: ['OutSystems Reactive', 'Portals'],
      link: '',
    },
    {
      title: 'OutSystems Integrations',
      status: 'professional',
      confidential: false,
      art: 'integrations',
      summary:
        'Integration work across OutSystems applications: REST APIs, analytics tracking and CKEditor 5 rich-text editing.',
      tags: ['REST APIs', 'Analytics tracking', 'CKEditor 5'],
      link: '',
    },
    {
      title: 'SAP CAP Practice Projects',
      status: 'learning',
      confidential: false,
      art: 'cap',
      summary:
        'Learning projects exploring the SAP Cloud Application Programming Model with Node.js, CDS and SAP BTP.',
      tags: ['SAP CAP', 'Node.js', 'CDS', 'SAP BTP'],
      link: '',
    },
  ],

  /**
   * level: 'professional' (used in professional work) | 'learning' (learning / practice)
   * icon:  'platform' | 'code' | 'plug' | 'tools'
   */
  skills: [
    {
      name: 'Platform',
      icon: 'platform',
      description: 'Low-code and enterprise platforms.',
      items: [
        { name: 'OutSystems Reactive Web', level: 'professional' },
        { name: 'SAP CAP', level: 'learning' },
        { name: 'SAP BTP', level: 'learning' },
      ],
    },
    {
      name: 'Development',
      icon: 'code',
      description: 'What I build and how.',
      items: [
        { name: 'E-commerce features', level: 'professional' },
        { name: 'Back-office tools', level: 'professional' },
        { name: 'Employee portals', level: 'professional' },
        { name: 'Performance improvements', level: 'professional' },
        { name: 'Node.js', level: 'learning' },
        { name: 'CDS', level: 'learning' },
      ],
    },
    {
      name: 'Integrations',
      icon: 'plug',
      description: 'Connecting systems and services.',
      items: [
        { name: 'REST APIs', level: 'professional' },
        { name: 'Analytics tracking', level: 'professional' },
        { name: 'CKEditor 5', level: 'professional' },
      ],
    },
    {
      name: 'Tools',
      icon: 'tools',
      description: 'Day-to-day tooling.',
      items: [
        { name: '[Tool]', level: 'professional' },
        { name: '[Tool]', level: 'professional' },
        { name: '[Tool]', level: 'learning' },
      ],
    },
  ],

  // issued: 'YYYY-MM'. credentialUrl: optional verification link ('' hides it).
  certifications: [
    {
      name: 'Associate Developer (ODC)',
      issuer: 'OutSystems',
      issued: '2025-07',
      credentialUrl: '',
    },
    {
      name: 'Associate Reactive Developer',
      issuer: 'OutSystems',
      issued: '2025-01',
      credentialUrl: '',
    },
  ],

  education: [
    {
      title: '[Degree / course name]',
      institution: '[Institution]',
      period: '[Start year] — [End year]',
      note: '[Optional: field of study or a short note.]',
    },
  ],

  contact: {
    heading: "Let's talk.",
    text: "Open to conversations about OutSystems, SAP CAP and new projects. The quickest way to reach me is by email.",
    email: '[your.email@example.com]',
    links: [
      { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/[your-profile]', handle: 'linkedin.com/in/[your-profile]' },
      { label: 'GitHub', icon: 'github', href: 'https://github.com/[your-username]', handle: 'github.com/[your-username]' },
    ],
  },

  footer: {
    note: 'Designed and built in the Azores.',
  },
};
