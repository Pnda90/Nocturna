import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Sparkles, Share2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ChallengeMode() {
  const {
    language,
    challengeMode,
    challengeQuestions,
    challengeResult,
    startChallenge,
    resetChallenge,
    completeChallenge,
  } = useAppStore();

  const handleShare = async () => {
    if (!challengeResult) return;

    const shareText = `${t(language, 'title')} - ${t(language, 'ouija.challenge.title')}\n\n${challengeResult.sign}\n\n"${challengeResult.phrase}"\n\n${new Date(challengeResult.timestamp).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NOCTURNA',
          text: shareText,
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  // Challenge result screen
  if (challengeResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="ritual-card p-8 text-center grain">
          <p className="text-6xl mb-6">{challengeResult.sign}</p>
          <h2 className="font-serif text-2xl mb-2">
            {t(language, 'ouija.challenge.complete')}
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-6" />
          
          <div className="space-y-3 mb-6">
            {challengeResult.questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-left p-3 bg-ritual/60 rounded-xl border border-border/20"
              >
                <p className="text-xs text-muted-foreground mb-1 italic">&ldquo;{q}&rdquo;</p>
                <p className="font-serif text-primary tracking-wider glow-ghost-text">
                  {challengeResult.answers[i]}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="font-serif text-lg text-foreground/80 italic mb-6">
            "{challengeResult.phrase}"
          </p>

          <p className="text-xs text-muted-foreground mb-6">
            {new Date(challengeResult.timestamp).toLocaleDateString(
              language === 'it' ? 'it-IT' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={handleShare} className="btn-primary-ritual flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              {t(language, 'ouija.challenge.share')}
            </button>
            <button onClick={resetChallenge} className="btn-ghost-ritual">
              {t(language, 'ouija.challenge.newChallenge')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Challenge mode active indicator - no limit, show tension level
  if (challengeMode) {
    const questionCount = challengeQuestions.length;
    const getTensionLabel = () => {
      if (questionCount <= 2) return language === 'it' ? 'Curiosità' : 'Curiosity';
      if (questionCount <= 5) return language === 'it' ? 'Interesse' : 'Interest';
      if (questionCount <= 8) return language === 'it' ? 'Inquietudine' : 'Unease';
      if (questionCount <= 12) return language === 'it' ? 'Terrore' : 'Terror';
      return language === 'it' ? 'Possessione' : 'Possession';
    };
    
    const getTensionColor = () => {
      if (questionCount <= 2) return 'text-muted-foreground';
      if (questionCount <= 5) return 'text-yellow-500';
      if (questionCount <= 8) return 'text-orange-500';
      if (questionCount <= 12) return 'text-red-500';
      return 'text-red-600 animate-pulse';
    };
    
    return (
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">
              {language === 'it' ? 'Domanda' : 'Question'} {questionCount + 1}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-background/50">
              <span className={getTensionColor()}>{getTensionLabel()}</span>
            </span>
          </div>
          
          {questionCount >= 3 && (
            <button
              onClick={completeChallenge}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <StopCircle className="w-3 h-3" />
              {language === 'it' ? 'Termina sessione' : 'End session'}
            </button>
          )}
        </div>
        
        {questionCount >= 5 && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground/60 mt-2 italic"
          >
            {language === 'it' ? 'L\'entità sta diventando più presente...' : 'The entity is becoming more present...'}
          </motion.p>
        )}
      </div>
    );
  }

  // Challenge start button
  return (
    <div className="mb-8 text-center">
      <button
        onClick={startChallenge}
        className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        <Sparkles className="w-4 h-4 group-hover:text-primary transition-colors" />
        <span className="text-sm tracking-wider">
          {language === 'it' ? 'Inizia sessione profonda' : 'Start deep session'}
        </span>
      </button>
      <p className="text-xs text-muted-foreground/60 mt-1">
        {language === 'it' 
          ? 'Dialoga con l\'entità. Più domande fai, più diventa presente.' 
          : 'Dialogue with the entity. The more you ask, the more present it becomes.'}
      </p>
    </div>
  );
}
