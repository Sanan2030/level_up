import { describe, expect, it } from 'vitest';
import { generateRoadmap, orderByPrerequisites } from '../lib/roadmap';
import type { LearningModule, LearningProfile, Lesson } from '../lib/types';

const title = { az: 'Mövzu', en: 'Topic' };
const modules: LearningModule[] = [
  {
    id: 'junior',
    trackId: 'ba',
    level: 'junior',
    title,
    description: title,
    lessonIds: ['a'],
    estimatedMinutes: 20,
    prerequisites: [],
  },
  {
    id: 'lead',
    trackId: 'ba',
    level: 'lead',
    title,
    description: title,
    lessonIds: ['c'],
    estimatedMinutes: 60,
    prerequisites: ['mid'],
  },
  {
    id: 'mid',
    trackId: 'ba',
    level: 'mid',
    title,
    description: title,
    lessonIds: ['b'],
    estimatedMinutes: 40,
    prerequisites: ['junior'],
  },
  {
    id: 'po',
    trackId: 'po',
    level: 'junior',
    title,
    description: title,
    lessonIds: ['d'],
    estimatedMinutes: 30,
    prerequisites: [],
  },
];
const lessons: Lesson[] = ['a', 'b', 'c', 'd'].map((id, i) => ({
  sourceIds: [],
  id,
  trackId: i === 3 ? 'po' : 'ba',
  level: i === 0 ? 'junior' : i === 1 ? 'mid' : 'lead',
  moduleId: modules.find((m) => m.lessonIds.includes(id))!.id,
  title,
  summary: title,
  minutes: [20, 40, 60, 30][i],
  status: id === 'c' ? 'planned' : 'published',
  topics: [],
  prerequisites: [],
}));
const profile: LearningProfile = {
  trackId: 'ba',
  currentLevel: 'junior',
  targetLevel: 'lead',
  dailyMinutes: 30,
};

describe('personalized roadmap', () => {
  it('selects only the level gap and orders prerequisites before dependent modules', () => {
    const roadmap = generateRoadmap(profile, modules, lessons);
    expect(roadmap.modules.map((m) => m.id)).toEqual(['mid', 'lead']);
    expect(roadmap.lessons.map((l) => l.id)).toEqual(['b', 'c']);
    expect(roadmap.totalMinutes).toBe(100);
    expect(roadmap.estimatedDays).toBe(4);
    expect(roadmap.nextLesson?.id).toBe('b');
    expect(roadmap.publishedCount).toBe(1);
  });
  it('retains completed progress and estimates only unfinished study time', () => {
    const roadmap = generateRoadmap(profile, modules, lessons, { b: '2026-10-20' });
    expect(roadmap.completedCount).toBe(1);
    expect(roadmap.completionPercent).toBe(50);
    expect(roadmap.remainingMinutes).toBe(60);
    expect(roadmap.estimatedDays).toBe(2);
    expect(roadmap.nextLesson).toBeUndefined();
  });
  it('rejects a target at or below current level and invalid study time', () => {
    expect(() => generateRoadmap({ ...profile, targetLevel: 'junior' }, modules, lessons)).toThrow(
      /Target/,
    );
    expect(() => generateRoadmap({ ...profile, dailyMinutes: 0 }, modules, lessons)).toThrow(
      /positive/,
    );
  });
  it('includes all certification modules independently of career-level selection', () => {
    const certification = [{ ...modules[0], id: 'ecba', trackId: 'ecba' as const }];
    const roadmap = generateRoadmap(
      { ...profile, trackId: 'ecba', currentLevel: 'lead', targetLevel: 'lead' },
      certification,
      lessons,
    );
    expect(roadmap.modules).toHaveLength(1);
  });
  it('detects a cycle instead of hanging or silently dropping prerequisites', () => {
    expect(() =>
      orderByPrerequisites([
        { id: 'a', prerequisites: ['b'] },
        { id: 'b', prerequisites: ['a'] },
      ]),
    ).toThrow(/Cyclic/);
  });
});
