export type Language = 'it' | 'en';

export const translations = {
  it: {
    // Header
    title: 'NOCTURNA',
    nav: {
      ouija: 'Ouija',
      stories: 'Racconti',
      settings: 'Impostazioni',
    },
    
    // Ouija
    ouija: {
      title: 'Tavola Ouija',
      subtitle: 'Chiedi. Ascolta. Non interrompere.',
      questionPlaceholder: 'Formula la tua domanda all\'oscurità...',
      startSession: 'Inizia sessione',
      endSession: 'Termina sessione',
      clear: 'Cancella',
      asking: 'Sto consultando...',
      yes: 'SÌ',
      no: 'NO',
      hello: 'CIAO',
      goodbye: 'ADDIO',
      sessionLog: 'Registro sessione',
      noQuestions: 'Nessuna domanda registrata',
      challenge: {
        title: 'Modalità Sfida',
        description: '3 domande. 3 risposte. Non rileggere fino alla fine.',
        start: 'Inizia sfida',
        question: 'Domanda',
        of: 'di',
        complete: 'Sfida completata',
        share: 'Condividi risultato',
        newChallenge: 'Nuova sfida',
      },
    },
    
    // Ritual messages
    ritual: {
      step1: 'Abbassa le luci.',
      step2: 'Non interrompere la sessione.',
      step3: 'Se senti freddo, è normale.',
      preparing: 'Preparando il contatto...',
      connected: 'Connessione stabilita.',
      disconnected: 'Sessione terminata.',
    },
    
    // Stories
    stories: {
      title: 'Generatore Racconti',
      subtitle: 'Lascia che le ombre tessano la tua storia.',
      seedLabel: 'Seme del racconto',
      seedPlaceholder: 'Un luogo, un oggetto, un nome, una paura...',
      length: 'Lunghezza',
      lengths: {
        flash: 'Flash (300-600 parole)',
        short: 'Breve (800-1200 parole)',
        medium: 'Medio (1500-2200 parole)',
      },
      style: 'Stile',
      styles: {
        gothic: 'Gotico moderno',
        psychological: 'Psicologico',
        folklore: 'Folklore',
        scifi: 'Sci-fi horror',
      },
      ambiguousEnding: 'Finale ambiguo',
      generate: 'Genera racconto',
      generating: 'Le ombre stanno scrivendo...',
      copy: 'Copia',
      copied: 'Copiato',
      regenerate: 'Rigenera',
      save: 'Salva',
      saved: 'Salvato',
      share: 'Condividi',
      savedStories: 'Racconti salvati',
      noSavedStories: 'Nessun racconto salvato',
      delete: 'Elimina',
      confirmDelete: 'Eliminare questo racconto?',
    },
    
    // Settings
    settings: {
      title: 'Impostazioni',
      language: 'Lingua',
      audio: 'Audio',
      audioOn: 'Attivo',
      audioOff: 'Disattivo',
      effectsIntensity: 'Intensità effetti',
      effects: {
        low: 'Bassa',
        medium: 'Media',
        high: 'Alta',
      },
      reduceMotion: 'Riduci animazioni',
      disclaimer: 'Disclaimer',
      disclaimerText: 'NOCTURNA è un\'esperienza di intrattenimento. Nessuna garanzia di contatto con entità. Tutti i dati sono salvati localmente sul tuo dispositivo. Non vengono inviate informazioni personali.',
      privacy: 'Privacy',
      privacyText: 'I tuoi dati rimangono sul tuo dispositivo. Le sessioni ouija e i racconti salvati utilizzano localStorage. Puoi cancellare tutti i dati in qualsiasi momento.',
      clearData: 'Cancella tutti i dati',
      dataCleared: 'Dati cancellati',
    },
    
    // Safety
    safety: {
      warning: 'Messaggio importante',
      message: 'Se stai attraversando un momento difficile, parlare con qualcuno può aiutare. Considera di rivolgerti a un professionista o a una persona di fiducia.',
      blocked: 'Questa richiesta non può essere elaborata.',
    },
    
    // Common
    common: {
      loading: 'Caricamento...',
      error: 'Si è verificato un errore',
      retry: 'Riprova',
      cancel: 'Annulla',
      confirm: 'Conferma',
      back: 'Indietro',
    },
  },
  
  en: {
    // Header
    title: 'NOCTURNA',
    nav: {
      ouija: 'Ouija',
      stories: 'Stories',
      settings: 'Settings',
    },
    
    // Ouija
    ouija: {
      title: 'Ouija Board',
      subtitle: 'Ask. Listen. Do not interrupt.',
      questionPlaceholder: 'Ask your question to the darkness...',
      startSession: 'Start session',
      endSession: 'End session',
      clear: 'Clear',
      asking: 'Consulting...',
      yes: 'YES',
      no: 'NO',
      hello: 'HELLO',
      goodbye: 'GOODBYE',
      sessionLog: 'Session log',
      noQuestions: 'No questions recorded',
      challenge: {
        title: 'Challenge Mode',
        description: '3 questions. 3 answers. Do not look back until the end.',
        start: 'Start challenge',
        question: 'Question',
        of: 'of',
        complete: 'Challenge complete',
        share: 'Share result',
        newChallenge: 'New challenge',
      },
    },
    
    // Ritual messages
    ritual: {
      step1: 'Dim the lights.',
      step2: 'Do not interrupt the session.',
      step3: 'If you feel cold, it is normal.',
      preparing: 'Preparing contact...',
      connected: 'Connection established.',
      disconnected: 'Session ended.',
    },
    
    // Stories
    stories: {
      title: 'Story Generator',
      subtitle: 'Let the shadows weave your tale.',
      seedLabel: 'Story seed',
      seedPlaceholder: 'A place, an object, a name, a fear...',
      length: 'Length',
      lengths: {
        flash: 'Flash (300-600 words)',
        short: 'Short (800-1200 words)',
        medium: 'Medium (1500-2200 words)',
      },
      style: 'Style',
      styles: {
        gothic: 'Modern gothic',
        psychological: 'Psychological',
        folklore: 'Folklore',
        scifi: 'Sci-fi horror',
      },
      ambiguousEnding: 'Ambiguous ending',
      generate: 'Generate story',
      generating: 'The shadows are writing...',
      copy: 'Copy',
      copied: 'Copied',
      regenerate: 'Regenerate',
      save: 'Save',
      saved: 'Saved',
      share: 'Share',
      savedStories: 'Saved stories',
      noSavedStories: 'No saved stories',
      delete: 'Delete',
      confirmDelete: 'Delete this story?',
    },
    
    // Settings
    settings: {
      title: 'Settings',
      language: 'Language',
      audio: 'Audio',
      audioOn: 'On',
      audioOff: 'Off',
      effectsIntensity: 'Effects intensity',
      effects: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
      reduceMotion: 'Reduce motion',
      disclaimer: 'Disclaimer',
      disclaimerText: 'NOCTURNA is an entertainment experience. No guarantee of contact with entities. All data is saved locally on your device. No personal information is transmitted.',
      privacy: 'Privacy',
      privacyText: 'Your data stays on your device. Ouija sessions and saved stories use localStorage. You can delete all data at any time.',
      clearData: 'Clear all data',
      dataCleared: 'Data cleared',
    },
    
    // Safety
    safety: {
      warning: 'Important message',
      message: 'If you are going through a difficult time, talking to someone can help. Consider reaching out to a professional or someone you trust.',
      blocked: 'This request cannot be processed.',
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getDefaultLanguage(): Language {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('it')) {
      return 'it';
    }
  }
  return 'en';
}

export function t(lang: Language, path: string): string {
  const keys = path.split('.');
  let result: unknown = translations[lang];
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  return typeof result === 'string' ? result : path;
}
