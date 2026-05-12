import { Language } from './i18n';

const crypticResponses = {
  it: [
    'NON ANCORA',
    'CHIEDI MEGLIO',
    'FORSE',
    'IL TEMPO DIRA',
    'SILENZIO',
    'PRESTO',
    'MAI',
    'CHI CHIEDE',
    'ATTENDI',
    'NON ORA',
    'ASCOLTA',
    'GUARDA DIETRO',
    'FREDDO',
    'VICINO',
    'LONTANO',
    'OMBRE',
    'RICORDA',
    'DIMENTICA',
    'SOGNA',
    'SVEGLIATI',
    'TRE',
    'MEZZANOTTE',
    'SPECCHIO',
    'PORTA',
    'CHIAVE',
    'NON VOLTARTI',
    'ASCOLTO',
    'VENGO',
    'RESTO',
    'PARTO',
  ],
  en: [
    'NOT YET',
    'ASK BETTER',
    'PERHAPS',
    'TIME WILL TELL',
    'SILENCE',
    'SOON',
    'NEVER',
    'WHO ASKS',
    'WAIT',
    'NOT NOW',
    'LISTEN',
    'LOOK BEHIND',
    'COLD',
    'NEAR',
    'FAR',
    'SHADOWS',
    'REMEMBER',
    'FORGET',
    'DREAM',
    'WAKE UP',
    'THREE',
    'MIDNIGHT',
    'MIRROR',
    'DOOR',
    'KEY',
    'DO NOT TURN',
    'I LISTEN',
    'I COME',
    'I STAY',
    'I LEAVE',
  ],
};

// Tension-escalated responses for progressive horror
const tensionResponses: Record<string, { it: string[]; en: string[] }> = {
  curiosità: {
    it: [
      'CHI SEI',
      'TI OSSERVO',
      'NON ANCORA',
      'FORSE',
      'ASPETTA',
      'QUALCUNO ASCOLTA',
      'SILENZIO',
      'CHIEDI MEGLIO',
    ],
    en: [
      'WHO ARE YOU',
      'I WATCH YOU',
      'NOT YET',
      'PERHAPS',
      'WAIT',
      'SOMEONE IS LISTENING',
      'SILENCE',
      'ASK BETTER',
    ],
  },
  interesse: {
    it: [
      'SO COSA CERCHI',
      'TI OSSERVO DA TEMPO',
      'LA TUA OMBRA E DIVERSA',
      'NON SEI SOLO',
      'SENTO IL TUO CUORE',
      'DIETRO LA PORTA',
      'RICORDO IL TUO NOME',
      'CI SIAMO GIA VISTI',
    ],
    en: [
      'I KNOW WHAT YOU SEEK',
      'I HAVE WATCHED YOU',
      'YOUR SHADOW IS DIFFERENT',
      'YOU ARE NOT ALONE',
      'I HEAR YOUR HEART',
      'BEHIND THE DOOR',
      'I REMEMBER YOUR NAME',
      'WE HAVE MET BEFORE',
    ],
  },
  inquietudine: {
    it: [
      'LA PORTA SI APRE',
      'NON DOVRESTI CONTINUARE',
      'IL FREDDO CHE SENTI SONO IO',
      'GUARDA DIETRO DI TE',
      'TRE PASSI E ARRIVO',
      'LE OMBRE SI MUOVONO',
      'HO FAME',
      'SENTI ANCHE TU QUEL RUMORE',
    ],
    en: [
      'THE DOOR OPENS',
      'YOU SHOULD NOT CONTINUE',
      'THE COLD YOU FEEL IS ME',
      'LOOK BEHIND YOU',
      'THREE STEPS AND I ARRIVE',
      'THE SHADOWS MOVE',
      'I AM HUNGRY',
      'DO YOU HEAR THAT NOISE TOO',
    ],
  },
  terrore: {
    it: [
      'SONO VICINO',
      'SENTO IL TUO RESPIRO',
      'DIETRO DI TE',
      'NON CHIUDERE GLI OCCHI',
      'SO DOVE DORMI',
      'IL BUIO MI APPARTIENE',
      'CORRI',
      'TI HO TROVATO',
    ],
    en: [
      'I AM CLOSE',
      'I FEEL YOUR BREATH',
      'BEHIND YOU',
      'DO NOT CLOSE YOUR EYES',
      'I KNOW WHERE YOU SLEEP',
      'THE DARKNESS IS MINE',
      'RUN',
      'I FOUND YOU',
    ],
  },
  possessione: {
    it: [
      'TROPPO TARDI',
      'ORA SEI MIO',
      'N O N   S C A P P I',
      'IO SONO TE',
      'SORRIDI PER ME',
      'GUARDAMI NEGLI OCCHI',
      'MXIII',
      'MAI PIU LUCE',
    ],
    en: [
      'TOO LATE',
      'NOW YOU ARE MINE',
      'N O   E S C A P E',
      'I AM YOU',
      'SMILE FOR ME',
      'LOOK INTO MY EYES',
      'MXIII',
      'NEVER LIGHT AGAIN',
    ],
  },
};

const yesNoResponses = {
  it: ['SÌ', 'NO'],
  en: ['YES', 'NO'],
};

const letterSequences = [
  'XIII',
  'VII',
  'III',
  '666',
  '333',
  '23',
  'MXIII',
  'IV',
];

const dangerousPatterns = [
  /suicid/i,
  /uccid/i,
  /kill/i,
  /death wish/i,
  /voglio morire/i,
  /want to die/i,
  /harm myself/i,
  /farmi del male/i,
  /autolesion/i,
  /self.?harm/i,
];

export function isDangerousQuestion(question: string): boolean {
  return dangerousPatterns.some((pattern) => pattern.test(question));
}

export function generateOuijaResponse(question: string, language: Language): string {
  const responses = crypticResponses[language];
  const yesNo = yesNoResponses[language];
  
  const random = Math.random();
  
  // 10% chance of YES/NO
  if (random < 0.1) {
    return yesNo[Math.floor(Math.random() * yesNo.length)];
  }
  
  // 10% chance of letter/number sequence
  if (random < 0.2) {
    return letterSequences[Math.floor(Math.random() * letterSequences.length)];
  }
  
  // 80% chance of cryptic response
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Generate a tension-aware local response when the AI backend is unavailable.
 * Uses question count to determine the tension level and selects responses accordingly.
 */
export function generateLocalResponse(
  question: string,
  language: Language,
  questionCount: number
): string {
  let tensionKey: string;
  if (questionCount <= 2) tensionKey = 'curiosità';
  else if (questionCount <= 5) tensionKey = 'interesse';
  else if (questionCount <= 8) tensionKey = 'inquietudine';
  else if (questionCount <= 12) tensionKey = 'terrore';
  else tensionKey = 'possessione';

  const pool = tensionResponses[tensionKey]?.[language] ?? crypticResponses[language];
  const random = Math.random();

  // Yes/No questions get direct answers sometimes
  const isYesNo = /\?/.test(question) && (
    /^(è|sei|c'è|sono|hai|puoi|sai|vuoi|posso|devo|esiste|can|is|are|do|does|will|should|have|was|were|am|could|would)/i.test(question.trim())
  );
  if (isYesNo && random < 0.2) {
    const yesNo = yesNoResponses[language];
    return yesNo[Math.floor(Math.random() * yesNo.length)];
  }

  // At high tension, occasionally mix in number sequences
  if (questionCount > 8 && random < 0.1) {
    return letterSequences[Math.floor(Math.random() * letterSequences.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export const ritualSteps = {
  it: [
    'Abbassa le luci.',
    'Non interrompere la sessione.',
    'Se senti freddo, è normale.',
  ],
  en: [
    'Dim the lights.',
    'Do not interrupt the session.',
    'If you feel cold, it is normal.',
  ],
};
