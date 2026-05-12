import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ChevronDown, ChevronUp, Scroll, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SessionLog() {
  const { language, sessionLog } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (sessionLog.length === 0) return null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(language === 'it' ? 'it-IT' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-5 border border-border/30 rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 group"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 text-sm tracking-wider uppercase">
          <Scroll className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary/80 transition-colors" />
          {t(language, 'ouija.sessionLog')}
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
            {sessionLog.length}
          </span>
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3">
              {sessionLog.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-ritual/50 border border-border/20 rounded-xl hover:border-primary/20 transition-all duration-300 group/entry"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground mb-2 truncate italic">
                        &ldquo;{entry.question}&rdquo;
                      </p>
                      <p className="font-serif text-lg text-primary tracking-wider glow-ghost-text">
                        {entry.answer}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground/40 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
