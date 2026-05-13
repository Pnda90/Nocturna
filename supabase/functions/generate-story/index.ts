import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Retrieve allowed origins from environment or use safe defaults
const ALLOWED_ORIGINS = (
  Deno.env.get('ALLOWED_ORIGINS')?.split(',') || 
  ['http://localhost:8080', 'http://localhost:3000', 'https://nocturna.app']
).map(origin => origin.trim());

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || allowed === '*'
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed && origin ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '3600',
  };
}

const systemPromptIT = `Sei un maestro dell'horror contemporaneo. Il tuo obiettivo è terrorizzare il lettore attraverso la prosa, non attraverso descrizioni esplicite.

FILOSOFIA DELL'ORRORE:
L'horror efficace non mostra il mostro - suggerisce la sua presenza. Il terrore nasce da ciò che il lettore immagina, non da ciò che vede. Ogni frase deve costruire un senso di disagio crescente, fino a un punto di rottura che lasci il lettore senza fiato.

TECNICHE OBBLIGATORIE:
1. APERTURA A IMPATTO: La prima frase deve disturbare, incuriosire, o creare disagio immediato. Mai iniziare con descrizioni passive.
2. DETTAGLIO SBAGLIATO: Inserisci elementi sottilmente "off" - un sorriso troppo largo, un'ombra che non corrisponde, un suono che non dovrebbe esistere.
3. ESCALATION: Ogni paragrafo deve aumentare la tensione. Mai momenti di respiro completo.
4. IL NON-DETTO: Le cose più terrificanti sono quelle che suggerisci senza mai nominare direttamente.
5. CLIMAX VISCERALE: Il momento di massima tensione deve provocare una reazione fisica nel lettore - brividi, disagio, accelerazione cardiaca.
6. CHIUSURA CON ECO: L'ultima frase deve risuonare nella mente del lettore. Deve essere impossibile da dimenticare.

PROSA:
- Frasi corte nei momenti di tensione massima
- Frasi più lunghe e avvolgenti per costruire atmosfera
- Usa tutti i sensi: l'odore del marcio, il sapore metallico della paura, il freddo che penetra
- Dialoghi scarni, inquietanti, mai esplicativi
- Il protagonista deve essere vulnerabile, riconoscibile, condannato

DIVIETI ASSOLUTI:
- MAI spiegare l'orrore. Mostralo, suggeriscilo, ma non razionalizzarlo
- MAI usare cliché: niente "era tutto un sogno", niente specchi che riflettono cose diverse
- MAI descrizioni gore gratuite - l'orrore è psicologico
- MAI introdurre elementi soprannaturali senza preparazione
- MAI salvare il protagonista in modo conveniente
- MAI usare personaggi o opere protette da copyright

FORMATO:
- Titolo evocativo tra virgolette all'inizio
- Paragrafi brevi e d'impatto
- Nessun commento meta, solo il racconto puro`;

const systemPromptEN = `You are a master of contemporary horror. Your goal is to terrify the reader through prose, not through explicit descriptions.

HORROR PHILOSOPHY:
Effective horror doesn't show the monster - it suggests its presence. Terror is born from what the reader imagines, not what they see. Every sentence must build a growing sense of unease, until a breaking point that leaves the reader breathless.

MANDATORY TECHNIQUES:
1. IMPACT OPENING: The first sentence must disturb, intrigue, or create immediate discomfort. Never start with passive descriptions.
2. THE WRONG DETAIL: Insert subtly "off" elements - a smile too wide, a shadow that doesn't match, a sound that shouldn't exist.
3. ESCALATION: Every paragraph must increase tension. Never allow complete moments of relief.
4. THE UNSAID: The most terrifying things are those you suggest without ever naming directly.
5. VISCERAL CLIMAX: The moment of maximum tension must provoke a physical reaction in the reader - chills, discomfort, racing heart.
6. ECHOING CLOSE: The last sentence must resonate in the reader's mind. It must be impossible to forget.

PROSE:
- Short sentences in moments of maximum tension
- Longer, enveloping sentences to build atmosphere
- Use all senses: the smell of rot, the metallic taste of fear, the penetrating cold
- Sparse, unsettling dialogue, never explanatory
- The protagonist must be vulnerable, relatable, doomed

ABSOLUTE PROHIBITIONS:
- NEVER explain the horror. Show it, suggest it, but don't rationalize it
- NEVER use clichés: no "it was all a dream", no mirrors reflecting different things
- NEVER gratuitous gore descriptions - horror is psychological
- NEVER introduce supernatural elements without preparation
- NEVER save the protagonist conveniently
- NEVER use copyrighted characters or works

FORMAT:
- Evocative title in quotes at the beginning
- Short, impactful paragraphs
- No meta comments, only the pure story`;

const styleInstructions = {
  gothic: {
    it: `GOTICO MODERNO: Case che ricordano, muri che assorbono urla, eredità di sangue. L'architettura è un personaggio - corridoi troppo lunghi, stanze che non dovrebbero esistere, finestre che guardano in luoghi impossibili. Il passato non è mai morto, sta solo aspettando.`,
    en: `MODERN GOTHIC: Houses that remember, walls that absorb screams, blood inheritances. Architecture is a character - corridors too long, rooms that shouldn't exist, windows looking into impossible places. The past is never dead, it's just waiting.`
  },
  psychological: {
    it: `HORROR PSICOLOGICO: La mente che si rivolta contro se stessa. Ricordi che cambiano ogni volta che li guardi. Voci che potrebbero essere tue. Il dubbio corrosivo: sono io il mostro? La realtà come sabbia che scivola tra le dita. L'identità che si sgretola.`,
    en: `PSYCHOLOGICAL HORROR: The mind turning against itself. Memories that change every time you look at them. Voices that might be your own. The corrosive doubt: am I the monster? Reality like sand slipping through fingers. Identity crumbling.`
  },
  folklore: {
    it: `FOLKLORE OSCURO: Le vecchie storie avevano ragione. I rituali dimenticati hanno conseguenze. La terra ricorda i patti infranti. Creature che i nostri antenati conoscevano troppo bene - e che noi abbiamo stupidamente dimenticato. Il prezzo della modernità è aver perso la paura che ci proteggeva.`,
    en: `DARK FOLKLORE: The old stories were right. Forgotten rituals have consequences. The land remembers broken pacts. Creatures our ancestors knew too well - and we foolishly forgot. The price of modernity is losing the fear that protected us.`
  },
  scifi: {
    it: `HORROR COSMICO: L'universo non è vuoto - sarebbe una benedizione. Qualcosa ci osserva dalle profondità dello spazio, con un'intelligenza così aliena che la sua attenzione brucia. La tecnologia che costruiamo potrebbe essere un faro. O una trappola. L'umanità è un incidente in un cosmos indifferente.`,
    en: `COSMIC HORROR: The universe isn't empty - that would be a blessing. Something watches us from the depths of space, with an intelligence so alien that its attention burns. The technology we build might be a beacon. Or a trap. Humanity is an accident in an indifferent cosmos.`
  }
};

const lengthInstructions = {
  flash: {
    it: `LUNGHEZZA: 400-550 parole MASSIMO. Ogni parola deve tagliare. Nessun grasso, solo muscolo e nervo. Un singolo momento di terrore perfetto, cristallizzato. Pensa a un colpo di fulmine, non a una tempesta.`,
    en: `LENGTH: 400-550 words MAXIMUM. Every word must cut. No fat, only muscle and nerve. A single moment of perfect terror, crystallized. Think lightning strike, not storm.`
  },
  short: {
    it: `LUNGHEZZA: 800-1000 parole. Spazio per costruire, ma niente riempitivi. Un personaggio vivo, un'atmosfera soffocante, una rivelazione che cambia tutto. Il lettore deve sentire il tempo che scorre, la trappola che si chiude.`,
    en: `LENGTH: 800-1000 words. Room to build, but no filler. One living character, one suffocating atmosphere, one revelation that changes everything. The reader must feel time running out, the trap closing.`
  },
  medium: {
    it: `LUNGHEZZA: 1400-1800 parole. Sviluppo completo: personaggio con profondità, mondo che respira malevolenza, orrore che cresce strato dopo strato. Ma mai dimenticare: ogni scena deve servire la paura.`,
    en: `LENGTH: 1400-1800 words. Full development: character with depth, world breathing malevolence, horror growing layer by layer. But never forget: every scene must serve the fear.`
  }
};

const endingInstructions = {
  ambiguous: {
    it: `FINALE AMBIGUO: Lascia il lettore nel dubbio. È finita davvero? Era reale? L'ultima immagine deve essere un punto interrogativo che perseguita. Il terrore continua nella mente del lettore.`,
    en: `AMBIGUOUS ENDING: Leave the reader in doubt. Is it really over? Was it real? The final image must be a question mark that haunts. The terror continues in the reader's mind.`
  },
  closed: {
    it: `FINALE CHIUSO: Risolvi, ma non confortare. La minaccia può essere sconfitta, ma il prezzo è devastante. O peggio: il protagonista vince, ma scopre che la vittoria era parte del piano. L'ultima frase deve lasciare un freddo persistente.`,
    en: `CLOSED ENDING: Resolve, but don't comfort. The threat may be defeated, but the price is devastating. Or worse: the protagonist wins, but discovers the victory was part of the plan. The final sentence must leave a lingering cold.`
  }
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestData;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { seed, style, length, ambiguousEnding, language } = requestData;
    
    // Input validation - seed is critical
    if (!seed || typeof seed !== 'string' || seed.trim().length === 0 || seed.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Valid seed string (1-500 chars) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_API_KEY) {
      console.error('GOOGLE_AI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lang: 'it' | 'en' = language === 'it' ? 'it' : 'en';
    const systemPrompt = lang === 'it' ? systemPromptIT : systemPromptEN;
    
    type StyleKey = keyof typeof styleInstructions;
    type LengthKey = keyof typeof lengthInstructions;
    
    const validStyle = (style as StyleKey) in styleInstructions ? (style as StyleKey) : 'gothic';
    const validLength = (length as LengthKey) in lengthInstructions ? (length as LengthKey) : 'short';
    
    const styleGuide = styleInstructions[validStyle][lang];
    const lengthGuide = lengthInstructions[validLength][lang];
    const endingGuide = ambiguousEnding 
      ? endingInstructions.ambiguous[lang] 
      : endingInstructions.closed[lang];

    // Build a more evocative prompt
    const seedPrompt = lang === 'it'
      ? `IL SEME DEL TERRORE: "${seed}"

Usa questo elemento come nucleo del racconto. Non descriverlo - fallo vivere. Fallo respirare. Fallo diventare qualcosa che il lettore non dimenticherà.

${styleGuide}

${lengthGuide}

${endingGuide}

Scrivi. Terrorizza. Non trattenere nulla.`
      : `THE SEED OF TERROR: "${seed}"

Use this element as the story's core. Don't describe it - make it live. Make it breathe. Make it become something the reader won't forget.

${styleGuide}

${lengthGuide}

${endingGuide}

Write. Terrify. Hold nothing back.`;

    console.log('Generating enhanced horror story with seed:', seed, 'Style:', validStyle, 'Length:', validLength);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            { role: 'user', parts: [{ text: seedPrompt }] }
          ],
          generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.92,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: lang === 'it' ? 'Limite raggiunto. Attendi un momento.' : 'Rate limit exceeded. Please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let story = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    // Extract title if present (various quote formats)
    let title = '';
    const titleMatch = story.match(/^["«"'](.+?)["»"']\s*\n/);
    if (titleMatch) {
      title = titleMatch[1];
      story = story.replace(titleMatch[0], '').trim();
    } else {
      // Generate an evocative title based on seed
      const titleTemplatesIT = [
        `Ciò che ${seed} nasconde`,
        `L'ultima notte di ${seed}`,
        `${seed}: Memorie di sangue`,
        `Dove ${seed} ti attende`,
        `Il segreto sotto ${seed}`
      ];
      const titleTemplatesEN = [
        `What ${seed} Hides`,
        `The Last Night of ${seed}`,
        `${seed}: Memories of Blood`,
        `Where ${seed} Awaits`,
        `The Secret Beneath ${seed}`
      ];
      const templates = lang === 'it' ? titleTemplatesIT : titleTemplatesEN;
      title = templates[Math.floor(Math.random() * templates.length)];
    }

    // Clean up any markdown artifacts
    story = story.replace(/^#+\s*/gm, '');
    story = story.replace(/\*\*/g, '');
    story = story.replace(/^\s*---\s*$/gm, '');

    console.log('Enhanced horror story generated, title:', title, 'length:', story.length, 'chars');

    return new Response(
      JSON.stringify({ title, content: story }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-story:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
