async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return response.json();
}

function renderStats(data) {
  const cards = [
    { label: 'Total Orders', value: data.totalOrders },
    { label: 'Revenue', value: `₹${data.totalRevenue.toLocaleString()}` },
    { label: 'Active Customers', value: data.activeCustomers },
    { label: 'Avg Margin', value: `${data.avgMargin}%` }
  ];

  document.getElementById('statsGrid').innerHTML = cards
    .map(
      (card) => `
        <div class="stat-card">
          <div class="stat-label">${card.label}</div>
          <div class="stat-value">${card.value}</div>
        </div>
      `
    )
    .join('');
}

function renderOrders(orders) {
  const rows = orders
    .slice(0, 5)
    .map(
      (order) => `
        <tr>
          <td>#${order.id}</td>
          <td>${order.customer}</td>
          <td>${order.product}</td>
          <td>₹${order.total}</td>
          <td><span class="badge">${order.status}</span></td>
        </tr>
      `
    )
    .join('');

  document.getElementById('ordersTable').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderMessages(messages) {
  document.getElementById('messagesList').innerHTML = messages
    .map(
      (message) => `
        <div class="message-item">
          <strong>${message.name}</strong>
          <div>${message.template}</div>
        </div>
      `
    )
    .join('');
}

function renderCustomers(customers) {
  document.getElementById('customersList').innerHTML = customers
    .map(
      (customer) => `
        <div class="customer-item">
          <strong>${customer.name}</strong><br />
          <small>${customer.segment} • ${customer.city}</small>
        </div>
      `
    )
    .join('');
}

function renderProducts(products) {
  document.getElementById('productsList').innerHTML = products
    .map(
      (product) => `
        <div class="product-item">
          <strong>${product.name}</strong><br />
          <small>${product.category} • ${product.stock} in stock</small>
        </div>
      `
    )
    .join('');
}

function handleQuoteSubmit(event) {
  event.preventDefault();
  const costPrice = document.getElementById('costPrice').value;
  const marginPercent = document.getElementById('marginPercent').value;

  fetchJSON('/api/quote', {
    method: 'POST',
    body: JSON.stringify({ costPrice, marginPercent })
  }).then((data) => {
    document.getElementById('quoteResult').innerHTML = `
      <strong>Suggested sale price:</strong> ₹${data.salePrice}<br />
      <strong>Profit:</strong> ₹${data.profit}
    `;
  });
}

function handleOrderSubmit(event) {
  event.preventDefault();

  const payload = {
    customer: document.getElementById('customerName').value,
    product: document.getElementById('productName').value,
    category: document.getElementById('category').value,
    quantity: document.getElementById('quantity').value,
    unitCost: document.getElementById('unitCost').value,
    marginPercent: document.getElementById('orderMargin').value,
    status: 'New'
  };

  fetchJSON('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then((data) => {
    alert(data.message);
    loadDashboard();
    document.getElementById('orderForm').reset();
  });
}

async function loadDashboard() {
  const [stats, orders, messages, customers, products] = await Promise.all([
    fetchJSON('/api/dashboard'),
    fetchJSON('/api/orders'),
    fetchJSON('/api/messages'),
    fetchJSON('/api/customers'),
    fetchJSON('/api/products')
  ]);

  renderStats(stats);
  renderOrders(orders);
  renderMessages(messages);
  renderCustomers(customers);
  renderProducts(products);
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('quoteForm').addEventListener('submit', handleQuoteSubmit);
  document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
  loadDashboard();
});
