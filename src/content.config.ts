import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yaml = (dir: string) => glob({ base: `./src/data/${dir}`, pattern: '**/*.{yaml,yml}' });
const link = z.url();

const profile = defineCollection({
  loader: yaml('profile'),
  schema: z.object({
    name: z.string(),
    headline: z.string(),
    affiliation: z.string(),
    location: z.string(),
    email: z.email(),
    shortBio: z.string(),
    bio: z.string(),
    researchInterests: z.array(z.string()),
    links: z.object({
      github: link.optional(),
      scholar: link.optional(),
      orcid: link.optional(),
      linkedin: link.optional(),
    }),
    hero: z.object({
      mp4: z.string(),
      webm: z.string(),
      poster: z.string(),
      alt: z.string(),
    }),
    credentials: z.array(z.string()).default([]),
    heroCaption: z.string().optional(),
    cvPdf: z.string().optional(),
  }),
});

const research = defineCollection({
  loader: yaml('research'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    body: z.string(),
    publications: z.array(z.string()).default([]), // publication ids (file names without .yaml)
    software: z.array(z.string()).default([]), // project ids
    order: z.number(),
  }),
});

const education = defineCollection({
  loader: yaml('education'),
  schema: z.object({
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
    location: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    advisor: z.string().optional(),
    notes: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: yaml('experience'),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    kind: z.enum(['research', 'teaching', 'industry']),
    location: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).default([]),
  }),
});

const publications = defineCollection({
  loader: yaml('publications'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    venueShort: z.string().optional(),
    year: z.number().int(),
    type: z.enum(['journal', 'conference', 'preprint', 'other']),
    status: z.enum(['published', 'preprint', 'in-preparation']).default('published'),
    equalContribution: z.boolean().default(false),
    equalContributors: z.number().int().min(2).default(2), // how many leading authors share first authorship
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    pmid: z.string().optional(),
    url: link.optional(),
    pdf: z.string().optional(),
    code: link.optional(),
    app: link.optional(),
    abstract: z.string().optional(),
    selected: z.boolean().default(false),
    featuredOrder: z.number().default(99),
  }),
});

const talks = defineCollection({
  loader: yaml('talks'),
  schema: z.object({
    title: z.string(),
    event: z.string(), // conference or meeting name; entries with the same event are grouped
    eventShort: z.string().optional(),
    date: z.coerce.date(), // date of the contribution (or first day of the event)
    yearOnly: z.boolean().default(false), // true when only the year is known
    location: z.string().optional(),
    type: z.enum(['talk', 'short-talk', 'lightning', 'poster', 'demo', 'invited']),
    coauthors: z.array(z.string()).default([]),
    description: z.string().optional(),
    url: link.optional(),
    slides: z.string().optional(),
    poster: z.string().optional(),
    video: link.optional(),
  }),
});

const awards = defineCollection({
  loader: yaml('awards'),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: yaml('projects'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    repo: link,
    docs: link.optional(),
    app: link.optional(),
    pypi: z.string().optional(),
    paper: z.string().optional(), // publication id
    plain: z.string().optional(), // one-sentence explanation for non-specialists
    kind: z.enum(['research', 'tool']).default('tool'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const patents = defineCollection({
  loader: yaml('patents'),
  schema: z.object({
    title: z.string(),
    inventors: z.array(z.string()).min(1),
    status: z.enum(['granted', 'pending']),
    number: z.string().optional(), // e.g. US 11,989,552 B2
    office: z.string().default('USPTO'),
    date: z.coerce.date(), // grant date or filing date
    assignee: z.string().optional(),
    url: link.optional(),
    note: z.string().optional(),
  }),
});

const service = defineCollection({
  loader: yaml('service'),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    description: z.string().optional(),
    url: link.optional(),
  }),
});

export const collections = { profile, research, education, experience, publications, talks, awards, projects, patents, service };
