// Movimento Sustentável — interações simples (menu, galeria, animações)

// ---------- Menu do celular ----------
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('#menu');

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---------- Cabeçalho com sombra + botão voltar ao topo ----------
const topbar = document.querySelector('.topbar');
const toTop = document.querySelector('.to-top');
const onScroll = () => {
  const y = window.scrollY;
  topbar.classList.toggle('is-scrolled', y > 10);
  toTop.classList.toggle('is-visible', y > 600);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Destaca no menu a seção que está na tela ----------
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });

// ---------- Animação suave ao rolar ----------
const revealEls = document.querySelectorAll('.title, .section__intro, .card, .pillar, .statement, .player, .about__text, .guardians, .moment, .partner, .stats li');
const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-in'); reveal.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => { el.classList.add('reveal'); reveal.observe(el); });

// ---------- Galeria: filtros + "ver mais" ----------
const items = [...document.querySelectorAll('.gallery__item')];
const chips = [...document.querySelectorAll('.chip')];
const LIMIT = 8;            // fotos visíveis por vez
let filter = 'todas';
let visibleCount = LIMIT;

const moreBtn = document.createElement('button');
moreBtn.type = 'button';
moreBtn.className = 'btn btn--ghost gallery__more';
document.querySelector('.gallery').after(moreBtn);

function renderGallery() {
  const match = items.filter(it => filter === 'todas' || it.dataset.cat === filter);
  items.forEach(it => { it.hidden = true; });
  match.forEach((it, i) => { it.hidden = i >= visibleCount; });
  const hiddenCount = Math.max(0, match.length - visibleCount);
  moreBtn.hidden = hiddenCount === 0;
  if (hiddenCount > 0) moreBtn.textContent = `Ver mais ${Math.min(LIMIT, hiddenCount)} foto${Math.min(LIMIT, hiddenCount) === 1 ? "" : "s"}`;
}
chips.forEach(chip => chip.addEventListener('click', () => {
  filter = chip.dataset.filter;
  visibleCount = LIMIT;
  chips.forEach(c => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
  renderGallery();
}));
moreBtn.addEventListener('click', () => { visibleCount += LIMIT; renderGallery(); });
renderGallery();

// ---------- Lightbox ----------
const box = document.querySelector('.lightbox');
const boxImg = box.querySelector('img');
const boxCap = box.querySelector('figcaption');
let list = [];
let current = 0;

function show(i) {
  current = (i + list.length) % list.length;
  const img = list[current].querySelector('img');
  boxImg.src = img.getAttribute('src').replace('/thumb/', '/full/');
  boxImg.alt = img.alt;
  boxCap.textContent = `${img.alt} · ${current + 1}/${list.length}`;
}
items.forEach(item => item.addEventListener('click', () => {
  // navega só entre as fotos do filtro atual
  list = items.filter(it => filter === 'todas' || it.dataset.cat === filter);
  show(list.indexOf(item));
  box.showModal();
}));
box.querySelector('.lightbox__close').addEventListener('click', () => box.close());
box.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(current - 1));
box.querySelector('.lightbox__nav--next').addEventListener('click', () => show(current + 1));
box.addEventListener('click', e => { if (e.target === box) box.close(); });
box.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// deslizar o dedo para trocar de foto no celular
let startX = null;
box.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
box.addEventListener('touchend', e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  startX = null;
});
