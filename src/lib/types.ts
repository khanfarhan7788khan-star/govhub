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
