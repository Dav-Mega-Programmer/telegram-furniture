const products = [
  {
    id: 'kitchen-1',
    name: 'Кухня на заказ',
    category: 'Кухни',
    price: 590000,
    meta: '24 м² · индивидуальный проект',
    image: 'assets/kitchen.svg',
    description: 'Кухня площадью 24 м². Комплектация, материалы, цвета и другие детали проекта уточняются при заказе.'
  }
];

const TG = window.Telegram?.WebApp;
TG?.ready();
TG?.expand();

const state = {
  tab: 'home',
  category: 'Все',
  favorites: JSON.parse(localStorage.getItem('telegramFurnitureFavorites') || '[]')
};

const app = document.getElementById('app');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');

function money(value) { return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'; }
function saveFavorites() { localStorage.setItem('telegramFurnitureFavorites', JSON.stringify(state.favorites)); }
function isFav(id) { return state.favorites.includes(id); }
function categories() { return ['Все', ...new Set(products.map(p => p.category))]; }

function productCard(p) {
  return `<article class="product-card">
    <div class="product-image">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <button class="favorite ${isFav(p.id) ? 'active' : ''}" data-favorite="${p.id}">${isFav(p.id) ? '♥' : '♡'}</button>
    </div>
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      <div class="product-meta">${p.meta}</div>
      <div class="product-bottom">
        <span class="price">${money(p.price)}</span>
        <button class="small-btn" data-product="${p.id}">Подробнее</button>
      </div>
    </div>
  </article>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="welcome">
      <div class="eyebrow">WESTWOODS · ARAM</div>
      <h1>Мебель для дома<br>под ваш проект</h1>
      <p>Кухни и мебель на заказ. Выберите модель, посмотрите детали и оставьте заявку прямо из Telegram.</p>
      <button class="primary-btn" data-tab="catalog">Открыть каталог →</button>
    </section>
    <section class="section">
      <div class="section-head">
        <div class="section-title">Категории</div>
        <button class="text-btn" data-tab="catalog">Все</button>
      </div>
      <div class="categories">
        <button class="category" data-cat="Кухни"><span class="emoji">🍳</span><strong>Кухни</strong></button>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div class="section-title">Наш каталог</div>
        <button class="text-btn" data-tab="catalog">Смотреть всё</button>
      </div>
      <div class="products">${products.map(productCard).join('')}</div>
    </section>`;
}

function renderCatalog() {
  const filtered = state.category === 'Все' ? products : products.filter(p => p.category === state.category);
  app.innerHTML = `
    <section class="section" style="margin-top:4px">
      <div class="section-head"><div class="section-title">Каталог</div></div>
      <div class="filter-row">${categories().map(c => `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}</div>
    </section>
    <section class="section" style="margin-top:14px">
      <div class="products">${filtered.map(productCard).join('')}</div>
    </section>`;
}

function renderFavorites() {
  const liked = products.filter(p => isFav(p.id));
  app.innerHTML = `
    <section class="section" style="margin-top:4px">
      <div class="section-head"><div class="section-title">Избранное</div></div>
      ${liked.length ? `<div class="products">${liked.map(productCard).join('')}</div>` : `<div class="empty"><strong>Пока пусто</strong>Нажмите ♡ на карточке, чтобы сохранить мебель в избранное.</div>`}
    </section>`;
}

function renderContacts() {
  app.innerHTML = `
    <section class="section" style="margin-top:4px">
      <div class="section-head"><div class="section-title">Контакты</div></div>
      <div class="info-grid">
        <div class="info-card">
          <h3>📞 Телефон</h3>
          <p><a class="contact-link" href="tel:+79771466003">+7 977 146-60-03</a></p>
        </div>
        <div class="info-card">
          <h3>💬 Telegram</h3>
          <p><a class="contact-link" href="https://t.me/Dvv009" target="_blank" rel="noopener">@Dvv009</a></p>
        </div>
        <div class="info-card">
          <h3>📍 Город</h3>
          <p>Щёлково</p>
        </div>
        <div class="info-card">
          <h3>🚚 Заказ</h3>
          <p>Стоимость, комплектация и детали проекта уточняются при оформлении заявки.</p>
        </div>
      </div>
    </section>`;
}

function updateNav() {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === state.tab));
}

function render() {
  if (state.tab === 'home') renderHome();
  if (state.tab === 'catalog') renderCatalog();
  if (state.tab === 'favorites') renderFavorites();
  if (state.tab === 'contacts') renderContacts();
  updateNav();
  updateTelegramBackButton();
}

function openModal(html) {
  modalBody.innerHTML = html;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  openModal(`
    <div class="detail">
      <img class="detail-img" src="${p.image}" alt="${p.name}" />
      <h2>${p.name}</h2>
      <div class="muted">${p.meta}</div>
      <div class="detail-price">${money(p.price)}</div>
      <p class="muted" style="line-height:1.5">${p.description}</p>
      <div class="form">
        <input class="field" id="orderName" placeholder="Ваше имя" autocomplete="name" />
        <input class="field" id="orderPhone" placeholder="Телефон" inputmode="tel" autocomplete="tel" />
        <textarea class="field" id="orderComment" rows="3" placeholder="Комментарий к заказу"></textarea>
        <button class="primary-submit" data-order="${p.id}">Оставить заявку</button>
      </div>
      <div class="note">После отправки заявки менеджер получит выбранную модель и ваши контакты.</div>
    </div>`);
}

function submitOrder(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const name = document.getElementById('orderName')?.value.trim();
  const phone = document.getElementById('orderPhone')?.value.trim();
  const comment = document.getElementById('orderComment')?.value.trim();

  if (!name || !phone) {
    TG?.showAlert ? TG.showAlert('Заполните имя и телефон.') : alert('Заполните имя и телефон.');
    return;
  }

  const text = [
    'Здравствуйте! Хочу заказать мебель.',
    `Товар: ${p.name}`,
    `Цена: ${money(p.price)}`,
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    comment ? `Комментарий: ${comment}` : ''
  ].filter(Boolean).join('\n');

  const link = `https://t.me/${window.APP_CONFIG?.TELEGRAM_CONTACT || 'Dvv009'}?text=${encodeURIComponent(text)}`;
  if (TG?.openTelegramLink) TG.openTelegramLink(link);
  else window.location.href = link;
}

function updateTelegramBackButton() {
  if (!TG?.BackButton) return;
  if (state.tab !== 'home') TG.BackButton.show(); else TG.BackButton.hide();
}

TG?.BackButton?.onClick(() => {
  state.tab = 'home';
  state.category = 'Все';
  render();
});

document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) {
    state.tab = tabBtn.dataset.tab;
    if (state.tab === 'catalog') state.category = 'Все';
    render();
    return;
  }

  const catBtn = e.target.closest('[data-cat]');
  if (catBtn) {
    state.category = catBtn.dataset.cat;
    state.tab = 'catalog';
    render();
    return;
  }

  const favBtn = e.target.closest('[data-favorite]');
  if (favBtn) {
    const id = favBtn.dataset.favorite;
    state.favorites = isFav(id) ? state.favorites.filter(x => x !== id) : [...state.favorites, id];
    saveFavorites();
    render();
    return;
  }

  const productBtn = e.target.closest('[data-product]');
  if (productBtn) {
    openProduct(productBtn.dataset.product);
    return;
  }

  const orderBtn = e.target.closest('[data-order]');
  if (orderBtn) {
    submitOrder(orderBtn.dataset.order);
    return;
  }

  if (e.target.closest('[data-close-modal]')) {
    closeModal();
    return;
  }
});

document.getElementById('shareBtn').addEventListener('click', async () => {
  const url = window.location.href;
  const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Каталог Westwoods')}`;
  if (TG?.openTelegramLink) TG.openTelegramLink(tgShare);
  else if (navigator.share) await navigator.share({ title: 'Westwoods', text: 'Каталог мебели', url });
  else {
    await navigator.clipboard?.writeText(url);
    alert('Ссылка скопирована.');
  }
});

render();
