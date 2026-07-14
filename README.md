# Publia

Publia transforme le lien d’un site déjà publié en une page professionnelle, simple à partager. Ce MVP inclut une page d’accueil, l’authentification, un tableau de bord CRUD, des pages publiques, le partage par lien/WhatsApp/LinkedIn/QR code et un compteur de visites.

## Technologies

React 18, TypeScript, Vite, Tailwind CSS, React Router, Supabase, React Hook Form, Zod, qrcode.react et Lucide React.

## Installation

Prérequis : Node.js 20 ou plus récent et npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sous Windows PowerShell, utilisez `Copy-Item .env.example .env.local` à la place de `cp`.

Sans variables Supabase valides, l’application démarre automatiquement en **mode démo**. La connexion est préremplie et les projets sont conservés dans le `localStorage` du navigateur. Cela permet de tester tout le parcours sans backend.

## Configuration Supabase

1. Créez un projet sur Supabase.
2. Dans l’éditeur SQL, exécutez intégralement [`supabase/schema.sql`](supabase/schema.sql).
3. Dans Authentication > URL Configuration, définissez l’URL du site et ajoutez les redirections locales et de production, par exemple `http://localhost:5173/**` et `https://votre-domaine.vercel.app/**`.
4. Copiez l’URL du projet et sa clé **publishable** (ou la clé `anon` legacy) dans `.env.local` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_publique
VITE_PUBLIC_APP_URL=http://localhost:5173
```

N’utilisez jamais la clé `service_role` ou une clé secrète dans une variable `VITE_*` : ces valeurs sont intégrées au navigateur. Le SQL active RLS sur toutes les tables publiques, isole les projets par propriétaire et limite l’enregistrement public des visites à une fonction contrôlée.

Pour vérifier l’installation, créez un compte, ajoutez un projet, ouvrez `/p/votre-slug` dans une fenêtre privée, puis confirmez que la visite apparaît dans le tableau de bord.

## Scripts

```bash
npm run dev        # serveur de développement
npm run typecheck  # validation TypeScript
npm run build      # compilation de production
npm run preview    # prévisualisation du build
```

## Déploiement sur Vercel

1. Poussez le dépôt sur GitHub et importez-le dans Vercel.
2. Gardez la commande de build `npm run build` et le dossier de sortie `dist`.
3. Ajoutez les trois variables d’environnement dans les paramètres Vercel.
4. Ajoutez l’URL Vercel aux URL autorisées dans Supabase Auth.
5. Le fichier `vercel.json` redirige les routes React (`/p/:slug`, `/dashboard`, etc.) vers l’application.

## Déploiement sur GitHub Pages

Le workflow `.github/workflows/deploy-pages.yml` construit et publie automatiquement l’application après chaque push sur `main`. Le mode GitHub utilise `/Publia/` comme chemin de base et copie `index.html` vers `404.html` afin que les routes React restent accessibles après un rechargement direct.

Dans GitHub, ouvrez **Settings > Pages** et choisissez **GitHub Actions** comme source. L’application sera ensuite disponible à l’adresse `https://patrickeudess.github.io/Publia/`.

## Architecture

- `src/components` : composants réutilisables ;
- `src/pages` : pages et parcours utilisateur ;
- `src/layouts` : coquilles publique et privée ;
- `src/hooks` : contexte d’authentification ;
- `src/services` : accès aux données Supabase ou démo ;
- `src/lib` : client Supabase, stockage démo et utilitaires ;
- `src/schemas` : validation Zod ;
- `src/types` : modèles TypeScript ;
- `supabase/schema.sql` : tables, index, RLS, triggers et fonction RPC.

## Limites volontaires du MVP

Publia ne fait ni reverse proxy, ni domaines personnalisés, ni sous-domaines dynamiques. Les images sont fournies par URL publique. Le compteur mesure les chargements de page sans collecter d’adresse IP ni de donnée personnelle sensible. Pour un usage public à fort trafic, ajoutez une protection anti-abus à la fonction de visites (rate limiting côté Edge Function ou passerelle API).