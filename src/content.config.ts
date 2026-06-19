import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
    color: z.string(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog,
};
