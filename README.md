# Thalie & Dimitry — Faire-part de Mariage

Site de faire-part digital pour le mariage de **Thalie ADONG** et **Dimitry MAKOBA**
**Samedi 29 août 2026** · Lille (Mairie + Église le Phare) · Belvédère, Belgique

---

## Table des matières

1. [Présentation](#présentation)
2. [Stack technique](#stack-technique)
3. [Installation et lancement](#installation-et-lancement)
4. [Architecture du projet](#architecture-du-projet)
5. [Système de design](#système-de-design)
6. [Déploiement GitHub Pages](#déploiement-github-pages)
7. [Formulaire RSVP (important)](#formulaire-rsvp-important)
8. [Maintenance — contenu blog](#maintenance--contenu-blog)
9. [Règles de développement](#règles-de-développement)
10. [Contacts](#contacts)

---

## Présentation

Le site est composé de deux expériences unifiées sous un seul projet Vite :

| Partie | URL | Rôle |
|--------|-----|------|
| **Landing animée** | `/` | Entrée immersive — vidéo plein écran avec verset biblique, grille de photos animée (GSAP), scroll fluide (Lenis), CTA vers le programme |
| **Site programme** | `/programme/` | Site d'information complet — couple, histoire, cérémonie, compte à rebours dynamique, RSVP, blog |

**Parcours visiteur :**
```
/ (landing animée)
  → vidéo + verset « L'amour est patient… » + incitation à scroller
  → scroll + animations GSAP (grille de photos)
  → CTA "Programme du mariage"
  → /programme/ (site complet)
      → navigation : Couple · Infos · Histoire · Cérémonie · RSVP · Blog
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
| Compte à rebours | Script inline vanilla dans `programme/index.html` (jours + heures, accord singulier/pluriel) |

### Hébergement
| Outil | Rôle |
|-------|------|
| **GitHub Pages** | Hébergement statique du site (via GitHub Actions) |
| [Formspree](https://formspree.io) *(à configurer)* | Réception des RSVP — voir [section dédiée](#formulaire-rsvp-important) |

> ⚠️ GitHub Pages est un hébergement **100 % statique** : pas de backend, pas de Netlify Forms.
> La réception des RSVP nécessite un service tiers (voir [Formulaire RSVP](#formulaire-rsvp-important)).

---

## Installation et lancement

### Prérequis
- [Node.js](https://nodejs.org) ≥ 20
- npm ≥ 9

### Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/thadimy/site-mariage.git
cd site-mariage

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
| `http://localhost:5173/programme/blog/comment-nous-sommes-rencontres.html` | Exemple d'article |

> **Note :** En développement, le `base` Vite vaut `/` et le dossier `programme/` est servi
> directement comme fichiers statiques. Les liens relatifs Webflow fonctionnent tels quels.

### Autres commandes

```bash
npm run build      # Build de production → génère dist/ (base /site-mariage/)
npm run preview    # Prévisualiser le build (http://localhost:4173/site-mariage/)
```

---

## Architecture du projet

```
site-mariage/
│
├── index.html              ← Entry point Vite — landing animée
├── vite.config.js          ← Config Vite (base, publicDir, copie statique de programme/)
├── package.json
├── README.md
├── CLAUDE.md               ← Instructions internes (non versionné)
├── netlify.toml            ← Config Netlify (legacy — ignorée par GitHub Pages)
│
├── .github/
│   └── workflows/
│       └── deploy.yml      ← CI/CD : build + déploiement GitHub Pages
│
├── src/                    ← Sources de la landing (traitées par Vite)
│   ├── scripts/
│   │   ├── index.js        ← Classes StickyGridScroll + IntroAnimations (GSAP + Lenis)
│   │   └── utils.js        ← preloadImages()
│   └── styles/
│       ├── base.css        ← Design tokens landing (--color-*, --font-*, tailles en rem)
│       └── index.css       ← Mise en page landing (block--intro, verset, block--main, gallery)
│
├── public/                 ← Assets statiques landing (copiés tel quel par Vite)
│   ├── video.mp4           ← Vidéo plein écran section intro
│   ├── fleur-vanille.png   ← Fleur décorative (compteur programme)
│   ├── new-young*.jpeg     ← Photos grille animée
│   ├── young-*.jpeg        ← Photos grille animée
│   ├── *.webp              ← Variantes WebP
│   ├── favicon.png
│   └── _redirects          ← Règles Netlify (legacy — ignorées par GitHub Pages)
│
└── programme/              ← Site Webflow (copié tel quel dans dist/ via viteStaticCopy)
    ├── index.html          ← Page principale (couple, infos, histoire, cérémonie, compte à rebours, RSVP)
    ├── merci.html          ← Confirmation post-RSVP
    ├── 401.html / 404.html
    ├── blog/               ← Blog statique (6 articles + index)
    │   ├── index.html                              ← Liste des articles (Journal)
    │   ├── comment-nous-sommes-rencontres.html
    │   ├── nos-photos-de-fiancailles.html
    │   ├── notre-date-et-lieu.html
    │   ├── notre-theme-et-couleurs.html
    │   ├── adresses-hotels-le-jour-j.html          ← Hôtels & accès le Jour-J
    │   └── nos-photos-du-mariage.html              ← Album photo (après le mariage)
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
    └── images/                 ← Assets du site programme (JPEG, PNG, SVG, WebP, AVIF)
```

### Comment Vite gère les deux parties

```
vite build
  ├── traite index.html (racine)
  │     └── bundle src/scripts/index.js + src/styles/*.css → dist/assets/
  │         (préfixés par le base /site-mariage/)
  ├── copie public/ → dist/ (assets landing)
  └── viteStaticCopy : copie programme/ → dist/programme/ (aucune transformation)
```

Le dossier `programme/` est volontairement **non traité** par Vite : ses chemins relatifs
(`css/`, `js/`, `images/`) doivent rester intacts pour que `webflow.js` fonctionne.

### À propos du `base` Vite

GitHub Pages sert une **page projet** sous un sous-chemin : `https://thadimy.github.io/site-mariage/`.
Le `base` est donc défini dans `vite.config.js` :

```js
base: command === 'build' ? (process.env.VITE_BASE || '/site-mariage/') : '/'
```

- **En dev** → `base: '/'` (le middleware qui sert `programme/` attend les URLs sous `/programme`).
- **En build** → `base: '/site-mariage/'` : Vite préfixe les assets bundlés.
- Tous les liens de contenu (vers `programme/`, le favicon, etc.) sont **relatifs**, donc
  ils fonctionnent quel que soit le `base`.

> **Domaine personnalisé** ou repo renommé en `<user>.github.io` (site servi à la racine) ?
> Builder avec `VITE_BASE=/` (voir le workflow). Aucun autre changement nécessaire.

---

## Système de design

Les deux parties du site partagent la même identité visuelle mais utilisent des conventions
de nommage différentes.

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

| Police | Usage |
|--------|-------|
| **Gilda Display** (serif) | Titres, headings, verset, compte à rebours |
| **Inter Tight** (sans-serif) | Corps de texte, UI |
| **Allura** (cursive) | Accents décoratifs |

> Ne jamais importer d'autre police. Ces trois polices sont chargées via Google Fonts.

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

## Déploiement GitHub Pages

Le déploiement est **automatisé** via GitHub Actions : chaque `push` sur `main` build le site
et le publie sur GitHub Pages. Aucune commande manuelle, aucun dossier `dist` à committer.

### Configuration initiale (une seule fois)

1. **Pousser le code** sur GitHub (le repo `thadimy/site-mariage` existe déjà) :
   ```bash
   git add .
   git commit -m "Déploiement GitHub Pages"
   git push origin main
   ```

2. Sur GitHub : **Settings → Pages → Build and deployment**
   - **Source** : sélectionner **GitHub Actions**

3. C'est tout. Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) se déclenche
   automatiquement et déploie le site.

4. Le site est en ligne sur :
   **https://thadimy.github.io/site-mariage/**

### Ce que fait le workflow

```
push sur main
  → checkout du code
  → npm ci (install)
  → npm run build (génère dist/ avec base /site-mariage/)
  → upload de dist/ comme artefact Pages
  → déploiement sur GitHub Pages
```

### Redéploiement

Chaque modification suit le même flux :

```bash
git add .
git commit -m "description des changements"
git push
```

Le suivi du déploiement se fait dans l'onglet **Actions** du repo. Un déploiement manuel est
aussi possible via **Actions → Déploiement GitHub Pages → Run workflow**.

### Domaine personnalisé (optionnel)

1. **Settings → Pages → Custom domain** → saisir le domaine (ex. `thalie-et-dimitry.fr`)
2. Configurer les DNS chez le registrar (GitHub fournit les enregistrements)
3. Cocher **Enforce HTTPS** (certificat automatique)
4. Le site étant alors servi à la **racine** du domaine, builder avec `base: /` :
   éditer le workflow et décommenter `env: VITE_BASE: /` à l'étape *Build de production*.

### Page 404 (optionnel)

GitHub Pages sert automatiquement un fichier `404.html` placé à la racine du build pour les
URLs inconnues. Pour une page d'erreur personnalisée, ajouter `public/404.html`
(il sera copié à la racine de `dist/`).

> **Note :** les fichiers `netlify.toml` et `public/_redirects` sont conservés pour permettre
> un hébergement alternatif sur Netlify, mais sont **ignorés par GitHub Pages**.

---

## Formulaire RSVP (important)

⚠️ **À lire avant la mise en ligne.**

Le formulaire RSVP de `programme/index.html` a été conçu pour **Netlify Forms**
(`data-netlify="true"`). **Ce mécanisme ne fonctionne pas sur GitHub Pages** : l'hébergement
est statique, sans backend pour recevoir les soumissions. En l'état, **les RSVP envoyés depuis
GitHub Pages sont perdus**.

### Solution : brancher un service de formulaire statique

Le plus simple est [**Formspree**](https://formspree.io) (offre gratuite suffisante) :

1. Créer un compte sur formspree.io, créer un formulaire → récupérer l'endpoint, ex.
   `https://formspree.io/f/abcdwxyz`.

2. Dans `programme/index.html`, modifier la balise `<form>` :

   **Avant :**
   ```html
   <form id="email-form" name="rsvp-mariage" data-netlify="true"
         data-netlify-honeypot="bot-field" method="POST" action="merci.html" class="cta-form">
   ```

   **Après :**
   ```html
   <form id="email-form" name="rsvp-mariage" method="POST"
         action="https://formspree.io/f/abcdwxyz" class="cta-form">
     <!-- Redirection vers la page de remerciement après envoi -->
     <input type="hidden" name="_next"
            value="https://thadimy.github.io/site-mariage/programme/merci.html">
   ```
   (retirer les attributs `data-netlify*` et l'input caché `form-name`).

3. La première soumission demande une confirmation par email à l'adresse du compte Formspree.
   Les RSVP suivants arrivent directement par email.

> Alternatives équivalentes : [Getform](https://getform.io), [Basin](https://usebasin.com),
> ou un simple [Google Forms](https://forms.google.com) intégré.

---

## Maintenance — contenu blog

Le blog contient **6 articles** dans `programme/blog/`, chacun relié à la page d'accueil
(section *Infos*) et à la liste `programme/blog/index.html`.

### Remplacer une image placeholder

Certains articles utilisent des images existantes du site en placeholder. Pour les remplacer :

1. Déposer la nouvelle image dans `programme/images/`
2. Mettre à jour le `src` dans le fichier de l'article (chemin `../images/...` depuis `blog/`) :
   ```html
   <img src="../images/ma-nouvelle-photo.jpg" ...>
   ```
3. Faire de même dans `programme/blog/index.html` pour la vignette de liste

### Ajouter un nouvel article

1. Créer `programme/blog/mon-nouvel-article.html` en copiant la structure d'un article existant
   (header, image principale, `blog-details-contant`, citation, articles connexes, footer)
2. Ajouter une entrée dans `programme/blog/index.html` (copier un bloc `.blog-collection-item-wrap`)
3. Alterner les layouts : `.blog-collection-item-wrap` (image à gauche) et
   `.blog-collection-item-wrap _02` (image à droite)
4. Mettre à jour la section « Continuer la lecture » des articles voisins si pertinent

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
1. Lire `src/styles/base.css` → tokens de design (couleurs, typographie, espacements en rem)
2. Lire `src/styles/index.css` → mise en page existante

### Conventions
- **Images programme** : référencées en `images/[fichier]` depuis les pages de `programme/`
- **Images programme dans blog/** : chemin `../images/[fichier]`
- **Assets landing** : référencés en **relatif** (`favicon.png`, `programme/`, `./photo.jpg`)
  pour rester compatibles avec le `base` GitHub Pages
- **Typo Webflow** : `blog-details-contant` (sans "e") — ne pas corriger, la classe CSS l'utilise
- **Guillemets** : si VS Code convertit automatiquement les guillemets droits (`"`) en
  guillemets typographiques (`"`) dans le HTML, les attributs cassent. Désactiver toute
  extension « smart quotes » / l'option d'auto-formatage des guillemets.

### Checklist avant commit
- [ ] Couleurs et polices conformes au système de design
- [ ] Classes CSS existantes réutilisées (pas de nouvelles classes pour des patterns existants)
- [ ] Aucun guillemet typographique dans les attributs HTML
- [ ] `npm run build` passe sans erreur

---

## Contacts

| | |
|--|--|
| Email | thaliedimitry@gmail.com |
| Téléphone | Audrey : +33 7 84 67 51 79 — Anouchka : +33 7 78 66 00 92 |
| Date du mariage | Samedi 29 août 2026 |
| Date limite RSVP | 30 juillet 2026 |
| Site en ligne | https://thadimy.github.io/site-mariage/ |
