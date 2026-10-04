const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const categories = ['Electronics', 'Industrial', 'Apparel', 'Home', 'Food'];

const products = [
  { id: 1, name: 'Smart POS Terminal', category: 'Electronics', costPrice: 180, stock: 48, status: 'In Stock' },
  { id: 2, name: 'Heavy Duty Cable Kit', category: 'Industrial', costPrice: 120, stock: 36, status: 'In Stock' },
  { id: 3, name: 'Bulk Office Shirts', category: 'Apparel', costPrice: 22, stock: 90, status: 'In Stock' },
  { id: 4, name: 'Kitchen Storage Pack', category: 'Home', costPrice: 45, stock: 40, status: 'Low Stock' },
  { id: 5, name: 'Rice Supply Box', category: 'Food', costPrice: 30, stock: 120, status: 'In Stock' }
];

const customers = [
  { id: 1, name: 'BluePeak Traders', segment: 'Wholesale', city: 'Delhi', creditLimit: 150000 },
  { id: 2, name: 'NorthStar Retail', segment: 'Retail', city: 'Jaipur', creditLimit: 80000 },
  { id: 3, name: 'Harbor Supply Co.', segment: 'Distributor', city: 'Mumbai', creditLimit: 220000 }
];

const orders = [
  { id: 1, customer: 'BluePeak Traders', category: 'Electronics', product: 'Smart POS Terminal', quantity: 10, unitCost: 180, marginPercent: 22, salePrice: 230, total: 2300, status: 'Paid', createdAt: '2026-09-12' },
  { id: 2, customer: 'NorthStar Retail', category: 'Home', product: 'Kitchen Storage Pack', quantity: 25, unitCost: 45, marginPercent: 18, salePrice: 54, total: 1350, status: 'Packed', createdAt: '2026-09-15' },
  { id: 3, customer: 'Harbor Supply Co.', category: 'Industrial', product: 'Heavy Duty Cable Kit', quantity: 35, unitCost: 120, marginPercent: 25, salePrice: 160, total: 5600, status: 'Shipped', createdAt: '2026-09-17' }
];

const messageTemplates = [
  { id: 1, name: 'Order Confirmed', template: 'Hello {customerName}, your order for {productName} has been confirmed and will be processed shortly.' },
  { id: 2, name: 'Payment Pending', template: 'Hi {customerName}, your invoice is due. Please complete the payment to proceed with dispatch.' },
  { id: 3, name: 'Shipment Update', template: 'Hello {customerName}, your shipment for {productName} is on the way and expected to arrive soon.' },
  { id: 4, name: 'Follow Up', template: 'Hi {customerName}, we hope your delivery was satisfactory. Please share your feedback and reorder anytime.' }
];

function calculateSalePrice(costPrice, marginPercent) {
  const margin = Number(marginPercent || 0) / 100;
  if (margin >= 1) {
    return costPrice;
  }
  return costPrice / (1 - margin);
}

function buildAutoMessage(status, customerName, productName) {
  const templateMap = {
    new: 'Hello {customerName}, thank you for placing an order of {productName}. We have received it and will update you soon.',
    pending: 'Hi {customerName}, your payment is pending for {productName}. Please complete the payment to avoid delays.',
    packed: 'Hello {customerName}, your order for {productName} has been packed and is ready for dispatch.',
    shipped: 'Hello {customerName}, your shipment for {productName} is on the way and tracking details will follow.',
    delivered: 'Hi {customerName}, your order for {productName} has been delivered successfully. Thank you for choosing us.'
  };

  const template = templateMap[status] || templateMap.new;
  return template
    .replace('{customerName}', customerName)
    .replace('{productName}', productName);
}

app.get('/api/dashboard', (req, res) => {
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const pending = orders.filter((o) => o.status === 'Packed' || o.status === 'Paid').length;
  const avgMargin = orders.reduce((sum, order) => sum + order.marginPercent, 0) / orders.length;

  res.json({
    totalOrders: orders.length,
    totalRevenue,
    activeCustomers: customers.length,
    lowStockProducts: products.filter((p) => p.stock < 50).length,
    pendingOrders: pending,
    avgMargin: Number(avgMargin.toFixed(2))
  });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/messages', (req, res) => {
  res.json(messageTemplates);
});

app.post('/api/quote', (req, res) => {
  const { costPrice, marginPercent } = req.body;
  const salePrice = calculateSalePrice(Number(costPrice), Number(marginPercent));
  const profit = salePrice - Number(costPrice);

  res.json({
    costPrice: Number(costPrice),
    marginPercent: Number(marginPercent),
    salePrice: Number(salePrice.toFixed(2)),
    profit: Number(profit.toFixed(2))
  });
});

app.post('/api/orders', (req, res) => {
  const { customer, product, quantity, unitCost, marginPercent, category, status = 'New' } = req.body;

  const salePrice = calculateSalePrice(Number(unitCost), Number(marginPercent));
  const total = Number(salePrice) * Number(quantity);

  const order = {
    id: Date.now(),
    customer,
    product,
    category: category || 'General',
    quantity: Number(quantity),
    unitCost: Number(unitCost),
    marginPercent: Number(marginPercent),
    salePrice: Number(salePrice.toFixed(2)),
    total: Number(total.toFixed(2)),
    status,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  orders.unshift(order);

  res.json({
    message: buildAutoMessage(status.toLowerCase().replace(/\s+/g, '_'), customer, product),
    order
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'b2b-order-management-system' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`B2B order system running at http://localhost:${PORT}`);
});
