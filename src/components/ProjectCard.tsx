import { Copy, Eye, ExternalLink, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../types'
import { formatDate, publicProjectUrl } from '../lib/utils'

type Props = { project: Project; onCopy: () => void; onDelete: () => void; onToggle: () => void }
export function ProjectCard({ project, onCopy, onDelete, onToggle }: Props) {
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-soft">
    <div className="h-2" style={{ backgroundColor: project.primary_color }} />
    <div className="p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {project.logo_url ? <img src={project.logo_url} alt="" className="h-11 w-11 rounded-xl border object-cover" /> : <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 font-bold text-brand-700">{project.name[0]}</div>}
          <div className="min-w-0"><h2 className="truncate font-semibold text-ink">{project.name}</h2><p className="truncate text-sm text-slate-500">/p/{project.slug}</p></div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${project.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{project.is_active ? 'Actif' : 'Inactif'}</span>
      </div>
      <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{project.short_description}</p>
      <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm"><span className="flex items-center gap-2 font-semibold text-ink"><Eye className="h-4 w-4 text-brand-600" />{project.views_count ?? 0} visites</span><span className="text-xs text-slate-400">{formatDate(project.updated_at)}</span></div>
      <div className="flex flex-wrap gap-2">
        <Link to={`/projets/${project.id}/modifier`} className="btn-secondary flex-1"><Pencil className="h-4 w-4" />Modifier</Link>
        <Link to={`/p/${project.slug}`} target="_blank" className="btn-icon" title="Prévisualiser"><ExternalLink className="h-4 w-4" /></Link>
        <button onClick={onCopy} className="btn-icon" title={`Copier ${publicProjectUrl(project.slug)}`}><Copy className="h-4 w-4" /></button>
        <details className="relative"><summary className="btn-icon list-none cursor-pointer"><MoreHorizontal className="h-4 w-4" /></summary><div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border bg-white p-1.5 shadow-xl">
          <button onClick={onToggle} className="menu-item"><Power className="h-4 w-4" />{project.is_active ? 'Désactiver' : 'Activer'}</button>
          <button onClick={onDelete} className="menu-item text-red-600"><Trash2 className="h-4 w-4" />Supprimer</button>
        </div></details>
      </div>
    </div>
  </article>
}