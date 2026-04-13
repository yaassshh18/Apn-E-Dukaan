# 🚀 Apn-E-Dukaan

The ultimate hyperlocal marketplace combining the best of Meesho, OLX, and WhatsApp.

## 📂 Folder Structure

```
Apn-E-Dukaan/
├── backend/                  # Django & DRF Backend
│   ├── config/               # Main settings, URLs
│   ├── users/                # User Auth & Roles (Buyer/Seller)
│   ├── products/             # Product Management
│   ├── orders/               # Cart & Checkout System
│   ├── chat/                 # WhatsApp-style chat/negotiation
│   ├── manage.py
│   └── requirements.txt
└── frontend/                 # React & Vite Frontend
    ├── src/
    │   ├── api/              # Axios interceptors config
    │   ├── components/       # Reusable UI (Navbar, etc)
    │   ├── context/          # React Context (Auth)
    │   ├── pages/            # Home, Login, Dashboards, Cart, Detail
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js    # Premium Design System constraints
    └── package.json
```

## 🔌 API Endpoints List

**Auth (`/api/auth/`)**
* `POST /login/` - Login & get JWT tokens
* `POST /register/` - Register new Buyer or Seller
* `GET/PUT /profile/` - View/Edit user profile

**Products (`/api/products/`)**
* `GET /products/` - List all products
* `POST /products/` - Add a product (Seller only)
* `GET /products/{id}/` - Retrieve product details
* `PUT/DELETE /products/{id}/` - Edit/Delete product

**Cart & Orders (`/api/cart/` & `/api/orders/`)**
* `GET /cart/` - View active cart
* `POST /cart/add_item/` - Add product to cart
* `DELETE /cart/remove_item/` - Remove from cart
* `POST /orders/` - Checkout and place an order
* `GET /orders/` - Buyer/Seller specific order lists

**Chat (`/api/chat/`)**
* `GET /chat/` - Retrieve chat history
* `POST /chat/` - Send a message or make an offer

## ⚙️ Setup Instructions (Local)

1. **Backend Database**
   By default, the app is configured to use `db.sqlite3` for a frictionless quickstart.

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # Activate venv: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
   pip install -r requirements.txt
   python manage.py runserver 8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5173`. 
   The backend API will be running on `http://localhost:8000`.

## 🚀 Deployment Guide (Production & PostgreSQL)

### 1. PostgreSQL Preparation
When deploying, inject your Postgres URL via environment variables. The `requirements.txt` already includes `psycopg2-binary` and `django-environ`.
- In `backend/config/settings.py`, replace the `DATABASES` section to use `dj-database-url` and pull `DATABASE_URL` from the environment.

### 2. Backend Deployment (Render or Railway)
- Connect your GitHub repository to Render/Railway.
- Set the root directory to `backend`.
- Build Command: `pip install -r requirements.txt && python manage.py migrate`
- Start Command: `gunicorn config.wsgi:application` (Install `gunicorn` first).
- **Environment Variables**: Add `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `DATABASE_URL`.

### 3. Frontend Deployment (Vercel)
- Connect your GitHub repository to Vercel.
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- **Environment Variables**: Add `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend.onrender.com/api/`). Update `axios.js` to use `import.meta.env.VITE_API_URL`.
