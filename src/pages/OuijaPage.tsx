import { OuijaBoard } from '@/components/OuijaBoard';
import { useAppStore } from '@/lib/store';

export default function OuijaPage() {
  const { reduceMotion } = useAppStore();

  return (
    <div className={`grain ${reduceMotion ? '' : 'vignette'}`}>
      <OuijaBoard />
    </div>
  );
}
