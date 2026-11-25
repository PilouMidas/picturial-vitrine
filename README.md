# Picturial — vitrine (picturial.fr)

Site statique 100 % vidéo, conçu selon [DESIGN.md](DESIGN.md) : sobre et élégant, blanc
dominant, accent unique `#F8AE19`, serif **Libre Caslon Text** + sans Instrument Sans
(auto-hébergées), aucun player Vimeo affiché en dur — lecture en lightbox au clic
(« Voir le film »).

Direction graphique (retours Philippe, nov. 2026), inspirée de **Haut et Court** :
- hero = vidéogramme **plein écran** dès l'arrivée (poster d'Ira, mon amour), bouton
  « Voir le film » en pastille blanche en bas à gauche (jamais de player en dur)
- réalisations = **carrousel horizontal film par film**, chaque film contenant son propre
  **carrousel de vidéoogrammes** (scroll-snap + flèches + compteur, affiché si >1 vidéogramme)
- logo **LONG horizontal officiel** (oiseau Tomi derrière PICTURIAL, même ligne) :
  `assets/img/logo-picturial-long-black.{png,webp}` ; header lisible, footer et À propos en grand
- hero = **Tristan** en premier film (vidéogramme plein écran + « Voir le film — Tristan »)

## Construction par étapes (vibe coding, nov. 2026)

`index.html` est volontairement réduit à une **page blanche** (étape 0) : header logo seul,
zone d'arrivée vide, footer légal. Les pages légales, le bandeau de consentement et la
lightbox restent en place et inertes. Chaque étape suivante (décrite par Philippe, en
commençant par l'écran d'arrivée) = un commit sur la branche de la PR #1, revu via
GitHub Pages sur `vibe/vitrine-picturial-075ffb`.

## Placer le surcadrage (zone nette) — le plus simple : mode visuel `?focus=edit`

**Sans console** : ouvre le site avec `?focus=edit` à la fin de l'URL, ex. en local
`http://localhost:8000/?focus=edit` (ou `https://.../index.html?focus=edit` en ligne).
Un panneau « Réglages hero » apparaît en bas à droite avec **9 curseurs** (X, Y, largeur,
hauteur du cadre net + **taille du logo en px** + **flou en px** autour de la zone nette
+ **durée des transitions** en s + **zoom d'arrivée** en %) + des boutons de préréglage
(Gauche/Centre/Droite/Haut/Bas) + 4 curseurs « cadre suivant » en coordonnées CSS directes (L/T/largeur/hauteur en %, variable `--nextGap` (écart entre les deux cadres, 0 = bord partagé)) + préréglage « Côte à côte » (bord gauche du cadre suivant sur le bord droit du cadre en place). Le curseur logo pilote `--logoH` (taille du logo blanc
en haut ; en responsive il repasse au coin haut gauche sous 860px), le curseur durée
pilote `--transDur` (durée du fondu/zoom au changement de film et de l'exit du cadre),
le curseur zoom pilote `--zoom` (léger zoom-in à l'arrivée et au changement de film).
Tu bouges un curseur → le cadre jaune et la zone nette suivent en direct. En bas du panneau, les
valeurs CSS se génèrent toutes seules avec un bouton **« Copier les valeurs CSS »** :
copie-les et colle-les dans `:root` de `assets/css/style.css` (ou donne-les moi, je
pousse le commit : les `--focus*` placent le cadre, `--logoH` la taille du logo, `--blur` le flou, `--transDur`/`--zoom` les transitions du carrousel, `--nextGap` l'écart entre les deux cadres). Console : `setNext(l, t, w, h)` / `setNext()`. Règle absolue : jamais de mouvement gauche→droite (sortie toujours à gauche, entrée inverse par le bas). Le panneau démarre **replié** (bouton « Ouvrir » en bas à droite) pour ne pas masquer la vue ; « Replier » le referme. `F5` enlève le panneau.

Alternative console (F12 → Console) :

Les 4 variables vivent sur `:root` (`assets/css/style.css`) : elles s'appliquent à **tous**
les heros/films (même position partout). Pour régler **depuis la console** (F12 → Console),
sans toucher au fichier :

```js
setFocus('droite')   // préréglages : 'droite' | 'gauche' | 'centre' | 'haut' | 'bas'
setFocus(0.8, 0.5, '40vw', '100%')   // ou valeurs brutes : x, y (0..1), largeur, hauteur
setFocus()           // lire les valeurs actuelles
```

Ajuster **petit à petit** (coller ce bloc une fois dans la console, puis appeler à volonté) :

```js
window.nudge = (dx, dy) => { const c = getComputedStyle(document.documentElement), g = k => c.getPropertyValue(k).trim(); setFocus(parseFloat(g('--focusX')) + dx, parseFloat(g('--focusY')) + dy, g('--focusW'), g('--focusH')); };
window.resize = (w, h) => { const c = getComputedStyle(document.documentElement), g = k => c.getPropertyValue(k).trim(); setFocus(g('--focusX'), g('--focusY'), w, h); };
// puis :  nudge(0.05, 0)  -> +5% vers la droite   |   nudge(0, -0.05) -> -5% vers le haut
//         resize('40vw', '80%')  -> change la taille du cadre sans toucher sa position
```

Ça pose les variables en inline sur `<html>` → effet immédiat, et comme c'est sur `:root`,
tous les films (les futurs heros par film) auront le surcadrage au même endroit.
Pour rendre le réglage permanent : éditer les `--focus*` dans `:root` de
`assets/css/style.css` (sur la branche) et committer.

- `--focusX` : 0 = bord gauche, 0.5 = centré, 1 = bord droit · `--focusY` : 0 = haut, 1 = bas
- `--focusW` / `--focusH` : taille de la zone nette (`100%` = pleine largeur/hauteur)

Réglage actuel (Tristan) : `--focusX: 1; --focusH: 100%` → bande nette pleine hauteur à
l'extrême droite de l'image.

## Lancer en local

```sh
cd picturial
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Aucun build, aucune dépendance : HTML + CSS + JS vanilla.

## Structure

```
index.html               page unique (hero plein écran = carrousel des 6 films : flèches + compteur + clavier, fondu/zoom entre films, cadre titre qui sort à gauche, titre suivant à sa place)
moodboard.html           moodboard interne (noindex, lien en footer — à retirer avant prod)
mentions-legales.html    LCEN art. 6 (éditeur, hébergeur, PI)
politique-de-confidentialite.html   RGPD (données, cookies, droits)
cgu.html                 conditions d'utilisation
DESIGN.md                design brief (contexte du projet)
assets/css/fonts.css     @font-face auto-hébergés (woff2, subsets latin / latin-ext)
assets/css/style.css     feuille de style
assets/js/legal-config.js  CONFIG LÉGALE CENTRALISÉE (remplie : SARL, SIRET 388 235 152 00039, OVHcloud, Christian Klein, DPO non désigné)
assets/js/main.js        menu mobile, bandeau consentement RGPD, lightbox Vimeo (bloquée sans accord), carrousel hero des films (tableau FILMS, flèches/clavier), panneau ?focus=edit, formulaire (mailto)
assets/fonts/            Libre Caslon Text + Instrument Sans (woff2)
assets/img/              vidéogrammes AVIF/WebP (800w/1600w, +1920w hero), logo LONG noir WebP/PNG, favicons, og-image
```

## Carrousel hero des films — vraie ligne de cadres (étape 3.2)

Les 6 films du tableau `FILMS` (`assets/js/main.js`) sont des diapositives adjacentes d'une
ligne horizontale (`.frame-line`, flex) dans `.frame-track` (`overflow: hidden`) : largeur
`--focusW`, hauteur `--focusH`, position verticale `--focusY`, écart `--nextGap` (défaut `0px` =
bord du cadre à venir collé sur le bord droit du cadre en place, comme Haut et Court).
Au clic sur `→` (bouton, carte suivante, ou touche →), la ligne glisse d'une largeur vers la
gauche (`placeLine()` calcule le `translateX` en px, transition `--transDur`) ; boucle infinie
par clone de la première carte + reset sans transition. **Navigation uniquement vers l'avant**
(jamais de mouvement gauche→droite : pas de bouton ←). Compteur « n / 6 » + chip « Voir le
film » (label fixe, titre en aria-label). Zone nette et barre de boutons suivent `--focus*`.
Photos : fondu + zoom-in entre deux slots (`--transDur`, `--zoom`), préchargement AVIF/WebP du
film suivant. `placeLine()` est rappelée au resize et à chaque changement de variables
(MutationObserver sur `<html>`) → compatible avec le mode Studio.

## Ajouter un film au carrousel hero

Déposer `assets/img/poster-<slug>-{800,1600,1920}.{avif,webp}` et ajouter une entrée dans
`FILMS` (main.js).

## Conformité légale (LCEN / RGPD)

- **Pages légales** liées dans le footer de toutes les pages : `mentions-legales.html`, `politique-de-confidentialite.html`, `cgu.html`. Pas de CGV : le site ne vend rien en ligne (vitrine + formulaire de contact).
- **Infos à renseigner** : une seule source, `assets/js/legal-config.js` (`window.LEGAL_CONFIG`). Les pages légales lisent les champs `[data-legal="…"]` et se remplissent automatiquement. Pré-rempli avec ce qu’on connaît (adresse, email, téléphone) ; à compléter : forme juridique, SIRET, directeur·rice de la publication, DPO, hébergeur.
- **Cookies** : le site ne dépose aucun cookie propre (pas d’analytics, pas de pub). Seul stockage local : le choix de consentement. Les lecteurs Vimeo (qui peuvent déposer des cookies de tiers) ne se chargent **qu’après acceptation** ; en cas de refus, la lightbox propose un lien direct vers Vimeo. Bandeau avec « Tout accepter » / « Tout refuser » de même niveau visuel, aucun choix pré-sélectionné, modifiable via « Gérer mes cookies » en pied de page.
- **Formulaire** : case de consentement au traitement de la demande, **jamais pré-cochée**, obligatoire ; envoi par mailto (aucune donnée stockée côté serveur).

## Vidéos (Vimeo, intégralité en lightbox)

| Film | Player |
|---|---|
| Tristan (premier film, hero) | `player.vimeo.com/video/1164957316?h=8c1cfa0fbf` |
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
