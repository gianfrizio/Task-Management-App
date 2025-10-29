# 🧪 Guida Testing Rapida - Task Management App

## 📍 URL Applicazione

**Frontend**: http://172.25.247.161:3000
**Backend**: http://172.25.247.161:5000

---

## ✅ STEP 1: Preparazione Browser

### 1.1 Apri il Browser
Apri Chrome, Firefox, o Edge e vai a:
```
http://172.25.247.161:3000
```

### 1.2 Cancella localStorage (IMPORTANTE!)
**Premi F12** per aprire DevTools, poi:
- Vai alla tab **"Console"**
- Digita:
  ```javascript
  localStorage.clear()
  ```
- Premi **INVIO**
- Chiudi DevTools (premi **F12** di nuovo)
- **Ricarica la pagina** (premi **F5**)

✅ **Risultato atteso**: Vedi la schermata di Login/Register

---

## ✅ STEP 2: Registrazione Utente

### 2.1 Clicca su "Register"
- Il tab "Register" dovrebbe essere evidenziato in blu

### 2.2 Compila il Form
Inserisci:
- **Username**: `testuser`
- **Email**: `test@example.com`
- **Password**: `Password123`

### 2.3 Clicca "Register"

✅ **Risultato atteso**:
- Toast verde in alto a destra: **"Account creato con successo!"**
- Vieni reindirizzato alla dashboard
- In alto a destra vedi: **"Benvenuto, testuser"**
- Vedi la sezione "I Miei Task" con filtri

---

## ✅ STEP 3: Crea il Primo Task

### 3.1 Clicca "Nuovo Task"
- Il bottone blu in alto a destra

### 3.2 Compila il Form Task
- **Titolo**: `Il mio primo task`
- **Descrizione**: `Questo è un task di prova per testare l'applicazione`
- **Stato**: `Da fare`
- **Priorità**: `Alta`
- **Categoria**: `Lavoro`
- **Data scadenza**: Seleziona domani

### 3.3 Clicca "Crea Task"

✅ **Risultato atteso**:
- Toast verde: **"Task creato con successo!"**
- Il form si chiude
- Vedi il task nella lista sotto
- Il task ha un badge rosso "Alta" (priorità)
- Il task ha un badge giallo "Da fare" (stato)

### 3.4 Verifica su MongoDB Atlas
1. Vai su https://cloud.mongodb.com
2. Login → Browse Collections
3. Database `taskmanager` → Collection `tasks`
4. Dovresti vedere 1 documento con il task appena creato!

---

## ✅ STEP 4: Test CRUD Operations

### 4.1 Crea Altri Task
Ripeti STEP 3 e crea:
- **Task 2**: Priorità Media, Stato "In corso", Categoria "Personale"
- **Task 3**: Priorità Bassa, Stato "Completato", Categoria "Studio"

✅ **Risultato**: Dovresti avere 3 task nella lista

### 4.2 Modifica un Task
1. Clicca **"Modifica"** sul primo task
2. Cambia il titolo in: `Task modificato`
3. Cambia priorità a: `Media`
4. Clicca **"Aggiorna Task"**

✅ **Risultato**:
- Toast: **"Task aggiornato!"**
- Il task mostra il nuovo titolo e badge giallo "Media"

### 4.3 Cambia Stato con Dropdown
1. Nel primo task, clicca sul **dropdown "Stato"**
2. Seleziona **"In corso"**

✅ **Risultato**:
- Toast: **"Stato aggiornato!"**
- Badge stato cambia colore (blu)

### 4.4 Elimina un Task
1. Clicca **"Elimina"** sull'ultimo task
2. Conferma nel popup

✅ **Risultato**:
- Toast: **"Task eliminato!"**
- Il task scompare dalla lista

---

## ✅ STEP 5: Test Filtri

### 5.1 Test Search
1. Nella barra di ricerca digita: `primo`
2. Attendi 300ms (debounce)

✅ **Risultato**: Vedi solo i task che contengono "primo" nel titolo o descrizione

### 5.2 Test Filtro Stato
1. Nel dropdown "Stato" seleziona: **"In corso"**

✅ **Risultato**: Vedi solo i task "In corso"

### 5.3 Test Filtro Priorità
1. Nel dropdown "Priorità" seleziona: **"Alta"**

✅ **Risultato**: Vedi solo i task con priorità alta e stato "In corso"

### 5.4 Test Pulisci Filtri
1. Clicca **"Pulisci filtri"**

✅ **Risultato**: Tutti i filtri si resettano e vedi tutti i task

### 5.5 Test Empty State
1. Applica filtri che non matchano nessun task (es. cerca "nonexistent")

✅ **Risultato**:
- Vedi: **"Nessun task trovato con questi filtri."**
- Vedi link: **"Rimuovi filtri"**
- Cliccandolo, i filtri si resettano

---

## ✅ STEP 6: Test Keyboard Shortcuts

### 6.1 Test Ctrl+K (Focus Search)
1. Premi **Ctrl+K**

✅ **Risultato**: Il cursore va nella barra di ricerca

### 6.2 Test / (Focus Search Quick)
1. Premi **/** (tasto slash)

✅ **Risultato**: Il cursore va nella barra di ricerca

### 6.3 Test Ctrl+N (Nuovo Task)
1. Premi **Ctrl+N**

✅ **Risultato**: Il form "Nuovo Task" si apre

### 6.4 Test Escape (Chiudi Form)
1. Con il form aperto, premi **Escape**

✅ **Risultato**: Il form si chiude

### 6.5 Test Tab Navigation
1. Apri form nuovo task
2. Premi **Tab** ripetutamente

✅ **Risultato**:
- Il focus si sposta tra i campi (visibile con anello blu)
- L'ordine è logico: Titolo → Descrizione → Stato → Priorità → ...

---

## ✅ STEP 7: Test Loading States

### 7.1 Test Initial Load
1. Ricarica la pagina (F5)

✅ **Risultato**: Vedi uno spinner di caricamento prima della dashboard

### 7.2 Test Form Submission
1. Apri nuovo task
2. Compila il form
3. Osserva il bottone "Crea Task" quando clicchi

✅ **Risultato**:
- Il bottone mostra uno spinner
- Il testo diventa "Creazione..."
- Il bottone è disabilitato durante il submit

---

## ✅ STEP 8: Test Autenticazione

### 8.1 Test Logout
1. Clicca **"Logout"** in alto a destra

✅ **Risultato**:
- Toast: **"Logout effettuato"**
- Torni alla schermata Login/Register

### 8.2 Test Login
1. Clicca sul tab **"Login"**
2. Inserisci:
   - Email: `test@example.com`
   - Password: `Password123`
3. Clicca **"Login"**

✅ **Risultato**:
- Toast: **"Bentornato!"**
- Vedi la dashboard con i tuoi task salvati

### 8.3 Test Login Errato
1. Fai Logout
2. Prova a fare login con password sbagliata: `wrong123`

✅ **Risultato**:
- Toast rosso: **"Invalid credentials"** (o simile)
- Rimani sulla schermata di login

---

## ✅ STEP 9: Test Validazione Form

### 9.1 Test Titolo Vuoto
1. Login
2. Apri nuovo task
3. Lascia il titolo vuoto
4. Clicca "Crea Task"

✅ **Risultato**:
- Errore sotto il campo: **"Il titolo è obbligatorio"** (o simile)
- Border rosso sul campo titolo

### 9.2 Test Limite Caratteri
1. Inserisci 201 caratteri nel titolo
2. Clicca "Crea Task"

✅ **Risultato**: Errore che indica il limite superato

### 9.3 Test Character Counter
1. Digita nel campo "Titolo"

✅ **Risultato**: Vedi contatore caratteri che si aggiorna in tempo reale

---

## ✅ STEP 10: Test Persistence

### 10.1 Test Refresh
1. Crea alcuni task
2. **Ricarica la pagina** (F5)

✅ **Risultato**:
- Rimani loggato
- Tutti i task sono ancora presenti

### 10.2 Test Chiudi/Riapri Browser
1. Chiudi completamente il browser
2. Riapri e vai a `http://172.25.247.161:3000`

✅ **Risultato**:
- Sei ancora loggato (grazie al token in localStorage)
- I task sono salvati (grazie a MongoDB Atlas)

---

## ✅ STEP 11: Test Responsiveness

### 11.1 Test Mobile View
1. Apri DevTools (F12)
2. Clicca sull'icona "Toggle device toolbar" (Ctrl+Shift+M)
3. Seleziona un dispositivo mobile (es. iPhone 12)

✅ **Risultato**:
- Layout si adatta al mobile
- I task vanno in colonna singola
- Form e bottoni sono touch-friendly

### 11.2 Test Resize
1. Riduci la larghezza della finestra

✅ **Risultato**: La griglia dei task passa da 3 colonne → 2 colonne → 1 colonna

---

## 🎯 Checklist Completa

Dopo aver completato tutti gli step, verifica:

- [ ] Registrazione funziona
- [ ] Login funziona
- [ ] Logout funziona
- [ ] Creazione task funziona
- [ ] Modifica task funziona
- [ ] Eliminazione task funziona
- [ ] Cambio stato funziona
- [ ] Search funziona (con debounce)
- [ ] Filtro stato funziona
- [ ] Filtro priorità funziona
- [ ] Pulisci filtri funziona
- [ ] Ctrl+K focus search
- [ ] Ctrl+N apre form
- [ ] Escape chiude form
- [ ] Tab navigation funziona
- [ ] Loading states visibili
- [ ] Validazione form funziona
- [ ] Character counter funziona
- [ ] Dati persistono su refresh
- [ ] Dati visibili su MongoDB Atlas
- [ ] Responsive su mobile
- [ ] Nessun errore in console

---

## 🐛 Problemi Comuni

### Problema: "Impossibile caricare i task"
**Soluzione**:
1. F12 → Console → `localStorage.clear()`
2. F5 (ricarica)

### Problema: Token expired
**Soluzione**:
1. Fai logout
2. Fai login di nuovo

### Problema: Il backend non risponde
**Soluzione**:
1. Verifica che il backend sia running su terminale
2. Controlla `http://172.25.247.161:5000/health` risponde con status "healthy"

---

## 🎉 Testing Completato!

Se tutti i test passano, l'applicazione è **production-ready**! 🚀

Puoi procedere con:
- Deploy su Vercel (frontend)
- Deploy su Railway/Render (backend)
- MongoDB Atlas (già configurato!)

**Buon testing!** ✨
