import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../hooks/useAuth'

export function ForgotPasswordPage() {
  const { resetPassword, demoMode } = useAuth(); const [email,setEmail]=useState(''); const [message,setMessage]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);setError('');try{await resetPassword(email);setMessage(demoMode ? 'Le mode démo ne nécessite pas de réinitialisation.' : 'Si un compte existe, un lien de réinitialisation a été envoyé.')}catch(err){setError(err instanceof Error?err.message:'Une erreur est survenue.')}finally{setLoading(false)}}
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><section className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-soft"><Brand/><h1 className="mt-9 text-3xl font-bold">Mot de passe oublié ?</h1><p className="mt-3 text-sm leading-6 text-slate-500">Indiquez votre adresse email. Nous vous enverrons un lien sécurisé.</p><form onSubmit={submit} className="mt-7 grid gap-5"><label className="field"><span>Adresse email</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@exemple.com"/></label>{message&&<p className="success-box">{message}</p>}{error&&<p className="error-box">{error}</p>}<button className="btn-primary btn-large" disabled={loading}>{loading?'Envoi…':'Envoyer le lien'}</button></form><Link to="/connexion" className="mt-6 block text-center text-sm font-semibold text-brand-700">Retour à la connexion</Link></section></main>
}