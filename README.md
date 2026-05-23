# 🌙 Nocturna

**Un'esperienza interattiva di intrattenimento sovrannaturale.**

Nocturna è un'applicazione web immersiva progettata per intrattenere gli utenti attraverso esperienze interattive basate su temi misteriosi e horror. L'app è puro intrattenimento creativo senza alcuna pretesa di capacità paranormale reali.

---

## 🌐 Prova l'App Online

**[Accedi a Nocturna su Vercel](https://nocturna-iota.vercel.app/)** - Nessuna installazione richiesta!

Clicca il link sopra e inizia subito a usare l'app direttamente dal tuo browser.

---

## ✨ Funzionalità Principali

- **🃏 Tavola Ouija Interattiva** - Poni domande e ricevi risposte che costruiscono tensione progressivamente
- **📖 Generatore di Storie Horror** - Genera racconti horror personalizzati basati su un tema a tua scelta
- **🎯 Challenge Mode** - Modalità sfida con meccaniche speciali
- **🌍 Multi-lingua** - Supporto italiano e inglese
- **🎨 Tema Scuro** - Interfaccia immersiva e atmosferica
- **🔊 Effetti Audio** - Sonorità ambientali opzionali per un'esperienza più coinvolgente

---

## 🚀 Quick Start

### Prerequisiti
- Node.js 16+ e npm

### Installazione

```sh
# Clona il repository
git clone <YOUR_GIT_URL>
cd nocturna-main

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:8080`

### Configurazione delle variabili di ambiente

Per far funzionare il frontend e le funzioni Supabase, copia `.env.example` in `.env` e configura le seguenti variabili:

- `VITE_SUPABASE_URL` = URL del progetto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` = chiave anonima pubblicabile
- `GOOGLE_AI_API_KEY` = chiave API di Google Generative AI
- `ALLOWED_ORIGINS` = origini permesse dalle funzioni, ad esempio `http://localhost:8080,https://nocturna-iota.vercel.app`

Le variabili dell'app frontend devono essere impostate anche su Vercel: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

---

## 🛠️ Tecnologie Utilizzate

- **Vite** - Build tool veloce e moderno
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Componenti UI di qualità
- **Zustand** - State management
- **Supabase** - Backend e edge functions
- **Framer Motion** - Animazioni fluide

---

## 📁 Struttura Progetto

```
src/
├── components/       # Componenti React
├── pages/           # Pagine dell'app
├── lib/             # Utility e logica
├── hooks/           # Custom React hooks
└── integrations/    # Integrazioni (Supabase)

supabase/
└── functions/       # Edge functions serverless
```

---

## 🧑‍💻 Sviluppo

```sh
# Linting
npm run lint

# Build per produzione
npm run build

# Preview della build
npm run preview
```

---

## 🔒 Sicurezza

L'applicazione implementa best practices di sicurezza:
- TypeScript strict mode
- Input validation su tutti gli endpoint
- JWT verification abilitato
- CORS ristretto
- Environment variables protette

Vedi il file `.env.example` per la configurazione delle variabili d'ambiente richieste.

---

## 📝 Disclaimer

**Nocturna è un'applicazione di puro intrattenimento.** Non contiene pretese di vera capacità paranormale, predizione del futuro o comunicazione sovrannaturale. Le risposte generate sono create tramite intelligenza artificiale e non hanno alcun significato reale o predittivo.

Utilizzare l'app consapevolmente e per scopi ricreativi.

---

## 📄 Licenza

Questo progetto è privato. Tutti i diritti riservati.

Vedi [LICENSE.md](./LICENSE.md) per i termini completi e le condizioni d'uso.

---

## ⚠️ Avviso di Sviluppo

**‼️ ATTENZIONE**

Questo progetto è in fase di sviluppo. Non rappresenta la versione finale o completa dello stesso. 
---

## ⚖️ Diritti e Utilizzo

Tutti i diritti derivanti dall'utilizzo di questa applicazione, inclusi ma non limitati ai dati, contenuti e funzionalità, sono di esclusiva proprietà dell'autore. L'applicazione è fornita "così com'è" senza garanzie di alcun tipo. L'autore non è responsabile per danni derivanti dall'uso dell'applicazione.

---

**Creato con ✨ e un po' di mistero. Buon divertimento!**
