import { demoStore } from '../lib/demo'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Project, ProjectInput } from '../types'

const nullable = (value: string | null | undefined) => value || null
const cleanInput = (input: ProjectInput) => ({ ...input, long_description: nullable(input.long_description), logo_url: nullable(input.logo_url), cover_url: nullable(input.cover_url), contact_email: nullable(input.contact_email), linkedin_url: nullable(input.linkedin_url), github_url: nullable(input.github_url) })

async function withViewCounts(projects: Project[]) {
  if (!supabase) return projects
  const client = supabase
  return Promise.all(projects.map(async (project) => {
    const { data } = await client.rpc('get_project_view_count', { target_project_id: project.id })
    return { ...project, views_count: typeof data === 'number' ? data : 0 }
  }))
}

export const projectService = {
  async list(userId: string): Promise<Project[]> {
    if (!isSupabaseConfigured || !supabase) return demoStore.getProjects().filter((p) => p.user_id === userId)
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return withViewCounts((data ?? []) as Project[])
  },
  async get(id: string): Promise<Project | null> {
    if (!isSupabaseConfigured || !supabase) return demoStore.getProjects().find((p) => p.id === id) ?? null
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data as Project | null
  },
  async getPublic(slug: string): Promise<Project | null> {
    if (!isSupabaseConfigured || !supabase) return demoStore.getProjects().find((p) => p.slug === slug && p.is_public && p.is_active) ?? null
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('is_public', true).eq('is_active', true).maybeSingle()
    if (error) throw error
    if (!data) return null
    const [project] = await withViewCounts([data as Project])
    return project
  },
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return demoStore.getProjects().some((p) => p.slug === slug && p.id !== excludeId)
    const { data, error } = await supabase.rpc('is_project_slug_available', { candidate_slug: slug, exclude_project_id: excludeId ?? null })
    if (error) throw error
    return data !== true
  },
  async create(userId: string, input: ProjectInput): Promise<Project> {
    if (!isSupabaseConfigured || !supabase) {
      const now = new Date().toISOString()
      const project: Project = { ...cleanInput(input), id: crypto.randomUUID(), user_id: userId, created_at: now, updated_at: now, views_count: 0 }
      demoStore.saveProjects([project, ...demoStore.getProjects()]); return project
    }
    const { data, error } = await supabase.from('projects').insert({ ...cleanInput(input), user_id: userId }).select().single()
    if (error) throw error
    return data as Project
  },
  async update(id: string, input: ProjectInput): Promise<Project> {
    if (!isSupabaseConfigured || !supabase) {
      let updated!: Project
      const projects = demoStore.getProjects().map((p) => p.id === id ? (updated = { ...p, ...cleanInput(input), updated_at: new Date().toISOString() }) : p)
      demoStore.saveProjects(projects); return updated
    }
    const { data, error } = await supabase.from('projects').update(cleanInput(input)).eq('id', id).select().single()
    if (error) throw error
    return data as Project
  },
  async remove(id: string) {
    if (!isSupabaseConfigured || !supabase) { demoStore.saveProjects(demoStore.getProjects().filter((p) => p.id !== id)); return }
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  },
  async setActive(id: string, isActive: boolean) {
    if (!isSupabaseConfigured || !supabase) {
      demoStore.saveProjects(demoStore.getProjects().map((p) => p.id === id ? { ...p, is_active: isActive, updated_at: new Date().toISOString() } : p)); return
    }
    const { error } = await supabase.from('projects').update({ is_active: isActive }).eq('id', id)
    if (error) throw error
  },
  async recordView(projectId: string) {
    if (!isSupabaseConfigured || !supabase) {
      demoStore.saveProjects(demoStore.getProjects().map((p) => p.id === projectId ? { ...p, views_count: (p.views_count ?? 0) + 1 } : p)); return
    }
    await supabase.rpc('record_project_view', { target_project_id: projectId, page_referrer: document.referrer?.slice(0, 500) || null })
  }
}