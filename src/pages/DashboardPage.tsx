import { Eye, FolderKanban, Plus, Search, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { ProjectCard } from '../components/ProjectCard'
import { Toast } from '../components/Toast'
import { useAuth } from '../hooks/useAuth'
import { publicProjectUrl, copyText } from '../lib/utils'
import { projectService } from '../services/projects'
import type { Project } from '../types'

export function DashboardPage() {
  const { user } = useAuth(); const [projects,setProjects]=useState<Project[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [search,setSearch]=useState(''); const [toast,setToast]=useState('')
  const load=async()=>{if(!user)return;try{setLoading(true);setProjects(await projectService.list(user.id))}catch(e){setError(e instanceof Error?e.message:'Impossible de charger vos projets.')}finally{setLoading(false)}}
  useEffect(()=>{void load()},[user?.id])
  const filtered=useMemo(()=>projects.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())),[projects,search]); const visits=projects.reduce((sum,p)=>sum+(p.views_count??0),0)
  const copied=async(p:Project)=>{await copyText(publicProjectUrl(p.slug));setToast('Lien public copié dans le presse-papiers.')}
  const remove=async(p:Project)=>{if(!window.confirm(`Supprimer définitivement « ${p.name} » ?`))return;try{await projectService.remove(p.id);setProjects(v=>v.filter(x=>x.id!==p.id));setToast('Projet supprimé.')}catch{setError('La suppression a échoué.')}}
  const toggle=async(p:Project)=>{try{await projectService.setActive(p.id,!p.is_active);setProjects(v=>v.map(x=>x.id===p.id?{...x,is_active:!x.is_active}:x));setToast(p.is_active?'Projet désactivé.':'Projet activé.')}catch{setError('La mise à jour a échoué.')}}
  if(loading)return <Loading label="Chargement de vos projets…"/>
  return <div className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-700">Votre espace</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Bonjour, {user?.fullName.split(' ')[0]} 👋</h1><p className="mt-2 text-slate-500">Gérez vos vitrines et suivez leur portée.</p></div><Link to="/projets/nouveau" className="btn-primary btn-large"><Plus className="h-5 w-5"/>Nouveau projet</Link></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="stat-card"><span className="stat-icon"><FolderKanban/></span><div><p>Projets</p><strong>{projects.length}</strong></div></div><div className="stat-card"><span className="stat-icon"><Eye/></span><div><p>Visites totales</p><strong>{visits}</strong></div></div><div className="stat-card"><span className="stat-icon"><TrendingUp/></span><div><p>Projets actifs</p><strong>{projects.filter(p=>p.is_active).length}</strong></div></div></div>
    {error&&<p className="error-box mt-6">{error}</p>}
    <div className="mt-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><h2 className="text-xl font-semibold">Mes projets</h2><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} className="input pl-9 sm:w-72" placeholder="Rechercher…" aria-label="Rechercher un projet"/></label></div>
    {filtered.length?<div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(p=><ProjectCard key={p.id} project={p} onCopy={()=>void copied(p)} onDelete={()=>void remove(p)} onToggle={()=>void toggle(p)}/>)}</div>:<div className="mt-5 rounded-3xl border border-dashed bg-white px-6 py-16 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50"><FolderKanban className="text-brand-700"/></span><h3 className="mt-5 text-lg font-semibold">{search?'Aucun résultat':'Votre première vitrine commence ici'}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{search?'Essayez un autre terme.':'Ajoutez votre projet et obtenez une page professionnelle prête à partager.'}</p>{!search&&<Link to="/projets/nouveau" className="btn-primary mt-6">Créer un projet</Link>}</div>}</div>{toast&&<Toast message={toast} onClose={()=>setToast('')}/>}</div>
}