export type Project = {
  id: string
  user_id: string
  name: string
  slug: string
  source_url: string
  short_description: string
  long_description: string | null
  logo_url: string | null
  cover_url: string | null
  category: string
  creator_name: string
  contact_email: string | null
  linkedin_url: string | null
  github_url: string | null
  primary_color: string
  is_public: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  views_count?: number
}

export type ProjectInput = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'views_count'>

export type AppUser = { id: string; email: string; fullName: string }
