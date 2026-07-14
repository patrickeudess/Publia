import { Link } from 'react-router-dom'

export function Brand({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`inline-flex items-center gap-2 font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`} aria-label="Publia, accueil">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg text-white shadow-sm">P</span>
    <span className="text-xl">Publia</span>
  </Link>
}