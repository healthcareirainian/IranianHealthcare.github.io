import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { getArticles, url } from '../lib/utils';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: site.name,
    description: site.description,
    site: new URL(url('/'), context.site),
    items: articles.slice(0, 50).map((a) => ({
      title: a.data.title,
      description: a.data.summary,
      pubDate: a.data.publishedAt,
      link: url(`/articles/${a.id}/`),
      categories: a.data.tags,
    })),
    customData: '<language>fa-IR</language>',
  });
}
