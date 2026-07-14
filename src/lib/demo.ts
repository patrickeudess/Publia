import type { Project } from '../types'

export const DEMO_USER = { id: 'demo-user', email: 'demo@publia.app', fullName: 'Aminata Diallo' }
export const DEMO_PROJECT: Project = {
  id: 'demo-afridata', user_id: DEMO_USER.id, name: 'AfriData Ready', slug: 'afridata-ready',
  source_url: 'https://patrickeudess.github.io/AfriData-Ready/',
  short_description: 'Une plateforme claire et accessible pour explorer des données africaines prêtes à l’emploi.',
  long_description: 'AfriData Ready aide les chercheurs, consultants et organisations à découvrir des ressources fiables et à transformer les données en décisions utiles. Cette page de démonstration illustre la façon dont Publia présente un projet avec une identité professionnelle.',
  logo_url: null, cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
  category: 'Données & recherche', creator_name: 'Publia Démo', contact_email: 'contact@example.com',
  linkedin_url: 'https://www.linkedin.com', github_url: 'https://github.com/patrickeudess/AfriData-Ready',
  primary_color: '#0f766e', is_public: true, is_active: true,
  created_at: new Date('2025-01-15').toISOString(), updated_at: new Date('2025-01-15').toISOString(), views_count: 128
}

const PROJECTS_KEY = 'publia_demo_projects'
const SESSION_KEY = 'publia_demo_session'
export const demoStore = {
  getProjects(): Project[] {
    const saved = localStorage.getItem(PROJECTS_KEY)
    if (!saved) { localStorage.setItem(PROJECTS_KEY, JSON.stringify([DEMO_PROJECT])); return [DEMO_PROJECT] }
    try { return JSON.parse(saved) as Project[] } catch { return [DEMO_PROJECT] }
  },
  saveProjects(projects: Project[]) { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)) },
  getSession() { return localStorage.getItem(SESSION_KEY) ? DEMO_USER : null },
  signIn() { localStorage.setItem(SESSION_KEY, 'active'); return DEMO_USER },
  signOut() { localStorage.removeItem(SESSION_KEY) }
}