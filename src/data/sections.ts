// Site information architecture. Modeled on the section / sub-topic mega-menu of a hospital
// news site, adapted to the Iranian health system. Order here is navigation order.

export interface Topic {
  slug: string;
  title: string;
}

export interface Section {
  slug: string;
  title: string;
  short: string; // label for the compact nav bar
  description: string;
  topics: Topic[];
}

export const sections: Section[] = [
  {
    slug: 'management',
    title: 'مدیریت و رهبری',
    short: 'مدیریت',
    description: 'راهبرد، اعتباربخشی، ایمنی بیمار و تصمیم‌های مدیران بیمارستان‌ها و شبکه‌های بهداشت.',
    topics: [
      { slug: 'strategy', title: 'راهبرد' },
      { slug: 'patient-safety', title: 'ایمنی بیمار' },
      { slug: 'accreditation', title: 'اعتباربخشی' },
      { slug: 'rankings', title: 'رتبه‌بندی‌ها' },
    ],
  },
  {
    slug: 'finance',
    title: 'اقتصاد سلامت',
    short: 'اقتصاد سلامت',
    description: 'بیمه، تعرفه، تأمین مالی و پوشش همگانی سلامت.',
    topics: [
      { slug: 'insurance', title: 'بیمه' },
      { slug: 'tariffs', title: 'تعرفه‌ها' },
      { slug: 'uhc', title: 'پوشش همگانی سلامت' },
    ],
  },
  {
    slug: 'health-it',
    title: 'فناوری سلامت',
    short: 'فناوری سلامت',
    description: 'پرونده الکترونیک سلامت، هوش مصنوعی، سلامت دیجیتال، پزشکی از راه دور و امنیت داده.',
    topics: [
      { slug: 'ai', title: 'هوش مصنوعی' },
      { slug: 'ehr', title: 'پرونده الکترونیک سلامت' },
      { slug: 'telehealth', title: 'پزشکی از راه دور' },
      { slug: 'cybersecurity', title: 'امنیت سایبری' },
    ],
  },
  {
    slug: 'clinical',
    title: 'بالینی',
    short: 'بالینی',
    description: 'راهنماهای بالینی، کنترل عفونت، بیماری‌های مزمن و سلامت عمومی.',
    topics: [
      { slug: 'infection-control', title: 'کنترل عفونت' },
      { slug: 'diabetes', title: 'دیابت و غدد' },
      { slug: 'cardiology', title: 'قلب و عروق' },
      { slug: 'public-health', title: 'سلامت عمومی' },
    ],
  },
  {
    slug: 'pharmacy',
    title: 'دارو',
    short: 'دارو',
    description: 'دارو، مصرف منطقی، مقاومت ضدمیکروبی و زنجیره تأمین.',
    topics: [
      { slug: 'rational-use', title: 'مصرف منطقی دارو' },
      { slug: 'supply', title: 'تأمین دارو' },
    ],
  },
  {
    slug: 'dentistry',
    title: 'دندانپزشکی',
    short: 'دندانپزشکی',
    description: 'سلامت دهان و دندان، پیشگیری و فناوری‌های نوین دندانپزشکی.',
    topics: [
      { slug: 'oral-health', title: 'سلامت دهان' },
      { slug: 'dental-ai', title: 'هوش مصنوعی در دندانپزشکی' },
    ],
  },
  {
    slug: 'workforce',
    title: 'نیروی انسانی',
    short: 'نیروی انسانی',
    description: 'پزشکان، پرستاران، آموزش و رفاه کادر درمان.',
    topics: [
      { slug: 'nursing', title: 'پرستاری' },
      { slug: 'wellbeing', title: 'رفاه و فرسودگی شغلی' },
      { slug: 'education', title: 'آموزش' },
    ],
  },
  {
    slug: 'policy',
    title: 'قوانین و سیاست‌گذاری',
    short: 'سیاست‌گذاری',
    description: 'سیاست‌های سلامت، نظام ارجاع، قوانین و مقررات.',
    topics: [
      { slug: 'referral', title: 'نظام ارجاع' },
      { slug: 'regulation', title: 'قوانین و مقررات' },
    ],
  },
];

export const sectionSlugs = sections.map((s) => s.slug) as [string, ...string[]];

export function getSection(slug: string): Section {
  const s = sections.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown section: ${slug}`);
  return s;
}

export function getTopic(sectionSlug: string, topicSlug: string): Topic | undefined {
  return getSection(sectionSlug).topics.find((t) => t.slug === topicSlug);
}

// Sections whose articles must show a medical-review status.
export const clinicalSections = new Set(['clinical', 'pharmacy', 'dentistry']);
