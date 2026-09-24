// Content collections: every CV section is a folder of YAML files under src/data/.
// One file = one entry. The Zod schema below validates each file at build time,
// so a malformed entry fails `npm run build` instead of rendering incorrectly.
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
    affiliation: z.string().optional(),
    location: z.string().optional(),
    email: z.email().optional(),
    bio: z.string(),
    researchInterests: z.array(z.string()).default([]),
    links: z
      .object({
        github: link.optional(),
        scholar: link.optional(),
        orcid: link.optional(),
        linkedin: link.optional(),
        twitter: link.optional(),
        website: link.optional(),
      })
      .default({}),
    cvPdf: z.string().optional(), // path under public/
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
    end: z.coerce.date().optional(), // omit for "present"
    thesis: z.string().optional(),
    advisor: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

const experience = defineCollection({
  loader: yaml('experience'),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit for "present"
    description: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const publications = defineCollection({
  loader: yaml('publications'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    year: z.number().int(),
    type: z.enum(['journal', 'conference', 'workshop', 'preprint', 'thesis', 'other']),
    doi: z.string().optional(),
    url: link.optional(),
    pdf: z.string().optional(),
    code: link.optional(),
    abstract: z.string().optional(),
    bibtex: z.string().optional(),
    selected: z.boolean().default(false),
  }),
});

const talks = defineCollection({
  loader: yaml('talks'),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    type: z.enum(['talk', 'invited', 'poster', 'workshop', 'panel']),
    url: link.optional(),
    slides: z.string().optional(),
    video: link.optional(),
  }),
});

const projects = defineCollection({
  loader: yaml('projects'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: link.optional(),
    repo: link.optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const news = defineCollection({
  loader: yaml('news'),
  schema: z.object({
    date: z.coerce.date(),
    text: z.string(),
    url: link.optional(),
  }),
});

export const collections = { profile, education, experience, publications, talks, projects, news };
