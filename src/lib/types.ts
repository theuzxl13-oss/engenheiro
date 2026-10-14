export type Profile = {
  full_name: string;
  headline: string;
  crea: string | null;
  degree: string | null;
  institution: string | null;
  graduation_year: number | null;
  years_experience: number | null;
  bio: string | null;
  areas: string[];
  courses: string[];
  photo_url: string | null;
  hero_image_url: string | null;
  cv_url: string | null;
  stat_projects: number | null;
  stat_clients: number | null;
  stat_certifications: number | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  whatsapp_message: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  service_area: string | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  year: number | null;
  summary: string | null;
  description: string | null;
  challenges: string | null;
  solutions: string | null;
  results: string | null;
  cover_url: string | null;
  gallery: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
};

export const CERTIFICATION_KINDS = {
  diploma: "Diploma",
  certificado: "Certificado",
  especializacao: "Especialização",
  curso: "Curso técnico",
  registro: "Registro profissional",
  evento: "Evento",
  outro: "Qualificação complementar",
} as const;

export type CertificationKind = keyof typeof CERTIFICATION_KINDS;

export type Certification = {
  id: string;
  title: string;
  issuer: string | null;
  kind: CertificationKind;
  year: number | null;
  description: string | null;
  file_url: string | null;
  sort_order: number;
  published: boolean;
};

export type Testimonial = {
  id: string;
  client_name: string;
  company: string | null;
  comment: string;
  rating: number | null;
  photo_url: string | null;
  published: boolean;
  sort_order: number;
};

export const QUOTE_STATUSES = {
  novo: "Novo",
  em_andamento: "Em andamento",
  respondido: "Respondido",
  arquivado: "Arquivado",
} as const;

export type QuoteStatus = keyof typeof QUOTE_STATUSES;

export type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  message: string;
  status: QuoteStatus;
  notes: string | null;
  created_at: string;
};

export type SiteContent = {
  /** true quando o conteúdo exibido é demonstrativo (Supabase não configurado). */
  demo: boolean;
  profile: Profile;
  services: Service[];
  projects: Project[];
  certifications: Certification[];
  testimonials: Testimonial[];
};
