import { StoryGenerator } from '@/components/StoryGenerator';
import { useAppStore } from '@/lib/store';

export default function StoriesPage() {
  const { reduceMotion } = useAppStore();

  return (
    <div className={`grain ${reduceMotion ? '' : 'vignette'}`}>
      <StoryGenerator />
    </div>
  );
}
