import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { createOuijaNarrativeState, generateNarrativeResponse, isDangerousQuestion, ritualSteps } from '@/lib/ouija-responses';
import { 
  playHum, 
  playRitual, 
  startAmbientSound, 
  stopAmbientSound,
  updateTensionAudio,
  playEntityResponse,
  playIntrusion,
  playLetterSound,
  playAnswerComplete,
} from '@/lib/audio';
import { checkRateLimit, getRateLimitResetTime, validateOuijaQuestion } from '@/lib/security';
import { Planchette } from './Planchette';
import { SessionLog } from './SessionLog';
import { ChallengeMode } from './ChallengeMode';
import { TensionEffects } from './TensionEffects';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const numbers = '1234567890'.split('');

// Decorative symbols for the board
const symbols = {
  sun: '☉',
  moon: '☾',
  star: '★',
  eye: '◉',
};

export function OuijaBoard() {
  const { 
    language, 
    audioEnabled, 
    sessionActive, 
    startSession, 
    endSession, 
    addSessionEntry,
    challengeMode,
    challengeQuestions,
    effectsIntensity,
    reduceMotion,
  } = useAppStore();
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [announcedAnswer, setAnnouncedAnswer] = useState('');
  const [sessionQuestionCount, setSessionQuestionCount] = useState(0);
  const [isAsking, setIsAsking] = useState(false);
  const [ritualStep, setRitualStep] = useState(-1);
  const [showSafetyMessage, setShowSafetyMessage] = useState(false);
  const [planchettePos, setPlanchettePos] = useState({ x: 0, y: 0 });
  const [isPlanchetteMoving, setIsPlanchetteMoving] = useState(false);
  const [highlightedChar, setHighlightedChar] = useState<string | null>(null);
  const [candleFlicker, setCandleFlicker] = useState(false);
  
  // Calculate tension level based on question count
  const tensionLevel = useMemo(() => {
    const count = challengeMode ? challengeQuestions.length : sessionQuestionCount;
    if (count <= 2) return 0;
    if (count <= 5) return 1;
    if (count <= 8) return 2;
    if (count <= 12) return 3;
    return 4;
  }, [challengeMode, challengeQuestions.length, sessionQuestionCount]);
  const visualTensionLevel = reduceMotion ? 0 : effectsIntensity === 'low'
    ? Math.min(tensionLevel, 1)
    : effectsIntensity === 'medium' ? Math.min(tensionLevel, 2) : tensionLevel;
  
  const boardRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<Map<string, HTMLElement>>(new Map());
  const ritualRunningRef = useRef(false);
  const ritualCancelledRef = useRef(false);
  const narrativeRef = useRef(createOuijaNarrativeState());
  const responseRunRef = useRef(0);

  const setCharRef = useCallback((char: string, element: HTMLElement | null) => {
    if (element) {
      charRefs.current.set(char, element);
    } else {
      charRefs.current.delete(char);
    }
  }, []);

  // Keep the planchette centered when the board changes size.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const centerPlanchette = () => {
      const rect = board.getBoundingClientRect();
      setPlanchettePos({ x: rect.width / 2, y: rect.height / 2 });
    };
    centerPlanchette();
    const observer = new ResizeObserver(centerPlanchette);
    observer.observe(board);
    return () => {
      ritualCancelledRef.current = true;
      responseRunRef.current += 1;
      observer.disconnect();
    };
  }, []);

  // Handle audio ambient based on session and tension
  useEffect(() => {
    if (sessionActive && audioEnabled) {
      startAmbientSound(0);
    } else {
      stopAmbientSound();
    }
    
    return () => {
      stopAmbientSound();
    };
  }, [sessionActive, audioEnabled]);

  useEffect(() => {
    if (sessionActive && audioEnabled) updateTensionAudio(tensionLevel);
  }, [sessionActive, audioEnabled, tensionLevel]);

  // Candle flicker effect
  useEffect(() => {
    if (!sessionActive || reduceMotion || effectsIntensity === 'low') return undefined;
    const interval = setInterval(() => {
      setCandleFlicker(prev => !prev);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [sessionActive, reduceMotion, effectsIntensity]);

  const movePlanchetteTo = useCallback(async (char: string, charIndex: number) => {
    const normalizedChar = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    const element = charRefs.current.get(normalizedChar);
    if (element && boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const charRect = element.getBoundingClientRect();
      
      const x = charRect.left - boardRect.left + charRect.width / 2;
      const y = charRect.top - boardRect.top + charRect.height / 2;
      
      setPlanchettePos({ x, y });
      setHighlightedChar(normalizedChar);
      setIsPlanchetteMoving(true);
      
      if (audioEnabled) {
        playLetterSound(charIndex);
      }
      
      await new Promise((resolve) => setTimeout(resolve, reduceMotion ? 45 : 260));
      setIsPlanchetteMoving(false);
    }
  }, [audioEnabled, reduceMotion]);

  const finishRitual = () => {
    setRitualStep(-1);
    setSessionQuestionCount(0);
    narrativeRef.current = createOuijaNarrativeState();
    ritualRunningRef.current = false;
    startSession();
  };

  const handleStartSession = async () => {
    if (ritualRunningRef.current || sessionActive) return;
    ritualRunningRef.current = true;
    ritualCancelledRef.current = false;
    if (audioEnabled) {
      playRitual();
    }
    if (reduceMotion) {
      finishRitual();
      return;
    }
    
    // Show ritual steps
    for (let i = 0; i < ritualSteps[language].length; i++) {
      setRitualStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (ritualCancelledRef.current) return;
    }
    
    finishRitual();
  };

  const handleSkipRitual = () => {
    ritualCancelledRef.current = true;
    finishRitual();
  };

  const handleEndSession = () => {
    endSession();
    setSessionQuestionCount(0);
    narrativeRef.current = createOuijaNarrativeState();
    setAnswer('');
    setAnnouncedAnswer('');
    setHighlightedChar(null);
    if (audioEnabled) {
      stopAmbientSound();
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || isAsking) return;
    
    // Validate and sanitize question
    const validation = validateOuijaQuestion(question);
    if (!validation.valid) {
      toast({
        title: language === 'it' ? 'Domanda non valida' : 'Invalid question',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }
    
    // Check rate limit
    if (!checkRateLimit('ouija')) {
      const resetTime = getRateLimitResetTime('ouija');
      toast({
        title: language === 'it' ? 'Troppo veloce' : 'Too fast',
        description: language === 'it' 
          ? `L'entità ha bisogno di riposare. Riprova tra ${resetTime} secondi.`
          : `The entity needs to rest. Try again in ${resetTime} seconds.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Check for dangerous content
    if (isDangerousQuestion(validation.sanitized)) {
      setShowSafetyMessage(true);
      return;
    }
    
    setIsAsking(true);
    setAnswer('');
    setAnnouncedAnswer('');
    const responseRun = ++responseRunRef.current;
    
    if (audioEnabled) {
      playHum();
    }

    try {
      // Keep one narrative thread for the entire session.
      const questionCount = challengeMode ? challengeQuestions.length + 1 : sessionQuestionCount + 1;
      const reply = generateNarrativeResponse(
        validation.sanitized, language, questionCount, narrativeRef.current,
      );
      const response = reply.answer;
      narrativeRef.current = reply.state;

      await new Promise((resolve) => setTimeout(resolve, reduceMotion ? 80 : 520));
      if (responseRun !== responseRunRef.current) return;
      if (audioEnabled) {
        if (reply.intrusion) playIntrusion();
        else playEntityResponse();
      }

      let charIndex = 0;
      for (const char of response) {
        if (responseRun !== responseRunRef.current) return;
        if (/[A-Za-z0-9À-ÿ]/.test(char)) {
          await movePlanchetteTo(char, charIndex);
          charIndex++;
        } else {
          await new Promise((resolve) => setTimeout(resolve, reduceMotion ? 25 : char === ' ' ? 100 : 280));
        }
        if (responseRun !== responseRunRef.current) return;
        setAnswer((prev) => prev + char);
      }
      
      // Clear highlight after finishing
      setTimeout(() => setHighlightedChar(null), 500);
      setAnnouncedAnswer(response);
      if (audioEnabled) playAnswerComplete();
      window.setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }, 160);
      
      // Log the session with sanitized question
      addSessionEntry(validation.sanitized, response);
      setSessionQuestionCount((count) => count + 1);
      
      // If in challenge mode, track it (no limit anymore)
      if (challengeMode) {
        const { addChallengeEntry } = useAppStore.getState();
        addChallengeEntry(validation.sanitized, response);
      }

    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Ouija response error:', err);
      }
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        variant: 'destructive',
      });
    }
    
    setIsAsking(false);
    setQuestion('');
  };

  const handleClear = () => {
    setQuestion('');
    setAnswer('');
    setAnnouncedAnswer('');
    setHighlightedChar(null);
  };

  const renderCharButton = (char: string, isSpecial: boolean = false) => {
    const isHighlighted = highlightedChar === char;
    return (
      <span
        key={char}
        ref={(el) => setCharRef(char, el)}
        className={`
          relative flex items-center justify-center
          font-serif font-semibold tracking-normal cursor-default
          transition-all duration-500
          ${isSpecial
            ? 'px-1.5 py-2 text-xs sm:px-4 sm:text-sm tracking-[0.12em] sm:tracking-[0.2em] uppercase'
            : 'w-full min-w-0 aspect-square text-[clamp(0.875rem,3.5vw,1.25rem)]'}
          ${isHighlighted 
            ? 'text-primary scale-125 glow-ghost-text' 
            : 'text-foreground/85 hover:text-foreground'}
        `}
        aria-hidden="true"
      >
        {char}
        {isHighlighted && (
          <motion.span
            layoutId="highlight"
            className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
          />
        )}
      </span>
    );
  };

  return (
    <div className={`min-h-screen pt-20 pb-8 px-4 ${visualTensionLevel >= 3 ? 'tension-flicker' : ''}`}>
      {/* Tension visual effects overlay */}
      <TensionEffects tensionLevel={visualTensionLevel} isActive={sessionActive} />
      
      <div className="container mx-auto max-w-4xl">
        {/* Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={`font-serif text-4xl md:text-5xl font-light tracking-[0.15em] mb-3 text-foreground/90 ${
            visualTensionLevel >= 4 ? 'tension-text-distort tension-shadow-pulse' : ''
          }`}>
            {t(language, 'ouija.title')}
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide italic">
            {t(language, 'ouija.subtitle')}
          </p>
        </motion.div>

        {/* Challenge Mode Toggle */}
        <ChallengeMode />

        {/* Ritual Steps */}
        <AnimatePresence>
          {ritualStep >= 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/98"
            >
              <div className="relative">
                {/* Candle glow effect */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <motion.p
                  key={ritualStep}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8 }}
                  className="font-serif text-xl md:text-3xl text-center text-foreground/80 max-w-lg px-6 leading-relaxed"
                >
                  {ritualSteps[language][ritualStep]}
                </motion.p>
              </div>
              <button
                type="button"
                onClick={handleSkipRitual}
                className="absolute bottom-10 right-6 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {language === 'it' ? 'Salta rituale' : 'Skip ritual'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safety Message */}
        <AnimatePresence>
          {showSafetyMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 px-4"
            >
              <div className="max-w-md text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-destructive/50 flex items-center justify-center">
                  <span className="text-2xl">⚠</span>
                </div>
                <h2 className="font-serif text-xl mb-4 text-destructive">
                  {t(language, 'safety.warning')}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t(language, 'safety.message')}
                </p>
                <button
                  onClick={() => {
                    setShowSafetyMessage(false);
                    setQuestion('');
                  }}
                  className="btn-ghost-ritual"
                >
                  {t(language, 'common.back')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Board Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Decorative corner candles */}
          {sessionActive && (
            <>
              <div className={`absolute -top-4 -left-4 w-8 h-8 transition-opacity duration-1000 ${candleFlicker ? 'opacity-80' : 'opacity-100'}`}>
                <div className="w-full h-full rounded-full bg-primary/30 blur-lg animate-pulse-slow" />
              </div>
              <div className={`absolute -top-4 -right-4 w-8 h-8 transition-opacity duration-1000 ${!candleFlicker ? 'opacity-80' : 'opacity-100'}`}>
                <div className="w-full h-full rounded-full bg-primary/30 blur-lg animate-pulse-slow" />
              </div>
            </>
          )}

          {/* Board */}
          <div 
            ref={boardRef}
            className={`
              relative overflow-hidden rounded-xl
              bg-gradient-to-b from-[hsl(30,15%,8%)] via-[hsl(25,20%,6%)] to-[hsl(20,15%,4%)]
              border border-primary/20
              shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,0.5)]
              p-3 sm:p-6 md:p-12
              transition-all duration-1000
              ${sessionActive ? 'ring-1 ring-primary/10' : ''}
              ${visualTensionLevel >= 2 ? 'tension-border-pulse' : ''}
              ${visualTensionLevel >= 4 ? 'tension-glitch' : ''}
            `}
          >
            {/* Wood grain texture overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Decorative border pattern */}
            <div className="absolute inset-4 border border-primary/10 rounded-lg pointer-events-none" />
            <div className="absolute inset-6 border border-primary/5 rounded-lg pointer-events-none" />

            <Planchette position={planchettePos} isMoving={isPlanchetteMoving} />
            
            {/* Top decorative row with sun and moon */}
            <div className="flex justify-between items-center gap-1 mb-5 sm:mb-8 px-1 sm:px-4">
              <span className="text-2xl text-primary/40">{symbols.sun}</span>
              <div className="flex gap-2 sm:gap-8">
                {renderCharButton(t(language, 'ouija.yes'), true)}
                {renderCharButton(t(language, 'ouija.no'), true)}
              </div>
              <span className="text-2xl text-primary/40">{symbols.moon}</span>
            </div>

            {/* Alphabet arc - first row (A-M) */}
            <div className="grid ouija-letter-row gap-0.5 sm:gap-1 md:gap-2 mb-2">
              {letters.slice(0, 13).map((letter) => renderCharButton(letter))}
            </div>

            {/* Alphabet arc - second row (N-Z) */}
            <div className="grid ouija-letter-row gap-0.5 sm:gap-1 md:gap-2 mb-5 sm:mb-8">
              {letters.slice(13).map((letter) => renderCharButton(letter))}
            </div>

            {/* Numbers row with decorative stars */}
            <div className="flex justify-center items-center gap-1 sm:gap-2 mb-5 sm:mb-8">
              <span className="hidden sm:inline text-lg text-primary/30">{symbols.star}</span>
              <div className="grid ouija-number-row gap-0.5 sm:gap-1 md:gap-2 w-full max-w-xl">
                {numbers.map((num) => renderCharButton(num))}
              </div>
              <span className="hidden sm:inline text-lg text-primary/30">{symbols.star}</span>
            </div>

            {/* Bottom decorative row */}
            <div className="flex justify-between items-center gap-2 px-1 sm:px-4">
              <div className="flex items-center gap-1 sm:gap-3">
                <span className="text-xl text-primary/30">{symbols.eye}</span>
                {renderCharButton(t(language, 'ouija.hello'), true)}
              </div>
              <div className="flex items-center gap-1 sm:gap-3">
                {renderCharButton(t(language, 'ouija.goodbye'), true)}
                <span className="text-xl text-primary/30">{symbols.eye}</span>
              </div>
            </div>

            {/* Vignette inside board */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
              }}
            />
          </div>
        </motion.div>

        {/* Question Input */}
        <motion.div 
          className="mt-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sessionActive && handleAsk()}
              placeholder={t(language, 'ouija.questionPlaceholder')}
              disabled={!sessionActive || isAsking}
              className="input-ritual text-center font-serif text-lg md:text-xl tracking-wide py-4"
              aria-label={language === 'it' ? 'Domanda' : 'Question'}
            />
            {sessionActive && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
            )}
          </div>

          {/* Answer Display */}
          <AnimatePresence mode="wait">
            {answer && (
              <motion.div
                ref={answerRef}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
              <div className={`inline-block px-4 sm:px-8 py-4 border border-primary/20 rounded-lg bg-ritual/50 ${
                visualTensionLevel >= 3 ? 'tension-border-pulse' : ''
              }`}>
                <p aria-hidden="true" className={`font-serif text-2xl md:text-4xl text-primary glow-ghost-text tracking-[0.08em] sm:tracking-[0.16em] md:tracking-[0.3em] uppercase break-words max-w-[85vw] ${
                  visualTensionLevel >= 4 ? 'tension-shadow-pulse' : ''
                }`}>
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{announcedAnswer}</p>

          {/* Asking indicator */}
          <AnimatePresence>
            {isAsking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-muted-foreground text-sm italic tracking-wide">
                    {t(language, 'ouija.asking')}
                  </p>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4">
            {!sessionActive ? (
              <motion.button
                onClick={handleStartSession}
                className="btn-primary-ritual text-base md:text-lg px-8 py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t(language, 'ouija.startSession')}
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={handleAsk}
                  disabled={!question.trim() || isAsking}
                  className="btn-primary-ritual"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language === 'it' ? 'Chiedi' : 'Ask'}
                </motion.button>
                <button
                  onClick={handleClear}
                  disabled={isAsking}
                  className="btn-ghost-ritual"
                >
                  {t(language, 'ouija.clear')}
                </button>
                <button
                  onClick={handleEndSession}
                  disabled={isAsking}
                  className="btn-ghost-ritual"
                >
                  {t(language, 'ouija.endSession')}
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Session Log */}
        <SessionLog />
      </div>
    </div>
  );
}
