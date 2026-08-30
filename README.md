# 🛍️ ShopEase — E-Commerce Web Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## ✨ Features

- **Product Catalog** — Browse products with search and category filtering
- **Product Detail** — View full product info, ratings, and quantity selector
- **Add to Cart** — Cart persisted in localStorage with live badge counter
- **Checkout** — Shipping address + payment method selection, stock verification
- **Order Tracking** — Status timeline, cancel orders, collapsible order details
- **User Auth** — Register/Login with JWT tokens
- **Role-Based Access** — Admin and User roles
- **Admin Dashboard** — Revenue stats, recent orders table
- **Admin Products** — Full CRUD with modal, image preview, search
- **Admin Orders** — Status management with inline dropdown, status filters

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| HTTP Client | Axios (with interceptors) |
| Routing | React Router v6 |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local: `mongodb://localhost:27017` or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### 1. Clone / Open the project
```bash
cd ecommerce-app
```

### 2. Configure the Backend

```bash
cd backend
```

Edit `.env` if you're using MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_key
```

### 3. Install & Seed

```bash
# Install backend dependencies
cd backend
npm install

# Seed the database (creates admin user + 12 products)
npm run seed
```

Seed output will show:
```
🔑 Admin credentials:
   Email:    admin@ecommerce.com
   Password: admin123

👤 User credentials:
   Email:    john@example.com
   Password: user123
```

### 4. Start the Backend

```bash
# In the backend folder
npm run dev
# Server runs on http://localhost:5000
```

### 5. Start the Frontend

```bash
# In a new terminal, in the frontend folder
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

Open **http://localhost:5173** 🎉

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── roleMiddleware.js   # Admin guard
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Express entry point
│   └── .env
└── frontend/
    └── src/
        ├── api/axios.js        # Axios + JWT interceptor
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   ├── ProtectedRoute.jsx
        │   └── AdminRoute.jsx
        └── pages/
            ├── HomePage.jsx
            ├── ProductDetailPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── CartPage.jsx
            ├── CheckoutPage.jsx
            ├── OrdersPage.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminProducts.jsx
                └── AdminOrders.jsx
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/profile` | Private | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | Get all products (supports `?keyword=&category=`) |
| GET | `/api/products/categories` | Public | Get all categories |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Private | Place order (checkout) |
| GET | `/api/orders/my` | Private | Get my orders |
| GET | `/api/orders/:id` | Private | Get order by ID |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| PUT | `/api/orders/:id/cancel` | Private | Cancel order |

## 🧭 Application Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Product catalog with search |
| `/products/:id` | Public | Product detail page |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/cart` | Public | Shopping cart |
| `/checkout` | User | Checkout page |
| `/orders` | User | Order history |
| `/admin` | Admin | Dashboard |
| `/admin/products` | Admin | Product management |
| `/admin/orders` | Admin | Order management |

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT tokens expire in **30 days**
- Admin routes protected by role middleware on both frontend and backend
- Stock verification happens server-side on checkout
