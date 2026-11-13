import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { EffectsIntensity } from '@/lib/store';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { playClick, playEntityResponse, setAudioPreferences, unlockAudio } from '@/lib/audio';

export function SettingsPage() {
  const {
    language,
    setLanguage,
    audioEnabled,
    setAudioEnabled,
    audioVolume,
    setAudioVolume,
    effectsIntensity,
    setEffectsIntensity,
    reduceMotion,
    setReduceMotion,
    clearAllData,
  } = useAppStore();

  const handleClearData = () => {
    clearAllData();
    toast({
      title: t(language, 'settings.dataCleared'),
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wider">
            {t(language, 'settings.title')}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div className="ritual-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-foreground">{t(language, 'settings.language')}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('it')}
                  className={`px-4 py-2 rounded text-sm tracking-wider transition-all duration-300 ${
                    language === 'it'
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Italiano
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded text-sm tracking-wider transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Audio */}
          <div className="ritual-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-foreground">{t(language, 'settings.audio')}</span>
              <button
                onClick={() => {
                  setAudioPreferences(!audioEnabled, audioVolume);
                  if (!audioEnabled) {
                    unlockAudio();
                    playClick();
                  }
                  setAudioEnabled(!audioEnabled);
                }}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  audioEnabled ? 'bg-primary/30' : 'bg-muted'
                }`}
                role="switch"
                aria-checked={audioEnabled}
                aria-label={t(language, 'settings.audio')}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                    audioEnabled ? 'left-8 bg-primary' : 'left-1 bg-muted-foreground'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {audioEnabled ? t(language, 'settings.audioOn') : t(language, 'settings.audioOff')}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <label htmlFor="audio-volume" className="text-sm text-muted-foreground shrink-0">
                {t(language, 'settings.audioVolume')}
              </label>
              <input
                id="audio-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioVolume}
                onChange={(event) => setAudioVolume(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <span className="text-xs text-muted-foreground w-9 text-right tabular-nums">
                {Math.round(audioVolume * 100)}%
              </span>
            </div>
            <button
              type="button"
              onClick={playEntityResponse}
              disabled={!audioEnabled}
              className="mt-4 text-sm text-primary underline underline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t(language, 'settings.audioPreview')}
            </button>
          </div>

          {/* Effects Intensity */}
          <div className="ritual-card p-6">
            <span className="text-foreground block mb-4">
              {t(language, 'settings.effectsIntensity')}
            </span>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as EffectsIntensity[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setEffectsIntensity(level)}
                  className={`flex-1 px-4 py-2 rounded text-sm tracking-wider transition-all duration-300 ${
                    effectsIntensity === level
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(language, `settings.effects.${level}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="ritual-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-foreground">{t(language, 'settings.reduceMotion')}</span>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  reduceMotion ? 'bg-primary/30' : 'bg-muted'
                }`}
                role="switch"
                aria-checked={reduceMotion}
                aria-label={t(language, 'settings.reduceMotion')}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                    reduceMotion ? 'left-8 bg-primary' : 'left-1 bg-muted-foreground'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="ritual-card p-6">
            <h3 className="font-serif text-lg mb-3 text-primary">
              {t(language, 'settings.disclaimer')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(language, 'settings.disclaimerText')}
            </p>
          </div>

          {/* Privacy */}
          <div className="ritual-card p-6">
            <h3 className="font-serif text-lg mb-3 text-primary">
              {t(language, 'settings.privacy')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(language, 'settings.privacyText')}
            </p>
          </div>

          {/* Clear Data */}
          <div className="ritual-card p-6">
            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-center gap-2 btn-ghost-ritual text-destructive border-destructive/30 hover:border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              {t(language, 'settings.clearData')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
