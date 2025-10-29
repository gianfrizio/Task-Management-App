# Task Management App

Full-stack task management application con Node.js, MongoDB e Next.js.

## Stack Tecnologico

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs per password hashing

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Axios

## Features

- Autenticazione utente (registrazione e login)
- CRUD completo per task
- Filtri per status, priorità e categoria
- Task con priorità (low, medium, high)
- Task con status (todo, in-progress, completed)
- Categorie personalizzate
- Date di scadenza
- UI responsive con dark mode

## Setup

### 1. Installare MongoDB

Assicurati di avere MongoDB installato e in esecuzione localmente sulla porta 27017.

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS con Homebrew
brew install mongodb-community

# Avvia MongoDB
sudo service mongodb start  # Linux
brew services start mongodb-community  # macOS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Crea un file `.env` nella cartella backend:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=il_tuo_secret_jwt_super_sicuro
NODE_ENV=development
```

Avvia il backend:

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Il file `.env.local` è già configurato:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Avvia il frontend:

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Registra nuovo utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Ottieni utente corrente (richiede auth)

### Tasks
- `GET /api/tasks` - Ottieni tutti i task (con filtri opzionali)
- `GET /api/tasks/:id` - Ottieni task specifico
- `POST /api/tasks` - Crea nuovo task
- `PUT /api/tasks/:id` - Aggiorna task
- `DELETE /api/tasks/:id` - Elimina task

## Struttura Progetto

```
TaskManagementApp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── TaskCard.tsx
    │   └── TaskForm.tsx
    ├── lib/
    │   ├── api.ts
    │   └── auth.ts
    ├── types/
    │   └── index.ts
    ├── .env.local
    └── package.json
```

## Utilizzo

1. Registrati con username, email e password
2. Fai login con le tue credenziali
3. Crea nuovi task cliccando "New Task"
4. Modifica lo status dei task direttamente dalle card
5. Filtra i task per status e priorità
6. Modifica o elimina i task esistenti

## Note di Sviluppo

- Il token JWT viene salvato in localStorage
- Le password vengono hashate con bcryptjs prima del salvataggio
- Tutti gli endpoint dei task richiedono autenticazione
- I task sono associati all'utente che li crea
- Dark mode supportato automaticamente
