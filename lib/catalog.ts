import modulesData from '@/data/modules.json';
import lessonsData from '@/data/lessons.json';
import competenciesData from '@/data/competencies/index.json';
import glossaryData from '@/data/glossary.json';
import { moduleSchema, lessonSchema, competencySchema, localizedSchema } from './types';
import { z } from 'zod';
export const modules = z.array(moduleSchema).parse(modulesData);
export const lessons = z.array(lessonSchema).parse(lessonsData);
export const competencies = z.array(competencySchema).parse(competenciesData);
export const glossary = z
  .array(
    z.object({
      id: z.string(),
      term: localizedSchema,
      definition: localizedSchema,
      relatedLessonId: z.string(),
    }),
  )
  .parse(glossaryData);
