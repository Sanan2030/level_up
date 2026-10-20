'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Flame,
  GraduationCap,
  Lightbulb,
  Play,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { lessons, modules, competencies } from '@/lib/catalog';
import { getTrack } from '@/lib/tracks';
import type { Locale } from '@/lib/types';
import { activityDate, streakDays } from '@/lib/storage';
import { generateRoadmap } from '@/lib/roadmap';
import { useProgress } from './providers';
const ProgressChart = dynamic(() => import('./progress-chart'), {
  ssr: false,
  loading: () => <div className="chart-placeholder" />,
});

export function Dashboard({ locale }: { locale: Locale }) {
  const az = locale === 'az';
  const { progress, ready } = useProgress();
  const track = getTrack(progress.activeTrack);
  const profile = progress.profiles[track.id];
  const available = lessons.filter((l) => l.trackId === track.id && l.status === 'published');
  const completed = lessons.filter(
    (l) => l.trackId === track.id && progress.completedLessons[l.id],
  );
  const allForTrack = lessons.filter((l) => l.trackId === track.id);
  const roadmap = profile
    ? generateRoadmap(profile, modules, lessons, progress.completedLessons)
    : null;
  const next = roadmap
    ? roadmap.nextLesson
    : available.find((l) => !progress.completedLessons[l.id]);
  const featured = ['stakeholder-mapping', 'product-goal', 'scrum-accountabilities']
    .map((id) => lessons.find((l) => l.id === id)!)
    .filter(Boolean);
  const percent = allForTrack.length
    ? Math.round((completed.length / allForTrack.length) * 100)
    : 0;
  const today = activityDate();
  const todayMinutes = lessons
    .filter(
      (l) =>
        progress.completedLessons[l.id] &&
        activityDate(new Date(progress.completedLessons[l.id])) === today,
    )
    .reduce((a, l) => a + l.minutes, 0);
  const dailyGoal = profile?.dailyMinutes ?? 30;
  const skills = competencies
    .filter((c) => c.trackId === track.id && c.level === (profile?.targetLevel ?? 'junior'))
    .flatMap((c) => c.checklist);
  const readiness = skills.length
    ? Math.round(
        (skills.filter((s) => progress.assessedSkills.includes(s.id)).length / skills.length) * 100,
      )
    : 0;
  const scoredAttempts = progress.attempts
    .filter((a) => a.trackId === track.id && a.total > 0)
    .slice(-5);
  const practiceTotal = scoredAttempts.reduce((sum, a) => sum + a.total, 0);
  const practiceAccuracy = practiceTotal
    ? Math.round((scoredAttempts.reduce((sum, a) => sum + a.score, 0) / practiceTotal) * 100)
    : 0;
  const writtenTrack = track.id === 'pspo3';
  const recentActivity = [
    ...Object.entries(progress.completedLessons).flatMap(([id, date]) => {
      const lesson = lessons.find((l) => l.id === id);
      return lesson
        ? [
            {
              id: `lesson-${id}`,
              date,
              label: lesson.title[locale],
              detail: az ? 'Dərs tamamlandı' : 'Lesson completed',
              href: `/${locale}/lessons/${id}`,
            },
          ]
        : [];
    }),
    ...progress.attempts.map((attempt) => ({
      id: attempt.id,
      date: attempt.completedAt,
      label: getTrack(attempt.trackId).name[locale],
      detail: attempt.total
        ? `${attempt.score}/${attempt.total} ${az ? 'düzgün cavab' : 'correct answers'}`
        : az
          ? 'Yazılı məşq tamamlandı'
          : 'Written reflection completed',
      href: `/${locale}/practice#attempt-history`,
    })),
  ]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 5);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const key = activityDate(d);
    return {
      day: d.toLocaleDateString(az ? 'az-AZ' : 'en-GB', { weekday: 'short' }),
      minutes: lessons
        .filter(
          (l) =>
            progress.completedLessons[l.id] &&
            activityDate(new Date(progress.completedLessons[l.id])) === key,
        )
        .reduce((a, l) => a + l.minutes, 0),
    };
  });
  const firstModule = roadmap ? roadmap.modules[0] : modules.find((m) => m.trackId === track.id);
  const moduleComplete = modules.some((m) =>
    m.lessonIds.every((id) => !!progress.completedLessons[id]),
  );
  const firstQuiz = progress.attempts.length > 0;
  const badges = [
    {
      icon: Compass,
      label: az ? 'İlk addım' : 'First step',
      earned: Object.keys(progress.profiles).length > 0,
    },
    {
      icon: BookOpen,
      label: az ? 'İlk dərs' : 'First lesson',
      earned: Object.keys(progress.completedLessons).length > 0,
    },
    { icon: Trophy, label: az ? 'Modul ustası' : 'Module explorer', earned: moduleComplete },
    { icon: GraduationCap, label: az ? 'Məşqə hazıram' : 'Practice starter', earned: firstQuiz },
  ];
  if (!ready)
    return (
      <div
        className="page-skeleton"
        aria-busy="true"
        aria-label={az ? 'İrəliləyiş yüklənir' : 'Loading progress'}
      >
        <div />
        <div />
        <div />
      </div>
    );
  return (
    <div className="dashboard stack-lg">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="tiny-spark">✦</span>
            {az ? 'HƏR GÜN BİR ADDIM İRƏLİ' : 'A LITTLE BETTER, EVERY DAY'}
          </div>
          <h1 className="page-title">
            {az ? 'Xoş gəldin, gələcəyin analitiki' : 'Welcome, future changemaker'}
            <span className="wave"> ✺</span>
          </h1>
          <p className="muted">
            {az
              ? 'Yeni bacarıqlar, aydın istiqamət və sənə uyğun bir öyrənmə yolu.'
              : 'New skills, a clear direction, and a learning path that feels like you.'}
          </p>
        </div>
        <Link href={`/${locale}/onboarding`} className="button button-secondary">
          <Compass size={16} />
          {az ? 'Planımı fərdiləşdir' : 'Personalize my path'}
        </Link>
      </div>
      <section className="welcome-banner">
        <div className="welcome-content">
          <span className="hero-pill">
            <span />
            {az ? 'SƏNİN TEMPİN. SƏNİN YOLUN.' : 'YOUR PACE. YOUR POSSIBILITIES.'}
          </span>
          <h2>
            {az ? (
              <>
                Növbəti səviyyənə
                <br />
                bir addım daha yaxın.
              </>
            ) : (
              <>
                Big ambitions.
                <br />
                Meet small, daily steps.
              </>
            )}
          </h2>
          <p>
            {az
              ? 'Biznes analizi və məhsul idarəçiliyini addım-addım öyrən. Bildiklərini real bacarığa çevir.'
              : 'Build confidence in business analysis and product ownership. Turn what you learn into what you can do.'}
          </p>
          <Link
            href={
              profile
                ? next
                  ? `/${locale}/lessons/${next.id}`
                  : `/${locale}/roadmap`
                : `/${locale}/onboarding`
            }
            className="button button-dark"
          >
            {profile
              ? az
                ? 'Öyrənməyə davam et'
                : 'Keep the momentum'
              : az
                ? 'Öyrənmə yolumu qur'
                : 'Build my learning path'}
            <ArrowRight size={17} />
          </Link>
          <div className="hero-caption">
            <span className="mini-check">
              <Check size={11} />
            </span>
            {az ? 'Praktik dərslər' : 'Practical lessons'}
            <span>·</span>
            {az ? 'Öz tempinlə' : 'At your own pace'}
            <span>·</span>
            {az ? 'Həmişə irəli' : 'Always forward'}
          </div>
        </div>
        <LearningIllustration locale={locale} />
      </section>
      <section
        className="stats-grid"
        aria-label={az ? 'Öyrənmə göstəriciləri' : 'Learning at a glance'}
      >
        <Stat
          icon={<BookOpen size={21} />}
          tone="peach"
          label={az ? 'Tamamlanan dərslər' : 'Lessons completed'}
          value={String(completed.length).padStart(2, '0')}
          detail={`${allForTrack.length} ${az ? 'dərsdən' : 'in your track'}`}
          suffix={<span className="stat-trend">{percent}%</span>}
        />
        <Stat
          icon={<Target size={21} />}
          tone="sage"
          label={
            track.category === 'career'
              ? az
                ? 'Bacarıq hazırlığı'
                : 'Skill readiness'
              : az
                ? 'Məşq nəticələri'
                : 'Practice accuracy'
          }
          value={
            writtenTrack ? '—' : `${track.category === 'career' ? readiness : practiceAccuracy}%`
          }
          detail={
            writtenTrack
              ? az
                ? 'Rubrik ilə özünüqiymətləndirmə'
                : 'Rubric-based self-review'
              : track.category === 'career'
                ? az
                  ? 'Özünüqiymətləndirmə əsasında'
                  : 'Based on your self-assessment'
                : az
                  ? 'Son 5 qiymətləndirilmiş məşq'
                  : 'Last 5 scored practice sessions'
          }
          suffix={
            <span className="mini-bar">
              <span
                style={{ width: `${track.category === 'career' ? readiness : practiceAccuracy}%` }}
              />
            </span>
          }
        />
        <Stat
          icon={<Flame size={21} />}
          tone="gold"
          label={az ? 'Öyrənmə seriyası' : 'Learning streak'}
          value={String(streakDays(progress.activity)).padStart(2, '0')}
          detail={az ? 'ardıcıl aktiv gün' : 'consecutive active days'}
          suffix={<span className="stat-encouragement">{az ? 'Davam et!' : 'Keep it going!'}</span>}
        />
        <Stat
          icon={<Clock3 size={21} />}
          tone="lilac"
          label={az ? 'Bu günün hədəfi' : 'Today’s learning goal'}
          value={String(todayMinutes)}
          unit={`/ ${dailyGoal} ${az ? 'dəq' : 'min'}`}
          detail={
            az ? 'Tamamlanan dərslərin təxmini vaxtı' : 'Estimated minutes in completed lessons'
          }
          suffix={
            <span className="mini-bar lilac">
              <span style={{ width: `${Math.min(100, (todayMinutes / dailyGoal) * 100)}%` }} />
            </span>
          }
        />
      </section>
      <div className="dashboard-middle">
        <section className="card path-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{az ? 'SƏNİN İSTİQAMƏTİN' : 'YOUR NEXT CHAPTER'}</span>
              <h2>{az ? 'Öyrənmə yolun' : 'Your learning path'}</h2>
            </div>
            <Link href={`/${locale}/roadmap`} className="text-link">
              {az ? 'Bütün plan' : 'View roadmap'}
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="path-track">
            <span className="course-icon peach">
              <BookOpen size={24} />
            </span>
            <div>
              <h3>{track.name[locale]}</h3>
              <p>
                {profile
                  ? `${profile.currentLevel === 'zero' ? (az ? 'Sıfırdan' : 'Starting fresh') : profile.currentLevel} → ${profile.targetLevel === 'lead' ? 'Lead / Senior' : profile.targetLevel}`
                  : az
                    ? 'İlk addımdan peşəkarlığa'
                    : 'From first steps to real expertise'}
              </p>
            </div>
            <span className="badge badge-sage">{az ? 'Öz tempinlə' : 'Self-paced'}</span>
          </div>
          <div className="path-progress-label">
            <span>{az ? 'Ümumi irəliləyiş' : 'Overall progress'}</span>
            <strong>{percent}%</strong>
          </div>
          <div className="progress-track">
            <div style={{ width: `${percent}%` }} />
          </div>
          <div className="path-module">
            <span className="module-number">01</span>
            <div>
              <small>{az ? 'NÖVBƏTİ ADDIM' : 'UP NEXT'}</small>
              <h4>
                {next?.title[locale] ??
                  firstModule?.title[locale] ??
                  (az ? 'İstiqamətini seç' : 'Choose your direction')}
              </h4>
              <span>
                <Clock3 size={12} />
                {next?.minutes ?? firstModule?.estimatedMinutes ?? 0} {az ? 'dəq' : 'min'}
                <span className="dot-separator">·</span>
                {az ? 'Əsas biliklər' : 'The foundations'}
              </span>
            </div>
            <Link
              href={next ? `/${locale}/lessons/${next.id}` : `/${locale}/roadmap`}
              className="play-button"
              aria-label={az ? 'Növbəti dərsi aç' : 'Open next lesson'}
            >
              <Play size={16} fill="currentColor" />
            </Link>
          </div>
        </section>
        <section className="card activity-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{az ? 'ARDICILLIQ ÖNƏMLİDİR' : 'CONSISTENCY ADDS UP'}</span>
              <h2>{az ? 'Öyrənmə ritmin' : 'Your learning rhythm'}</h2>
            </div>
            <span className="badge">{az ? 'Son 7 gün' : 'Last 7 days'}</span>
          </div>
          <div className="activity-total">
            <strong>{week.reduce((a, d) => a + d.minutes, 0)}</strong>
            <span>{az ? 'dəqiqə öyrənmə' : 'minutes of learning'}</span>
            <span className="activity-caption">
              {az ? 'Kiçik addımlar da sayılır.' : 'Every small step counts.'}
            </span>
          </div>
          <ProgressChart data={week} locale={locale} />
        </section>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {az ? 'MARAĞINI BACARIĞA ÇEVİR' : 'FOLLOW YOUR CURIOSITY'}
            </span>
            <h2>{az ? 'Sənin üçün seçdiklərimiz' : 'A good place to begin'}</h2>
          </div>
          <Link href={`/${locale}/lessons`} className="text-link">
            {az ? 'Dərs kitabxanası' : 'Explore all lessons'}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="course-grid">
          {featured.map((lesson, i) => (
            <Link
              href={`/${locale}/lessons/${lesson.id}`}
              key={lesson.id}
              className="card course-card"
            >
              <div className={`course-art course-art-${i}`}>
                <CourseArt index={i} />
                <span className="course-category">{getTrack(lesson.trackId).name[locale]}</span>
                {progress.completedLessons[lesson.id] && (
                  <span className="course-complete">
                    <CheckCircle2 size={18} />
                  </span>
                )}
              </div>
              <div className="course-body">
                <div className="course-meta">
                  <span>{az ? 'BAŞLANĞIC' : 'FOUNDATIONS'}</span>
                  <span>
                    <Clock3 size={12} />
                    {lesson.minutes} {az ? 'dəq' : 'min'}
                  </span>
                </div>
                <h3>{lesson.title[locale]}</h3>
                <p>{lesson.summary[locale]}</p>
                <div className="course-bottom">
                  <span>{az ? 'Dərsə keç' : 'Explore lesson'}</span>
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className="dashboard-bottom">
        <section className="card milestones">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {az ? 'HƏR UĞUR BİR ADDIMDIR' : 'CELEBRATE THE SMALL WINS'}
              </span>
              <h2>{az ? 'Uğur nişanların' : 'Your milestones'}</h2>
            </div>
            <Trophy size={20} className="muted" />
          </div>
          <div className="milestone-grid">
            {badges.map(({ icon: Icon, label, earned }) => (
              <div key={label} className={`milestone ${earned ? 'earned' : ''}`}>
                <span>
                  <Icon size={26} />
                  {earned && (
                    <i>
                      <Check size={10} />
                    </i>
                  )}
                </span>
                <strong>{label}</strong>
                <small>
                  {earned
                    ? az
                      ? 'Qazanıldı'
                      : 'Unlocked'
                    : az
                      ? 'Səni gözləyir'
                      : 'Yours to unlock'}
                </small>
              </div>
            ))}
          </div>
        </section>
        <aside className="daily-note">
          <span className="note-icon">
            <Lightbulb size={21} />
          </span>
          <span className="eyebrow">{az ? 'BU GÜNÜN FİKRİ' : 'A THOUGHT TO TAKE WITH YOU'}</span>
          <p>
            {az
              ? 'Yaxşı analitik bütün cavabları bilmir. O, düzgün sualları verməyi bacarır.'
              : 'A great analyst doesn’t have every answer. They know how to ask a better question.'}
          </p>
          <span className="note-signature">
            {az ? 'Maraqla öyrən. İnamla tətbiq et.' : 'Stay curious. Grow with purpose.'}
            <Sparkles size={14} />
          </span>
        </aside>
      </div>
      <section className="card recent-activity">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{az ? 'ATDIĞIN ADDIMLAR' : 'THE STEPS YOU’VE TAKEN'}</span>
            <h2>{az ? 'Son fəaliyyət' : 'Recent activity'}</h2>
          </div>
          <Clock3 size={20} className="muted" />
        </div>
        {recentActivity.length ? (
          <ul>
            {recentActivity.map((item) => (
              <li key={item.id}>
                <span className="recent-activity-icon">
                  <CheckCircle2 size={17} />
                </span>
                <Link href={item.href}>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </Link>
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString(az ? 'az-AZ' : 'en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            {az
              ? 'İlk dərsini tamamla və ya məşqə başla. Atacağın hər addım burada görünəcək.'
              : 'Complete a lesson or try a practice session. Your next small win will appear here.'}
          </p>
        )}
      </section>
    </div>
  );
}
function Stat({
  icon,
  tone,
  label,
  value,
  unit,
  detail,
  suffix,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  unit?: string;
  detail: string;
  suffix: React.ReactNode;
}) {
  return (
    <div className="card stat-card">
      <div className="stat-top">
        <span className={`stat-icon ${tone}`}>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="stat-value">
        {value}
        <span>{unit}</span>
      </div>
      <div className="stat-bottom">
        <small>{detail}</small>
        {suffix}
      </div>
    </div>
  );
}
function LearningIllustration({ locale }: { locale: Locale }) {
  return (
    <div className="learning-illustration" aria-hidden="true">
      <span className="orbit orbit-one" />
      <span className="orbit orbit-two" />
      <span className="illustration-star star-one">✦</span>
      <span className="illustration-star star-two">✧</span>
      <div className="floating-badge badge-bottom">
        <CheckCircle2 size={19} />
        <div>
          <strong>{locale === 'az' ? 'Yeni bacarıq' : 'New skill unlocked'}</strong>
          <small>{locale === 'az' ? 'Bir addım daha irəli' : 'One step closer'}</small>
        </div>
      </div>
      <div className="illustration-card card-back" />
      <div className="illustration-card card-front">
        <span className="illustration-label">YOUR NEXT LEVEL</span>
        <div className="illustration-chart">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="illustration-card-line" />
        <span className="illustration-card-line short" />
        <span className="illustration-check">
          <Check size={22} />
        </span>
      </div>
      <div className="floating-badge badge-top">
        <span className="floating-trophy">
          <Trophy size={23} />
        </span>
        <div>
          <strong>{locale === 'az' ? 'Gələcəyinə yatırım' : 'Invest in your future'}</strong>
          <small>{locale === 'az' ? 'Kiçik addımlarla' : 'One day at a time'}</small>
        </div>
      </div>
      <span className="illustration-dot dot-one" />
      <span className="illustration-dot dot-two" />
    </div>
  );
}
function CourseArt({ index }: { index: number }) {
  return (
    <div className="course-art-visual" aria-hidden="true">
      {index === 0 ? (
        <>
          <div className="visual-person p1" />
          <div className="visual-person p2" />
          <div className="visual-person p3" />
          <div className="visual-center">
            <Target size={30} />
          </div>
          <span className="visual-connector c1" />
          <span className="visual-connector c2" />
          <span className="visual-connector c3" />
        </>
      ) : index === 1 ? (
        <>
          <span className="visual-road r1" />
          <span className="visual-road r2" />
          <span className="visual-road r3" />
          <div className="visual-flag">
            <Target size={33} />
          </div>
          <span className="visual-step s1" />
          <span className="visual-step s2" />
          <span className="visual-step s3" />
        </>
      ) : (
        <>
          <div className="visual-scrum-circle" />
          <div className="visual-scrum-icon si1">
            <Compass size={22} />
          </div>
          <div className="visual-scrum-icon si2">
            <BookOpen size={22} />
          </div>
          <div className="visual-scrum-icon si3">
            <GraduationCap size={22} />
          </div>
        </>
      )}
    </div>
  );
}
