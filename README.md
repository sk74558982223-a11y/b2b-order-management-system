# B2B Order Management System

A complete all-in-one B2B order management system with:
- order tracking
- product catalog management
- customer management
- auto-generated profit margin pricing
- WhatsApp/email-style message templates
- dashboard analytics
- order automation workflow

## Features

- Dashboard with sales and order summary
- Order management with status updates
- Product catalog by category
- Customer list and billing insight
- Auto pricing calculator with margin logic
- Message templates for customer contact and follow-up
- Business-ready starter architecture for B2B workflows

## Tech Stack

- Node.js
- Express
- HTML/CSS/JavaScript

## Run the app

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Project structure

```text
.
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── server.js
├── package.json
└── README.md
```

## Default admin login

This is a demo app without authentication, designed to help you prototype the B2B workflow quickly.

## Customization ideas

- add MongoDB/PostgreSQL persistence
- connect WhatsApp Business API
- add invoice PDF generation
- create role-based admin permissions
- add supplier management and stock reconciliation
