import { OuijaBoard } from '@/components/OuijaBoard';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export default function OuijaPage() {
  const { reduceMotion } = useAppStore();

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      useAppStore.getState().setReduceMotion(true);
    }
  }, []);

  return (
    <div className={`grain ${reduceMotion ? '' : 'vignette'}`}>
      <OuijaBoard />
    </div>
  );
}
