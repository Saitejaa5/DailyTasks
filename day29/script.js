const form = document.getElementById('cardForm');
const previewBtn = document.getElementById('previewBtn');
const cardsContainer = document.getElementById('cardsContainer');
const previewModal = document.getElementById('previewModal');
const previewContent = document.getElementById('previewContent');

let cards = JSON.parse(localStorage.getItem('cards')) || [];

// Load existing cards on page load
cards.forEach(card => renderCard(card));

form.addEventListener('submit', e => {
  e.preventDefault();
  const card = getFormData();
  card.id = Date.now();
  cards.push(card);
  saveAndRender();
  form.reset();
});

previewBtn.addEventListener('click', () => {
  const card = getFormData();
  previewContent.innerHTML = createCardHTML(card, true);
  previewModal.style.display = 'flex';
});

previewModal.addEventListener('click', () => {
  previewModal.style.display = 'none';
});

function getFormData() {
  const name = document.getElementById('name').value;
  const bio = document.getElementById('bio').value;
  const borderStyle = document.getElementById('borderStyle').value;
  const imageFile = document.getElementById('image').files[0];
  return { name, bio, borderStyle, theme: 'light', image: imageFile ? URL.createObjectURL(imageFile) : '' };
}

function saveAndRender() {
  localStorage.setItem('cards', JSON.stringify(cards));
  renderAllCards();
}

function renderAllCards() {
  cardsContainer.innerHTML = '';
  cards.forEach(card => renderCard(card));
}

function renderCard(card) {
  const cardDiv = document.createElement('div');
  cardDiv.className = `card ${card.theme}`;
  cardDiv.innerHTML = `
    <img src="${card.image}" class="${card.borderStyle}" alt="Profile Picture"/>
    <h3>${card.name}</h3>
    <p>${card.bio}</p>
    <button onclick="toggleTheme(${card.id})">Toggle Theme</button>
    <button onclick="editCard(${card.id})">Edit</button>
    <button onclick="deleteCard(${card.id})">Delete</button>
  `;
  cardsContainer.appendChild(cardDiv);
}

function createCardHTML(card, isPreview=false) {
  return `
    <div class="card ${card.theme}">
      <img src="${card.image}" class="${card.borderStyle}" alt="Profile Picture"/>
      <h3>${card.name}</h3>
      <p>${card.bio}</p>
      ${!isPreview ? `
      <button onclick="toggleTheme(${card.id})">Toggle Theme</button>
      <button onclick="editCard(${card.id})">Edit</button>
      <button onclick="deleteCard(${card.id})">Delete</button>` : ''}
    </div>
  `;
}

window.toggleTheme = function(id) {
  cards = cards.map(c => c.id === id ? {...c, theme: c.theme === 'light' ? 'dark' : 'light'} : c);
  saveAndRender();
}

window.deleteCard = function(id) {
  cards = cards.filter(c => c.id !== id);
  saveAndRender();
}

window.editCard = function(id) {
  const card = cards.find(c => c.id === id);
  if (!card) return;
  document.getElementById('name').value = card.name;
  document.getElementById('bio').value = card.bio;
  document.getElementById('borderStyle').value = card.borderStyle;
  // Note: image can't be auto-loaded back to file input due to browser security
  cards = cards.filter(c => c.id !== id);
  saveAndRender();
}
