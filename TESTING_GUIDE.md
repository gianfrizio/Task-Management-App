# Guida al Testing - Task Management App

## 🚀 Quick Start

### 1. Installazione Dipendenze

```bash
# Backend
cd /home/gianfrizio/TaskManagementApp/backend
npm install

# Frontend
cd /home/gianfrizio/TaskManagementApp/frontend
npm install
```

### 2. Configurazione Backend

Crea il file `.env` nella cartella `backend`:

```bash
cd /home/gianfrizio/TaskManagementApp/backend
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production
FRONTEND_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
NODE_ENV=development
EOF
```

### 3. Avvio MongoDB

**Opzione A - Docker (Consigliato)**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Opzione B - MongoDB locale**:
```bash
# Se già installato
sudo systemctl start mongodb
# oppure
mongod --dbpath ~/data/db
```

**Opzione C - MongoDB Atlas** (Cloud - Gratuito):
1. Vai su https://www.mongodb.com/cloud/atlas
2. Crea cluster gratuito
3. Ottieni connection string
4. Aggiorna `MONGODB_URI` in `.env`

### 4. Avvio Backend

```bash
cd /home/gianfrizio/TaskManagementApp/backend
npm run dev
```

**Output atteso**:
```
Server running on port 5000
Environment: development
MongoDB connected successfully
```

### 5. Avvio Frontend

**Nuovo terminale**:
```bash
cd /home/gianfrizio/TaskManagementApp/frontend
npm run dev
```

**Output atteso**:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in Xms
```

### 6. Apri l'Applicazione

Apri il browser su: **http://localhost:3000**

---

## 🧪 Esecuzione Test

### Backend Tests

```bash
cd /home/gianfrizio/TaskManagementApp/backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

**Test disponibili**:
- ✅ 37 test User Model
- ✅ 15 test Auth API

### Frontend Tests

```bash
cd /home/gianfrizio/TaskManagementApp/frontend

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

**Test disponibili**:
- ✅ 6 test useDebounce hook

---

## 🎯 Testing Manuale - Checklist

### ✅ Autenticazione

**Registrazione**:
- [ ] Vai su http://localhost:3000
- [ ] Clicca su "Register"
- [ ] Inserisci:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `Password123`
- [ ] Clicca "Register"
- [ ] Verifica: Toast "Account creato con successo!"
- [ ] Verifica: Navbar mostra "Benvenuto, testuser"

**Login**:
- [ ] Clicca "Logout"
- [ ] Clicca "Login"
- [ ] Inserisci email e password
- [ ] Clicca "Login"
- [ ] Verifica: Toast "Bentornato!"

**Errori**:
- [ ] Prova registrazione con email duplicata → Errore
- [ ] Prova login con password sbagliata → "Invalid credentials"
- [ ] Prova email invalida → Errore validazione

---

### ✅ Task Management

**Creazione Task**:
- [ ] Clicca "Nuovo Task"
- [ ] Compila:
  - Titolo: `Il mio primo task`
  - Descrizione: `Questo è un test`
  - Stato: `Da fare`
  - Priorità: `Alta`
  - Categoria: `Lavoro`
  - Scadenza: Domani
- [ ] Clicca "Crea Task"
- [ ] Verifica: Task appare nella lista
- [ ] Verifica: Toast "Task creato con successo!"

**Modifica Task**:
- [ ] Clicca "Modifica" su un task
- [ ] Cambia il titolo
- [ ] Clicca "Aggiorna Task"
- [ ] Verifica: Modifiche salvate
- [ ] Verifica: Toast "Task aggiornato!"

**Cambio Stato**:
- [ ] Usa il dropdown stato nel task
- [ ] Cambia da "Da fare" a "In corso"
- [ ] Verifica: Toast "Stato aggiornato!"
- [ ] Verifica: Badge colore cambiato

**Eliminazione Task**:
- [ ] Clicca "Elimina" su un task
- [ ] Conferma nel popup
- [ ] Verifica: Task rimosso dalla lista
- [ ] Verifica: Toast "Task eliminato!"

---

### ✅ Filtri e Ricerca

**Ricerca**:
- [ ] Crea 3-4 task con titoli diversi
- [ ] Digita nella search box
- [ ] Verifica: Filtro in tempo reale (debounce 300ms)
- [ ] Verifica: Nessun flickering

**Filtro Stato**:
- [ ] Seleziona "In corso"
- [ ] Verifica: Solo task in corso visibili
- [ ] Clicca "Pulisci filtri"
- [ ] Verifica: Tutti i task tornano visibili

**Filtro Priorità**:
- [ ] Seleziona "Alta"
- [ ] Verifica: Solo task alta priorità
- [ ] Combina con filtro stato
- [ ] Verifica: Filtri cumulativi funzionano

**Empty State**:
- [ ] Applica filtri che non matchano nessun task
- [ ] Verifica: Messaggio "Nessun task trovato"
- [ ] Verifica: Link "Rimuovi filtri" visibile
- [ ] Clicca link
- [ ] Verifica: Filtri resettati

---

### ✅ Keyboard Navigation

**Shortcuts**:
- [ ] Premi **Ctrl+K** → Focus su search ✅
- [ ] Premi **/** → Focus su search ✅
- [ ] Premi **Ctrl+N** → Apre form nuovo task ✅
- [ ] Premi **Escape** (form aperto) → Chiude form ✅

**Tab Navigation**:
- [ ] Apri form nuovo task
- [ ] Premi **Tab** ripetutamente
- [ ] Verifica: Focus si sposta tra campi
- [ ] Verifica: Focus visibile (blue ring)
- [ ] Dall'ultimo campo, Tab torna al primo (focus trap)

**Form Navigation**:
- [ ] Premi **Shift+Tab** → Va indietro
- [ ] Verifica: Ordine logico
- [ ] Premi **Enter** nel form → Submit

---

### ✅ Accessibility

**Screen Reader Test** (se disponibile NVDA/JAWS):
- [ ] Attiva screen reader
- [ ] Naviga con Tab
- [ ] Verifica: Tutti gli elementi hanno label
- [ ] Verifica: Errori form annunciati
- [ ] Verifica: Stato loading annunciato

**Visual Test**:
- [ ] Verifica: Tutti i button hanno focus ring
- [ ] Verifica: Contrast ratio sufficiente
- [ ] Verifica: Testo leggibile
- [ ] Resize finestra → Responsive

**Keyboard Only Test**:
- [ ] **Non usare il mouse**
- [ ] Completa tutto il workflow:
  - Login/Register
  - Crea task
  - Modifica task
  - Elimina task
  - Search
  - Logout
- [ ] Verifica: Tutto funziona senza mouse

---

### ✅ Performance

**Loading States**:
- [ ] Refresh pagina
- [ ] Verifica: Spinner iniziale
- [ ] Login
- [ ] Verifica: Spinner su bottone login
- [ ] Crea task
- [ ] Verifica: Spinner su bottone submit

**Debounce**:
- [ ] Apri Network tab (F12 → Network)
- [ ] Digita velocemente nella search
- [ ] Verifica: Solo 1 request dopo 300ms di pausa
- [ ] NON una request per ogni lettera

**Code Splitting**:
- [ ] F12 → Network → JS
- [ ] Refresh pagina
- [ ] Verifica: Chunk separati per TaskCard e TaskForm
- [ ] Verifica: Caricati solo quando necessari

---

### ✅ Error Handling

**Network Errors**:
- [ ] Stoppa il backend (Ctrl+C)
- [ ] Prova a creare un task
- [ ] Verifica: Toast errore chiaro
- [ ] Verifica: No crash app
- [ ] Riavvia backend
- [ ] Verifica: App riprende a funzionare

**Validation Errors**:
- [ ] Apri form nuovo task
- [ ] Lascia titolo vuoto
- [ ] Clicca "Crea Task"
- [ ] Verifica: Errore sotto il campo
- [ ] Verifica: Border rosso sul campo
- [ ] Inserisci 201 caratteri nel titolo
- [ ] Verifica: Errore "max 200 caratteri"

**401 Auto-Logout**:
- [ ] Login
- [ ] Apri DevTools → Application → Storage → Clear all
- [ ] Fai una azione (es. crea task)
- [ ] Verifica: Auto-redirect al login
- [ ] Verifica: Toast errore

---

## 🐛 Known Issues / Limitations

- ⚠️ **MongoDB required**: Serve MongoDB in esecuzione
- ⚠️ **No password reset**: Feature non implementata
- ⚠️ **No email verification**: Feature non implementata
- ⚠️ **No task attachments**: Feature non implementata
- ⚠️ **No real-time sync**: No WebSocket (reload per vedere cambi altri utenti)

---

## 📊 Expected Test Results

### Backend Tests
```
PASS  src/__tests__/models/User.test.js
  User Model
    Validation
      ✓ should create a valid user (XXms)
      ✓ should fail without username (XXms)
      ... (35 more tests)

Test Suites: 2 passed, 2 total
Tests:       52 passed, 52 total
```

### Frontend Tests
```
PASS  __tests__/hooks/useDebounce.test.ts
  useDebounce
    ✓ should return initial value immediately (Xms)
    ✓ should debounce value updates (Xms)
    ... (4 more tests)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

---

## 🆘 Troubleshooting

### Backend non parte

**Problema**: `Error: connect ECONNREFUSED 127.0.0.1:27017`
**Soluzione**: MongoDB non è in esecuzione. Avvialo con Docker o `mongod`

**Problema**: `Error: JWT_SECRET is required`
**Soluzione**: Manca file `.env`. Crealo come da sezione 2

**Problema**: `Port 5000 already in use`
**Soluzione**:
```bash
# Trova processo
lsof -i :5000
# Killalo
kill -9 <PID>
# Oppure usa altra porta in .env
PORT=5001
```

### Frontend non parte

**Problema**: `Error: Cannot find module 'next'`
**Soluzione**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problema**: `Port 3000 already in use`
**Soluzione**:
```bash
# Next.js usa automaticamente 3001 se 3000 è occupato
# Oppure specifica porta:
PORT=3001 npm run dev
```

### Tests falliscono

**Problema**: Backend tests timeout
**Soluzione**: MongoDB memory server slow la prima volta. Attendi o aumenta timeout in jest.config.js

**Problema**: Frontend tests fail con "localStorage is not defined"
**Soluzione**: Controlla che jest.setup.js sia configurato correttamente

---

## 📝 Testing Notes

Dopo il testing, annota qui eventuali bug o miglioramenti:

### Bug trovati:
-

### Miglioramenti suggeriti:
-

### Performance issues:
-

---

## ✅ Testing Complete!

Una volta completata la checklist, l'app è testata e pronta per:
- Deploy su Vercel (frontend)
- Deploy su Railway/Render (backend)
- MongoDB Atlas (database)

**Buon testing!** 🎉
