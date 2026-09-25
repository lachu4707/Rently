# RentalHub Backend (MERN)

Node.js + Express + MongoDB API that connects your React pages: **Profile**,
**Sell**, **Recently Viewed**, **About Us**, and the dashboard **Feed/Search**.

## 1. Setup

```bash
cd rentalhub-backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — local Mongo (`mongodb://127.0.0.1:27017/rentalhub`) or an
  Atlas connection string.
- `JWT_SECRET` — any long random string.
- `CLIENT_ORIGIN` — your React dev server URL (e.g. `http://localhost:5173`
  for Vite, `http://localhost:3000` for CRA).

Start MongoDB locally, then:

```bash
npm run dev        # nodemon, auto-restarts
npm run seed        # optional: loads 3 demo listings + a demo user
npm start           # production
```

API runs at `http://localhost:5000/api`.

## 2. Project structure

```
config/db.js                 MongoDB connection
models/                      User, Product, RecentlyViewed
middleware/authMiddleware.js JWT verification (protect / optionalAuth)
middleware/errorMiddleware.js 404 + error handler
controllers/                 Business logic per feature
routes/                      Express routers, mounted in server.js
utils/seed.js                Demo data loader
server.js                    App entry point
```

## 3. Endpoints

| Method | Route                          | Auth | Purpose                          |
|--------|---------------------------------|------|-----------------------------------|
| POST   | /api/auth/register              | –    | Create account                    |
| POST   | /api/auth/login                 | –    | Log in, get JWT                   |
| GET    | /api/users/me                   | ✅   | Profile page data                 |
| PUT    | /api/users/me                   | ✅   | Edit profile                      |
| GET    | /api/users/me/listings          | ✅   | "My listings" on profile page     |
| GET    | /api/products                   | –    | Feed + search (`?q=&sort=&tag=`)  |
| GET    | /api/products/:id                | –    | Product detail / modal            |
| POST   | /api/products                   | ✅   | Sell page — create listing        |
| PUT    | /api/products/:id                | ✅   | Edit own listing                  |
| DELETE | /api/products/:id                | ✅   | Delete own listing                |
| GET    | /api/recently-viewed             | ✅   | Recently Viewed page              |
| POST   | /api/recently-viewed/:productId  | ✅   | Log a view (call on modal open)   |
| DELETE | /api/recently-viewed/:productId  | ✅   | Remove one entry                  |
| GET    | /api/about                       | –    | About Us content                  |

Protected routes need a header: `Authorization: Bearer <token>` (the token
returned from register/login).

## 4. Wiring your `RentalHubDashboard.jsx`

Right now the dashboard uses hardcoded `CATEGORIES_DEMO` and a stub `go()`
function. Two changes connect it to this backend:

**a) Replace `CATEGORIES_DEMO` with a fetch:**

```jsx
const [items, setItems] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((r) => r.json())
    .then(setItems);
}, []);

// then use `items` everywhere `CATEGORIES_DEMO` was used
```

For search, debounce `query` and call
`/api/products?q=${query}&sort=${sort}` instead of filtering client-side.

**b) Replace `go()` with real navigation + API calls.** If you're using
`react-router`, swap `handleNav` for `navigate(...)`, and add the "record a
view" call when `ProductModal` opens:

```jsx
useEffect(() => {
  if (!activeProduct) return;
  const token = localStorage.getItem("token");
  if (!token) return; // guard for logged-out users
  fetch(`http://localhost:5000/api/recently-viewed/${activeProduct.id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}, [activeProduct]);
```

**Auth pattern for your other pages:** after login/register, store the
returned `token` (e.g. `localStorage.setItem("token", data.token)`), then
send it as `Authorization: Bearer <token>` on Profile, Sell, and Recently
Viewed requests.

## 5. Notes / things you'll likely want to adjust

- **Distance filtering (`radius`, `distanceKm`)** is hardcoded in your demo
  data. The `Product` model already has a `coordinates` field — to filter
  by real distance, add a `2dsphere` index and use MongoDB's `$near`/
  `$geoNear` instead of the current flat `distanceKm` comparison.
- **Image uploads**: `images` currently expects an array of URL strings
  (matches your demo, which uses `picsum.photos` URLs). For real file
  uploads from the Sell page, add `multer` + a storage provider (S3,
  Cloudinary, or local disk) — ask if you'd like this wired in.
- **CORS**: `CLIENT_ORIGIN` in `.env` must exactly match your frontend's
  dev URL or the browser will block requests.
