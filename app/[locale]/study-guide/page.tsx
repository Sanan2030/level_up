import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { lessons } from '@/lib/catalog';
import { getQuestions } from '@/lib/assessments';
import { scrumCompetencies } from '@/lib/study-guide';
export const metadata = { title: 'PSPO study guide and competency map' };
export default function StudyGuidePage() {
  const questions = getQuestions();
  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">UNDERSTAND · APPLY · EXPLAIN</p>
        <h1 className="page-title">Study product ownership with a purpose.</h1>
        <p className="muted">
          Follow the five Professional Scrum Competencies and their 28 focus areas. Use the lessons
          as starting points, practice a decision, then explain why each alternative helps or harms
          the product.
        </p>
      </header>
      <div className="notice">
        <BookOpen size={22} />
        <p>
          This is an editorial study map based on the official competency text supplied by the user.
          It is a professional development framework, not a verified exam blueprint or a guarantee
          of passing.
        </p>
      </div>
      <section className="grid-3" aria-label="Suggested study sequence">
        {[
          [
            '01',
            'Build the foundation',
            'Start with empiricism, accountabilities, events, artifacts and Done. Separate Scrum requirements from optional techniques.',
            '/en/lessons/pspo1-empiricism',
          ],
          [
            '02',
            'Apply product judgment',
            'Compare value, risk and evidence in strategy, discovery, stakeholder and flow scenarios.',
            '/en/lessons/pspo2-discovery',
          ],
          [
            '03',
            'Review the reasoning',
            'Practice, read every option explanation, revisit mistakes and return to the cited source section.',
            '/en/practice?track=pspo2',
          ],
        ].map(([n, title, text, href]) => (
          <article className="card stack" key={n}>
            <span className="eyebrow">STEP {n}</span>
            <h2 className="section-title">{title}</h2>
            <p className="muted">{text}</p>
            <Link className="text-link" href={href}>
              Continue <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </section>
      <section className="card stack">
        <h2 className="section-title">Choose a practice session</h2>
        <p className="muted">
          Choose 5–100 questions, a difficulty and a response format. Use unseen-question filtering
          for new practice, or mistake review to revisit previous attempts. Timed practice remains
          available when a full official-format mock cannot be verified.
        </p>
        <div className="button-row">
          {(['pspo1', 'pspo2', 'pspo3'] as const).map((track, index) => (
            <Link
              key={track}
              className="button button-secondary"
              href={`/en/practice?track=${track}`}
            >
              PSPO {['I', 'II', 'III'][index]} ·{' '}
              {questions.filter((q) => q.trackId === track).length} questions
            </Link>
          ))}
        </div>
      </section>
      <nav className="study-navigation" aria-label="Competency groups">
        {scrumCompetencies.map((g, index) => (
          <a className="button button-outline" key={g.id} href={`#${g.id}`}>
            {index + 1}. {g.title}
          </a>
        ))}
      </nav>
      {scrumCompetencies.map((group, index) => (
        <section className="card stack study-group" id={group.id} key={group.id}>
          <header>
            <div className="study-group-header">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2 className="section-title">{group.title}</h2>
            </div>
            <p className="muted">{group.description}</p>
          </header>
          {group.areas.map((area) => (
            <article className="study-focus" key={area.id}>
              <h3>{area.title}</h3>
              <p className="muted">{area.description}</p>
              <div>
                {area.lessonIds.map((id) => {
                  const lesson = lessons.find((l) => l.id === id && l.status === 'published');
                  return lesson ? (
                    <Link className="text-link" key={id} href={`/en/lessons/${id}`}>
                      <CheckCircle2 size={14} />
                      {lesson.title.en}
                    </Link>
                  ) : null;
                })}
              </div>
            </article>
          ))}
        </section>
      ))}
      <div className="card stack">
        <h2 className="section-title">Use the evidence, not a memorized answer.</h2>
        <ul>
          <li>Identify the purpose and accountability involved before choosing an action.</li>
          <li>State which evidence would change your decision in an ambiguous product scenario.</li>
          <li>Keep the Definition of Done, self-management and transparent trade-offs visible.</li>
          <li>Use the citations to inspect a rule; use original practice to apply it.</li>
        </ul>
        <div className="button-row">
          <Link className="text-link" href="/en/sources#scrum-competencies-2026">
            Competency source and reading notes <ArrowRight size={15} />
          </Link>
          <a
            className="text-link"
            href="https://www.scrum.org/open-assessments/product-owner-open"
            target="_blank"
            rel="noreferrer"
          >
            Official Product Owner Open ↗
          </a>
        </div>
      </div>
    </div>
  );
}
