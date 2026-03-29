const WHATSAPP_NUMBER = '595991725654';

const formatWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const getAllImoveis = () => window.IMOVEIS_DATA || [];

const cardTemplate = (item) => `
  <article class="card">
    <img src="${item.imagens[0]}" alt="${item.titulo}">
    <div class="card-body">
      <div class="chip-row">
        <span class="chip">${item.regiao}</span>
        <span class="chip">${item.tipo}</span>
      </div>
      <h3>${item.titulo}</h3>
      <p>${item.descricaoCurta}</p>
      <strong class="price">${item.valor}</strong>
      <div class="chip-row">
        <span class="chip">${item.area}</span>
        ${item.quartos ? `<span class="chip">${item.quartos} quartos</span>` : ''}
        <span class="chip">${item.banheiros} banheiros</span>
      </div>
      <div class="chip-row">
        <a class="btn btn-secondary" href="imovel.html?id=${item.id}">Ver detalhes</a>
        <a class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="${formatWhatsAppLink(`Olá! Tenho interesse no imóvel ${item.titulo}.`)}">WhatsApp</a>
      </div>
    </div>
  </article>`;

const renderCards = (containerId, items) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items.length
    ? items.map(cardTemplate).join('')
    : '<p>Nenhum imóvel encontrado para os filtros selecionados.</p>';
};

const setupCatalogFilters = () => {
  const filtersWrap = document.getElementById('catalog-filters');
  if (!filtersWrap) return;

  const data = getAllImoveis();
  const region = document.getElementById('filter-region');
  const type = document.getElementById('filter-type');
  const max = document.getElementById('filter-max');
  const search = document.getElementById('filter-search');

  const parseUsd = (txt) => Number(txt.replace(/[^\d]/g, ''));

  const apply = () => {
    const valueMax = max.value ? Number(max.value) : Infinity;
    const term = search.value.toLowerCase().trim();

    const filtered = data.filter((item) => {
      const okRegion = !region.value || item.regiao === region.value;
      const okType = !type.value || item.tipo === type.value;
      const okValue = parseUsd(item.valor) <= valueMax;
      const okSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.descricaoCurta.toLowerCase().includes(term);
      return okRegion && okType && okValue && okSearch;
    });

    renderCards('catalog-grid', filtered);
  };

  [region, type, max, search].forEach((el) =>
    el?.addEventListener('input', apply)
  );

  apply();
};

const setupFeatured = () => {
  const data = getAllImoveis();
  if (document.getElementById('featured-grid')) {
    renderCards('featured-grid', data.slice(0, 3));
  }
};

const setupDetalhe = () => {
  const root = document.getElementById('imovel-detalhe');
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const item = getAllImoveis().find((x) => x.id === id) || getAllImoveis()[0];

  if (!item) return;

  root.innerHTML = `
    <div class="detail-grid">
      <div>
        <img class="gallery-main" id="gallery-main" src="${item.imagens[0]}" alt="${item.titulo}">
        <div class="thumbs" id="thumbs">
          ${item.imagens
            .map(
              (img, idx) =>
                `<img class="${idx === 0 ? 'active' : ''}" src="${img}" alt="Foto ${
                  idx + 1
                } de ${item.titulo}" data-img="${img}">`
            )
            .join('')}
        </div>
      </div>

      <aside class="detail-card">
        <div class="chip-row">
          <span class="chip">${item.regiao}</span>
          <span class="chip">${item.tipo}</span>
        </div>
        <h1>${item.titulo}</h1>
        <p>${item.descricaoCompleta}</p>
        <p><strong class="price">${item.valor}</strong></p>
        <div class="chip-row">
          <span class="chip">Área: ${item.area}</span>
          ${item.quartos ? `<span class="chip">Quartos: ${item.quartos}</span>` : ''}
          <span class="chip">Banheiros: ${item.banheiros}</span>
          <span class="chip">Garagem: ${item.garagem}</span>
        </div>
        <a class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="${formatWhatsAppLink(
          `Olá! Quero atendimento sobre o imóvel ${item.titulo}.`
        )}">Atendimento via WhatsApp</a>
      </aside>
    </div>

    <section class="section">
      <h2>Tour em vídeo</h2>
      <div class="video-wrap">
        <iframe src="${item.video}" title="Vídeo do imóvel" allowfullscreen></iframe>
      </div>
    </section>
  `;

  const main = document.getElementById('gallery-main');
  const thumbs = document.querySelectorAll('#thumbs img');
  thumbs.forEach((img) => {
    img.addEventListener('click', () => {
      main.src = img.dataset.img;
      thumbs.forEach((x) => x.classList.remove('active'));
      img.classList.add('active');
    });
  });
};

const setupFloatingWhats = () => {
  const floating = document.querySelector('.whatsapp-float');
  if (!floating) return;
  floating.href = formatWhatsAppLink('Olá! Quero conhecer os imóveis da Valença Imobiliária - CDE.');
};

document.addEventListener('DOMContentLoaded', () => {
  setupFeatured();
  setupCatalogFilters();
  setupDetalhe();
  setupFloatingWhats();
});
