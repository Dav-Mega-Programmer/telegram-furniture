const products = [
  { id: 'sofa-1', name: 'Диван «Лофт»', category: 'Диваны', price: 54900, meta: '220 см · рогожка · раскладной', image: 'assets/sofa.svg', description: 'Прямой диван для гостиной с удобным спальным местом. Можно выбрать ткань и цвет.' },
  { id: 'bed-1', name: 'Кровать «Сканди»', category: 'Спальня', price: 42900, meta: '160×200 · массив · без матраса', image: 'assets/bed.svg', description: 'Лаконичная кровать в скандинавском стиле. Доступна в нескольких оттенках дерева.' },
  { id: 'table-1', name: 'Стол «Моно»', category: 'Столы', price: 28900, meta: '120×70 · дуб · масло', image: 'assets/table.svg', description: 'Обеденный стол с массивной столешницей. Подходит для кухни и небольшой столовой.' },
  { id: 'wardrobe-1', name: 'Шкаф «Норд»', category: 'Хранение', price: 63900, meta: '180×60 · ЛДСП · 3 двери', image: 'assets/wardrobe.svg', description: 'Вместительный шкаф с регулируемыми полками и штангой. Собирается на месте.' },
  { id: 'chair-1', name: 'Кресло «Софт»', category: 'Гостиная', price: 19900, meta: 'текстиль · дуб · мягкое', image: 'assets/chair.svg', description: 'Акцентное кресло с мягкой посадкой для гостиной, кабинета или зоны отдыха.' },
  { id: 'dresser-1', name: 'Комод «Мини»', category: 'Хранение', price: 23900, meta: '100 см · 4 ящика · дуб', image: 'assets/dresser.svg', description: 'Компактный комод для спальни, прихожей или детской комнаты.' }
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
  return `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" /><button class="favorite ${isFav(p.id) ? 'active' : ''}" data-favorite="${p.id}">${isFav(p.id) ? '♥' : '♡'}</button></div><div class="product-info"><div class="product-name">${p.name}</div><div class="product-meta">${p.meta}</div><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="small-btn" data-product="${p.id}">Подробнее</button></div></div></article>`;
}
function renderHome() {
  app.innerHTML = `<section class="welcome"><div class="eyebrow">Добро пожаловать</div><h1>Мебель для дома<br>без лишних шагов</h1><p>Смотрите каталог, выбирайте модель и отправляйте заявку прямо из Telegram.</p><button class="primary-btn" data-tab="catalog">Открыть каталог →</button></section><section class="section"><div class="section-head"><div class="section-title">Категории</div><button class="text-btn" data-tab="catalog">Все</button></div><div class="categories">${['Диваны','Спальня','Столы','Хранение','Гостиная'].map((c, i) => `<button class="category" data-cat="${c}"><span class="emoji">${['🛋️','🛏️','🪑','🗄️','🛋️'][i]}</span><strong>${c}</strong></button>`).join('')}</div></section><section class="section"><div class="section-head"><div class="section-title">Популярное</div><button class="text-btn" data-tab="catalog">Смотреть всё</button></div><div class="products">${products.slice(0,4).map(productCard).join('')}</div></section>`;
}
function renderCatalog() {
  const filtered = state.category === 'Все' ? products : products.filter(p => p.category === state.category);
  app.innerHTML = `<section class="section" style="margin-top:4px"><div class="section-head"><div class="section-title">Каталог</div></div><div class="filter-row">${categories().map(c => `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}</div></section><section class="section" style="margin-top:14px"><div class="products">${filtered.map(productCard).join('')}</div></section>`;
}
function renderFavorites() {
  const liked = products.filter(p => isFav(p.id));
  app.innerHTML = `<section class="section" style="margin-top:4px"><div class="section-head"><div class="section-title">Избранное</div></div>${liked.length ? `<div class="products">${liked.map(productCard).join('')}</div>` : `<div class="empty"><strong>Пока пусто</strong>Нажмите ♡ на карточке, чтобы сохранить мебель в избранное.</div>`}</section>`;
}
function renderContacts() {
  app.innerHTML = `<section class="section" style="margin-top:4px"><div class="section-head"><div class="section-title">Контакты</div></div><div class="info-grid"><div class="info-card"><h3>📞 Отдел продаж</h3><p>+7 (900) 000-00-00<br>Ежедневно, 10:00–20:00</p></div><div class="info-card"><h3>📍 Шоурум</h3><p>Москва, ул. Примерная, 10<br>Перед визитом лучше согласовать время.</p></div><div class="info-card"><h3>🚚 Доставка</h3><p>Доставка и сборка рассчитываются после выбора модели и адреса.</p></div><div class="note">Замените эти данные на свои контакты, адрес, условия доставки и ссылки.</div></div></section>`;
}
function updateNav() { document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === state.tab)); }
function render() { if (state.tab === 'home') renderHome(); if (state.tab === 'catalog') renderCatalog(); if (state.tab === 'favorites') renderFavorites(); if (state.tab === 'contacts') renderContacts(); updateNav(); updateTelegramBackButton(); }
function openModal(html) { modalBody.innerHTML = html; modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); }
function closeModal() { modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); }
function openProduct(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  openModal(`<div class="detail"><img class="detail-img" src="${p.image}" alt="${p.name}" /><h2>${p.name}</h2><div class="muted">${p.meta}</div><div class="detail-price">${money(p.price)}</div><p class="muted" style="line-height:1.5">${p.description}</p><div class="form"><input class="field" id="orderName" placeholder="Ваше имя" autocomplete="name" /><input class="field" id="orderPhone" placeholder="Телефон" inputmode="tel" autocomplete="tel" /><textarea class="field" id="orderComment" rows="3" placeholder="Комментарий к заказу"></textarea><button class="primary-submit" data-order="${p.id}">Оставить заявку</button></div><div class="note">После отправки заявки менеджер получит выбранную модель и ваши контакты.</div></div>`);
}
async function submitOrder(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  const name = document.getElementById('orderName')?.value.trim();
  const phone = document.getElementById('orderPhone')?.value.trim();
  const comment = document.getElementById('orderComment')?.value.trim();
  if (!name || !phone) { TG?.showAlert ? TG.showAlert('Заполните имя и телефон.') : alert('Заполните имя и телефон.'); return; }
  const payload = { productId: p.id, product: p.name, price: p.price, name, phone, comment, initData: TG?.initData || '', telegramUser: TG?.initDataUnsafe?.user || null };
  const api = (window.APP_CONFIG?.API_URL || '').replace(/\/$/, '');
  try {
    if (!api) throw new Error('API_URL is not configured');
    const res = await fetch(api + '/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('API error');
    openModal(`<div class="detail"><h2>Заявка отправлена ✅</h2><p class="muted" style="line-height:1.5">Спасибо, ${name}! Менеджер свяжется с вами по телефону ${phone}.</p><button class="primary-submit" data-close-modal>Готово</button></div>`);
    TG?.HapticFeedback?.notificationOccurred('success');
  } catch (e) {
    openModal(`<div class="detail"><h2>Нужно настроить сервер</h2><p class="muted" style="line-height:1.5">Каталог работает, но отправка заявок пока не подключена. Укажи API_URL после размещения бота на сервере.</p><button class="primary-submit" data-close-modal>Закрыть</button></div>`);
  }
}
function updateTelegramBackButton() {
  if (!TG?.BackButton) return;
  if (state.tab !== 'home') TG.BackButton.show(); else TG.BackButton.hide();
}
TG?.BackButton?.onClick(() => { state.tab = 'home'; state.category = 'Все'; render(); });

// Telegram MainButton — показывает кнопку "Заказать" только после открытия формы товара.
function setOrderMainButton(show, handler) {
  if (!TG?.MainButton) return;
  TG.MainButton.offClick?.(handler);
  if (show) { TG.MainButton.setText('Оставить заявку'); TG.MainButton.show(); TG.MainButton.onClick(handler); }
  else TG.MainButton.hide();
}

document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-tab]'); if (tabBtn) { state.tab = tabBtn.dataset.tab; if (state.tab === 'catalog') state.category = 'Все'; render(); return; }
  const catBtn = e.target.closest('[data-cat]'); if (catBtn) { state.category = catBtn.dataset.cat; state.tab = 'catalog'; render(); return; }
  const favBtn = e.target.closest('[data-favorite]'); if (favBtn) { const id = favBtn.dataset.favorite; state.favorites = isFav(id) ? state.favorites.filter(x => x !== id) : [...state.favorites, id]; saveFavorites(); render(); return; }
  const productBtn = e.target.closest('[data-product]'); if (productBtn) { openProduct(productBtn.dataset.product); return; }
  const orderBtn = e.target.closest('[data-order]'); if (orderBtn) { submitOrder(orderBtn.dataset.order); return; }
  if (e.target.closest('[data-close-modal]')) { closeModal(); return; }
});

document.getElementById('shareBtn').addEventListener('click', async () => {
  const url = window.location.href;
  const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Каталог мебели')}`;
  if (TG?.openTelegramLink) TG.openTelegramLink(tgShare);
  else if (navigator.share) await navigator.share({ title: 'Мебельный дом', text: 'Каталог мебели', url });
  else { await navigator.clipboard?.writeText(url); alert('Ссылка скопирована.'); }
});
render();
