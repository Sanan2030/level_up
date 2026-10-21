import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3 } from 'lucide-react';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { ComponentProps } from 'react';
import { LessonCheck } from '@/components/lesson/lesson-check';
import { SourceLinks } from '@/components/source-links';
import { getQuestions } from '@/lib/assessments';
import { lessons } from '@/lib/catalog';
import { getContent } from '@/lib/content';
import { getLocale } from '@/lib/i18n';
import { getTrack } from '@/lib/tracks';
import { Diagram } from '@/components/lesson/diagram';
import { ConceptStepper } from '@/components/lesson/concept-stepper';
import { LessonActions } from '@/components/lesson/lesson-actions';
export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const data = getContent(id, getLocale(locale));
  return {
    title: data?.lesson.title[getLocale(locale)] ?? 'Lesson',
    description: data?.lesson.summary[getLocale(locale)],
  };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale = getLocale(raw);
  const az = locale === 'az';
  const data = getContent(id, locale);
  if (!data) notFound();
  const { lesson, body, metadata, fallback } = data;
  const sections = [...body.matchAll(/^## (.+)$/gm)].map((match, index) => ({
    title: match[1],
    id: `section-${index + 1}`,
  }));
  const checks = getQuestions()
    .filter(
      (q) => q.lessonId === id && q.sourceIds.length && ['single', 'multiple'].includes(q.type),
    )
    .slice(0, 4);
  const { content } = await compileMDX({
    source: body,
    options: { blockJS: false, blockDangerousJS: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
    components: {
      h2: (props: ComponentProps<'h2'>) => (
        <h2 {...props} id={sections.find((s) => s.title === props.children)?.id} />
      ),
      LessonCheck: () => <LessonCheck questions={checks} locale={locale} />,
      Diagram: ({ chart }: { chart: string }) => (
        <Diagram chart={chart} locale={locale} title={lesson.title[locale]} />
      ),
      ConceptStepper: () => <ConceptStepper locale={locale} />,
    },
  });
  const trackLessons = lessons.filter(
    (l) => l.trackId === lesson.trackId && l.status === 'published',
  );
  const next = trackLessons[trackLessons.findIndex((l) => l.id === id) + 1];
  return (
    <div className="lesson-page stack-lg">
      <Link className="text-link" href={`/${locale}/lessons`}>
        <ArrowLeft size={15} />
        {az ? 'Dərs kitabxanası' : 'Back to library'}
      </Link>
      <header className="lesson-header">
        <div className="button-row">
          <span className="badge badge-peach">{getTrack(lesson.trackId).name[locale]}</span>
          <span className="badge">{lesson.level === 'lead' ? 'Lead / Senior' : lesson.level}</span>
          <span className="lesson-time">
            <Clock3 size={15} />
            {lesson.minutes} {az ? 'dəq' : 'min'}
          </span>
        </div>
        <h1>{lesson.title[locale]}</h1>
        <p>{lesson.summary[locale]}</p>
      </header>
      {lesson.status === 'planned' && (
        <div className="notice">
          <BookOpen size={18} />
          <div>
            <strong>{az ? 'Bu dərs hələ hazırlanır' : 'This lesson is an outline'}</strong>
            <p>
              {az
                ? 'Aşağıda mövzu planı və öyrənmə istiqaməti var. Tam dərs və məşq yoxlanıldıqdan sonra tamamlanma aktiv olacaq.'
                : 'Below is the curriculum outline and study direction. Completion becomes available once the full lesson and practice are published.'}
            </p>
          </div>
        </div>
      )}
      {fallback && (
        <p role="status" className="notice">
          {az
            ? 'Bu dərsin Azərbaycan dilinə tərcüməsi hazırlanır. İngilis versiyası göstərilir.'
            : 'This translation is being prepared. Showing the English version.'}
        </p>
      )}
      <div className="lesson-layout">
        <article className="lesson-article card">
          <div className="objectives">
            <span className="eyebrow">
              {az ? 'BU DƏRSDƏ NƏ ÖYRƏNƏCƏKSƏN' : 'WHAT YOU’LL WALK AWAY WITH'}
            </span>
            <ul>
              {metadata.objectives.map((o) => (
                <li key={o}>
                  <Check size={16} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="prose" lang={fallback ? 'en' : locale}>
            {content}
          </div>
        </article>
        <aside className="lesson-sidebar stack">
          <nav className="card padded lesson-toc" aria-label={az ? 'Bu dərsdə' : 'In this lesson'}>
            <p className="eyebrow">{az ? 'BU DƏRSDƏ' : 'IN THIS LESSON'}</p>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="card padded">
            <SourceLinks ids={lesson.sourceIds} locale={locale} />
          </div>
          <div className="card padded">
            <p className="eyebrow">{az ? 'ÖYRƏN, SONRA TƏTBİQ ET' : 'MAKE IT STICK'}</p>
            <h3>{az ? 'Bir az düşün. Bir az sına.' : 'Pause. Reflect. Put it to work.'}</h3>
            <p className="muted">
              {az
                ? 'Dərsdən sonra bir real nümunə tap və öyrəndiyini öz sözlərinlə izah et.'
                : 'After this lesson, find a real example and explain what you learned in your own words.'}
            </p>
            <hr />
            <span className="lesson-time">
              <Clock3 size={15} />
              {lesson.minutes} {az ? 'dəqiqəlik investisiya' : 'minutes well invested'}
            </span>
          </div>
          <div className="card padded">
            <h3>{az ? 'Biliklərini yoxla' : 'Try what you know'}</h3>
            <p className="muted">
              {az
                ? 'Məşq sualları ilə güclü və zəif tərəflərini kəşf et.'
                : 'Use original practice questions to discover your strengths and your next opportunity.'}
            </p>
            <Link
              className="button button-secondary"
              href={`/${locale}/practice?track=${lesson.trackId}&lesson=${lesson.id}`}
            >
              {az ? 'Məşqə başla' : 'Explore practice'}
              <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
      <LessonActions lesson={lesson} locale={locale} />
      {next && (
        <Link href={`/${locale}/lessons/${next.id}`} className="card padded next-lesson-link">
          <div>
            <span className="eyebrow">{az ? 'MARAĞINI İZLƏ' : 'KEEP EXPLORING'}</span>
            <h3>{next.title[locale]}</h3>
          </div>
          <ArrowRight size={22} />
        </Link>
      )}
    </div>
  );
}
