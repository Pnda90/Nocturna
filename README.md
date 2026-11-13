# Nocturna

Nocturna è una web app di intrattenimento horror con una tavola Ouija digitale, una modalità sfida e un generatore locale di racconti. Le risposte e i racconti sono creati nel browser da contenuti predefiniti: non sono comunicazioni paranormali e questa versione non usa servizi di intelligenza artificiale.

## Prova l'app

[Apri Nocturna](https://nocturna-iota.vercel.app/)

## Funzionalità

- Tavola Ouija con risposte locali legate alla domanda, un filo narrativo per sessione, animazione della planchette e registro delle domande.
- Modalità sfida con tensione progressiva e risultato condivisibile.
- Racconti horror locali con tema, stile, lunghezza e tipo di finale selezionabili.
- Interfaccia in italiano e inglese, paesaggio sonoro procedurale opzionale, controllo del volume e impostazioni per gli effetti e il movimento.
- Racconti e registro salvati nel `localStorage` del browser, cancellabili dalle impostazioni.

## Sviluppo locale

Richiede una versione recente di Node.js e npm.

```sh
npm install
npm run dev
```

Il server di sviluppo usa `http://localhost:8080`. Per verificare la build:

```sh
npm run lint
npm run build
npm run preview
```

La versione attuale non richiede variabili d'ambiente. Le funzioni di generazione sono in `src/lib/ouija-responses.ts` e `src/lib/story-generator.ts`.

## Tecnologie

React, TypeScript, Vite, Tailwind CSS, Zustand e Framer Motion.

## Origine del progetto

Il primo MVP è stato prototipato con [AgentiPRO](https://github.com/Pnda90/AgentiPRO), come prova di sviluppo rapido assistito da agenti.

## Nota sul progetto

Nocturna è ancora in sviluppo. Il codice e gli asset sono proprietari; consultare [LICENSE.md](./LICENSE.md) per i termini d'uso.
