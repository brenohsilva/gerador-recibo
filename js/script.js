const form = document.getElementById('budget-form');
const formSection = document.getElementById('form-section');
const productsContainer = document.getElementById('products-container');
const productTemplate = document.getElementById('product-template');
const addProductButton = document.getElementById('add-product-button');
const previewActions = document.getElementById('preview-actions');
const budgetPreview = document.getElementById('budget-preview');
const backButton = document.getElementById('back-button');
const printButton = document.getElementById('print-button');

const previewClient = document.getElementById('preview-client');
const previewDate = document.getElementById('preview-date');
const previewValidity = document.getElementById('preview-validity');
const previewProducts = document.getElementById('preview-products');
const previewTotal = document.getElementById('preview-total');

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatDate(dateValue) {
  if (!dateValue) return '';
  const [year, month, day] = dateValue.split('-');
  return `${day}/${month}/${year}`;
}

function updateProductNumbers() {
  const cards = productsContainer.querySelectorAll('.product-card');

  cards.forEach((card, index) => {
    card.querySelector('.product-number').textContent = index + 1;
    const removeButton = card.querySelector('.remove-product-button');
    removeButton.disabled = cards.length === 1;
  });
}

function calculateProductTotal(card) {
  const quantity = Number(card.querySelector('[name="quantity"]').value) || 0;
  const unitPrice = Number(card.querySelector('[name="unitPrice"]').value) || 0;
  const total = quantity * unitPrice;

  card.querySelector('[name="total"]').value = formatCurrency(total);
  return total;
}

function addProduct(product = {}) {
  const clone = productTemplate.content.cloneNode(true);
  const card = clone.querySelector('.product-card');

  card.querySelector('[name="code"]').value = product.code || '';
  card.querySelector('[name="description"]').value = product.description || '';
  card.querySelector('[name="brand"]').value = product.brand || '';
  card.querySelector('[name="location"]').value = product.location || '';
  card.querySelector('[name="unit"]').value = product.unit || 'UN';
  card.querySelector('[name="quantity"]').value = product.quantity || 1;
  card.querySelector('[name="unitPrice"]').value = product.unitPrice || 0;

  card.querySelectorAll('[name="quantity"], [name="unitPrice"]').forEach((input) => {
    input.addEventListener('input', () => calculateProductTotal(card));
  });

  card.querySelector('.remove-product-button').addEventListener('click', () => {
    card.remove();
    updateProductNumbers();
  });

  productsContainer.appendChild(card);
  calculateProductTotal(card);
  updateProductNumbers();
}

function getProductsFromForm() {
  return Array.from(productsContainer.querySelectorAll('.product-card')).map((card) => {
    const quantity = Number(card.querySelector('[name="quantity"]').value) || 0;
    const unitPrice = Number(card.querySelector('[name="unitPrice"]').value) || 0;

    return {
      code: card.querySelector('[name="code"]').value.trim(),
      description: card.querySelector('[name="description"]').value.trim(),
      brand: card.querySelector('[name="brand"]').value.trim(),
      location: card.querySelector('[name="location"]').value.trim(),
      unit: card.querySelector('[name="unit"]').value.trim(),
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    };
  });
}

function renderPreview(products) {
  const total = products.reduce((sum, product) => sum + product.total, 0);

  previewClient.textContent = document.getElementById('client').value;
  previewDate.textContent = formatDate(document.getElementById('date').value);
  previewValidity.textContent = formatDate(document.getElementById('validity').value);
  previewProducts.innerHTML = '';

  products.forEach((product) => {
    const productRow = document.createElement('tr');
    productRow.innerHTML = `
      <td>${product.code}</td>
      <td>${product.description}</td>
      <td>${product.brand}</td>
      <td>${formatCurrency(product.unitPrice)}</td>
      <td>${formatCurrency(product.total)}</td>
    `;

    const detailsRow = document.createElement('tr');
    detailsRow.className = 'product-location-row';
    detailsRow.innerHTML = `
      <td>${product.location}</td>
      <td>${product.unit}</td>
      <td>${product.quantity.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
      <td></td>
      <td></td>
    `;

    previewProducts.appendChild(productRow);
    previewProducts.appendChild(detailsRow);
  });

  previewTotal.textContent = formatCurrency(total);
}

addProductButton.addEventListener('click', () => addProduct());

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const products = getProductsFromForm();
  renderPreview(products);

  formSection.classList.add('hidden');
  previewActions.classList.remove('hidden');
  budgetPreview.classList.remove('hidden');
});

backButton.addEventListener('click', () => {
  formSection.classList.remove('hidden');
  previewActions.classList.add('hidden');
  budgetPreview.classList.add('hidden');
});

printButton.addEventListener('click', () => {
  window.print();
});

addProduct({
  code: '',
  description: '',
  brand: '',
  location: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
});
