# 🛒 Flipkart Clone — Full Stack E-Commerce App

A full-featured e-commerce web application inspired by Flipkart, built with a React + Vite frontend and a Node.js + Express + Prisma backend.

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🔗 Live Demo

| | Link |
|---|---|
| 🌐 **Frontend** | [https://flipkart-clone-one-alpha.vercel.app](https://flipkart-clone-one-alpha.vercel.app) |
| ⚙️ **Backend API** | [https://flipkart-clone-backend-iwsu.onrender.com](https://flipkart-clone-backend-iwsu.onrender.com) |

---

## ⚠️ Important — First Load Notice

> The backend is hosted on **Render's free tier**, which automatically **spins down after 15 minutes of inactivity** to save resources.
>
> When you first open the app (or after a period of no use), the backend needs to wake up. This **cold start takes 30–50 seconds** — the products page may appear empty or show a loading spinner during this time.
>
> ✅ **Just wait 30–50 seconds** and everything will load automatically. This is a known Render free tier limitation and is **not a bug**.

---

## ✨ Features

### 🛍️ Shopping Experience
- Browse **125+ products** across 6 categories
- Product Detail Page with **multi-image carousel**
- Search products by name
- Filter by category
- Sort by price, rating, and relevance
- Pagination support

### 🔐 Authentication
- User registration & login with **JWT**
- Protected routes for cart, orders, and wishlist
- Passwords hashed with **bcryptjs**

### 🛒 Cart & Checkout
- Add / remove / update quantity in cart
- Place orders with saved delivery addresses
- View full order history

### ❤️ Wishlist
- Save products to wishlist
- Move wishlist items directly to cart

### 📦 Address Management
- Add and manage multiple delivery addresses
- Set a default address for checkout

---

## 🧪 Test Credentials

```
Email:    user@flipkart.com
Password: password123
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React 18 + Vite | UI & build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| Context API | Global state (auth, cart, wishlist) |

### Backend
| Technology | Role |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM | Database access layer |
| PostgreSQL | Relational database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| express-async-errors | Async error handling |

---

## 📁 Project Structure

```
flipkart-clone/
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/         # Navbar, ProductCard, Carousel, etc.
│   │   ├── pages/              # Home, ProductDetail, Cart, Orders...
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   └── api/                # Axios API functions
│   └── .env
│
└── backend/                    # Node.js + Express
    ├── src/
    │   ├── routes/             # auth, products, cart, orders, wishlist
    │   ├── middleware/         # authMiddleware, errorHandler
    │   └── app.js
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js             # Seeds 125 products across 6 categories
    ├── vercel.json
    └── server.js
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud — [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Clone the repo

```bash
git clone https://github.com/your-username/flipkart-clone.git
cd flipkart-clone
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your actual values

npx prisma db push
npx prisma generate
npx prisma db seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

---

## 🌐 Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_super_secret_key
CLIENT_URL=https://flipkart-clone-one-alpha.vercel.app
PORT=5000
NODE_ENV=production
```

### Frontend `.env`
```env
VITE_API_URL=https://flipkart-clone-backend-iwsu.onrender.com
```

---

## 🗄️ Seed Data

| Category | Products |
|---|---|
| 📱 Electronics | 35 |
| 👗 Fashion | 25 |
| 🏠 Home & Furniture | 20 |
| 📚 Books | 15 |
| 🏋️ Sports & Fitness | 15 |
| 💄 Beauty & Care | 15 |
| **Total** | **125** |

---

## 📌 Known Limitations

| Issue | Cause | Workaround |
|---|---|---|
| 30–50s cold start on first visit | Render free tier spins down after inactivity | Wait ~50 seconds on first load |
| Products empty on first load | Backend still waking up | Refresh the page after 50 seconds |

---

## 📄 License

Built for educational purposes as part of a full-stack development assignment.

---

## 🙌 Acknowledgements

- Product images — [Unsplash](https://unsplash.com)
- Inspired by [Flipkart](https://www.flipkart.com)
- Badges — [Shields.io](https://shields.io)
