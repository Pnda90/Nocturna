import { Language } from './i18n';

export type StoryLength = 'flash' | 'short' | 'medium';
export type StoryStyle = 'gothic' | 'psychological' | 'folklore' | 'scifi';

interface StoryParams {
  seed: string;
  length: StoryLength;
  style: StoryStyle;
  ambiguousEnding: boolean;
  language: Language;
}

const storyTemplates = {
  gothic: {
    it: {
      openings: [
        'La villa giaceva in silenzio da decenni, le sue finestre come occhi ciechi che scrutavano la brughiera.',
        'Quando ereditai la tenuta di famiglia, non sapevo che con essa avrei ereditato anche i suoi segreti.',
        'Il temporale che quella notte si abbatté sulla costa non era naturale. Lo sapevo dalle urla del vento.',
      ],
      middles: [
        'I corridoi sembravano allungarsi quando li percorrevo di notte, e le ombre danzavano ai margini della mia visione.',
        'Trovai le lettere nascoste dietro il camino, ingiallite dal tempo, scritte con una calligrafia che riconoscevo come la mia.',
        'Il ritratto nella biblioteca mi osservava. Ogni giorno, il suo sorriso sembrava più ampio, più consapevole.',
      ],
      endings: {
        closed: [
          'Quando l\'alba finalmente giunse, capii che non sarei mai più partito. La villa mi aveva scelto, come aveva scelto tutti gli altri prima di me.',
          'Le fiamme consumarono ogni cosa quella notte. Ma mentre guardavo bruciare la mia eredità, sentii una risata che non era la mia.',
        ],
        ambiguous: [
          'L\'ultima cosa che ricordo è il suono della porta che si chiudeva. Ma non c\'era nessuno dietro di me. O almeno, così credevo.',
          'Dicono che la villa sia ancora lì, in attesa. A volte, nelle notti di tempesta, si vedono luci alle finestre. Luci che non dovrebbero esserci.',
        ],
      },
    },
    en: {
      openings: [
        'The mansion had stood silent for decades, its windows like blind eyes staring across the moor.',
        'When I inherited the family estate, I did not know I would also inherit its secrets.',
        'The storm that struck the coast that night was not natural. I knew it from the wind\'s screaming.',
      ],
      middles: [
        'The corridors seemed to stretch when I walked them at night, and shadows danced at the edges of my vision.',
        'I found the letters hidden behind the fireplace, yellowed by time, written in a handwriting I recognized as my own.',
        'The portrait in the library watched me. Each day, its smile seemed wider, more knowing.',
      ],
      endings: {
        closed: [
          'When dawn finally came, I understood I would never leave. The mansion had chosen me, as it had chosen all the others before.',
          'The flames consumed everything that night. But as I watched my inheritance burn, I heard laughter that was not my own.',
        ],
        ambiguous: [
          'The last thing I remember is the sound of the door closing. But there was no one behind me. Or so I thought.',
          'They say the mansion still stands, waiting. Sometimes, on stormy nights, lights appear in the windows. Lights that should not be there.',
        ],
      },
    },
  },
  psychological: {
    it: {
      openings: [
        'Non ricordo quando ho iniziato a sentire i passi. Forse sono sempre stati lì, nascosti nel silenzio.',
        'Il terapeuta disse che era stress. Ma lo stress non ti sussurra il tuo nome alle tre di notte.',
        'Ho smesso di guardare negli specchi tre mesi fa. Non mi piaceva quello che cominciava a guardarmi indietro.',
      ],
      middles: [
        'I post-it apparivano ogni mattina sul frigorifero. Messaggi nella mia calligrafia che non ricordavo di aver scritto.',
        'Mia moglie insisteva che non avevamo un seminterrato. Ma io sentivo qualcuno camminare là sotto ogni notte.',
        'Le registrazioni del mio telefono mostravano ore di sonno. Ma la voce che parlava nel buio non era la mia.',
      ],
      endings: {
        closed: [
          'Quando finalmente guardai di nuovo nello specchio, capii. Non ero io quello che fingeva. Era sempre stato lui.',
          'Il rapporto della polizia parlò di esaurimento nervoso. Ma non spiegarono mai chi aveva scritto il mio nome sul muro. Cento volte.',
        ],
        ambiguous: [
          'Ora prendo le medicine. Funzionano, dicono. Ma a volte, nel silenzio, sento ancora qualcuno che ride. E usa la mia voce.',
          'Ho bruciato tutti gli specchi. Ho sigillato le porte. Ma la notte scorsa, qualcuno ha bussato. Dall\'interno dell\'armadio.',
        ],
      },
    },
    en: {
      openings: [
        'I don\'t remember when I first started hearing the footsteps. Perhaps they were always there, hidden in the silence.',
        'The therapist said it was stress. But stress doesn\'t whisper your name at three in the morning.',
        'I stopped looking in mirrors three months ago. I didn\'t like what was starting to look back.',
      ],
      middles: [
        'The post-its appeared every morning on the fridge. Messages in my handwriting that I didn\'t remember writing.',
        'My wife insisted we didn\'t have a basement. But I heard someone walking down there every night.',
        'My phone recordings showed hours of sleep. But the voice speaking in the darkness wasn\'t mine.',
      ],
      endings: {
        closed: [
          'When I finally looked in the mirror again, I understood. I wasn\'t the one pretending. It had always been him.',
          'The police report spoke of nervous breakdown. But they never explained who wrote my name on the wall. A hundred times.',
        ],
        ambiguous: [
          'I take the medicine now. It works, they say. But sometimes, in the silence, I still hear someone laughing. Using my voice.',
          'I burned all the mirrors. I sealed the doors. But last night, someone knocked. From inside the closet.',
        ],
      },
    },
  },
  folklore: {
    it: {
      openings: [
        'Mia nonna diceva sempre: non aprire mai la porta dopo mezzanotte. Non importa chi bussa. Non importa quale voce senti.',
        'Nelle montagne del nostro paese, i vecchi non pronunciano mai certi nomi dopo il tramonto. Io ero giovane. Non ho ascoltato.',
        'La tradizione vuole che si lasci un posto vuoto a tavola durante la notte dei morti. Quell\'anno, dimenticammo.',
      ],
      middles: [
        'La creatura che vidi non aveva volto, eppure sorrideva. Le storie della nonna parlavano di esseri così, che rubano i lineamenti dei bambini cattivi.',
        'I lupi ululavano quella notte, ma non era un ululato normale. Era un lamento, un avvertimento che arrivava troppo tardi.',
        'Trovai il cerchio di funghi all\'alba. Le impronte al suo interno erano le mie, ma io non ricordavo di aver camminato.',
      ],
      endings: {
        closed: [
          'Ora anch\'io racconto queste storie ai nipoti. E loro, come me, non crederanno. Finché non sarà troppo tardi.',
          'Il prezzo fu pagato quella notte. La creatura prese ciò che le spettava, e il villaggio tornò in silenzio. Un silenzio che dura ancora.',
        ],
        ambiguous: [
          'Ogni anno, il primo novembre, lascio il posto vuoto a tavola. E ogni anno, al mattino, trovo il piatto vuoto. Qualcuno ha mangiato.',
          'I vecchi del villaggio ora non parlano più con me. Ma li vedo, a volte, fare il segno contro il malocchio quando passo. Sanno cosa ho portato indietro.',
        ],
      },
    },
    en: {
      openings: [
        'My grandmother always said: never open the door after midnight. No matter who knocks. No matter whose voice you hear.',
        'In the mountains of our village, the elders never speak certain names after sunset. I was young. I didn\'t listen.',
        'Tradition says to leave an empty seat at the table on the night of the dead. That year, we forgot.',
      ],
      middles: [
        'The creature I saw had no face, yet it smiled. Grandmother\'s stories spoke of beings like this, who steal the features of bad children.',
        'The wolves howled that night, but it wasn\'t a normal howl. It was a lament, a warning that came too late.',
        'I found the fairy ring at dawn. The footprints inside were mine, but I didn\'t remember walking.',
      ],
      endings: {
        closed: [
          'Now I too tell these stories to grandchildren. And they, like me, will not believe. Until it\'s too late.',
          'The price was paid that night. The creature took what it was owed, and the village fell silent. A silence that lasts still.',
        ],
        ambiguous: [
          'Every year, on November first, I leave an empty seat at the table. And every year, in the morning, I find the plate empty. Someone has eaten.',
          'The village elders no longer speak to me. But I see them, sometimes, making the sign against the evil eye as I pass. They know what I brought back.',
        ],
      },
    },
  },
  scifi: {
    it: {
      openings: [
        'Il segnale arrivò alle 03:47, ora di Marte. Era identico al primo, quello che avevamo ricevuto trecento anni fa. Prima del silenzio.',
        'Quando mi svegliai dal criosonno, l\'astronave era vuota. Il registro diceva che ero in stasi da settantadue ore. I corridoi dicevano il contrario.',
        'L\'IA smise di rispondere il giorno in cui scoprimmo la struttura sotto la superficie. L\'ultima cosa che disse fu: "Non eravate i primi."',
      ],
      middles: [
        'Le impronte nel corridoio non corrispondevano a nessun membro dell\'equipaggio. Avevano sei dita. E continuavano a moltiplicarsi.',
        'I dati che scaricammo dalla struttura erano in un linguaggio che non avremmo dovuto riconoscere. Eppure, qualcosa in me sapeva leggerli.',
        'La quarantena durò diciannove giorni. Al ventesimo, qualcuno bussò all\'oblò esterno. Eravamo a ottocento chilometri dalla superficie.',
      ],
      endings: {
        closed: [
          'Il messaggio che inviammo alla Terra non arrivò mai. Ma qualcosa rispose. E la voce che sentimmo parlava perfetto italiano. Troppo perfetto.',
          'Quando finalmente aprimmo la camera sigillata, capimmo. Non eravamo venuti a esplorare. Eravamo stati invitati.',
        ],
        ambiguous: [
          'Il rapporto ufficiale parla di guasto tecnico, allucinazione di massa. Ma ogni notte, guardo le stelle e mi chiedo. Cosa sta ancora aspettando, là fuori?',
          'Sono tornato sulla Terra, ma qualcosa non torna. I cieli sono dello stesso blu, le persone sorridono come prima. Eppure, a volte, quando li guardo, i loro occhi brillano nel buio.',
        ],
      },
    },
    en: {
      openings: [
        'The signal arrived at 03:47, Mars time. It was identical to the first one, the one we received three hundred years ago. Before the silence.',
        'When I woke from cryosleep, the ship was empty. The log said I had been in stasis for seventy-two hours. The corridors said otherwise.',
        'The AI stopped responding the day we discovered the structure beneath the surface. The last thing it said was: "You were not the first."',
      ],
      middles: [
        'The footprints in the corridor matched no crew member. They had six fingers. And they kept multiplying.',
        'The data we downloaded from the structure was in a language we shouldn\'t have recognized. Yet, something in me knew how to read it.',
        'Quarantine lasted nineteen days. On the twentieth, someone knocked on the outer porthole. We were eight hundred kilometers above the surface.',
      ],
      endings: {
        closed: [
          'The message we sent to Earth never arrived. But something answered. And the voice we heard spoke perfect English. Too perfect.',
          'When we finally opened the sealed chamber, we understood. We hadn\'t come to explore. We had been invited.',
        ],
        ambiguous: [
          'The official report speaks of technical malfunction, mass hallucination. But every night, I look at the stars and wonder. What is still waiting, out there?',
          'I returned to Earth, but something doesn\'t add up. The skies are the same blue, people smile as before. Yet, sometimes, when I look at them, their eyes glow in the dark.',
        ],
      },
    },
  },
};

const seedEnhancements = {
  it: {
    place: [
      'In quel luogo dimenticato, ',
      'Tra le mura di ',
      'Nel cuore oscuro di ',
    ],
    object: [
      'L\'oggetto giaceva in attesa, ',
      'Quando toccai ',
      'Era stato nascosto per un motivo, ',
    ],
    name: [
      'pronunciarono il nome proibito: ',
      'Il nome echeggiò nel vuoto: ',
      'Nessuno osava più dire quel nome: ',
    ],
    fear: [
      'La paura prese forma: ',
      'Ciò che temevo si materializzò: ',
      'Il terrore aveva un volto: ',
    ],
  },
  en: {
    place: [
      'In that forgotten place, ',
      'Within the walls of ',
      'In the dark heart of ',
    ],
    object: [
      'The object lay waiting, ',
      'When I touched ',
      'It had been hidden for a reason, ',
    ],
    name: [
      'they spoke the forbidden name: ',
      'The name echoed in the void: ',
      'No one dared say that name anymore: ',
    ],
    fear: [
      'The fear took form: ',
      'What I feared materialized: ',
      'Terror had a face: ',
    ],
  },
};

function getWordCount(length: StoryLength): { min: number; max: number } {
  switch (length) {
    case 'flash':
      return { min: 300, max: 600 };
    case 'short':
      return { min: 800, max: 1200 };
    case 'medium':
      return { min: 1500, max: 2200 };
  }
}

function generateParagraph(sentences: string[], count: number): string {
  const selected: string[] = [];
  const available = [...sentences];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }
  
  return selected.join(' ');
}

export function generateStory(params: StoryParams): { title: string; content: string } {
  const { seed, length, style, ambiguousEnding, language } = params;
  const template = storyTemplates[style][language];
  const wordTarget = getWordCount(length);
  
  // Generate title
  const titles = {
    it: [
      `L'Ombra di ${seed}`,
      `${seed}: Un Racconto`,
      `Quando ${seed} Chiamò`,
      `Il Segreto di ${seed}`,
      `L'Ultimo ${seed}`,
    ],
    en: [
      `The Shadow of ${seed}`,
      `${seed}: A Tale`,
      `When ${seed} Called`,
      `The Secret of ${seed}`,
      `The Last ${seed}`,
    ],
  };
  
  const title = titles[language][Math.floor(Math.random() * titles[language].length)];
  
  // Build story
  const paragraphs: string[] = [];
  
  // Opening with seed integration
  const enhancements = seedEnhancements[language];
  const enhancementTypes = Object.keys(enhancements) as Array<keyof typeof enhancements>;
  const randomEnhancement = enhancementTypes[Math.floor(Math.random() * enhancementTypes.length)];
  const enhancementPrefix = enhancements[randomEnhancement][Math.floor(Math.random() * enhancements[randomEnhancement].length)];
  
  const opening = template.openings[Math.floor(Math.random() * template.openings.length)];
  paragraphs.push(enhancementPrefix + seed + '. ' + opening);
  
  // Middle paragraphs based on length
  const middleCount = length === 'flash' ? 2 : length === 'short' ? 4 : 6;
  for (let i = 0; i < middleCount; i++) {
    const middle = template.middles[Math.floor(Math.random() * template.middles.length)];
    paragraphs.push(middle);
  }
  
  // Ending
  const endings = ambiguousEnding ? template.endings.ambiguous : template.endings.closed;
  paragraphs.push(endings[Math.floor(Math.random() * endings.length)]);
  
  return {
    title,
    content: paragraphs.join('\n\n'),
  };
}

const dangerousSeedPatterns = [
  /suicid/i,
  /uccid/i,
  /kill/i,
  /murder/i,
  /omicid/i,
  /violen[cz]/i,
  /abus/i,
  /tortur/i,
  /rape/i,
  /stupro/i,
];

export function isDangerousSeed(seed: string): boolean {
  return dangerousSeedPatterns.some((pattern) => pattern.test(seed));
}
