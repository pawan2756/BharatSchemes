# 🇮🇳 BharatScheme

A full-stack web application that helps Indian citizens discover and apply for government schemes they are eligible for — powered by an AI assistant for personalized recommendations.

---

## 🚀 Features

- 🔍 **Find Schemes** — Search and filter government schemes by category, eligibility, and state
- 🤖 **AI Assistant** — Get personalized scheme recommendations based on your profile
- 📊 **Dashboard** — Track schemes you've applied for or saved
- 👤 **User Profile** — Manage your personal information for eligibility checks
- 🔐 **Authentication** — Secure login and registration system
- 🛡️ **Admin Panel** — Manage schemes and users (admin only)

---

## 🗂️ Project Structure

```
BharatScheme/
├── client/                         # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.jsx            # Home page
│   │   │   ├── layout.jsx          # Root layout
│   │   │   ├── globals.css         # Global styles
│   │   │   ├── login/              # Login page
│   │   │   ├── register/           # Register page
│   │   │   ├── dashboard/          # User dashboard
│   │   │   ├── find-schemes/       # Browse schemes
│   │   │   ├── ai-assistant/       # AI chat assistant
│   │   │   ├── profile/            # User profile
│   │   │   └── admin/              # Admin panel
│   │   └── components/
│   │       ├── layout/
│   │       │   └── Navbar.jsx      # Navigation bar
│   │       └── dashboard/
│   │           └── SchemeCard.jsx  # Scheme card component
│   ├── public/                     # Static assets
│   ├── package.json
│   └── next.config.ts
│
└── server/                         # Express.js Backend
    ├── src/
    │   ├── index.js                # Entry point
    │   ├── models/
    │   │   ├── User.js             # User model (MongoDB)
    │   │   └── Scheme.js           # Scheme model (MongoDB)
    │   ├── controllers/
    │   │   └── SchemeController.js # Scheme logic
    │   ├── routes/
    │   │   ├── authRoutes.js       # Auth endpoints
    │   │   ├── SchemeRoutes.js     # Scheme endpoints
    │   │   └── AIRoutes.js         # AI endpoints
    │   ├── middleware/
    │   │   └── auth.js             # JWT middleware
    │   └── services/
    │       ├── AIService.js        # OpenAI integration
    │       └── EligibilityService.js # Eligibility logic
    ├── seed.js                     # Database seeder
    └── package.json
```

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 15](https://nextjs.org/) — React framework with App Router
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Lucide React](https://lucide.dev/) — Icons
- [Axios](https://axios-http.com/) — HTTP client

**Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) — REST API
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — Database
- [JWT](https://jwt.io/) — Authentication
- [OpenAI API](https://openai.com/) — AI assistant

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- OpenAI API Key

---

### 1. Clone the repository

```bash
git clone https://github.com/pawan2756/BharatSchemes.git
cd BharatSchemes
```

---

### 2. Setup the Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Seed the database with sample schemes:

```bash
node seed.js
```

Start the server:

```bash
npm run dev
```

Server runs at **http://localhost:5000**

---

### 3. Setup the Frontend (Client)

```bash
cd client
npm install
```

Create a `.env.local` file inside the `client/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Schemes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemes` | Get all schemes |
| GET | `/api/schemes/:id` | Get scheme by ID |
| POST | `/api/schemes` | Create scheme (admin) |
| PUT | `/api/schemes/:id` | Update scheme (admin) |
| DELETE | `/api/schemes/:id` | Delete scheme (admin) |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI assistant |
| POST | `/api/ai/recommend` | Get scheme recommendations |

---

## 🌐 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | User dashboard |
| `/find-schemes` | Browse all schemes |
| `/ai-assistant` | AI-powered assistant |
| `/profile` | User profile |
| `/admin` | Admin panel |

---

## 🚀 Deployment

### Frontend — Vercel

The easiest way to deploy the Next.js client is with [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import the `client/` folder on Vercel
3. Add environment variables in Vercel dashboard

### Backend — Railway / Render

1. Push your code to GitHub
2. Connect the `server/` folder to [Railway](https://railway.app) or [Render](https://render.com)
3. Add your `.env` variables in the platform dashboard

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Author

**Pawan** — [@pawan2756](https://github.com/pawan2756)
