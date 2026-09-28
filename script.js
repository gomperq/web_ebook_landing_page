// Ikony
if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });

// Sticky pasek: pokazuj po minięciu CTA w hero, chowaj przy sekcji oferty
(function () {
  const bar = document.getElementById('sticky-buy');
  const hero = document.getElementById('hero-cta');
  const offer = document.getElementById('oferta');
  if (!bar || !hero || !offer || !('IntersectionObserver' in window)) return;

  let heroVisible = true;
  let offerVisible = false;
  const link = bar.querySelector('a');

  const update = () => {
    const show = !heroVisible && !offerVisible;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    link.tabIndex = show ? 0 : -1;
  };

  new IntersectionObserver(([e]) => {
    // CTA uznajemy za "minięte" tylko gdy jest nad ekranem
    heroVisible = e.isIntersecting || e.boundingClientRect.top > 0;
    update();
  }).observe(hero);

  new IntersectionObserver(([e]) => {
    offerVisible = e.isIntersecting;
    update();
  }, { threshold: 0.15 }).observe(offer);
})();

// Akordeon: otwarcie jednego zamyka pozostałe w tej samej grupie
document.querySelectorAll('.accordion').forEach((group) => {
  group.addEventListener('toggle', (e) => {
    if (!e.target.open) return;
    group.querySelectorAll('details[open]').forEach((d) => {
      if (d !== e.target) d.open = false;
    });
  }, true);
});
