function openPlayer({ titre, vimeo, lecteur }) {
  document.querySelector('#player-title').textContent = titre;
  document.querySelector('#vimeo-link').href = vimeo;
  const frame = document.createElement('iframe');
  frame.title = 'Lecteur Vimeo — ' + titre;
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  frame.src = lecteur + '&autoplay=1&dnt=1';
  screenArea.replaceChildren(frame);
  player.showModal();
}
const player = document.querySelector('#player');
const screenArea = document.querySelector('#screen');
document.querySelector('#close-player').onclick = () => player.close();
player.addEventListener('click', event => {
  if (event.target !== player) return;
  const rect = player.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) player.close();
});
player.addEventListener('close', () => screenArea.replaceChildren());
const wrapper = document.querySelector('.swiper-wrapper');
const images = document.querySelector('#images');
const pages = document.querySelector('#pages');
films.forEach(({ titre, genre, mention, description, slug, image: source }, index) => {
  const frame = document.createElement('div');
  const image = new Image();
  image.src = source;
  image.alt = '';
  frame.append(image);
  images.append(frame);
  const slide = document.createElement('article');
  slide.className = 'swiper-slide';
  slide.innerHTML = '<div class="copy"><p class="kind"></p><h2></h2><p class="meta"></p><div class="actions"><button type="button" class="watch" aria-haspopup="dialog"><span aria-hidden="true">▶</span> Voir le film</button><a class="info">En savoir plus <span aria-hidden="true">↗</span></a></div></div>';
  slide.querySelector('.kind').textContent = genre;
  slide.querySelector('h2').textContent = titre;
  slide.querySelector('.meta').textContent = mention;
  slide.querySelector('.info').href = '#film/' + slug;
  const watch = slide.querySelector('.watch');
  watch.setAttribute('aria-label', 'Voir le film « ' + titre + ' »');
  watch.addEventListener('click', () => {
    openPlayer(films[index]);
  });
  if (description?.trim()) {
    const summary = document.createElement('p');
    summary.className = 'description';
    summary.textContent = description.trim();
    slide.querySelector('.actions').before(summary);
  }
  slide.addEventListener('click', () => {
    if (slide.classList.contains('swiper-slide-next') && slider.allowClick) slider.slideNext();
  });
  wrapper.append(slide);
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', 'Afficher ' + titre);
  dot.addEventListener('click', () => slider.slideToLoop(index));
  pages.append(dot);
});
function sync(swiper) {
  const index = swiper.realIndex;
  const incoming = images.children[index];
  if (!incoming.classList.contains('current')) {
    images.querySelector('.outgoing')?.classList.remove('outgoing');
    const previous = images.querySelector('.current');
    previous?.classList.replace('current', 'outgoing');
    incoming.classList.add('current');
  }
  Array.from(pages.children).forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
  Array.from(wrapper.children).forEach(slide => slide.setAttribute('aria-hidden', String(Number(slide.dataset.swiperSlideIndex) !== index)));
  document.querySelector('#status').textContent = films[index].titre + ', film ' + (index + 1) + ' sur ' + films.length;
}
const slider = new Swiper('.swiper', {
  slidesPerView:'auto', loop:true, speed:matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 640,
  slidesOffsetBefore: () => innerWidth * (innerWidth <= 650 ? .05 : .12),
  on:{init:sync,realIndexChange:sync}
});
document.querySelector('#prev').onclick = () => slider.slidePrev();
document.querySelector('#next').onclick = () => slider.slideNext();
document.addEventListener('keydown', event => {
  if (player.open || menu.open || home.hidden || window.scrollY > home.clientHeight / 2) return;
  if(event.key === 'ArrowRight') slider.slideNext();
  if(event.key === 'ArrowLeft') slider.slidePrev();
});

const home = document.querySelector('#home');
const detail = document.querySelector('#detail');
const stills = document.querySelector('#stills');
const controls = document.querySelector('#gallery-controls');
let detailFilm;
let stillIndex = 0;

function showCount() {
  document.querySelector('#still-count').textContent = (stillIndex + 1) + ' / ' + stills.children.length;
}
function moveStill(step) {
  const count = stills.children.length;
  if (count < 2) return;
  const previous = stills.children[stillIndex];
  stillIndex = (stillIndex + step + count) % count;
  stills.querySelector('.still-outgoing')?.classList.remove('still-outgoing');
  previous.classList.replace('still-active', 'still-outgoing');
  previous.setAttribute('aria-hidden', 'true');
  const current = stills.children[stillIndex];
  current.classList.add('still-active');
  current.removeAttribute('aria-hidden');
  showCount();
}
let gesture;
stills.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || controls.hidden) return;
  gesture = {id:event.pointerId, x:event.clientX, y:event.clientY};
  stills.setPointerCapture(event.pointerId);
});
stills.addEventListener('pointerup', event => {
  if (gesture?.id !== event.pointerId) return;
  const dx = event.clientX - gesture.x;
  const dy = event.clientY - gesture.y;
  gesture = null;
  if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) moveStill(dx < 0 ? 1 : -1);
});
stills.addEventListener('lostpointercapture', () => { gesture = null; });
document.querySelector('#still-prev').onclick = () => moveStill(-1);
document.querySelector('#still-next').onclick = () => moveStill(1);
detail.addEventListener('keydown', event => {
  if (controls.hidden || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  moveStill(event.key === 'ArrowRight' ? 1 : -1);
});
document.querySelector('#film-watch').onclick = () => openPlayer(detailFilm);

const editorial = document.querySelector('#editorial');
const about = document.querySelector('#about-strip');
const menu = document.querySelector('#site-menu');
const toggle = document.querySelector('#menu-toggle');
toggle.onclick = () => {
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
};
document.querySelector('#menu-close').onclick = () => menu.close();
menu.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
menu.addEventListener('click', event => {
  if (event.target.closest('a')) menu.close();
});
const contactForm = document.querySelector('#contact-form');
const submitButton = contactForm.querySelector('button');
const sendStatus = document.querySelector('#send-status');
if (location.protocol === 'file:') {
  submitButton.disabled = true;
  sendStatus.textContent = 'Aperçu local · L’envoi sera disponible sur le site connecté.';
}
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitButton.disabled) return;
  submitButton.disabled = true;
  sendStatus.textContent = 'Envoi en cours…';
  try {
    const response = await fetch('./api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result = await response.json();
    if (!response.ok || result.sent !== true) throw new Error();
    sendStatus.textContent = 'Merci, votre message a été envoyé à Picturial.';
    contactForm.reset();
  } catch {
    sendStatus.textContent = 'L’envoi a échoué. Votre texte est conservé. Vous pouvez réessayer ou nous écrire à contact@picturial.fr.';
  } finally {
    submitButton.disabled = false;
  }
});
document.querySelector('.wordmark').addEventListener('click', () => {
  if (location.hash === '#accueil') window.scrollTo(0,0);
});

const archives = [
  ['Hybridation(s)', 2023, '12 min', 'Philippe Beyer-Hirsch'],
  ['Adidas – Une histoire d’Alsace', 2006, '52 min', 'Christian Klein · France 3 Alsace'],
  ['Les Jets – Dans l’ombre des Shadows', 2004, '26 min', 'Christian Klein · France 3'],
  ['Port d’attache', 1998, '30 min', 'Christian Klein · Arte'],
  ['Tomi et ses jouets', 1996, '52 min', 'Christian Klein · France Télévisions'],
  ['Val d’Isère : Les XVI J.O. d’Hiver', 1992, '52 min', 'Christian Klein · France 3 Alsace']
].map(([titre, annee, duree, realisation]) => ({titre, annee, duree, realisation}));
function filmography(container, entries) {
  for (const film of [...entries].sort((a,b) => b.annee - a.annee)) {
    const row = document.createElement('div');
    row.className = 'archive-row';
    const year = document.createElement('span');
    year.textContent = film.annee;
    const name = document.createElement('div');
    const title = document.createElement(film.slug ? 'a' : 'strong');
    if (film.slug) title.href = '#film/' + film.slug;
    title.textContent = film.titre;
    const credit = document.createElement('small');
    credit.textContent = film.realisation;
    name.append(title,credit);
    const duration = document.createElement('span');
    duration.textContent = film.duree;
    row.append(year,name,duration);
    container.append(row);
  }
}
filmography(document.querySelector('#histoire .archive-list'), [...films,...archives]);
filmography(document.querySelector('#documentaires .archive-list'), archives);
for (const film of [...films].sort((a,b) => b.annee - a.annee)) {
  const card = document.createElement('a');
  card.href = '#film/' + film.slug;
  const image = new Image();
  image.src = film.image;
  image.alt = '';
  card.append(image,document.createTextNode(film.titre));
  document.querySelector((film.genre === 'Fiction' ? '#films' : '#documentaires') + ' .catalog-grid').append(card);
}

function route() {
  const film = films.find(item => location.hash === '#film/' + item.slug);
  if (player.open) player.close();
  detail.hidden = !film;
  const slug = location.hash.slice(1);
  const page = Array.from(editorial.children).find(section => section.id === slug);
  home.hidden = Boolean(film || page);
  about.hidden = home.hidden;
  editorial.hidden = !page;
  for (const section of editorial.children) section.hidden = section !== page;
  if (page) {
    const title = page.querySelector('h1');
    document.title = title.textContent + ' — Picturial';
    title.tabIndex = -1;
    title.focus({preventScroll:true});
    window.scrollTo(0,0);
    return;
  }
  document.title = film ? film.titre + ' — Picturial' : 'Picturial — Les films';
  if (!film) {
    window.scrollTo(0,0);
    if (detailFilm) {
      slider.update();
      slider.slideToLoop(films.indexOf(detailFilm), 0);
      wrapper.querySelector('a[href="#film/' + detailFilm.slug + '"]').focus({preventScroll:true});
    }
    return;
  }
  detailFilm = film;
  const title = document.querySelector('#film-title');
  title.textContent = film.titre;
  document.querySelector('#film-credit').textContent = film.mention;
  document.querySelector('#film-genre').textContent = film.genre;
  const story = document.querySelector('#film-story');
  const synopsis = film.synopsis || film.description;
  const poster = document.querySelector('#film-poster');
  poster.hidden = !film.affiche;
  if (film.affiche) {
    poster.src = film.affiche;
    poster.alt = 'Affiche du film « ' + film.titre + ' »';
  } else {
    poster.removeAttribute('src');
    poster.alt = '';
  }
  const runtime = document.querySelector('#film-runtime');
  runtime.hidden = !film.duree;
  runtime.querySelector('p').textContent = film.duree || '';
  const parcours = document.querySelector('#film-parcours');
  parcours.querySelector('h2').textContent = film.parcours?.titre || '';
  const entries = film.parcours?.entrees || [];
  parcours.hidden = entries.length === 0;
  parcours.querySelector('ul').replaceChildren(...entries.map(entry => {
    const item = document.createElement('li');
    item.textContent = entry;
    return item;
  }));
  document.querySelector('#film-dossier').hidden = !synopsis && !film.affiche && runtime.hidden && parcours.hidden;
  story.hidden = !synopsis;
  story.querySelector('p').textContent = synopsis;
  const pictures = [{image:film.image, alt:'Vidéogramme de « ' + film.titre + ' »'}, ...film.galerie];
  stills.replaceChildren(...pictures.map(({ image, alt }, index) => {
    const photo = new Image();
    photo.src = image;
    photo.alt = alt;
    photo.draggable = false;
    if (index === 0) photo.classList.add('still-active');
    else photo.setAttribute('aria-hidden', 'true');
    return photo;
  }));
  stillIndex = 0;
  controls.hidden = pictures.length === 1;
  stills.tabIndex = controls.hidden ? -1 : 0;
  showCount();
  title.focus({preventScroll:true});
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);
route();
