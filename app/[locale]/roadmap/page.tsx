import { RoadmapView } from '@/components/learning';
import { getLocale } from '@/lib/i18n';
export const metadata = { title: 'Learning roadmap' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <RoadmapView locale={getLocale(locale)} />;
}
