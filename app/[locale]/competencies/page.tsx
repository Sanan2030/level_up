import { CompetencyView } from '@/components/learning';
import { getLocale } from '@/lib/i18n';
export const metadata = { title: 'Competency matrix' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CompetencyView locale={getLocale(locale)} />;
}
