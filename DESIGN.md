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

- Titres : une serif avec caractère — Fraunces (Google Fonts), auto-hébergée en woff2
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
