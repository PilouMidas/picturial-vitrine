# Design Brief — Vitrine Picturial (picturial.fr)

Sobre et élégant. Ce fichier est le contexte de référence du projet : toute décision
de design ou de contenu doit s'y conformer.

## 1. Principes directeurs

- Sobre et élégant : blanc dominant, beaucoup d'air, grande typographie, aucune décoration gratuite
- Une seule idée par section ; le contenu guide, jamais l'inverse
- Mobile-first : la page est lue à 60%+ sur téléphone, réflexe suffit
- Le site doit paraître fait par un humain pour des humains : pas un template

## 2. Interdits absolus (anti « AI slop »)

- Pas de dégradés violet/bleu, pas de glow, pas de glassmorphism
- Pas de police Inter, Roboto ou system-ui comme identité
- Pas de rangées de 3 cartes identiques avec icône + titre + paragraphe
- Pas d'emoji comme icônes, pas de texte « Lorem », pas de badges « ✨ Powered by IA »
- Pas de dark mode par défaut, pas de hero plein écran avec image stock floue et texte centré par-dessus
- Pas de confettis, animations d'apparition lourdes, ou parallax

## 3. Couleurs

- Fond : blanc pur `#FFFFFF` (ou ivoire très léger `#FAFAF8` si plus de douceur)
- Texte : quasi-noir `#1A1A1A` (jamais `#000` pur)
- Accent unique : le jaune-orangé de marque Picturial `#F8AE19` (RVB 248, 174, 25), mais en
  touches subtiles uniquement : étiquettes de section, filets, soulignés, hover, bouton
  lecture du hero. Jamais en grandes surfaces ni en fond de texte. Pour du texte accent sur
  blanc, utiliser une version assombrie lisible (contraste ≥ 4.5:1). Un seul accent, tenu sur
  tout le site. (Implémentation : texte accent = `#9A6500`, 4,96:1 sur blanc.)
- Gris secondaire : `#6B6B6B` pour les textes tertiaires, `#E5E5E2` pour les filets/séparateurs
- Ratio contraste ≥ 4.5:1 partout. Note : le bouton principal est fond `#F8AE19` avec texte
  `#1A1A1A` (9,2:1) — le blanc sur `#F8AE19` ne fait que 1,9:1 et est donc exclu.

## 4. Typographie

- Titres : une serif avec caractère — **Libre Caslon Text** (Google Fonts), auto-hébergée en
  woff2 (Fraunces écartée en itération 2 : capitales F et J trop « ondulantes » au goût de Philippe)
- Corps et UI : une sans sobre mais pas Inter — Instrument Sans, auto-hébergée en woff2
- Échelle : titre hero 48-64px desktop (clamp responsive), h2 ~32px, corps 16-17px, interligne 1.6
- Un seul graissage fort par bloc visuel ; l'italique serif peut servir de touche signature
  (témoignages, slogans)

## 5. Mise en page

- Conteneur max-width ~1080px, marges latérales généreuses (>24px mobile)
- Sections séparées par du blanc : 96-128px d'écart vertical, pas des filets partout
- Titre de section : petite étiquette (uppercase, letter-spacing 0.1em, accent) + grand titre serif
- Les images : pleines largeur ou inégales (asymétrie), jamais en grille régulière de vignettes
- CTA : boutons rectangulaires simples, fond accent, texte sombre, rayon 4-6px max ;
  hover sobre (assombrissement, pas de transformation)
- Un seul CTA principal par page

## 6. Structure de la vitrine (site 100% vidéo)

- **Header** : logo Picturial, 3-4 liens (Réalisations, Prestations, À propos, Contact), un
  bouton contact discret. Sticky avec fond blanc
- **Hero** : accroche « Des films engagés qui interrogent notre époque. », sous-titre discret
  « production audiovisuelle & cinéma », + l'affiche du showreel si disponible (lien « Voir le
  film » qui ouvre le player en lightbox), CTA unique « Discuter d'un projet ». Option sans
  affiche : hero purement typographique, très Haut et Court. Jamais de player affiché en dur
  dans la page. (Showreel non fourni → hero typographique.)
- **Réalisations** (sélection courte, éditoriale) : façon catalogue de cinéma inspiré Haut et
  Court. Chaque réalisation = une entrée : affiche/poster du film comme unique visuel, grand
  titre serif, type/durée/année en petites capitales grisées, une ligne de contexte, lien
  « Voir le film » qui ouvre le film (intégralité sur Vimeo) en lightbox. Mise en page en
  index vertical, alignements stricts, asymétrie dans les tailles d'affiches plutôt qu'une
  grille. Le meilleur projet en premier
- **Prestations** : les types de films listés avec numérotation (01, 02, 03), titres serif
  grands, plutôt qu'en cartes
- **Preuve** : 2-3 témoignages clients, mise en page asymétrique, texte en italique serif
- **À propos** : court, personnel, une photo réelle plutôt qu'une illustration, une phrase sur
  la vision (photo non fournie à ce stade → logo avec Tomi en attendant)
- **Contact** : email contact@picturial.fr bien visible, formulaire simple (nom, email, projet,
  message), liens Vimeo/Instagram si pertinents
- **Footer** : sobre, mentions légales, copyright

### 6 bis. Traitement des vidéos (règles)

- Aucun player affiché en dur sur le site : le visuel de chaque œuvre est son affiche/poster ;
  le player Vimeo n'existe qu'en lightbox, chargé au clic
- Référence de goût : le site de Haut et Court (index éditorial, playback « Voir la bande-annonce »
  en modale) ; ici le lien sera « Voir le film » (intégralité en lightbox)
- Identité : couleur de marque `#F8AE19`, logos en plusieurs déclinaisons (version sombre sur
  fond clair privilégiée)
- Si un jour le showreel doit jouer en hero : affiche + bouton lecture qui ouvre le player,
  pas d'iframe en dur
- Affiches en AVIF/WebP, aspect-ratio fixe pour éviter tout layout shift
- Réalisations : sélection courte de 4-8 œuvres. Le tri éditorial prime sur la quantité

## 7. Technique

- HTML/CSS statique, pas de dépendances inutiles (aucun framework, aucun build)
- Fonts en font-display: swap, préchargées, auto-hébergées (woff2)
- Images en AVIF/WebP, lazy-load, dimensions fixes pour éviter le layout shift
- Meta title/description propres, favicon, Open Graph basique
- Accessibilité : navigation clavier, alt sur les images, aria-labels sur les icônes
- Objectif Lighthouse ≥ 95 sur mobile

## 8. Ton

Professionnel mais humain. Phrases courtes. Pas de jargon ni de mots à la mode (« solution »,
« sur-mesure », « excellence »). On dit ce qu'on fait, pour qui, et comment contacter.

## 9. Identité et contenu réel

### Identité

- Logos disponibles en 3 déclinaisons : PICTURIAL texte seul (horizontal), PICTURIAL + oiseau
  « Tomi », blanc et noir. Baseline : « production audiovisuelle & cinéma »
- Pour le site (fond clair) : version noire. Le header utilise le wordmark texte seul (compact),
  le logo complet avec Tomi va en footer et À propos. Tomi peut servir de signature discrète en
  jaune `#F8AE19` en petit format

### Catalogue Réalisations (ordre à affiner par Philippe, meilleur d'abord)

Sélection principale — documentaires récents (et fiction), intégralité sur Vimeo en lightbox
« Voir le film » :

| Œuvre | Réalisation | Durée/Année | Commande | Ligne de contexte | Vimeo |
|---|---|---|---|---|---|
| Ira, mon amour | Philippe Beyer-Hirsch | 3' — 2024 | — | Dans les rues de Chișinău, une jeune femme part sur les traces de l'histoire familiale de sa meilleure amie. | vimeo.com/picturial/iramonamour |
| Objet (re)trouvé | Philippe Beyer-Hirsch | 23' — 2022 | France Design Week | De délaissés domestiques à mobilier design, l'itinéraire de meubles surcyclés. | vimeo.com/picturial/objetretrouve |
| Le Blues du poulailler | Philippe Beyer-Hirsch | 17' — 2023 | Assemblée Nationale | Deux députés à la rencontre d'éleveurs et scientifiques pour comprendre l'épizootie aviaire de 2022. | vimeo.com/picturial/bluesdupoulailler |
| Récréations | Philippe Beyer-Hirsch | 26' — 2024 | France Design Week | Le parcours de cinq chaises d'écoles « abandonnées », adoptées par des particuliers, artisans ou designers. | vimeo.com/picturial/recreation |
| Murmures de culture | Philippe Beyer-Hirsch | 6' — 2025 | France Design Week | Le processus de création d'une nouvelle matière, inspiré par Le chant du Styrène d'Alain Resnais. | vimeo.com/1169950875/0b4518e3ef |

Bloc « Et aussi » (liste sobre, sans visuel ni player) : Tristan (fiction, 14', 2024, Mallory
Grolleau — Prix du public Piranha Alien d'or, Festival du Film Fantastique de Rouen),
Hybridation(s) (12', 2023), Adidas — Une histoire d'Alsace (52', 2006), Les Jets — Dans l'ombre
des Shadows (26', 2004), Port d'attache (30', 1998, Arte), Tomi et ses jouets (52', 1996,
France Télévisions).

### Contenu société (source : Présentation Picturial docu 2026)

- **À propos** : « Implantée en Alsace depuis sa création en 1988, Picturial a connu plusieurs
  vies : films pour les soirées Thema d'Arte dans les années 1990, puis production de films
  publicitaires et institutionnels (Adidas, BMW, Heschung). Depuis 2022, une nouvelle génération
  au capital fait renouer l'entreprise avec ses premières amours documentaires. Sous la
  supervision de Christian Klein, Picturial accompagne l'émergence de nouveaux auteurs et
  développe des films engagés, portés par le désir d'interroger notre époque. En parallèle,
  Picturial développe une activité de fiction et produit ses premiers courts-métrages. »
- **Coordonnées** : 1c rue du Baron Chouard, 67700 Monswiller · 07 66 74 55 26 ·
  contact@picturial.fr
- **Prestations (types)** : documentaire de création, fiction (courts-métrages), films de
  commande institutionnels & marques

## 10. Conformité légale (LCEN / RGPD) — ajouté après le brief initial

- Pages dédiées liées dans le footer de toutes les pages : `mentions-legales.html` (LCEN art. 6),
  `politique-de-confidentialite.html` (RGPD), `cgu.html`. Pas de CGV (pas de vente en ligne).
- Configuration légale centralisée dans `assets/js/legal-config.js` (`window.LEGAL_CONFIG`) :
  société, forme juridique, SIRET, adresse, email, téléphone, directeur de la publication,
  DPO, hébergeur, date de mise à jour. Les pages légales se remplissent via les attributs
  `[data-legal="…"]`.
- Bandeau de consentement conforme : boutons « Tout accepter » / « Tout refuser » au même
  niveau visuel, aucun choix pré-sélectionné, aucun script de tracking chargé avant
  consentement (le site n'en a aucun ; les lecteurs Vimeo ne se chargent qu'après accord,
  sinon lien direct vers Vimeo). Choix conservé en stockage local, modifiable via
  « Gérer mes cookies » en pied de page.
- Formulaire de contact : case de consentement **non pré-cochée** et obligatoire ; envoi par
  mailto (aucune donnée stockée côté serveur).

## 11. Itération 2 — retours Philippe (24 nov. 2026)

Référence de goût corrigée : **Haut et Court** (la boîte de prod), pas « Oecourt ».

- **Typo** : Fraunces → Libre Caslon Text (F et J droits, plus catalogue de cinéma).
- **Logo** : version **horizontale** privilégiée (oiseau Tomi sur la même ligne que PICTURIAL,
  derrière le texte). `logo-picturial-horizontal.{png,webp}` est une recomposition provisoire
  depuis les PNG fournis ; à remplacer par le fichier officiel. Fini les logos en tout petit :
  header à hauteur fixe lisible, footer et À propos en grand.
- **Hero** : vidéogramme **plein écran** dès l'arrivée (style Haut et Court), sans player en
  dur — pastille « Voir le film — Ira, mon amour » en bas à gauche, lecture en lightbox.
  L'accroche serif passe en section « intro » juste dessous.
- **Réalisations** : **défilement horizontal** (scroll-snap + flèches + compteur « 1 / 5 »),
  une diapositive = vidéogramme + titre + méta + ligne de contexte + « Voir le film ».
- Moodboard évoqué comme prochaine étape possible (non tranché pour l'instant).

## 12. Itération 3 — retours Philippe (24 nov. 2026, 2e salve)

- **Tristan premier film** : vidéogramme de Tristan en hero plein écran (chip « Voir le film —
  Tristan ») et première diapositive des réalisations. Vimeo trouvé : `1164957316?h=8c1cfa0fbf`
  (845 s ≈ 14 min). Tristan retiré du bloc « Et aussi ».
- **Logo LONG officiel** reçu (`Logo Picturial Tomi et Texte LONG BLACK.png`) →
  `logo-picturial-long-black.{png,webp}`, utilisé partout (header, footer, À propos, moodboard).
- **Carrousel de vidéogrammes par film** : chaque diapositive film contient un `.still-strip`
  (scroll-snap horizontal + flèches + compteur, affiché seulement s'il y a >1 vidéogramme).
  Le carrousel externe (films) reste piloté par ses propres flèches. 1 vidéogramme/film pour
  l'instant ; ajouter des fichiers `poster-<slug>-<n>-*.{avif,webp}` + une entrée `.still`.
- **Config légale remplie** (`assets/js/legal-config.js`) : SARL, SIRET 388 235 152 00039,
  hébergeur OVHcloud (2 rue Kellermann, 59100 Roubaix), directeur de la publication Christian
  Klein, DPO « non désigné » (non requis à ce stade, art. 37 RGPD).
- **Moodboard** : `moodboard.html` (noindex, lien « Moodboard (interne) » en footer, à retirer
  avant la mise en production).

## 13. Méthode : construction par étapes (24 nov. 2026, 3e salve)

Philippe veut avancer en « vibe coding pur » : il décrit **une étape à la fois**, en
commençant par ce qu'on voit en arrivant sur le site ; chaque étape est un commit sur la
branche de la PR, revue en ligne (GitHub Pages sur la branche). Les borders tenus à chaque
étape : ce fichier + les décisions actées, les interdits anti-slop, les règles légales
(LCEN/RGPD, bandeau consentement, aucune case pré-cochée), jamais de player en dur,
contraste ≥ 4,5:1, pas de layout shift, mobile-first.

**Étape 0 faite** : `index.html` réduit à une page blanche (header logo LONG seul, zone
d'arrivée vide, footer légal complet). Les assets, les pages légales, le consentement et
la lightbox restent prêts.

**Étape 1 faite (écran d'arrivée)** : hero 100svh = vidéogramme Tristan en deux couches
(fond flou `blur(6px) brightness(.55)`, centre net cadré par `clip-path` + filet accent
#F8AE19 — le cadre `--frameW/--frameH` est la zone incompressible : hauteur fixe quand on
rétrécit la fenêtre). Dans le cadre, en bas à gauche : « Film / Tristan / de Mallory
Grolleau · fiction · 14 min · 2024 » en blanc. En haut au centre : logo **blanc empilé**
(oiseau au-dessus du texte, `logo-picturial-stacked-white`) sur fond transparent ; en
responsive il rétrécit progressivement (clamp) et passe en coin haut à gauche (< 860px).
Petit bouton « Voir le film — Tristan » en bas à gauche (lightbox, consentement requis).
Pas de menu pour l'instant.

**Étape 1.1 (focus réglable)** : la zone nette n'est plus un cadre centré fixe mais 4
variables sur `.hero` (`--focusX/--focusY` 0..1, `--focusW/--focusH`, cf. README). Réglage
Tristan : `--focusX: 1`, `--focusH: 100%` → bande nette **pleine hauteur à l'extrême droite**
(le sujet à conserver), le reste de l'image reste flou. Le filet accent suit la zone.

**Étape 1.2** : correction du bandeau blanc en haut (le header overlay perdition contre
`.site-header` sticky → spécificité corrigée en `.site-header.site-header--overlay`, le
header flotte maintenant vraiment sur l'image) ; `object-fit: cover` = zoom automatique
si l'image n'est pas en 16:9 (Tristan fait 1,9:1, aucun bandeau venant de l'image) ;
léger **zoom-in à l'arrivée** (`hero-zoom` 1.6s, désactivé si `prefers-reduced-motion`).

**Étape 1.4** : nouvelle image de base Tristan (`tristan_07_web.jpg` → `poster-tristan-*.{avif,webp}`
+ og-image). Le surcadrage devient pilotable depuis la **console** : `setFocus('droite'|'gauche'|'centre'|'haut'|'bas')`
ou `setFocus(x, y, w, h)` (main.js pose les `--focus*` en inline sur `:root`) ; les variables
vivent désormais sur `:root` dans le CSS → **même position pour tous les films**. Réglage
défaut : droite pleine hauteur (`--focusX: 1; --focusH: 100%`).

**Étape 1.6 (plus simple)** : mode édition visuel du cadre — ouvrir le site avec
**`?focus=edit`** → panneau « Cadre net » en bas à droite (4 curseurs X/Y/largeur/hauteur
+ préréglages + valeurs CSS copiables). Aucun besoin de la console. Les valeurs restent
sur `:root` → même placement pour tous les films.

**Étape 1.7** : le panneau `?focus=edit` gagne un curseur **« Logo (px) »** → variable
`--logoH` sur `:root` (défaut `clamp(44px, 8vh, 88px)`, `clamp(26px, 6vw, 44px)` < 860px).
Les valeurs copiées incluent `--logoH`. Param accepté aussi : `?edit=1`.

**Étape 1.8** : curseur **« Flou (px) »** dans le panneau `?focus=edit` → variable `--blur`
(défaut `6px`) sur `:root`, utilisée par `.hero-bg img { filter: blur(var(--blur)) ... }`.
Valeur copiable incluse dans le champ CSS.

**Étape 2 (carrousel de films plein écran, façon Haut et Court)** : le hero devient un carrousel
des 6 films (tableau `FILMS` dans main.js). La carte du film suivant dépasse déjà en plus petit
(échelle .8, opacité .55) à droite du cadre principal, cliquable. Au clic sur la flèche droite
(bouton, carte suivante, ou touche →) : la photo du film courant fond légèrement, celle du film
suivant (ex. Ira, mon amour) prend la place principale avec un léger zoom-in ; le cadre titre
de Tristan sort complètement par la gauche (`translateX(-110vw)`) pendant que le titre du
film suivant vient prendre exactement la place de Tristan (mêmes `--focus*`, même taille,
il grandit légèrement et gagne en opacité). Compteur « n / 6 » + bouton « Voir le film — {titre} ».
Deux nouvelles variables sur `:root` : `--transDur` (durée du fondu/zoom/exit, défaut .8s) et
`--zoom` (zoom d'arrivée, défaut 1.05). Panneau `?focus=edit` : 8 curseurs (X/Y/L/H + logo +
flou + **durée** + **zoom**) et les 4 lignes de valeurs CSS copiables incluent désormais
`--transDur` / `--zoom`. Valeurs verrouillées par Philippe : `--focusX: 0.37; --focusY: 0.5;
--focusW: 50%; --focusH: 100%; --logoH: 102px; --blur: 2px;` dans `:root`.

**Étape 2.1 (retours Philippe)** : le cadre titre qui sort par la gauche (ou la droite)
disparaît vite — fondu sur 30 % de `--transDur` puis `visibility: hidden` et
`pointer-events: none`, aucun fantôme visible pendant la sortie. La carte du film
précédent n'apparaît plus à gauche du cadre (classe `.is-prev` supprimée) : seul le film
suivant dépasse à droite, comme sur Haut et Court. Boutons de changement de film bien
visibles : barre blanche en bas à droite (flèche précédente · compteur « n / 6 » · flèche suivante),
z-index 46 au-dessus des cadres, même style que le chip « Voir le film » ; en mobile
(< 720px) la barre remonte au-dessus du chip pour ne pas se chevaucher.

**Étape 2.2 (retours Philippe)** : le titre du film est remonté dans l'image (caption relevée
de ~64px dans le cadre) et les boutons de navigation passent **en dessous**, dans le cadre :
une seule barre blanche en bas à gauche du cadre (`hero-bar` = chip « Voir le film — {titre} »
+ filet + ← · n / 6 · →), positionnée avec les mêmes `--focus*` que le cadre. Le titre du film
suivant **monte du bas vers le haut** à l'arrivée (`caption-rise` : translateY(26px)+opacité 0 →
place, durée `--transDur`) pendant que le cadre photo glisse **de la droite vers la gauche**
(ligne d'images, plus qu'un carrousel) ; l'ancien sort à gauche en disparaissant vite. En mobile
la barre s'étale en bas de l'écran (12px). `prefers-reduced-motion` : pas d'animations.

**Étape 2.3 (retours Philippe)** : correction du fondu entre deux photos — le film suivant
est préchargé en AVIF **et** WebP, aux 3 largeurs (800/1600/1920, `imagesrcset`/`imagesizes=100vw`)
car le `<picture>` sert l'AVIF en priorité : l'image suivante est en cache pendant le fondu, plus
de flash noir. Mouvement : à l'arrivée sur le site, le cadre titre monte du bas de l'écran
(`frame-rise` sur `.is-entering`, une seule fois, 1,5 x `--transDur`) ; en navigation, le cadre
suivant glisse depuis la droite (ligne d'images droite → gauche), l'ancien sort à gauche en
disparaissant vite. Le titre reste remonté dans le cadre avec la barre de boutons en dessous.

**Étape 2.4 (remarque Philippe, cf. Haut et Court)** : le bord droit du cadre en place est
aussi le bord gauche du cadre à venir — les cartes se touchent comme dans une ligne.
`.is-next` = `translateX(var(--focusW)) translateY(10vh) scale(0.8)` : la carte suivante a son
bord gauche exactement sur le bord droit du cadre courant, en bas à droite ; au clic elle
remonte en glissant vers la gauche (diagonale bas-droite → place principale). Miroir en sens
inverse : `.is-from-left` = `translateX(calc(var(--focusW) * -1))` (bord droit de la carte
entrante sur le bord gauche du cadre courant).

**Étape 2.5 (retours Philippe)** : plus de superposition — les deux cadres ont désormais des
coordonnées CSS propres et réglables : cadre en place `--focusX/Y/W/H` (convention gardée),
cadre à venir `--nextL/--nextT/--nextW/--nextH` en left/top/width/height directs (défauts
`68.5% / 20% / 40% / 80%` = bord gauche du cadre à venir sur le bord droit du cadre en place,
en bas à droite). La transition anime la boîte (left/top/width/height) : au clic, la carte
suivante glisse vers la gauche et grandit jusqu'à prendre exactement la place du cadre courant.
RÈGLE ABSOLUE retenue : **jamais de mouvement de gauche vers la droite** — l'ancien cadre sort
toujours par la gauche (`is-exit-left`), et en sens inverse (`←`) la carte entrante arrive par
le bas (`is-from-bottom`, translateY(10vh)), jamais par la gauche. Panneau `?focus=edit` :
12 curseurs (X/Y/L/H du cadre + L/T/larg/haut du cadre suivant en % + logo + flou + durée + zoom),
préréglage « Côte à côte », sortie CSS sur 5 lignes incluant les `--next*`. Console : `setNext(l, t, w, h)`
/ `setNext()` pour lire.

**Étape 2.6** : le panneau `?focus=edit` ne masque plus la vue — il démarre **replié**
(petite barre « Réglages hero · Ouvrir » en bas à droite), on clique pour déplier/replier
(bouton Ouvrir/Replier, `is-collapsed` masque tout sauf l'en-tête). Quand il est ouvert il est
limité en hauteur (`max-height: calc(100svh - 32px)`, scroll interne) pour ne jamais couvrir
tout l'écran.

**Étape 2.7** : correction définitive des mouvements gauche→droite. Les cartes cachées
(`.is-hidden`) sont désormais garées aux coordonnées du cadre à venir (`--next*`) en
opacity 0 / visibility hidden : `is-hidden` ↔ `is-next` n'est plus qu'un fondu sur place
(aucun déplacement). Bilan des mouvements restants : cadre suivant → cadre principal =
boîte `--next*` → `--focus*` (droite→gauche + grandissement) ; ancien cadre = sortie
`translateX(-110vw)` (gauche) ; sens inverse = entrée par le bas `translateY(10vh)` depuis la
position `--next*`. **Aucun mouvement gauche→droite nulle part.**
