// ─── Landing Page Content — V3 ───
// Verbatim copy from Jawad's updated landing page doc
// (https://docs.google.com/document/d/1-gLIexGSOcDRmeHumHL2_TpAYf5aj7CrQIJpXOW0veo)
// HARD RULE: do not paraphrase or condense any line below.

export const hero = {
  headline: {
    line1: 'Turn all available evidence into a',
    line2: 'quantitative foundation',
    line3: 'for your most consequential decisions.',
    sub: 'Delineate creates models from the totality of available evidence — in any therapeutic area — so your development, regulatory, and commercial teams act on quantitative evidence insights in a fraction of the time.',
  },

  stats: [
    { value: '4,000+', label: 'Clinical plots digitized' },
    { value: '23,000', label: 'Structured data points delivered' },
    { value: '3,000+', label: 'Preclinical figures processed' },
    { value: 'Top 3', label: 'of 10 pharma companies trust Delineate' },
  ],

  cta: {
    primary: 'Request a Demonstration',
    secondary: 'Talk to Our Data Team',
  },

  nav: ['What we do', 'Who we support', 'Databases', 'Case studies'],
}

export const clientBar = {
  backedBy: 'Backed by',
  trust: {
    number: '4',
    line1: 'of the top 10',
    line2: 'pharma companies',
  },
}

export const capabilities = {
  header: 'What we do',
  subheader: 'Five capabilities that take you from raw evidence to a defensible decision — go / no-go, dose selection, trial design, indication prioritization, and submission strategy.',
  items: [
    {
      number: '01',
      title: 'Assemble & structure the evidence',
      description: 'We extract and structure FDA clinical pharmacology reviews, EMA EPARs, published literature, AdCom briefing documents, and postmarket commitments into a queryable database across any drug class — so the cross-asset evidence base is ready before modeling begins.',
    },
    {
      number: '02',
      title: 'Model & simulate across the totality of evidence',
      description: 'We synthesize the evidence into quantitative predictions — across any combination of agents, indications, patient subgroups, and endpoints — in hours, not months. The basis for go / no-go decisions before committing Phase 3 resources.',
    },
    {
      number: '03',
      title: 'Optimize dose against the benefit-risk curve',
      description: 'We characterize efficacy and toxicity curves across the full evidence base, identifying the dose that captures achievable efficacy while staying on the right side of the toxicity curve — aligned with FDA Project Optimus expectations.',
    },
    {
      number: '04',
      title: 'Benchmark your asset against the class',
      description: 'We overlay your Phase 1/2 PK and efficacy data on the class-level exposure-response landscape, so you know whether your signal is genuinely differentiated — or within the noise of what the class already delivers. The basis for trial design and control arm modeling anchored to the competitor evidence base, not a single study.',
    },
    {
      number: '05',
      title: 'Generate submission-ready outputs',
      description: 'We export model diagnostics, exposure-response plots, and indirect comparison frameworks formatted for FDA briefing documents, EMA scientific advice packages, and HTA value dossiers.',
    },
  ],
}

export const audiences = {
  header: 'Who we support',
  items: [
    {
      title: 'Clinical pharmacology & pharmacometrics',
      description: 'Modeling and simulation, freed from weeks of manual evidence assembly.',
    },
    {
      title: 'Clinical development & trial design',
      description: 'Trial design, control arm modeling, dose selection, and indication prioritization.',
    },
    {
      title: 'Commercial, BD & lifecycle management',
      description: 'A living quantitative model of the competitive class.',
    },
    {
      title: 'Regulatory affairs & market access',
      description: 'Project Optimus–aligned dose justification and HTA-ready indirect comparison frameworks.',
    },
  ],
}

export const databases = {
  header: 'Fit-for-purpose database services',
  title: 'Your model is only as good as the data behind it.',
  body: 'For teams who want to do their own modeling, Delineate builds fit-for-purpose databases — assembled from source, rigorously QC\'d, and formatted precisely for your workflow. Dual independent extraction with formal arbitration, source-level verification against original documents, cross-study consistency checks for covariates and endpoints, systematic outlier flagging, and a full audit trail on every value — delivered with a structured QC report and in your exact required format, whether that\'s NONMEM, Monolix, Phoenix NLME, R / Python data frames, MBMA software-compatible structures, Excel workbooks with metadata sheets, or a bespoke client schema.',
  pullquote: 'A pharmacometrics team that spends three weeks cleaning data before building a model has not spent three weeks doing pharmacometrics. Delineate gives those weeks back.',
}

export const caseStudies = {
  header: 'Case studies',
  readMoreLabel: 'Read more',
  items: [
    {
      title: 'Obesity drug database — MBMA for go / no-go',
      tag: 'DOSE-RESPONSE',
      metrics: '300 clinical trials extracted · NONMEM-ready on delivery · Go / no-go decision supported',
      paragraphs: [
        'A biopharma company with a GLP-1 asset in late Phase 2 needed to quantify where their asset sat on the class-level exposure-response curve before committing to Phase 3. Internal estimate: 4–5 months of analyst time to build the cross-trial database.',
        'Delineate delivered a NONMEM-ready MBMA database covering 300 trials across the GLP-1 and obesity landscape — trial- and arm-level data harmonized to consistent endpoint definitions, with covariates structured to the client\'s model specification. BLQ handling, missing data flags, data dictionary, and QC report all included.',
        'The MBMA ran within two weeks of delivery. The model supported a positive Phase 3 go decision at the next development committee. The database is now anchoring the Phase 3 control arm specification.',
      ],
      readMoreHref: '#',
    },
    {
      title: 'ADC oncology — model decision engine',
      tag: 'ONCOLOGY',
      metrics: '15 approved ADCs · 3-analyte PopPK framework · Project Optimus–ready',
      paragraphs: [
        'The ADC competitive landscape is the hardest MBMA problem in oncology. Three analytes (intact ADC, total antibody, free payload) with distinct disposition. DAR heterogeneity drives clearance independently of TMDD. Bystander payloads decouple efficacy from target saturation. Standard PopPK frameworks for naked antibodies weren\'t designed for any of this.',
        'Delineate built an ADC-specific decision engine covering every approved ADC — Kadcyla, Enhertu, Trodelvy, Padcev, Polivy, Zynlonta, Elahere, Aidixi, Dato-DXd. Three-analyte PopPK modeling, DAR heterogeneity adjustment, explicit TMDD parameterization, and bystander effect correction for valid cross-asset E-R comparisons in low-expression indications.',
        'The framework supports the dose-optimization argument required by Project Optimus, biomarker threshold strategy (as Enhertu demonstrated in HER2-low), payload class benchmarking, and HTA indirect comparison for overlapping HER2 ADC indications.',
      ],
      readMoreHref: '#',
    },
    {
      title: 'Hybrid AI PK model — Sanofi',
      tag: 'PHARMACOKINETICS',
      metrics: '900 publications screened · 4,000+ PK plots digitized · 23,000+ data points extracted',
      paragraphs: [
        'Sanofi had a hybrid-AI PK model architecture ready but no scalable pathway to build a training corpus of the required scale. Manual digitization was too slow; commercial databases lacked the granularity and format alignment the AI pipeline required.',
        'Delineate screened 900 publications and used our AI graph digitization engine to extract 23,000+ individual data points from over 4,000 PK plots — capturing central estimates alongside error bars and variance measures. All data structured to the client\'s exact pipeline schema with compound metadata, study covariates, and provenance mapping.',
        'Delivered in eight weeks versus an internal estimate of six to nine months. The model trained directly on delivery with no reformatting required. The database has since been extended twice, with Delineate maintaining the corpus as new literature is published.',
      ],
      readMoreHref: '#',
    },
    {
      title: 'Pipeline intelligence database — BD & licensing',
      tag: 'BD&L',
      metrics: 'Multi-year congress mining · Structured CI database · 10 days to full competitive view',
      paragraphs: [
        'A BD&L team evaluating a time-pressured in-licensing opportunity needed a structured view of the competitive landscape — but key data on pipeline assets was scattered across multi-year congress proceedings, abstract books, investor presentations, and press releases.',
        'Delineate built a structured competitive intelligence database covering clinical stage, mechanism, trial design, efficacy and safety readouts, and dosing for each pipeline asset — drawing on congresses, published literature, regulatory documents, and trial registries. Abstract-only data was flagged with confidence ratings. The database was updated twice during diligence as new congress data emerged.',
        'The BD team had a comprehensive competitive view within ten days. The database directly informed the valuation model and the deal evaluation proceeded on schedule. The engagement has since been extended as an ongoing CI resource for the therapeutic area franchise.',
      ],
      readMoreHref: '#',
    },
    {
      title: 'Surrogate endpoint database — Critical Path Institute',
      tag: 'REGULATORY',
      metrics: '1,000s of studies AI-screened · 200+ publications digitized · Regulatory-grade evidence package',
      paragraphs: [
        'Establishing a surrogate endpoint for regulatory use requires demonstrating, across the totality of clinical evidence, that the proposed surrogate reliably predicts the clinical outcome of interest. For type 1 diabetes, this meant assembling and modeling a comprehensive database spanning decades of trial data — demanding both the breadth of a systematic literature review and the analytical rigor of a quantitative MBMA.',
        'Delineate conducted an AI-accelerated systematic literature review across thousands of studies, compressing a process that would conventionally take many months into a fraction of the timeline. From the screened corpus, 200+ publications were taken forward for full digitization and structured extraction — capturing longitudinal biomarker trajectories, clinical outcome data, trial design characteristics, and patient population covariates. Full provenance documentation aligned to regulatory-grade standards.',
        'The database provided the quantitative foundation for the surrogate endpoint qualification program. The collaboration with Critical Path Institute placed this work within the formal regulatory science pathway — with the evidence package designed from the outset to meet the evidentiary standards of FDA\'s surrogate endpoint qualification process.',
      ],
      readMoreHref: '#',
    },
  ],
}

export const closingCTA = {
  headline: 'See Delineate applied to your therapeutic area.',
  body: 'Request a demonstration using your asset\'s published or preliminary data against the full available evidence base.',
  testimonial: {
    quote: 'We went from 6 months of manual literature review to a complete, auditable MBMA database in under 5 weeks.',
    role: 'Senior Director, Pharmacometrics',
    company: 'Top 10 Pharma',
  },
  cta: 'Request a Demonstration',
  secondaryLink: 'Talk to Our Data Team',
}

export const footer = {
  contact: 'contact@delineate.pro',
  url: 'delineate.pro',
  backed: 'Backed by MIT · Y Combinator · NIH SEED',
  socials: {
    linkedin: 'https://www.linkedin.com/company/delineate-pro/',
    twitter: '#',
  },
}
