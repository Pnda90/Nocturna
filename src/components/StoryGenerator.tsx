import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { generateStory, isDangerousSeed, StoryLength, StoryStyle } from '@/lib/story-generator';
import { Copy, RefreshCw, Save, Share2, Trash2, Check, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { checkRateLimit, getRateLimitResetTime, validateStorySeed } from '@/lib/security';

export function StoryGenerator() {
  const { language, savedStories, saveStory, deleteStory } = useAppStore();
  
  const [seed, setSeed] = useState('');
  const [length, setLength] = useState<StoryLength>('short');
  const [style, setStyle] = useState<StoryStyle>('gothic');
  const [ambiguousEnding, setAmbiguousEnding] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<{
    title: string;
    content: string;
    seed: string;
    style: StoryStyle;
    length: StoryLength;
    language: typeof language;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSavedStories, setShowSavedStories] = useState(false);

  const handleGenerate = async () => {
    if (!seed.trim()) return;
    
    // Validate and sanitize seed
    const validation = validateStorySeed(seed);
    if (!validation.valid) {
      toast({
        title: language === 'it' ? 'Input non valido' : 'Invalid input',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }
    
    // Check rate limit
    if (!checkRateLimit('story')) {
      const resetTime = getRateLimitResetTime('story');
      toast({
        title: language === 'it' ? 'Troppo veloce' : 'Too fast',
        description: language === 'it' 
          ? `Le ombre hanno bisogno di tempo. Riprova tra ${resetTime} secondi.`
          : `The shadows need time. Try again in ${resetTime} seconds.`,
        variant: 'destructive',
      });
      return;
    }
    
    if (isDangerousSeed(validation.sanitized)) {
      toast({
        title: t(language, 'safety.blocked'),
        description: t(language, 'safety.message'),
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedStory(null);
    setSaved(false);

    const story = generateStory({
      seed: validation.sanitized,
      length,
      style,
      ambiguousEnding,
      language,
    });
    setGeneratedStory({ ...story, seed: validation.sanitized, length, style, language });

    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!generatedStory) return;
    
    await navigator.clipboard.writeText(`${generatedStory.title}\n\n${generatedStory.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedStory) return;
    
    saveStory({
      title: generatedStory.title,
      content: generatedStory.content,
      seed: generatedStory.seed,
      style: generatedStory.style,
      length: generatedStory.length,
      language: generatedStory.language,
    });
    
    setSaved(true);
    toast({
      title: t(language, 'stories.saved'),
    });
  };

  const handleShare = async () => {
    if (!generatedStory) return;

    const shareText = `${generatedStory.title}\n\n${generatedStory.content.substring(0, 500)}...`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: generatedStory.title,
          text: shareText,
        });
      } catch (e) {
        // Cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: t(language, 'stories.copied') });
    }
  };

  const handleDeleteStory = (id: string) => {
    deleteStory(id);
    toast({ title: t(language, 'settings.dataCleared') });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wider mb-2">
            {t(language, 'stories.title')}
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            {t(language, 'stories.subtitle')}
          </p>
        </div>

        {/* Generator Form */}
        <div className="ritual-card p-6 md:p-8 mb-8 grain">
          <div className="space-y-6">
            {/* Seed Input */}
            <div>
              <label htmlFor="story-seed" className="block text-sm text-muted-foreground mb-2">
                {t(language, 'stories.seedLabel')}
              </label>
              <input
                id="story-seed"
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder={t(language, 'stories.seedPlaceholder')}
                className="input-ritual"
                disabled={isGenerating}
              />
            </div>

            {/* Length & Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="story-length" className="block text-sm text-muted-foreground mb-2">
                  {t(language, 'stories.length')}
                </label>
                <select
                  id="story-length"
                  value={length}
                  onChange={(e) => setLength(e.target.value as StoryLength)}
                  className="select-ritual"
                  disabled={isGenerating}
                >
                  <option value="flash">{t(language, 'stories.lengths.flash')}</option>
                  <option value="short">{t(language, 'stories.lengths.short')}</option>
                  <option value="medium">{t(language, 'stories.lengths.medium')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="story-style" className="block text-sm text-muted-foreground mb-2">
                  {t(language, 'stories.style')}
                </label>
                <select
                  id="story-style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value as StoryStyle)}
                  className="select-ritual"
                  disabled={isGenerating}
                >
                  <option value="gothic">{t(language, 'stories.styles.gothic')}</option>
                  <option value="psychological">{t(language, 'stories.styles.psychological')}</option>
                  <option value="folklore">{t(language, 'stories.styles.folklore')}</option>
                  <option value="scifi">{t(language, 'stories.styles.scifi')}</option>
                </select>
              </div>
            </div>

            {/* Ambiguous Ending Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {t(language, 'stories.ambiguousEnding')}
              </span>
              <button
                onClick={() => setAmbiguousEnding(!ambiguousEnding)}
                disabled={isGenerating}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  ambiguousEnding ? 'bg-primary/30' : 'bg-muted'
                }`}
                role="switch"
                aria-checked={ambiguousEnding}
                aria-label={t(language, 'stories.ambiguousEnding')}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
                    ambiguousEnding ? 'left-7 bg-primary' : 'left-1 bg-muted-foreground'
                  }`}
                />
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!seed.trim() || isGenerating}
              className="w-full btn-primary-ritual flex items-center justify-center gap-2"
            >
              {isGenerating ? t(language, 'stories.generating') : t(language, 'stories.generate')}
            </button>
          </div>
        </div>

        {/* Generated Story */}
        <AnimatePresence>
          {generatedStory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="ritual-card p-6 md:p-8 mb-8"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-center mb-8 text-primary">
                {generatedStory.title}
              </h2>
              
              <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                {generatedStory.content.split('\n\n').map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0)' }}
                    transition={{ delay: i * 0.15 }}
                    className="text-foreground/85 leading-relaxed mb-5 font-serif text-base md:text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Story Actions */}
              <div className="flex flex-wrap justify-center gap-3 mt-8 pt-6 border-t border-border/30">
                <button onClick={handleCopy} className="btn-ghost-ritual flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t(language, 'stories.copied') : t(language, 'stories.copy')}
                </button>
                <button onClick={handleGenerate} disabled={isGenerating} className="btn-ghost-ritual flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {t(language, 'stories.regenerate')}
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saved}
                  className="btn-ghost-ritual flex items-center gap-2"
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? t(language, 'stories.saved') : t(language, 'stories.save')}
                </button>
                <button onClick={handleShare} className="btn-ghost-ritual flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  {t(language, 'stories.share')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Stories Section */}
        {savedStories.length > 0 && (
          <div className="mt-12">
            <button
              onClick={() => setShowSavedStories(!showSavedStories)}
              className="w-full flex items-center justify-between py-3 px-4 border border-border/30 rounded-lg text-muted-foreground hover:text-foreground hover:border-ghost/30 transition-all duration-300"
            >
              <span className="flex items-center gap-2 text-sm tracking-wider uppercase">
                <BookOpen className="w-4 h-4" />
                {t(language, 'stories.savedStories')} ({savedStories.length})
              </span>
            </button>

            <AnimatePresence>
              {showSavedStories && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4">
                    {savedStories.map((story) => (
                      <div
                        key={story.id}
                        className="p-4 bg-ritual border border-border/20 rounded-lg"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-serif text-lg text-primary">{story.title}</h3>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t(language, 'stories.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 font-serif">
                          {story.content.substring(0, 250)}...
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground/60">
                          <span>{t(language, `stories.styles.${story.style}`)}</span>
                          <span>•</span>
                          <span>
                            {new Date(story.timestamp).toLocaleDateString(
                              story.language === 'it' ? 'it-IT' : 'en-US'
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
