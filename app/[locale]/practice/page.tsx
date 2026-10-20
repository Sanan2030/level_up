import { QuizWorkspace } from '@/components/quiz/quiz-workspace';
import { getLocale } from '@/lib/i18n';
import { getExams, getQuestions } from '@/lib/assessments';
export const metadata = { title: 'Practice & certification exams' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <QuizWorkspace locale={getLocale(locale)} questions={getQuestions()} exams={getExams()} />;
}
