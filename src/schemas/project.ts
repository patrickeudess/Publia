import { z } from 'zod'

const optionalUrl = z.union([z.literal(''), z.string().url('Saisissez une URL valide')])

export const projectSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(80),
  slug: z.string().trim().min(3, 'Le slug doit contenir au moins 3 caractères').max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Utilisez uniquement des minuscules, chiffres et tirets'),
  source_url: z.string().url('Saisissez une URL valide').refine((url) => /^https?:\/\//i.test(url), 'Le lien doit commencer par http:// ou https://'),
  short_description: z.string().trim().min(20, 'Ajoutez une description d’au moins 20 caractères').max(180),
  long_description: z.string().trim().max(3000).optional().default(''),
  logo_url: optionalUrl,
  cover_url: optionalUrl,
  category: z.string().min(1, 'Choisissez une catégorie'),
  creator_name: z.string().trim().min(2, 'Indiquez le nom du créateur').max(100),
  contact_email: z.union([z.literal(''), z.string().email('Adresse email invalide')]),
  linkedin_url: optionalUrl.refine((url) => !url || url.includes('linkedin.com'), 'Utilisez un lien LinkedIn'),
  github_url: optionalUrl.refine((url) => !url || url.includes('github.com'), 'Utilisez un lien GitHub'),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Couleur hexadécimale invalide'),
  is_public: z.boolean(),
  is_active: z.boolean()
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const authSchema = z.object({
  fullName: z.string().trim().optional(),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

export const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60)