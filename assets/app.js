const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

$$('.lang-wrap').forEach((wrap) => {
  const pill = $('.lang-pill', wrap);
  if (!pill) return;
  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
  });
});

document.addEventListener('click', () => $$('.lang-wrap').forEach(w => w.classList.remove('open')));

const drawer = $('.drawer');
const drawerPanel = $('.drawer-panel');
const burger = $('.burger');
const drawerClose = $('.drawer-close');
let trapTarget = null;

function focusables(container) {
  return $$('a,button,input,[tabindex]:not([tabindex="-1"])', container).filter(el => !el.disabled);
}

function trapFocus(container, e) {
  const f = focusables(container);
  if (!f.length) return;
  if (e.key !== 'Tab') return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openDrawer() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');
  trapTarget = drawerPanel;
  focusables(drawerPanel)[0]?.focus();
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
  trapTarget = null;
}

burger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (e) => { if (!drawerPanel.contains(e.target)) closeDrawer(); });
$$('.drawer a').forEach(a => a.addEventListener('click', closeDrawer));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeDrawer(); closeModal(); }
  if (trapTarget) trapFocus(trapTarget, e);
});

const modal = $('.modal');
const modalPanel = $('.modal-panel');
function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  trapTarget = modalPanel;
  focusables(modalPanel)[0]?.focus();
}
function closeModal() {
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  trapTarget = null;
}
$('[data-open-modal]')?.addEventListener('click', openModal);
$$('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (!modalPanel.contains(e.target)) closeModal(); });

const amountButtons = $$('.amt');
const monthInput = $('#months');
const locale = document.body.dataset.locale || 'en-GB';
const currency = document.body.dataset.currency || 'EUR';
let amount = 10000;
const rates = { low: 0.08, base: 0.115, high: 0.15 };

function fmt(v) { return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(v); }

function updateCalc() {
  const m = Number(monthInput?.value || 12);
  $('#mval').textContent = m;
  $('#low').textContent = fmt(amount * ((1 + rates.low) ** m));
  $('#base').textContent = fmt(amount * ((1 + rates.base) ** m));
  $('#high').textContent = fmt(amount * ((1 + rates.high) ** m));
}

amountButtons.forEach((btn) => btn.addEventListener('click', () => {
  amountButtons.forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  amount = Number(btn.dataset.amount);
  updateCalc();
}));
monthInput?.addEventListener('input', updateCalc);
updateCalc();

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.18 });
$$('.reveal').forEach((el) => io.observe(el));

$$('.faq-item').forEach((item) => {
  const btn = $('button', item);
  btn.addEventListener('click', () => {
    $$('.faq-item').forEach((o) => {
      if (o !== item) { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); }
    });
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  });
});
