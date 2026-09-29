// Domena sklepu Shopify, który zbiera adresy. Podmień przed publikacją.
// Formularz tworzy klienta w Shopify z tagami; wysyłkę PDF robi automatyzacja (Shopify Flow + Shopify Email).
const SHOPIFY_DOMAIN = 'TWOJ-SKLEP.myshopify.com';

const configured = !SHOPIFY_DOMAIN.startsWith('TWOJ-SKLEP');

document.querySelectorAll('form.signup').forEach((form) => {
  const status = form.querySelector('.signup__status');
  const button = form.querySelector('button[type="submit"]');

  const show = (text, kind) => {
    status.textContent = text;
    status.className = 'signup__status is-' + kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (!email.checkValidity()) {
      show('Wpisz poprawny adres e-mail, np. ty@przyklad.pl.', 'error');
      email.focus();
      return;
    }

    const tags = form.dataset.tags.split(',');
    const consent = form.querySelector('input[name="marketing"]');
    if (consent && consent.checked) tags.push('zgoda-marketingowa');

    if (!configured) {
      show('Formularz nie jest jeszcze podłączony do sklepu. Ustaw SHOPIFY_DOMAIN w script.js.', 'error');
      return;
    }

    const data = new FormData();
    data.append('form_type', 'customer');
    data.append('utf8', '✓');
    data.append('contact[email]', email.value.trim());
    data.append('contact[tags]', tags.join(','));

    button.disabled = true;
    try {
      // no-cors: Shopify nie zwraca nagłówków CORS, więc odpowiedź jest nieczytelna, ale zapis przechodzi.
      await fetch('https://' + SHOPIFY_DOMAIN + '/contact#contact_form', { method: 'POST', mode: 'no-cors', body: data });
      form.querySelector('.signup__row').hidden = true;
      if (consent) consent.closest('label').hidden = true;
      show(form.dataset.success, 'ok');
    } catch (err) {
      show('Nie udało się wysłać. Sprawdź połączenie z internetem i spróbuj jeszcze raz.', 'error');
    } finally {
      button.disabled = false;
    }
  });
});

// Pasek na telefonie: widoczny, gdy żaden formularz ani hero nie jest na ekranie
(function () {
  const bar = document.getElementById('sticky');
  if (!bar || !('IntersectionObserver' in window)) return;
  const link = bar.querySelector('a');
  const watched = [document.getElementById('pobierz'), ...document.querySelectorAll('.final')];
  const visible = new Set();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    const show = visible.size === 0;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    link.tabIndex = show ? 0 : -1;
  });
  watched.forEach((el) => el && io.observe(el));
})();
