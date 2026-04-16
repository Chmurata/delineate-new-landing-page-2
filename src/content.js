// ─── Landing Page Content — V2.2 ───
// All copy in one place. Components read from here.
// Hero headlines are switchable (A/B/C/D), other sections have single content.

export const hero = {
  headline: {
    line1: 'Make the best evidence based',
    line2: 'decision with fit for purpose',
    line3: 'biopharma database.',
    sub: 'Go from unstructured to structured.\nDelineate creates analysis ready fit for purposes databases from any accessible source.\nDatabase will be structured.',
  },

  stats: [
    { value: '4,000+', label: 'Clinical plots digitized' },
    { value: '23,000', label: 'Structured data points delivered' },
    { value: '3,000+', label: 'Preclinical figures processed' },
    { value: 'Top 3', label: 'of 10 pharma companies trust Delineate' },
  ],

  cta: {
    primary: 'Book a Free Discovery Call',
    secondary: 'See How It Works',
  },

  nav: ['How it works', 'Use cases', 'Results', 'About'],
}

export const clientBar = {
  backedBy: 'Backed by',
  trust: {
    number: '4',
    line1: 'of the top 10',
    line2: 'pharma companies',
  },
}

export const caseStudies = {
  header: 'Results That Speak for Themselves',
  items: [
    {
      title: 'Top 10 Pharma — AI Model Training Dataset',
      metrics: '900 publications · 4,000+ PK plots · 23,000 data points',
      description: 'Structured data delivered for a published PBPK + machine learning model predicting IV pharmacokinetic profiles in humans.',
      citation: 'Jia et al., 2025',
      // Image: dark-themed PK concentration-time curves with glowing blue data points on a subtle grid
      image: '/assets/case-studies/sanofi-pk.png',
      imageAlt: 'PK concentration-time curves',
      tag: 'PHARMACOKINETICS',
    },
    {
      title: 'Weight Loss MBMA Database',
      metrics: '300 clinical trials · NONMEM-ready dataset',
      description: 'Endpoint observations, dosing schedules, and patient covariates across the full GLP-1 landscape. Delivered for immediate dose-response modeling.',
      // Image: dose-response landscape — multiple GLP-1 drug curves converging, dark bg
      image: '/assets/case-studies/weight-loss-mbma.png',
      imageAlt: 'GLP-1 dose-response landscape',
      tag: 'DOSE-RESPONSE',
    },
    {
      title: 'Oncology Tumor Volume Database',
      metrics: '450+ publications · ~3,000 preclinical figures',
      description: 'Custom computer vision models extracted tumor volume data into a standardized database for tumor growth inhibition modeling.',
      // Image: tumor growth inhibition curves — multiple diverging lines, dense data feel
      image: '/assets/case-studies/oncology-tgi.png',
      imageAlt: 'Tumor growth inhibition curves',
      tag: 'ONCOLOGY',
    },
    {
      title: 'On-Premise Parameter Search — Large Pharma',
      metrics: 'Custom LLM · On-premise deployment',
      description: 'Semantic search across a proprietary QSP parameter database. Structured parameter estimates returned at domain-specific accuracy.',
      // Image: abstract search query flowing into structured parameter grid, glowing nodes
      image: '/assets/case-studies/on-premise-search.png',
      imageAlt: 'Semantic parameter search',
      tag: 'AI SEARCH',
    },
    {
      title: 'Competitive Asset Extraction — BD&L',
      metrics: 'Conference proceedings · Competitive intelligence',
      description: 'Compound profiles, clinical endpoints, and drug candidate data compiled into a searchable database for in-licensing evaluation.',
      // Image: conference poster mosaic being distilled into clean structured table
      image: '/assets/case-studies/bdl-extraction.png',
      imageAlt: 'Competitive intelligence extraction',
      tag: 'BD&L',
    },
  ],
}

export const differentiators = {
  header: 'What Sets Delineate Apart',
  items: [
    {
      title: 'Automated Graph & Chart Digitization',
      description: 'Our specialized computer vision models extract numerical data from marker plots, Kaplan-Meier curves, dose-response figures, and more — with full traceability back to every source figure. No other solution can do this.',
      icon: 'graph',
    },
    {
      title: 'Fit-for-Purpose Databases',
      description: 'Every dataset Delineate builds is constructed for your exact regulatory question — not pulled from a pre-packaged, one-size-fits-all catalog.',
      icon: 'database',
    },
    {
      title: 'One Platform, Zero Context-Switching',
      description: 'Search, extraction, plot digitization, quality control, and delivery — AI agents orchestrating five capabilities in one environment.',
      icon: 'platform',
    },
    {
      title: 'Full Auditability',
      description: 'Every data point is traceable back to its source figure and publication. Three-layer quality system — automated validation, expert scientific review, and source-level auditability.',
      icon: 'audit',
    },
  ],
}

export const process = {
  header: 'From Published Evidence to Decision-Ready Databases',
  steps: [
    {
      number: 1,
      title: 'Free Consultation',
      description: 'We define your MBMA scope together — therapeutic area, endpoints, inclusion criteria, deliverable format — so the database is built for your exact question from day one.',
    },
    {
      number: 2,
      title: 'Search Entire Landscape Conclusively',
      description: 'Every qualifying study. Found. Screened. Documented. Our AI-powered search consistently surfaces more qualifying evidence than manual review alone.',
    },
    {
      number: 3,
      title: 'Extract to Any Structured Representation — Including Graphs',
      description: 'Every number, from every source — text, tables, and figures — in one structured dataset. Proprietary computer vision models digitize the plots that other solutions can\'t touch.',
    },
    {
      number: 4,
      title: 'Analyze',
      description: 'Analysis-ready, NONMEM-formatted datasets delivered in weeks. Your team models with the full body of evidence while our three-layer QC ensures every data point traces back to its source.',
    },
  ],
}

export const serviceOfferings = {
  header: 'How We Engage',
  items: [
    {
      title: 'Contract Services',
      description: 'A dedicated Delineate team builds your MBMA database end-to-end — custom search and extraction templates, expert QC, and NONMEM-ready deliverables on your timeline.',
    },
    {
      title: 'Platform Access',
      description: 'Direct access to Delineate\'s search, extraction, and digitization tools for your internal pharmacometrics team — one environment, full audit trail.',
    },
    {
      title: 'On-Premise Deployment',
      description: 'For organizations with data governance requirements — Delineate capabilities deployed within your infrastructure, with dedicated engineering handoff and training.',
    },
  ],
}

export const closingCTA = {
  headline: 'The evidence already exists. Let\'s put it to work.',
  body: 'Whether you\'re designing a Phase III trial, evaluating an in-licensing opportunity, preparing for a regulatory briefing, or deciding which asset to advance — MBMA from Delineate gives you the quantitative foundation to get it right the first time.',
  cta: 'Book a Free Discovery Call',
  secondaryLink: 'See How It Works',
}

export const footer = {
  contact: 'contact@delineate.pro',
  url: 'delineate.pro',
  backed: 'Backed by MIT · Y Combinator · NIH SEED',
  socials: {
    linkedin: '#',
    twitter: '#',
  },
}
