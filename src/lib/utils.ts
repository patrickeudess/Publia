export const publicBaseUrl = () => (
  import.meta.env.VITE_PUBLIC_APP_URL?.replace(/\/$/, '')
  || new URL(import.meta.env.BASE_URL, window.location.origin).href.replace(/\/$/, '')
)
export const publicProjectUrl = (slug: string) => `${publicBaseUrl()}/p/${slug}`
export const formatDate = (value: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
export const copyText = async (value: string) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value)
  const input = document.createElement('textarea')
  input.value = value
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

