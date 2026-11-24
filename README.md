# Picturial — vitrine (picturial.fr)

Site statique 100 % vidéo, conçu selon [DESIGN.md](DESIGN.md) : sobre et élégant, blanc
dominant, accent unique `#F8AE19`, serif **Libre Caslon Text** + sans Instrument Sans
(auto-hébergées), aucun player Vimeo affiché en dur — lecture en lightbox au clic
(« Voir le film »).

Direction graphique (retours Philippe, nov. 2026), inspirée de **Haut et Court** :
- hero = vidéogramme **plein écran** dès l'arrivée (poster d'Ira, mon amour), bouton
  « Voir le film » en pastille blanche en bas à gauche (jamais de player en dur)
- réalisations = **défilement horizontal** (scroll-snap + flèches + compteur), chaque
  diapositive = vidéogramme + titre + méta + contexte + « Voir le film »
- logo **horizontal** (oiseau Tomi sur la même ligne, derrière le nom) : `assets/img/logo-picturial-horizontal.{png,webp}`
  est une **recomposition provisoire** à partir des PNG fournis — remplacer par la version
  officielle dès réception (mêmes noms de fichiers).

## Lancer en local

```sh
cd picturial
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Aucun build, aucune dépendance : HTML + CSS + JS vanilla.

## Structure

```
index.html               page unique (hero, réalisations, prestations, preuve, à propos, contact)
mentions-legales.html    LCEN art. 6 (éditeur, hébergeur, PI)
politique-de-confidentialite.html   RGPD (données, cookies, droits)
cgu.html                 conditions d'utilisation
DESIGN.md                design brief (contexte du projet)
assets/css/fonts.css     @font-face auto-hébergés (woff2, subsets latin / latin-ext)
assets/css/style.css     feuille de style
assets/js/legal-config.js  CONFIG LÉGALE CENTRALISÉE : à remplir (SIRET, forme juridique, hébergeur, DPO…)
assets/js/main.js        menu mobile, bandeau consentement RGPD, lightbox Vimeo (bloquée sans accord), formulaire (mailto)
assets/fonts/            Libre Caslon Text + Instrument Sans (woff2)
assets/img/              vidéogrammes AVIF/WebP (800w/1600w, +1920w pour le hero), logo horizontal WebP/PNG, favicons, og-image
```

## Conformité légale (LCEN / RGPD)

- **Pages légales** liées dans le footer de toutes les pages : `mentions-legales.html`, `politique-de-confidentialite.html`, `cgu.html`. Pas de CGV : le site ne vend rien en ligne (vitrine + formulaire de contact).
- **Infos à renseigner** : une seule source, `assets/js/legal-config.js` (`window.LEGAL_CONFIG`). Les pages légales lisent les champs `[data-legal="…"]` et se remplissent automatiquement. Pré-rempli avec ce qu’on connaît (adresse, email, téléphone) ; à compléter : forme juridique, SIRET, directeur·rice de la publication, DPO, hébergeur.
- **Cookies** : le site ne dépose aucun cookie propre (pas d’analytics, pas de pub). Seul stockage local : le choix de consentement. Les lecteurs Vimeo (qui peuvent déposer des cookies de tiers) ne se chargent **qu’après acceptation** ; en cas de refus, la lightbox propose un lien direct vers Vimeo. Bandeau avec « Tout accepter » / « Tout refuser » de même niveau visuel, aucun choix pré-sélectionné, modifiable via « Gérer mes cookies » en pied de page.
- **Formulaire** : case de consentement au traitement de la demande, **jamais pré-cochée**, obligatoire ; envoi par mailto (aucune donnée stockée côté serveur).

## Vidéos (Vimeo, intégralité en lightbox)

| Film | Player |
|---|---|
| Ira, mon amour | `player.vimeo.com/video/933198113?h=8300f40080` |
| Objet (re)trouvé | `player.vimeo.com/video/774185263?h=440a590aba` |
| Le Blues du poulailler | `player.vimeo.com/video/876004689?h=6995f14855` |
| Récréations | `player.vimeo.com/video/1006856972?h=69c2dffb86` |
| Murmures de culture | `player.vimeo.com/video/1169950875?h=0b4518e3ef` |

## À compléter côté client

- Ordre définitif des réalisations (à affiner par Philippe, meilleur d'abord)
- Photo réelle pour la section À propos (le logo avec Tomi tient lieu d placeholder visuel)
- Témoignages clients verbatim pour la section Preuve (remplacent les éléments factuels actuels)
- Affiche + lien Vimeo du showreel si le hero doit intégrer un « Voir le film »
