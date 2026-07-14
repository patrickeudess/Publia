import { CheckCircle2, X } from 'lucide-react'

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div role="status" className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm font-medium text-ink shadow-2xl">
    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" /><span className="flex-1">{message}</span>
    <button onClick={onClose} aria-label="Fermer"><X className="h-4 w-4 text-slate-400" /></button>
  </div>
}