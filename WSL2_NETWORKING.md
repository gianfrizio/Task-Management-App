# WSL2 Networking - Guida Rapida

## 🔍 Problema Identificato

Stai usando WSL2, e c'è un problema noto di networking tra il browser Windows e i server in WSL2:
- **Browser Windows** → `http://localhost:3000` **NON funziona** ❌
- **Il browser non riesce a raggiungere i server WSL2 tramite localhost**

## ✅ Soluzione

Usa l'indirizzo IP di WSL2 invece di localhost!

### 📍 Il tuo IP WSL2 attuale

```
172.25.247.161
```

⚠️ **NOTA**: Questo IP può cambiare se riavvii WSL2. Se non funziona più, esegui:
```bash
hostname -I
```

## 🚀 Come Accedere all'Applicazione

### 1. Apri il Browser (su Windows)

Vai a questo URL:

```
http://172.25.247.161:3000
```

**NON usare** `http://localhost:3000` ❌

### 2. Verifica Backend

Il backend è raggiungibile su:

```
http://172.25.247.161:5000
```

Puoi testarlo andando a:
```
http://172.25.247.161:5000/health
```

Dovresti vedere:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-28T..."
}
```

## 🔧 Configurazione Attuale

I file sono già stati configurati automaticamente:

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://172.25.247.161:5000/api
```

### Backend (`.env`)
```env
FRONTEND_URL=http://172.25.247.161:3000
```

## 📝 Testing dell'Applicazione

### 1. Registrazione
1. Apri `http://172.25.247.161:3000` nel browser
2. Clicca su "Register"
3. Inserisci:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Password123`
4. Clicca "Register"
5. ✅ Dovresti vedere "Account creato con successo!"

### 2. Login
1. Clicca "Logout"
2. Clicca "Login"
3. Inserisci email e password
4. Clicca "Login"
5. ✅ Dovresti vedere "Bentornato!"

### 3. Crea Task
1. Clicca "Nuovo Task"
2. Compila il form
3. Clicca "Crea Task"
4. ✅ Il task appare nella lista

## 🐛 Troubleshooting

### Problema: "Cannot connect to server"

**Soluzione**: L'IP WSL2 è cambiato. Esegui:

```bash
# 1. Ottieni il nuovo IP
hostname -I

# 2. Aggiorna frontend/.env.local
# Sostituisci 172.25.247.161 con il nuovo IP
nano /home/gianfrizio/TaskManagementApp/frontend/.env.local

# 3. Aggiorna backend/.env
# Sostituisci 172.25.247.161 con il nuovo IP
nano /home/gianfrizio/TaskManagementApp/backend/.env

# 4. Riavvia entrambi i server
# Ctrl+C sui terminali e poi:
cd /home/gianfrizio/TaskManagementApp/backend && npm run dev
cd /home/gianfrizio/TaskManagementApp/frontend && npm run dev
```

### Problema: "CORS error" nel browser

**Causa**: Il backend non accetta richieste dal tuo IP.

**Soluzione**: Assicurati che `FRONTEND_URL` nel backend `.env` corrisponda all'URL che stai usando nel browser.

### Problema: I server non si avviano

**Backend non si avvia**:
```bash
# Controlla se la porta 5000 è già in uso
lsof -i :5000

# Se occupata, killa il processo
kill -9 <PID>

# Riavvia
cd /home/gianfrizio/TaskManagementApp/backend && npm run dev
```

**Frontend non si avvia**:
```bash
# Controlla se la porta 3000 è già in uso
lsof -i :3000

# Se occupata, killa il processo
kill -9 <PID>

# Riavvia
cd /home/gianfrizio/TaskManagementApp/frontend && npm run dev
```

## 🎯 URL di Riferimento Rapido

| Servizio | URL Corretto | URL Sbagliato |
|----------|--------------|---------------|
| **Frontend** | `http://172.25.247.161:3000` | ~~http://localhost:3000~~ ❌ |
| **Backend API** | `http://172.25.247.161:5000/api` | ~~http://localhost:5000/api~~ ❌ |
| **Backend Health** | `http://172.25.247.161:5000/health` | ~~http://localhost:5000/health~~ ❌ |

## 📚 Alternative per il Futuro

### Opzione 1: Windows Terminal Proxy (Avanzato)
Usa `wsl.localhost` invece dell'IP:
```
http://wsl.localhost:3000
```

### Opzione 2: Docker (Consigliato per Produzione)
Containerizza l'intera applicazione per evitare problemi di networking.

### Opzione 3: Deploy Cloud
Deploy su:
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: MongoDB Atlas

Nessun problema di networking WSL2! 🎉

---

## ✅ Checklist Rapida

Prima di testare, verifica:

- [ ] Backend è in esecuzione (`cd backend && npm run dev`)
- [ ] Frontend è in esecuzione (`cd frontend && npm run dev`)
- [ ] MongoDB Atlas è connesso (vedi log backend)
- [ ] `.env.local` ha l'IP corretto (`172.25.247.161`)
- [ ] `.env` backend ha l'IP corretto (`172.25.247.161`)
- [ ] Stai usando `http://172.25.247.161:3000` nel browser

---

**Fatto!** Ora puoi testare l'applicazione usando `http://172.25.247.161:3000` 🚀
