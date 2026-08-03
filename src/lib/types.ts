export type Site = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  ministry: string;
  state: string | null;
  level: string;
  languages: string[];
  tags: string[];
  featured: boolean;
  verified_date: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  key: string;
  icon: string;
  count: number;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  featured: boolean;
  related_site_ids: string[];
  views: number;
  published_date: string;
  updated_date: string;
  reading_minutes: number;
};

export type ServiceDetail = {
  site_id: string;
  overview: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  fees: string;
  processing_time: string;
  steps: string[];
  important_notes: string;
  common_mistakes: string[];
  faqs: { q: string; a: string }[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  level: string;
  active: boolean;
  created_at: string;
};
