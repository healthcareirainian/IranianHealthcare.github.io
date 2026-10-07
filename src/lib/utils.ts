import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path with the site base path (needed for the GitHub project-site URL). */
export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return base + p;
}

const jalaliLong = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const jalaliWeekday = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatDate = (d: Date) => jalaliLong.format(d);
export const formatDateWithWeekday = (d: Date) => jalaliWeekday.format(d);

const faDigits = new Intl.NumberFormat('fa-IR', { useGrouping: false });
export const faNum = (n: number) => faDigits.format(n);

/** Minutes to read, assuming ~200 Persian words per minute. */
export function readingTime(body = ''): number {
  const words = body.replace(/[#>*_`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const articleUrl = (a: Article) => url(`/articles/${a.id}/`);
export const sectionUrl = (slug: string) => url(`/section/${slug}/`);
export const topicUrl = (section: string, topic: string) => url(`/section/${section}/${topic}/`);
export const tagUrl = (tag: string) => url(`/tags/${encodeURIComponent(tag)}/`);
export const authorUrl = (id: string) => url(`/authors/${id}/`);

/** All published articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export const typeLabel: Record<Article['data']['type'], string> = {
  news: 'خبر',
  brief: 'خلاصه',
  list: 'فهرست',
  analysis: 'تحلیل',
  explainer: 'دانستنی',
};
