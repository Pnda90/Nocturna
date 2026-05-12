import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { isDangerousSeed, StoryLength, StoryStyle } from '@/lib/story-generator';
import { Copy, RefreshCw, Save, Share2, Trash2, Check, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { checkRateLimit, getRateLimitResetTime, validateStorySeed, sanitizeOutput } from '@/lib/security';

export function StoryGenerator() {
  const { language, savedStories, saveStory, deleteStory } = useAppStore();
  
  const [seed, setSeed] = useState('');
  const [length, setLength] = useState<StoryLength>('short');
  const [style, setStyle] = useState<StoryStyle>('gothic');
  const [ambiguousEnding, setAmbiguousEnding] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<{ title: string; content: string } | null>(null);
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

    try {
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: { seed: validation.sanitized, style, length, ambiguousEnding, language }
      });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Story generation error:', error);
        }
        // Fallback to demo story when API fails
        const sanitizedSeed = validation.sanitized;
        setGeneratedStory({
          title: language === 'it' ? `"Il Mistero di ${sanitizedSeed}"` : `"The Mystery of ${sanitizedSeed}"`,
          content: language === 'it' 
            ? `La notte in cui tutto cambiò, ${sanitizedSeed} non era più lo stesso. Qualcosa di sottile, quasi impercettibile, aveva iniziato a rosicchiare i margini della realtà. Era come se il mondo attorno fosse leggermente sfuocato, come una fotografia non a fuoco.\n\nI giorni passavano, ma il tempo non scorreva normale. Le ore si dilatavano in strani intervalli. Quando chiudeva gli occhi, vedeva cose che non dovrebbero esistere. Ombre che si muovevano con volontà propria, pareti che respiravano, specchi che riflettevano stanze che non aveva mai visto.\n\nE il peggio era il silenzio. Un silenzio che non era veramente silenzio, ma qualcosa di più profondo. Era come se l'universo intero stesse trattenendo il respiro, aspettando che realizzasse qualcosa.\n\nQualcosa che non poteva più ignorare. Qualcosa che era sempre stato lì, in attesa.`
            : `The night everything changed, ${sanitizedSeed} was no longer the same. Something subtle, almost imperceptible, had begun gnawing at the edges of reality. It was as if the world around was slightly out of focus, like a photograph not quite sharp.\n\nDays passed, but time did not flow normally. Hours dilated into strange intervals. When closing their eyes, they saw things that shouldn't exist. Shadows moving with their own will, walls that breathed, mirrors reflecting rooms they had never seen.\n\nAnd the worst was the silence. A silence that wasn't truly silence, but something deeper. It was as if the entire universe was holding its breath, waiting for them to realize something.\n\nSomething they could no longer ignore. Something that had always been there, waiting.`
        });
        toast({
          title: language === 'it' ? 'Racconto di Demo' : 'Demo Story',
          description: language === 'it' ? 'Racconto di esempio (la generazione AI non è disponibile al momento)' : 'Example story (AI generation not available right now)',
        });
        setIsGenerating(false);
        return;
      }

      if (data?.title && data?.content) {
        // Sanitize AI-generated content before displaying
        setGeneratedStory({
          title: sanitizeOutput(data.title),
          content: sanitizeOutput(data.content),
        });
      } else {
        throw new Error('Invalid response');
      }

    } catch (err) {
      console.error('Story generation fetch error:', err);
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        variant: 'destructive',
      });
    }

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
      seed,
      style,
      length,
      language,
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
              <label className="block text-sm text-muted-foreground mb-2">
                {t(language, 'stories.seedLabel')}
              </label>
              <input
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
                <label className="block text-sm text-muted-foreground mb-2">
                  {t(language, 'stories.length')}
                </label>
                <select
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
                <label className="block text-sm text-muted-foreground mb-2">
                  {t(language, 'stories.style')}
                </label>
                <select
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
