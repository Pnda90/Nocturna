import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

const onboardingMessages = {
  it: [
    'Benvenuto nell\'oscurità.',
    'Alcuni confini non dovrebbero essere attraversati.',
    'Sei sicuro di voler continuare?',
    'Molto bene.',
    'Abbassa le luci.',
  ],
  en: [
    'Welcome to the darkness.',
    'Some boundaries should not be crossed.',
    'Are you sure you want to continue?',
    'Very well.',
    'Dim the lights.',
  ],
};

export default function LandingPage() {
  const { language, reduceMotion } = useAppStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('nocturna-onboarding');
    
    if (hasSeenOnboarding) {
      setShowContent(true);
      return;
    }

    // Show onboarding sequence
    const messages = onboardingMessages[language];
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= messages.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            localStorage.setItem('nocturna-onboarding', 'true');
            setShowContent(true);
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [language]);

  const handleEnter = () => {
    navigate('/ouija');
  };

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background grain vignette">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.6 }}
            className="font-serif text-xl md:text-2xl text-center text-foreground/80 px-8 max-w-lg"
          >
            {onboardingMessages[language][step]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background grain vignette px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.1 : 1 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0.1 : 0.8 }}
          className="font-serif text-5xl md:text-7xl font-light tracking-[0.3em] text-foreground mb-4"
        >
          NOCTURNA
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.8, duration: reduceMotion ? 0.1 : 0.8 }}
          className="text-muted-foreground text-sm md:text-base tracking-wider mb-12"
        >
          {language === 'it' 
            ? 'Un\'esperienza nell\'ignoto' 
            : 'An experience into the unknown'}
        </motion.p>

        {/* Decorative symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : 1.2, duration: reduceMotion ? 0.1 : 0.6 }}
          className="mb-12"
        >
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 border border-ghost/30 rounded-full animate-pulse-slow" />
            <div className="absolute inset-3 border border-ghost/50 rounded-full" />
            <div className="absolute inset-6 border border-primary/60 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-primary text-2xl">☽</span>
            </div>
          </div>
        </motion.div>

        {/* Enter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 1.6, duration: reduceMotion ? 0.1 : 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleEnter}
            className="btn-primary-ritual"
          >
            {language === 'it' ? 'Entra nella tavola' : 'Enter the board'}
          </button>
          <button
            onClick={() => navigate('/stories')}
            className="btn-ghost-ritual"
          >
            {language === 'it' ? 'Racconti' : 'Stories'}
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 2, duration: reduceMotion ? 0.1 : 0.8 }}
          className="text-muted-foreground/50 text-xs mt-16 max-w-md mx-auto"
        >
          {language === 'it'
            ? 'Esperienza di intrattenimento. Nessuna garanzia di contatto con entità.'
            : 'Entertainment experience. No guarantee of contact with entities.'}
        </motion.p>
      </motion.div>
    </div>
  );
}
