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
      "Right now I'm expanding into SAP CAP: at work I'm building the backend of a project management app integrated with new AI technologies, alongside training and learning projects with Node.js, CDS and SAP BTP.",
      'I enjoy building applications that solve real problems, and I want to keep growing in both OutSystems development and SAP CAP.',
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
      role: 'SAP CAP Developer — project work',
      company: 'Axians by AMT',
      start: 'September 2026',
      end: 'Present',
      location: 'Nonagon, Lagoa, São Miguel · Hybrid',
      summary:
        'Backend development for a project management app built with SAP CAP and integrated with new AI technologies, alongside SAP CAP training and learning projects.',
      highlights: ['Project management app backend with SAP CAP', 'Integration with new AI technologies', 'Node.js and CDS'],
      tags: ['SAP CAP', 'Node.js', 'CDS', 'AI integration'],
    },
    {
      role: 'OutSystems Developer',
      company: 'Axians by AMT',
      start: 'April 2026',
      end: 'Present',
      location: 'Nonagon, Lagoa, São Miguel · Hybrid',
      summary: 'Building OutSystems applications.',
      highlights: [],
      tags: ['OutSystems'],
    },
    {
      role: 'OutSystems Developer',
      company: 'Azores Hive',
      start: '2022',
      end: '2024',
      location: 'Nonagon, Lagoa, São Miguel · Hybrid',
      summary:
        'Developed OutSystems applications, including features for web platforms, and supported the implementation of improvements.',
      highlights: [],
      tags: ['OutSystems'],
    },
  ],

  /**
   * status:       'professional' | 'learning'
   * confidential: true shows a "Confidential" badge
   * art:          card illustration — 'commerce' | 'gov' | 'portal' | 'integrations' | 'ai' | 'cap'
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
      title: 'Project Management App',
      status: 'professional',
      confidential: false,
      art: 'ai',
      summary: 'Backend for a project management application built with SAP CAP and integrated with new AI technologies.',
      tags: ['SAP CAP', 'Node.js', 'CDS', 'AI integration'],
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
        { name: 'OutSystems Service Studio', level: 'professional' },
        { name: 'Git', level: 'professional' },
        { name: 'Postman', level: 'professional' },
        { name: 'Jira', level: 'professional' },
        { name: 'SAP Business Application Studio', level: 'learning' },
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
      title: 'Técnico de Sistemas Informáticos — Level 4',
      institution: 'ENTA, Ponta Delgada',
      period: '2019 — 2022',
      note: 'Technical training in computer systems.',
    },
  ],

  contact: {
    heading: "Let's talk.",
    text: "Open to conversations about OutSystems, SAP CAP and new projects. The quickest way to reach me is by email.",
    email: 'nelsont408@gmail.com',
    links: [
      { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/nelsontteixeira', handle: 'linkedin.com/in/nelsontteixeira' },
      { label: 'GitHub', icon: 'github', href: 'https://github.com/NelsonTeixeira09', handle: 'github.com/NelsonTeixeira09' },
    ],
  },

  footer: {
    note: 'Designed and built in the Azores.',
  },
};
