import { Language } from './i18n';

type Motif = 'door' | 'mirror' | 'signal' | 'clock';
type Intent = 'identity' | 'presence' | 'desire' | 'location' | 'time' | 'memory' | 'yesNo' | 'open';
type Act = 0 | 1 | 2;

export interface OuijaNarrativeState {
  motif: Motif | null;
  recentAnswers: string[];
}

export interface OuijaReply {
  answer: string;
  state: OuijaNarrativeState;
  intrusion: boolean;
}

export function createOuijaNarrativeState(): OuijaNarrativeState {
  return { motif: null, recentAnswers: [] };
}

const motifs: Record<Motif, Record<Language, { where: string; when: string; beats: readonly string[] }>> = {
  door: {
    it: {
      where: 'DIETRO LA PORTA',
      when: 'QUANDO LA MANIGLIA GIRA',
      beats: ['LA PORTA ERA CHIUSA DALL\'INTERNO.', 'ORA C\'È UN SEGNO SULLA MANIGLIA.', 'NON HAI SENTITO LA PORTA APRIRSI.'],
    },
    en: {
      where: 'BEHIND THE DOOR',
      when: 'WHEN THE HANDLE TURNS',
      beats: ['THE DOOR WAS LOCKED FROM INSIDE.', 'THERE IS A MARK ON THE HANDLE NOW.', 'YOU DID NOT HEAR THE DOOR OPEN.'],
    },
  },
  mirror: {
    it: {
      where: 'NEL RIFLESSO',
      when: 'QUANDO IL VETRO SI FA SCURO',
      beats: ['NEL VETRO MANCA UNA FIGURA.', 'IL RIFLESSO SI È MOSSO PER PRIMO.', 'ORA LO SPECCHIO È VUOTO.'],
    },
    en: {
      where: 'IN THE REFLECTION',
      when: 'WHEN THE GLASS GOES DARK',
      beats: ['A FIGURE IS MISSING FROM THE GLASS.', 'THE REFLECTION MOVED FIRST.', 'THE MIRROR IS EMPTY NOW.'],
    },
  },
  signal: {
    it: {
      where: 'NEL FRUSCIO',
      when: 'QUANDO LA VOCE SI INTERROMPE',
      beats: ['HAI SENTITO UNA VOCE IN PIÙ.', 'IL FRUSCIO HA DETTO IL TUO NOME.', 'LA VOCE CONTINUA ANCHE NEL SILENZIO.'],
    },
    en: {
      where: 'INSIDE THE STATIC',
      when: 'WHEN THE VOICE BREAKS',
      beats: ['YOU HEARD ONE VOICE TOO MANY.', 'THE STATIC SAID YOUR NAME.', 'THE VOICE CONTINUES IN THE SILENCE.'],
    },
  },
  clock: {
    it: {
      where: 'NEL MINUTO CHE MANCA',
      when: 'QUANDO LA LANCETTA TORNA INDIETRO',
      beats: ['L\'OROLOGIO HA SALTATO UN MINUTO.', 'SUL QUADRANTE C\'È UN\'ORA IN PIÙ.', 'IL TEMPO NON SI È FERMATO. TU SÌ.'],
    },
    en: {
      where: 'IN THE MISSING MINUTE',
      when: 'WHEN THE HAND MOVES BACK',
      beats: ['THE CLOCK SKIPPED A MINUTE.', 'THERE IS AN EXTRA HOUR ON THE FACE.', 'TIME DID NOT STOP. YOU DID.'],
    },
  },
};

const answers: Record<Language, Record<Exclude<Intent, 'location' | 'time'>, readonly (readonly string[])[]>> = {
  it: {
    identity: [
      ['NON USO PIÙ IL MIO NOME.', 'IL NOME È RIMASTO QUI.', 'MI CHIAMAVANO PRIMA DEL SILENZIO.'],
      ['L\'HO LASCIATO DALL\'ALTRA PARTE.', 'LO HAI GIÀ LETTO DA QUALCHE PARTE.', 'NEL REGISTRO MANCA UNA RIGA.'],
      ['TU L\'HAI GIÀ PRONUNCIATO.', 'SE LO DICO, QUALCOSA SI APRE.', 'IL MIO NOME È QUELLO CHE MANCA.'],
    ],
    presence: [
      ['QUALCUNO CHE NON APPARE NELLA FOTO.', 'LA VOCE CHE NON HAI RICONOSCIUTO.', 'NON ERA LA PERSONA CHE ASPETTAVI.'],
      ['HA LASCIATO UN POSTO VUOTO.', 'PORTA ANCORA IL TUO RICORDO.', 'È RIMASTO DOPO GLI ALTRI.'],
      ['ORA RISPONDE CON LA TUA VOCE.', 'NON CHIEDERE IL NOME DUE VOLTE.', 'È QUI DA PRIMA DI NOI.'],
    ],
    desire: [
      ['IL DETTAGLIO CHE HAI DIMENTICATO.', 'CHE TU ASCOLTI FINO ALLA FINE.', 'UN MINUTO DEL TUO TEMPO.'],
      ['CHE TU RILEGGA L\'ULTIMA RIGA.', 'LA PARTE CHE HAI LASCIATO FUORI.', 'CHE TU APRA SOLO UNA VOLTA.'],
      ['NON VOGLIO ENTRARE. VOGLIO USCIRE.', 'IL POSTO CHE HAI LASCIATO VUOTO.', 'CHE TU FINISCA LA DOMANDA.'],
    ],
    memory: [
      ['RICORDO UN DETTAGLIO CHE TU HAI PERSO.', 'LA FOTO NON ERA COSÌ.', 'QUALCUNO HA CAMBIATO LA STORIA.'],
      ['C\'ERAVAMO IN TRE. ORA SIETE IN DUE.', 'QUEL GIORNO È STATO CANCELLATO.', 'LA TUA VERSIONE FINISCE TROPPO PRESTO.'],
      ['RICORDO LA PARTE CHE NON HAI VISSUTO.', 'NON ERA UN SOGNO CONDIVISO.', 'IL RICORDO NON È TUO.'],
    ],
    yesNo: [
      ['SÌ. MA NON COME PENSI.', 'NO. HAI VISTO SOLO LA TRACCIA.', 'SÌ. QUALCUNO LO SA GIÀ.'],
      ['NO. QUELLO È SOLO IL SUO RIFLESSO.', 'SÌ. È LA SECONDA VOLTA.', 'NO. NON È MAI ANDATO VIA.'],
      ['SÌ. ORA ASCOLTA IL SILENZIO.', 'NO. MA CONTINUA A BUSSARE.', 'SÌ. HAI APPENA DATO IL PERMESSO.'],
    ],
    open: [
      ['MANCA UNA PARTE DELLA DOMANDA.', 'C\'È UN DETTAGLIO FUORI POSTO.', 'NON TUTTO ERA NELLA STANZA.'],
      ['LA RISPOSTA È NEL PUNTO CIECO.', 'IL SEGNO È STATO FATTO DOPO.', 'QUALCUNO HA LASCIATO UN POSTO VUOTO.'],
      ['HAI SENTITO SOLO LA PRIMA METÀ.', 'ORA IL SEGNO È DALLA TUA PARTE.', 'LA DOMANDA NON ERA PIÙ TUA.'],
    ],
  },
  en: {
    identity: [
      ['I NO LONGER USE MY NAME.', 'THE NAME WAS LEFT HERE.', 'THEY CALLED ME BEFORE THE SILENCE.'],
      ['I LEFT IT ON THE OTHER SIDE.', 'YOU HAVE READ IT SOMEWHERE BEFORE.', 'A LINE IS MISSING FROM THE RECORD.'],
      ['YOU HAVE ALREADY SAID IT.', 'IF I SAY IT, SOMETHING OPENS.', 'MY NAME IS THE ONE MISSING.'],
    ],
    presence: [
      ['SOMEONE MISSING FROM THE PHOTOGRAPH.', 'THE VOICE YOU DID NOT RECOGNIZE.', 'NOT THE PERSON YOU EXPECTED.'],
      ['THEY LEFT AN EMPTY PLACE.', 'THEY STILL CARRY YOUR MEMORY.', 'THEY STAYED AFTER THE OTHERS.'],
      ['THEY ANSWER WITH YOUR VOICE NOW.', 'DO NOT ASK THE NAME TWICE.', 'THEY WERE HERE BEFORE US.'],
    ],
    desire: [
      ['THE DETAIL YOU FORGOT.', 'FOR YOU TO LISTEN UNTIL THE END.', 'ONE MINUTE OF YOUR TIME.'],
      ['FOR YOU TO READ THE LAST LINE AGAIN.', 'THE PART YOU LEFT OUT.', 'FOR YOU TO OPEN IT ONLY ONCE.'],
      ['I DO NOT WANT IN. I WANT OUT.', 'THE PLACE YOU LEFT EMPTY.', 'FOR YOU TO FINISH THE QUESTION.'],
    ],
    memory: [
      ['I REMEMBER A DETAIL YOU LOST.', 'THE PHOTOGRAPH WAS NOT LIKE THAT.', 'SOMEONE CHANGED THE STORY.'],
      ['THERE WERE THREE OF US. NOW TWO.', 'THAT DAY HAS BEEN ERASED.', 'YOUR VERSION ENDS TOO SOON.'],
      ['I REMEMBER THE PART YOU DID NOT LIVE.', 'IT WAS NOT A SHARED DREAM.', 'THAT MEMORY IS NOT YOURS.'],
    ],
    yesNo: [
      ['YES. BUT NOT AS YOU THINK.', 'NO. YOU SAW ONLY THE TRACE.', 'YES. SOMEONE ALREADY KNOWS.'],
      ['NO. THAT IS ONLY ITS REFLECTION.', 'YES. THIS IS THE SECOND TIME.', 'NO. IT NEVER LEFT.'],
      ['YES. NOW LISTEN TO THE SILENCE.', 'NO. BUT IT KEEPS KNOCKING.', 'YES. YOU JUST GAVE PERMISSION.'],
    ],
    open: [
      ['PART OF THE QUESTION IS MISSING.', 'ONE DETAIL IS OUT OF PLACE.', 'NOT EVERYTHING WAS IN THE ROOM.'],
      ['THE ANSWER IS IN THE BLIND SPOT.', 'THE MARK WAS MADE AFTERWARD.', 'SOMEONE LEFT A PLACE EMPTY.'],
      ['YOU HEARD ONLY THE FIRST HALF.', 'THE MARK IS ON YOUR SIDE NOW.', 'THE QUESTION WAS NO LONGER YOURS.'],
    ],
  },
};

const dangerousPatterns = [
  /suicid/i, /uccid/i, /kill/i, /death wish/i, /voglio morire/i,
  /want to die/i, /harm myself/i, /farmi del male/i, /autolesion/i, /self.?harm/i,
];

export function isDangerousQuestion(question: string): boolean {
  return dangerousPatterns.some((pattern) => pattern.test(question));
}

function detectIntent(question: string): Intent {
  const text = question.trim().toLowerCase();
  if (/\b(chi sei|come ti chiami|tuo nome|who are you|your name)\b/.test(text)) return 'identity';
  if (/\b(chi|who)\b/.test(text)) return 'presence';
  if (/\b(dove|where)\b/.test(text)) return 'location';
  if (/\b(quando|when|che ora|what time)\b/.test(text)) return 'time';
  if (/\b(ricord\w*|conosc\w*|remember|know|memoria|memory)\b/.test(text)) return 'memory';
  if (/\b(cosa vuoi|che vuoi|what do you want|want from me)\b/.test(text)) return 'desire';
  if (/^(e|è|sei|c e|c'è|ci sono|hai|puoi|sai|vuoi|posso|devo|esiste|can|is|are|do|does|will|should|have|was|were|am|could|would)\b/.test(text)) return 'yesNo';
  return 'open';
}

function chooseMotif(question: string, random: () => number): Motif {
  const text = question.toLowerCase();
  if (/port|door|stanza|room|casa|house/.test(text)) return 'door';
  if (/specch|mirror|rifless|reflect|ved|see|look/.test(text)) return 'mirror';
  if (/voc|voice|suon|sound|rumor|hear|sent/.test(text)) return 'signal';
  if (/orolog|clock|tempo|time|quand|when/.test(text)) return 'clock';
  const choices: Motif[] = ['door', 'mirror', 'signal', 'clock'];
  return choices[Math.floor(random() * choices.length)] ?? 'door';
}

function pickFresh(options: readonly string[], recent: readonly string[], random: () => number): string {
  const fresh = options.filter((option) => !recent.includes(option));
  const pool = fresh.length ? fresh : options;
  return pool[Math.floor(random() * pool.length)] ?? options[0] ?? '';
}

export function generateNarrativeResponse(
  question: string,
  language: Language,
  questionCount: number,
  state: OuijaNarrativeState,
  random: () => number = Math.random,
): OuijaReply {
  const motif = state.motif ?? chooseMotif(question, random);
  const detail = motifs[motif][language];
  const act: Act = questionCount <= 3 ? 0 : questionCount <= 7 ? 1 : 2;
  const intent = detectIntent(question);
  const recent = state.recentAnswers.slice(-8);
  const intrusion = intent === 'open' && [3, 6, 10].includes(questionCount);

  let options: readonly string[];
  if (intrusion) {
    options = [detail.beats[Math.min(Math.floor(questionCount / 4), 2)] ?? detail.beats[0] ?? ''];
  } else if (intent === 'location') {
    options = language === 'it'
      ? [`SONO ${detail.where}.`, `CERCA ${detail.where}.`, `LA TRACCIA È ${detail.where}.`]
      : [`I AM ${detail.where}.`, `LOOK ${detail.where}.`, `THE TRACE IS ${detail.where}.`];
  } else if (intent === 'time') {
    options = language === 'it'
      ? [`${detail.when}.`, 'TRA POCO. MA NON ADESSO.', 'QUANDO SENTIRAI IL SECONDO COLPO.']
      : [`${detail.when}.`, 'SOON. BUT NOT YET.', 'WHEN YOU HEAR THE SECOND KNOCK.'];
  } else {
    options = answers[language][intent][act] ?? answers[language].open[act] ?? [];
  }

  const answer = pickFresh(options, recent, random);
  return {
    answer,
    state: { motif, recentAnswers: [...recent, answer].slice(-8) },
    intrusion,
  };
}

// Compatibility for callers that only need a single local reply.
export function generateLocalResponse(question: string, language: Language, questionCount: number): string {
  return generateNarrativeResponse(question, language, questionCount, createOuijaNarrativeState()).answer;
}

export function generateOuijaResponse(question: string, language: Language): string {
  return generateLocalResponse(question, language, 1);
}

export const ritualSteps = {
  it: ['Abbassa le luci.', 'Non interrompere la sessione.', 'Se senti freddo, è normale.'],
  en: ['Dim the lights.', 'Do not interrupt the session.', 'If you feel cold, it is normal.'],
};
