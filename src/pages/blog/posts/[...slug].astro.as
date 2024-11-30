---
import Layout from '../../../layouts/MainLayout.astro';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const posts = await Astro.glob('./*.md');
  
  return posts.map(post => ({
    params: { 
      slug: post.url?.split('/').pop()?.replace('.md', '')
    },
    props: { post },
  }));
}) satisfies GetStaticPaths;

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={post.frontmatter.title}>
  <article class="max-w-3xl mx-auto px-4 py-8 prose prose-lg">
    <h1 class="font-mono text-3xl mb-4">{post.frontmatter.title}</h1>
    <div class="font-mono text-sm mb-8">{post.frontmatter.date}</div>
    <Content />
  </article>
</Layout>