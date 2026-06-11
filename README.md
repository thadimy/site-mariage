# Thalie & Dimitry — Faire-part de Mariage

Site de faire-part digital pour le mariage de **Thalie ADONG** et **Dimitry MAKOBA**  
**Samedi 29 août 2026** · Lille (Mairie + Église le Phare) · belvédèree, Belgique

---

## Table des matières

1. [Présentation](#présentation)
2. [Stack technique](#stack-technique)
3. [Installation et lancement](#installation-et-lancement)
4. [Architecture du projet](#architecture-du-projet)
5. [Système de design](#système-de-design)
6. [Déploiement Netlify](#déploiement-netlify)
7. [Maintenance — contenu blog](#maintenance--contenu-blog)
8. [Règles de développement](#règles-de-développement)
9. [Contacts](#contacts)

---

## Présentation

Le site est composé de deux expériences unifiées sous un seul projet Vite :

| Partie | URL | Rôle |
|--------|-----|------|
| **Landing animée** | `/` | Entrée immersive — vidéo, grille de photos avec animations GSAP, scroll fluide Lenis, CTA vers le programme |
| **Site programme** | `/programme/` | Site d'information complet — couple, histoire, cérémonie, compte à rebours, RSVP, blog |

**Parcours visiteur :**
```
/ (landing animée)
  → scroll + animations GSAP
  → CTA "Programme du mariage"
  → /programme/ (site complet)
      → navigation : Couple · Histoire · Cérémonie · RSVP · Blog
```

---

## Stack technique

### Landing (`/`)
| Outil | Version | Rôle |
|-------|---------|------|
| [Vite](https://vitejs.dev) | ^6.4 | Bundler / dev server |
| [GSAP](https://gsap.com) | ^3.13 | Animations (sticky grid, parallax, reveal) |
| [Lenis](https://github.com/darkroomengineering/lenis) | ^1.3 | Smooth scroll |
| [imagesloaded](https://imagesloaded.desandro.com) | ^5.0 | Préchargement images avant init GSAP |

### Site programme (`/programme/`)
| Outil | Rôle |
|-------|------|
| HTML statique | Export Webflow — aucun bundler |
| `css/webflow.css` | Reset + classes utilitaires Webflow |
| `css/thalie-dimitry.webflow.css` | Design system du site (variables, composants) |
| `js/webflow.js` | Interactions Webflow (sliders, navbar, animations) — **ne jamais modifier** |
| jQuery 3.5.1 (CDN) | Requis par webflow.js |
| Netlify Forms | Réception des formulaires RSVP (sans backend) |

---

## Installation et lancement

### Prérequis
- [Node.js](https://nodejs.org) ≥ 20
- npm ≥ 9

### Démarrage rapide

```bash
# Cloner le repo
git clone <url-du-repo>
cd thalie-dimitry-mariage

# Installer les dépendances (une seule fois)
npm install

# Démarrer le serveur de développement
npm run dev
```

Le site est accessible sur :

| URL | Page |
|-----|------|
| `http://localhost:5173/` | Landing animée |
| `http://localhost:5173/programme/` | Site programme complet |
| `http://localhost:5173/programme/blog/` | Blog / Journal |
| `http://localhost:5173/programme/blog/comment-nous-sommes-rencontres.html` | Article 1 |

> **Note :** En développement, le dossier `programme/` est servi directement par Vite comme fichiers statiques. Les liens relatifs Webflow fonctionnent tels quels.

### Autres commandes

```bash
npm run build      # Build de production → génère dist/
npm run preview    # Prévisualiser le build localement (http://localhost:4173/)
```

---

## Architecture du projet

```
thalie-dimitry-mariage/
│
├── index.html              ← Entry point Vite — landing animée
├── vite.config.js          ← Config Vite (root='.', publicDir='public', copie statique de programme/)
├── package.json
├── netlify.toml            ← Config build + redirects Netlify
├── .gitignore
├── README.md
├── CLAUDE.md               ← Instructions pour Claude Code (règles visuelles, architecture)
│
├── src/                    ← Sources de la landing (traitées par Vite)
│   ├── scripts/
│   │   ├── index.js        ← Classes StickyGridScroll + IntroAnimations (GSAP + Lenis)
│   │   └── utils.js        ← preloadImages()
│   └── styles/
│       ├── base.css        ← Design tokens landing (--color-*, --font-*, tailles en rem)
│       └── index.css       ← Mise en page landing (block--intro, block--main, gallery)
│
├── public/                 ← Assets statiques landing (copiés tel quel par Vite)
│   ├── video.mp4           ← Vidéo portrait section intro
│   ├── edited-1.png        ← Photo droite section intro
│   ├── new-young*.jpeg     ← Photos grille animée (colonnes 1-2)
│   ├── young-*.jpeg        ← Photos grille animée (colonne 3)
│   ├── d.png               ← Photo grille (12e item)
│   ├── *.webp              ← Variantes WebP
│   ├── favicon.png
│   └── _redirects          ← Règles de routage Netlify (fallback)
│
└── programme/              ← Site Webflow (copié tel quel dans dist/ via viteStaticCopy)
    ├── index.html          ← Page principale (7 sections)
    ├── merci.html          ← Confirmation post-RSVP
    ├── blog.html           ← Shell CMS original (non utilisé en navigation)
    ├── detail_blog.html    ← Shell CMS original (non utilisé en navigation)
    ├── 401.html / 404.html
    ├── blog/               ← Blog statique reconstruit
    │   ├── index.html                              ← Liste des 4 articles
    │   ├── comment-nous-sommes-rencontres.html
    │   ├── nos-photos-de-fiancailles.html
    │   ├── notre-date-et-lieu.html
    │   └── notre-theme-et-couleurs.html
    ├── admin-page/
    │   ├── styleguide.html     ← Référence des composants HTML (boutons, cartes, nav)
    │   ├── change-log.html
    │   └── licenses.html
    ├── css/
    │   ├── normalize.css
    │   ├── webflow.css
    │   └── thalie-dimitry.webflow.css  ← Source de vérité : variables CSS + toutes les classes
    ├── js/
    │   └── webflow.js          ← ⛔ NE JAMAIS MODIFIER
    └── images/                 ← 131 assets (JPEG, PNG, SVG, WebP, AVIF)
```

### Comment Vite gère les deux parties

```
vite build
  ├── traite index.html (racine)
  │     └── bundle src/scripts/index.js + src/styles/*.css → dist/assets/
  ├── copie public/ → dist/ (assets landing)
  └── viteStaticCopy : copie programme/ → dist/programme/ (aucune transformation)
```

Le dossier `programme/` est volontairement **non traité** par Vite : ses chemins relatifs (`css/`, `js/`, `images/`) doivent rester intacts pour que `webflow.js` fonctionne.

---

## Système de design

Les deux parties du site partagent la même identité visuelle mais utilisent des conventions de nommage différentes.

### Palette de couleurs

| Couleur | Hex | Variable landing | Variable programme |
|---------|-----|-------------------|--------------------|
| Fond principal | `#e8f0f6` | `--color-body-bg` | `--_colors---body-bg` |
| Bleu marine (primaire) | `#0d2a3d` | `--color-primary` | `--_colors---theme-primary-color` |
| Bleu navy | `#174664` | `--color-navy-kelp` | `--_colors---navy-kelp` |
| Bleu secondaire | `#2e7aad` | `--color-secondary` | `--_colors---theme-secondary` |
| Terracotta (accent) | `#db570f` | `--color-accent` | `--_colors---accent-color` |
| Texte clair | `#ddeaf4` | `--color-text-light` | `--_colors---text-light` |

### Typographie

| Police | Usage | Variable |
|--------|-------|----------|
| **Gilda Display** (serif) | Titres, headings | `--_typography---heading-font` |
| **Inter Tight** (sans-serif) | Corps de texte, UI | `--_typography---body-font` |
| **Allura** (cursive) | Accents décoratifs | `--_typography---heading-font-two` |

### Composants réutilisables (programme/)

Avant de créer un nouveau composant HTML dans `programme/`, toujours vérifier dans :
- `programme/admin-page/styleguide.html` — structures HTML des boutons, cartes, nav
- `programme/css/thalie-dimitry.webflow.css` — classes disponibles

**Bouton principal :**
```html
<a href="#" class="hero-link-wrap-02 w-inline-block">
  <div class="hero-link-text">LABEL</div>
  <img loading="lazy" src="images/btn-bg.avif" alt="btn-bg" class="btn-bg">
</a>
```

**Bouton secondaire (outline) :**
```html
<a href="#" class="hero-link-wrap-02 w-inline-block">
  <div class="hero-link-text _02">LABEL</div>
  <img loading="lazy" src="images/btn-bg-2.svg" alt="btn-bg-2" class="btn-bg">
</a>
```

**Inputs de formulaire :**
```html
<input class="cta-form-input three w-input" type="text" ...>
<select class="cta-form-input three w-select">...</select>
<input type="submit" class="message-2 w-button" value="Envoyer">
```

---

## Déploiement Netlify

### Premier déploiement

1. Pousser ce repo sur GitHub
2. [Netlify](https://app.netlify.com) → "Add new site" → "Import an existing project"
3. Sélectionner le repo GitHub
4. Netlify détecte automatiquement `netlify.toml` :
   - **Build command :** `npm run build`
   - **Publish directory :** `dist`
5. Cliquer **Deploy site**

### Domaine personnalisé

Dashboard Netlify → **Domain settings** → **Add custom domain**  
→ Configurer les DNS chez votre registrar (Netlify fournit les valeurs)  
→ SSL Let's Encrypt activé automatiquement (gratuit)

### Activer les notifications RSVP (obligatoire après 1er déploiement)

Dashboard → **Forms** → `rsvp-mariage` → **Form notifications** → **Add notification** → Email  
→ Destinataire : `thaliedimitry@gmail.com`

### Redéploiement

Chaque `git push` sur la branche principale déclenche un rebuild automatique.

```bash
git add .
git commit -m "description des changements"
git push
```

---

## Maintenance — contenu blog

Les articles du blog contiennent des marqueurs à remplacer avec le vrai contenu :

```bash
# Trouver tous les points d'injection
grep -r "<!-- CONTENU :" programme/blog/
```

### Injecter le contenu d'un article

Ouvrir le fichier correspondant dans `programme/blog/` et remplacer chaque `<!-- CONTENU : ... -->` :

| Marqueur | À remplacer par |
|----------|----------------|
| `<!-- CONTENU : titre article N -->` | Le titre complet de l'article |
| `<!-- CONTENU : date article N -->` | Ex : `15 juin 2026` |
| `<!-- CONTENU : catégorie article N -->` | Ex : `Notre Histoire` |
| `<!-- CONTENU : extrait article N -->` | 2-3 lignes de résumé |
| `<!-- CONTENU : corps de l'article N -->` | HTML riche (paragraphes, `<strong>`, `<em>`…) |
| `<!-- CONTENU : citation article N -->` | Une citation marquante |
| `<!-- CONTENU : auteur citation N -->` | Prénom de l'auteur |
| `<!-- CONTENU : alt image ... -->` | Texte alternatif pour l'accessibilité |

### Remplacer une image placeholder

Les articles utilisent des images existantes du site en guise de placeholder. Pour les remplacer :

1. Déposer la nouvelle image dans `programme/images/`
2. Mettre à jour le `src` dans le fichier de l'article :
   ```html
   <img src="../images/ma-nouvelle-photo.jpg" ...>
   ```
3. Faire de même dans `programme/blog/index.html` pour la vignette de liste

### Ajouter un 5e article

1. Créer `programme/blog/mon-nouvel-article.html` en copiant la structure d'un article existant
2. Ajouter une entrée dans `programme/blog/index.html` (copier un bloc `.blog-collection-item-wrap`)
3. Alterner les layouts : `.blog-collection-item-wrap` et `.blog-collection-item-wrap _02`

---

## Règles de développement

### Ce qu'on ne touche jamais
- `programme/js/webflow.js` — code propriétaire minifié
- `src/scripts/index.js` — logique GSAP/Lenis de la landing
- `programme/admin-page/styleguide.html` — référence en lecture seule

### Avant d'écrire du code dans programme/
1. Lire `programme/admin-page/styleguide.html` → structures HTML des composants
2. Lire `programme/css/thalie-dimitry.webflow.css` → classes et variables disponibles
3. Utiliser les classes existantes, ne pas en créer de nouvelles pour des patterns existants

### Avant d'écrire du code dans la landing (src/)
1. Lire `src/styles/base.css` → tokens de design (couleurs, typographie, espacements)
2. Lire `src/styles/index.css` → mise en page existante

### Conventions
- **Images programme** : toujours référencées en `images/[fichier]` depuis les pages dans `programme/`
- **Images programme dans blog/** : chemin `../images/[fichier]`
- **Assets landing** : toujours référencés en `./[fichier]` depuis `index.html`
- **Typo Webflow** : `blog-details-contant` (sans "e") — ne pas corriger, la classe CSS l'utilise
- **Chemins absolus** : utiliser `/programme/` pour les liens depuis la landing vers le site

---

## Contacts

| | |
|--|--|
| Email | thaliedimitry@gmail.com |
| Téléphone | Audrey : +33 7 84 67 51 79 
Anouchka : +33 7 78 66 00 92 |
| Date du mariage | Samedi 29 août 2026 |
| Date limite RSVP | 30 juillet 2026 |
