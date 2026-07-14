import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../hooks/useAuth'

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const fonctionnementUrl = `${import.meta.env.BASE_URL}#fonctionnement`
  const avantagesUrl = `${import.meta.env.BASE_URL}#avantages`
  return <div className="min-h-screen bg-paper text-ink">
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur"><div className="container flex h-18 items-center justify-between"><Brand />
      <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"><a href={fonctionnementUrl} className="hover:text-brand-700">Comment ça marche</a><a href={avantagesUrl} className="hover:text-brand-700">Avantages</a><Link to={user ? '/dashboard' : '/connexion'} className="btn-primary">{user ? 'Mon tableau de bord' : 'Se connecter'}</Link></nav>
      <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">{open ? <X /> : <Menu />}</button>
    </div>{open && <nav className="container grid gap-3 border-t py-4 text-sm font-medium md:hidden"><a href={fonctionnementUrl} onClick={() => setOpen(false)}>Comment ça marche</a><a href={avantagesUrl} onClick={() => setOpen(false)}>Avantages</a><Link to={user ? '/dashboard' : '/connexion'} className="btn-primary">{user ? 'Tableau de bord' : 'Se connecter'}</Link></nav>}</header>
    <main><Outlet /></main>
  </div>
}

