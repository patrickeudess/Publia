export function Loading({ label = 'Chargement…' }: { label?: string }) {
  return <div className="grid min-h-[40vh] place-items-center"><div className="text-center"><span className="mx-auto mb-3 block h-9 w-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" /><p className="text-sm text-slate-500">{label}</p></div></div>
}