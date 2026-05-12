import { SettingsPage as SettingsContent } from '@/components/SettingsPage';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const { reduceMotion } = useAppStore();

  return (
    <div className={`grain ${reduceMotion ? '' : 'vignette'}`}>
      <SettingsContent />
    </div>
  );
}
