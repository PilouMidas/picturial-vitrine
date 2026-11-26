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

## 14. Méthode de travail — mode Studio (validée par Philippe)

Objectif : Philippe est acteur de la composition graphique directement dans le navigateur,
sans instruction textuelle systématique à l'agent, et sans allers-retours commit/push pour chaque
ajustement.

**Outil** : `?studio=1` sur le site (assets/js/studio.js + assets/css/studio.css, chargés
dynamiquement UNIQUEMENT avec ce paramétre → aucun effet sur le site public).
Périmètre étape 1 : les deux cadres du hero + le logo, manipulés via les variables CSS
existantes (`--focusX/Y/W/H`, `--nextL/T/W/H`, `--logoH`) posées en inline sur `:root`
(jamais de style inline sur les éléments, jamais de positionnement absolu ajouté).
Fonctions : sélection souris (clic sur le cadre/logo ou liste des calques), contour + 8 poignées,
déplacer (drag), redimensionner (poignées, Maj = garder les proportions), flèches clavier
(1 px, Maj × 10), repères + magnétisme (bords/centre du viewport + **bord partagé entre les deux
cadres**), inspecteur (valeurs live + saisie exacte), annuler/rétablir (Ctrl+Z / Ctrl+Y),
reset par élément ou global, masquer l'UI (H), pause des animations du carrousel (défaut ON),
brouillon auto-sauvegardé en localStorage (`picturial-studio-draft`, restauré à l'ouverture),
export : bloc CSS des **seules variables modifiées** (diff vs `:root` de style.css) + JSON +
résumé en français à transmettre à l'agent.
Le panneau `?focus=edit` (curseurs) reste pour les réglages fins.

**Méthode Git associée** : exploration 100 % locale dans le navigateur (localStorage), aucun
commit/push automatique. Philippe copie l'export et le transmet → l'agent intègre dans le code
source, valide (HTML strict, node --check, accolades CSS, 200 locaux) et committe un **jalon**
sur `vibe/vitrine-picturial-075ffb` (PR #1 conservée). **Push uniquement sur demande explicite**
(« publie ») ou publication convenue (revue GitHub Pages). Les commits = jalons significatifs,
pas des micro-ajustements.

**Solutions évaluées et écartées** : designmode.app (extension, édition live en styles inline,
pas de pilotage des variables ni d'export propre — retenu en option pour les tests rapides de
texte uniquement), VisBug (pas d'export de diff), visual-editor-skill (orienté agent, pas
autonome), Pinegrow (desktop proprio payant, exclu par contrainte).

**Étape 3.1** : le chip du hero est à largeur fixe — label constant « Voir le film »
(le titre du film n'est plus dans le texte visible, donc la cible de clic ne bouge plus ;
le titre reste en `aria-label` « Voir le film — {titre} » pour l'a11y et la lightbox).

**Étape 3.2 — carrousel en VRAIE LIGNE (demande Philippe : « exactement comme Haut et Court »)** :
les 6 cadres sont des diapositives adjacentes d'une ligne horizontale (`.frame-line` en flex,
`overflow: hidden` sur `.frame-track`) : largeur = `--focusW`, hauteur = `--focusH`, position
verticale = `--focusY`, écart entre cadres = `--nextGap` (défaut `0px` → **bord droit du cadre en
place = bord gauche du cadre à venir**, comme chez Haut et Court). Au clic sur `→` (bouton,
carte suivante, ou flèche droite du clavier), toute la ligne glisse d'exactement une largeur vers
la gauche (`transform: translateX` calculé en px par `placeLine()`, transition `--transDur`) :
l'ancien cadre sort par la gauche (coupé par le bord de l'écran), le suivant prend sa place,
la carte d'après est simplement coupée par le bord droit de l'écran. Boucle infinie par clone de
la première carte en fin de ligne + reset sans transition (aucun mouvement gauche→droite, donc
bouton `←` et touche `←` supprimés — navigation 100 % vers l'avant). La zone nette (`clip-path`)
et la barre de boutons continuent de suivre `--focus*`. Studio : la cible « cadre à venir » règle
désormais `--nextGap` (px).

**Étape 3.3 — SWIPE** : glisser horizontalement sur le hero déplace la ligne en direct
(la ligne suit le doigt, `no-trans` pendant le drag, clampé) ; au relâché, si le geste depasse
-60 px vers la gauche → avance d'un film (transition normale), sinon la ligne revient à sa
place. Swipe vers la droite autorisé en rubber-band seulement (jamais de navigation
gauche→droite). `touch-action: pan-y` sur `.hero` pour que le tactile horizontal soit capté,
`cursor: grab`, anti-sélection pendant le geste, clic sur la carte suivante toujours actif.

**Étape 3.4 — SWIPER (la vraie lib, demandée par Philippe)** : le carrousel hero tourne désormais sur
**Swiper 14.4.0 Core auto-hébergé** (`assets/vendor/swiper/swiper-core.min.{js,css}` + `LICENSE` MIT conservée avec le code distribué ; bundle généré en local avec esbuild depuis `swiper/core` + modules `Navigation, Autoplay, EffectFade` — 0 € de licence, aucun CDN).
Structure : `.frame-track.swiper` > `.frame-line.swiper-wrapper` > 6 `.hero-frame.swiper-slide`.
Config : `slidesPerView: "auto"`, largeur de slide = `--focusW` (px calculés), `slidesOffsetBefore`
= position gauche du cadre actif (depuis `--focusX`), `spaceBetween` = `--nextGap` (0 = bord partagé),
`speed` = `--transDur`, `loop: true`, **`allowSlidePrev: false`** (règle absolue : jamais de mouvement
gauche→droite, donc pas de slide précédent ni swipe vers la droite), `grabCursor`, navigation sur
`#hero-next`, tap sur la carte de droite = slideNext, touche → = slideNext. Swiper gère le swipe
tactile/souris nativement. `applyMeasure()` recalcule à chaque resize et à chaque changement de
variables (MutationObserver sur `<html>`) → compatible Studio. Les fonds (fondu + zoom) restent
nos deux slots `.hl`.

**Étape 3.5** : correction de l'effet « saccadé / fondu moche » signalé par Philippe. Cause :
au changement de film, trois mouvements se superposaient (glissement de la ligne Swiper +
zoom-in de la nouvelle photo + fondu). Désormais : au slide, **fondu seul** entre les deux photos
(durée raccourcie à 0,7 x `--transDur`), le zoom-in `hero-zoom` n'est appliqué qu'à l'arrivée sur
le site. La ligne Swiper glisse seule, proprement, sur `--transDur`.

**Étape 4 — carrousel du premier écran, refonte selon spec Philippe (réf. hautetcourt.com 1440x810)** :
image plein écran derrière l'en-tête ; dans la moitié basse, une **bande horizontale de fiches**
(`.fiche.swiper-slide` dans `.frame-line`) : fiche active à x = `--ficheXvw` (15.97vw = 230px à 1440),
fiche suivante à x = `--ficheXvw` + `--ficheStepvw` (44.44vw = 870px à 1440), en retrait via
`--peekOpacity`. Avance : Swiper fait glisser la bande d'exactement une largeur de fiche
(`slidesOffsetBefore` = X, largeur de slide = step, `spaceBetween` 0), `speed` = `--bandDur` (800ms),
`cssEase` = `--bandEase` (ease-out à l'arrivée), `loop: true` (dernier→premier continu), autoplay 5s
(désactivé si prefers-reduced-motion), flèches précédent/suivant + clavier + swipe. En même temps, les deux
images plein écran se croisent en fondu (`--bgDur`) ; les boutons de la fiche active apparaissent
en `--btnDur` (400ms, `.fiche-actions` en absolute bas = hauteur fixe). **Titres longs** : largeur de
fiche fixe (indépendante du titre) ; titre actif = `max-width: ficheStepvw - 2*fichePad` sans limite de
lignes ; titre de l'aperçu = `max-width: 100vw - ficheXvw - ficheStepvw - fichePad` (largeur réellement
visible, marge droite incluse) + `line-clamp: 3` avec ellipse UNIQUEMENT dans l'aperçu. Le bouton
« Voir le film » vit dans chaque fiche (lien propre par film, délégation `[data-video]`). Réglages
regroupés dans `:root` de style.css : `--ficheXvw --ficheStepvw --ficheH --barH --fichePad
--peekOpacity --bandDur --bandEase --bgDur --btnDur`. Studio retargeté (fiche active / aperçu / logo).
Vérifié en jsdom à 1280x720 / 1440x810 / 1920x1080 (géométrie conforme, 0 erreur).

**Étape 4.1 (d'après les captures de hautetcourt.com envoyées par Philippe)** : plus de bordure autour
des fiches (la référence n'a pas de cadre ; le jaune reste sur l'étiquette « Film » et le bouton) ; dans la
fiche à venir, le bloc texte est décalé vers le bas de `--peekDrop` (3vh) — « titre plus bas » comme sur
leur capture avec « The last pickpocket in New York ».

**Étape 5 — double Swiper Core (spec Philippe, démos swiperjs.com/demos/220-effect-fade/core et
/120-slides-per-view-auto/core)** : le hero superpose désormais **deux instances Swiper Core** sur la
même liste de films, dans le même ordre :
1. **Fond** `#hero-bg.swiper` : un slide par film (`.bg-slide.swiper-slide` contenant deux couches
   `.bg-layer` — `.bg-blur` flou + sombre et `.bg-sharp` net recadré par la lentille `--focus*`), plein
   écran jusque derrière l'en-tête. `effect: "fade"`, `fadeEffect: { crossFade: true }`, `loop: true`,
   `allowTouchMove: false`, `speed` = `--bgDur`.
2. **Fiches** `#frame-track.swiper` (inchangé en apparence) : `slidesPerView: "auto"`, `speed: 800`
   (`--bandDur`), `loop: true`, autoplay unique ici (5s), flèches prev/next + clavier + swipe (tap sur la
   fiche de droite = suivant). À chaque `slideChange` : `sync()` (classes `is-current`/`is-next`,
   compteur) puis **`fond.slideToLoop(fiches.realIndex, M.bg)`** — la boucle des deux instances garde la
   continuité dernier→premier.
L'en-tête et `.hero-bar` restent en place. Zoom-in d'arrivée sur le slide de fond actif uniquement.
**Titre à venir** : à 1440×810, fiche active x=230 (`--ficheXvw` 15.97vw), suivante x=870
(`--ficheStepvw` 44.44vw ≈ 640px) → 570px visibles ; `--fichePad` = `clamp(20px, 2.08vw, 30px)` donc marge
droite 30px et titre d'aperçu plafonné à `100vw - --ficheXvw - --ficheStepvw - --fichePad` ≈ **540px**,
`line-clamp: 3` + ellipse uniquement dans l'aperçu (`.fiche.is-next`), titre complet sans limite quand la
fiche est active. La largeur de fiche est fixée en px (inline) : la longueur du titre ne déplace ni la
fiche suivante ni les flèches. Réglages dans `:root` : `--ficheXvw --ficheStepvw --fichePad --peekOpacity
--peekDrop --ficheH --barH --bandDur --bandEase --bgDur --btnDur`. Vérifié en jsdom à 1280×720 /
1440×810 / 1920×1080 : 2 instances initialisées sans erreur, fond fade/crossFade/allowTouchMove:false,
fiches speed 800 + autoplay 5000, offsetBefore 230px et slide 640px à 1440, `fond.realIndex` suit
`fiches.realIndex` via `slideToLoop` (next et prev, boucle comprise).

**Étape 5.1 — correctifs après retour Philippe (vérifiés en navigateur headless Chromium, 1440×810/1280×720/1920×1080/390×844)** :
1. **Fondu absent (cut sec)** : le CSS du module fade (`.swiper-fade .swiper-slide { transition-property: opacity }`) ne fait pas partie de `swiper.min.css` (core) — il est ajouté à la fin de `assets/vendor/swiper/swiper-core.min.css` (règles officielles du module, MIT). Résultat : fondu croisé réel sur `--bgDur` (opacités interpolées mesurées 1→0 / 0→1).
2. **Titres longs coupés à droite** : la largeur d'aperçu utilisait `100vw` (barre de défilement incluse) alors que le hero fait `innerWidth − scrollbar` → dépassement ~6px à 1440. Désormais `main.js` mesure le hero et pose `--heroW`, `--ficheX`, `--ficheStep` en px sur `#hero` ; le CSS les utilise (`calc(var(--heroW, 100vw) - var(--ficheX, --ficheXvw) - var(--ficheStep, --ficheStepvw) - var(--fichePad))` pour l'aperçu, `var(--ficheStep)` pour le titre actif, `var(--ficheX)` pour la barre de flèches). Vérifié : titre long en aperçu, 0px de dépassement, clamp 3 lignes.
3. **Titres non axés sur la zone nette** : la lentille `--focusX/--focusW` (18,5%–68,5%) ne coincidait pas avec la colonne de la fiche active. Le clip-path horizontal de `.bg-sharp img` est désormais calé exactement sur la fiche active : `inset(... calc(100% - var(--ficheX) - var(--ficheStep) + var(--fichePad)) ... calc(var(--ficheX) + var(--fichePad)))` — bord gauche de la zone nette = x du titre actif (mesuré identique à 0,02px près à toutes les résolutions). Vertical toujours piloté par `--focusY/--focusH`.
4. **Zoom-in à chaque changement** : à chaque `slideChange` du Swiper de fond, la diapositive entrante reçoit `.zoom-in` (animation `hero-zoom`, `--zoom` 1.05 → 1 sur la durée du fondu), comme à l'arrivée sur le site.
Vérifié aussi : boucle dernier→premier (6× suivant → « 1 / 6 », `fond.realIndex` = 0), aucune erreur console.

**Étape 5.2 — retours Philippe (vérifiés en Chromium headless 1440×810)** :
1. **Fondu ralenti** : `--bgDur` 0.8s → **1.2s** (seule la transition d'image ; la bande de fiches reste à
   `--bandDur` 800ms).
2. **Netteté qui baisse doucement sur l'image sortante** : à chaque `slideChange` du fond, la diapositive
   précédente reçoit `.is-leaving` → `.bg-sharp img` gagne `blur(var(--fadeBlur))` (6px) avec
   `transition: filter var(--bgDur) ease` — l'image qui disparaît s'estompe en perdant un peu de netteté.
3. **Garde-fou titre à gauche (fiche active)** : `.fiche` en `overflow: hidden` + titre actif clampé à
   `--titleLines` (3) lignes avec ellipse, `max-width` = largeur fiche, `overflow-wrap: break-word` +
   `hyphens: auto` sur tous les titres → un titre trop long ne peut dépasser ni à droite ni en bas de la
   carte active. À droite (aperçu), le clamp 3 lignes sur la largeur visible reste en place.
Vérifié : fondu 1200ms avec opacités interpolées, blur sortant animé jusqu'à 6px, titre absurde → 3 lignes
contenues dans la fiche (withinCard), titres réels inchangés (1 ligne), 0 erreur console.
