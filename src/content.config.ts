import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { sections, sectionSlugs } from './data/sections';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().min(5),
      summary: z.string().min(20),
      section: z.enum(sectionSlugs),
      topic: z.string().optional(),
      tags: z.array(z.string()).default([]),
      author: reference('authors'),
      medicalReviewer: reference('authors').optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      type: z.enum(['news', 'brief', 'list', 'analysis', 'explainer']).default('explainer'),
      featured: z.enum(['lead', 'top']).optional(),
      sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
      draft: z.boolean().default(false),
    })
    .refine(
      (a) => !a.topic || sections.find((s) => s.slug === a.section)?.topics.some((t) => t.slug === a.topic),
      { message: 'topic must be one of the topics of its section (see src/data/sections.ts)' },
    ),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    credentials: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { articles, authors, pages };
