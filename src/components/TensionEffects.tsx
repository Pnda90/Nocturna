import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TensionEffectsProps {
  tensionLevel: number; // 0-4
  isActive: boolean;
}

export function TensionEffects({ tensionLevel, isActive }: TensionEffectsProps) {
  const [showFlash, setShowFlash] = useState(false);
  const [glitchText, setGlitchText] = useState<string | null>(null);

  // Random screen flash at high tension
  useEffect(() => {
    if (!isActive || tensionLevel < 3) return;
    
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 100);
      }
    }, 5000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, [isActive, tensionLevel]);

  // Random glitch text at max tension
  useEffect(() => {
    if (!isActive || tensionLevel < 4) return;
    
    const glitchMessages = [
      'NON VOLTARTI',
      'SONO QUI',
      'TI VEDO',
      'DIETRO DI TE',
      'TROPPO TARDI',
      'ASCOLTA',
      '...',
      'SEI SOLO?',
    ];
    
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        const msg = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
        setGlitchText(msg);
        setTimeout(() => setGlitchText(null), 800 + Math.random() * 400);
      }
    }, 8000 + Math.random() * 7000);
    
    return () => clearInterval(interval);
  }, [isActive, tensionLevel]);

  if (!isActive) return null;

  return (
    <>
      {/* Vignette overlay that intensifies with tension */}
      <div 
        className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 ${
          tensionLevel >= 2 ? 'tension-vignette' : ''
        }`}
        style={{
          background: `radial-gradient(ellipse at center, transparent ${40 - tensionLevel * 5}%, rgba(0,0,0,${0.4 + tensionLevel * 0.12}) 100%)`,
        }}
      />

      {/* Screen flicker at high tension */}
      {tensionLevel >= 3 && (
        <div className="fixed inset-0 pointer-events-none z-50 tension-flicker opacity-0" />
      )}

      {/* Red flash effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed inset-0 bg-destructive pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Glitch text overlay */}
      <AnimatePresence>
        {glitchText && (
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="font-serif text-4xl md:text-6xl text-destructive/80 tracking-[0.5em] tension-glitch tension-shadow-pulse">
              {glitchText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner shadows that creep in */}
      {tensionLevel >= 2 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: tensionLevel * 0.15 }}
            className="fixed top-0 left-0 w-1/3 h-1/3 pointer-events-none z-30"
            style={{
              background: 'radial-gradient(ellipse at top left, rgba(0,0,0,0.8) 0%, transparent 70%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: tensionLevel * 0.15 }}
            className="fixed top-0 right-0 w-1/3 h-1/3 pointer-events-none z-30"
            style={{
              background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.8) 0%, transparent 70%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: tensionLevel * 0.2 }}
            className="fixed bottom-0 left-0 w-1/2 h-1/2 pointer-events-none z-30"
            style={{
              background: 'radial-gradient(ellipse at bottom left, rgba(0,0,0,0.9) 0%, transparent 60%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: tensionLevel * 0.2 }}
            className="fixed bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-30"
            style={{
              background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,0.9) 0%, transparent 60%)',
            }}
          />
        </>
      )}
    </>
  );
}