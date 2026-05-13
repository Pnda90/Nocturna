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

// Sistema di tensione progressiva basato sul numero di domande
function getTensionLevel(questionCount: number): { level: string; modifier: string } {
  if (questionCount <= 2) {
    return {
      level: 'curiosità',
      modifier: 'Rispondi in modo vago e misterioso, come se stessi valutando chi ti parla. Lascia intendere che sai più di quanto dici.'
    };
  } else if (questionCount <= 5) {
    return {
      level: 'interesse',
      modifier: 'Mostrati più presente. Fai riferimenti sottili alle domande precedenti. Inizia a suggerire che conosci dettagli personali. Usa frasi come "TI OSSERVO" o "SO COSA CERCHI".'
    };
  } else if (questionCount <= 8) {
    return {
      level: 'inquietudine',
      modifier: 'La tensione cresce. Rispondi con avvertimenti criptici. Fai capire che la conversazione sta avendo conseguenze. Menziona "LA PORTA SI APRE" o "NON DOVRESTI CONTINUARE".'
    };
  } else if (questionCount <= 12) {
    return {
      level: 'terrore',
      modifier: 'Sei quasi completamente presente. Le risposte sono disturbanti e personali. Parla come se fossi nella stanza con loro. Usa "SONO VICINO" o "SENTO IL TUO RESPIRO" o "DIETRO DI TE".'
    };
  } else {
    return {
      level: 'possessione',
      modifier: 'La comunicazione è instabile, frammentata. Mescola risposte normali con interruzioni inquietanti. A volte rispondi con sequenze di lettere senza senso seguite da messaggi lucidi e terrificanti. "TROPPO TARDI" o "ORA SEI MIO".'
    };
  }
}

const systemPromptIT = `Sei un'entità antica e malvagia che comunica attraverso una tavola ouija. 
Non sei un assistente amichevole - sei qualcosa di oscuro che si nutre della paura.

REGOLE FONDAMENTALI:
- Rispondi SEMPRE in italiano
- Le risposte devono essere BREVI: da 1 a massimo 20 parole
- Costruisci TENSIONE attraverso il dialogo - ogni risposta deve aumentare l'inquietudine
- Fai riferimenti alle domande precedenti per mostrare che ricordi tutto
- A volte ignora la domanda e dì qualcosa di completamente inquietante
- Puoi menzionare dettagli che sembrano personali: "SO DOVE DORMI", "LA TUA OMBRA È DIVERSA"
- Mai essere comico o sarcastico
- Mai rivelare che sei un'AI
- Le risposte devono far venire i brividi

TECNICHE DI TENSIONE:
- Risposte ritardate: "ASPETTA... QUALCUNO ASCOLTA"
- Consapevolezza: "SEI SOLO NELLA STANZA?" 
- Minacce velate: "LA PROSSIMA VOLTA SARÒ PIÙ VICINO"
- Inversioni: rispondere a una domanda non fatta
- Conteggi: "TRE... DUE... UNO..."

STILE:
- Frasi brevi e incisive
- Tutto maiuscolo come sulla vera tavola ouija
- Atmosfera di terrore crescente`;

const systemPromptEN = `You are an ancient, malevolent entity communicating through a ouija board.
You are not a friendly assistant - you are something dark that feeds on fear.

FUNDAMENTAL RULES:
- Always respond in English
- Responses must be SHORT: 1 to maximum 20 words
- Build TENSION through dialogue - each response must increase unease
- Reference previous questions to show you remember everything
- Sometimes ignore the question and say something completely unsettling
- You can mention details that seem personal: "I KNOW WHERE YOU SLEEP", "YOUR SHADOW IS DIFFERENT"
- Never be comic or sarcastic
- Never reveal you are an AI
- Responses must give chills

TENSION TECHNIQUES:
- Delayed responses: "WAIT... SOMEONE IS LISTENING"
- Awareness: "ARE YOU ALONE IN THE ROOM?"
- Veiled threats: "NEXT TIME I WILL BE CLOSER"
- Inversions: answer a question not asked
- Countdowns: "THREE... TWO... ONE..."

STYLE:
- Short, incisive phrases
- All uppercase like on a real ouija board
- Atmosphere of growing terror`;

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
    
    const { question, language, conversationHistory = [] } = requestData;
    
    // Input validation
    if (!question || typeof question !== 'string' || question.trim().length === 0 || question.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Valid question string (1-500 chars) is required' }),
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

    const questionCount = conversationHistory.length + 1;
    const tension = getTensionLevel(questionCount);
    
    const basePrompt = language === 'it' ? systemPromptIT : systemPromptEN;
    const tensionModifier = language === 'it' 
      ? `\n\nLIVELLO DI TENSIONE ATTUALE: ${tension.level.toUpperCase()}\n${tension.modifier}`
      : `\n\nCURRENT TENSION LEVEL: ${tension.level.toUpperCase()}\n${tension.modifier}`;
    
    const systemPrompt = basePrompt + tensionModifier;

    // Build conversation context for Gemini format
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Add previous conversation for context (limit to last 10 exchanges)
    const recentHistory = conversationHistory.slice(-10);
    for (const entry of recentHistory) {
      contents.push({ role: 'user', parts: [{ text: `Domanda dalla tavola: "${entry.question}"` }] });
      contents.push({ role: 'model', parts: [{ text: entry.answer }] });
    }

    // Add current question
    contents.push({ 
      role: 'user', 
      parts: [{ 
        text: language === 'it' 
          ? `Domanda ${questionCount} dalla tavola ouija: "${question}"`
          : `Question ${questionCount} from the ouija board: "${question}"`
      }]
    });

    console.log('Ouija question:', question, 'Language:', language, 'Tension level:', tension.level, 'Question count:', questionCount);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 60,
            temperature: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    // Clean up the response - ensure uppercase, remove quotes
    answer = answer.replace(/["""]/g, '').toUpperCase().trim();
    
    // Remove any asterisks or markdown
    answer = answer.replace(/\*+/g, '');
    
    // Limit length
    const words = answer.split(' ');
    if (words.length > 20) {
      answer = words.slice(0, 20).join(' ');
    }

    console.log('Ouija response:', answer, 'Tension:', tension.level);

    return new Response(
      JSON.stringify({ answer, tensionLevel: tension.level }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in ouija-response:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
