'use client';

import dynamic from 'next/dynamic';
import { apiLessonExercises, sqlLessonExercises } from '@/lib/labs/catalog';

const SqlLab = dynamic(() => import('./labs/sql-lab').then((module) => module.SqlLab), {
  ssr: false,
  loading: () => <p role="status">Loading SQL lab…</p>,
});
const ApiLab = dynamic(() => import('./labs/api-lab').then((module) => module.ApiLab), {
  ssr: false,
  loading: () => <p role="status">Loading API lab…</p>,
});

export function LessonLab({ lessonId }: { lessonId: string }) {
  const sql = sqlLessonExercises[lessonId];
  const api = apiLessonExercises[lessonId];
  if (!sql && !api) return null;
  return (
    <div id="practice-lab" className="stack lesson-labs">
      {sql && <SqlLab key={`sql-${lessonId}`} initialExercise={sql} />}
      {api && <ApiLab key={`api-${lessonId}`} initialExercise={api} />}
    </div>
  );
}
