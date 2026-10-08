export const site = {
  name: 'سلامت ایران',
  nameEn: 'Iranian Healthcare',
  tagline: 'اخبار، تحلیل و دانستنی‌های نظام سلامت',
  description:
    'سلامت ایران: اخبار، تحلیل و دانستنی‌های نظام سلامت به زبان فارسی، برای مدیران، کادر درمان و همه علاقه‌مندان به سلامت.',
  // Fill these in when the channels exist; empty values hide the links.
  telegram: '',
  email: '',
  github: 'https://github.com/healthcareirainian/IranianHealthcare.github.io',
  // Shared backend (C:\git\sites-api). Set PUBLIC_API_BASE at build time (repo variable in CI).
  // Empty → forms, newsletter and live "most read" fall back to their static versions.
  api: (import.meta.env.PUBLIC_API_BASE ?? '').replace(/\/$/, ''),
};
