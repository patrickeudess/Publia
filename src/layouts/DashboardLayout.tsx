import { FolderKanban, Home, LogOut, Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../hooks/useAuth'

export function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const { user, signOut, demoMode } = useAuth(); const navigate = useNavigate()
  const logout = async () => { await signOut(); navigate('/') }
  const nav = <><NavLink to="/dashboard" end className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}><FolderKanban />Mes projets</NavLink><Link to="/projets/nouveau" className="side-link"><Plus />Nouveau projet</Link><Link to="/" className="side-link"><Home />Voir le site</Link></>
  return <div className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white p-5 lg:flex lg:flex-col"><Brand /><nav className="mt-10 grid gap-2">{nav}</nav><div className="mt-auto border-t pt-5"><p className="truncate text-sm font-semibold">{user?.fullName}</p><p className="mb-3 truncate text-xs text-slate-500">{user?.email}</p><button onClick={logout} className="side-link w-full"><LogOut />Déconnexion</button></div></aside>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:ml-64 lg:px-8"><div className="lg:hidden"><Brand /></div>{demoMode && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Mode démo</span>}<button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu"><Menu /></button></header>
    {open && <div className="fixed inset-0 z-50 bg-ink/30 lg:hidden" onClick={() => setOpen(false)}><aside className="h-full w-72 bg-white p-5" onClick={(e) => e.stopPropagation()}><div className="flex justify-between"><Brand /><button onClick={() => setOpen(false)}><X /></button></div><nav className="mt-10 grid gap-2" onClick={() => setOpen(false)}>{nav}</nav><button onClick={logout} className="side-link mt-8 w-full"><LogOut />Déconnexion</button></aside></div>}
    <main className="lg:ml-64"><Outlet /></main>
  </div>
}