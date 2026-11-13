import { Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function AudioToggle() {
  const { audioEnabled, setAudioEnabled, language } = useAppStore();

  return (
    <button
      onClick={() => setAudioEnabled(!audioEnabled)}
      className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-ghost/30 rounded"
      aria-label={language === 'it'
        ? audioEnabled ? 'Disattiva audio' : 'Attiva audio'
        : audioEnabled ? 'Mute audio' : 'Unmute audio'}
    >
      {audioEnabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
}
